'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getLocalDb, saveLocalDb } from '@/lib/local-store'
import type { HomepageSection } from '@/types'

function checkSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your_supabase_url_here') &&
    supabaseAnonKey &&
    !supabaseAnonKey.includes('your_supabase_anon_key_here')
  )
}

export async function updateHomepageSection(section: Partial<HomepageSection> & { section_key: string }) {
  try {
    const isSupabase = checkSupabaseConfigured()

    if (!isSupabase) {
      if (process.env.VERCEL) {
        return {
          success: false,
          message:
            'Website online di Vercel membutuhkan database online (Supabase). Silakan hubungkan Supabase di Environment Variables Vercel.',
        }
      }

      // Always update local database store on local machine
      const db = getLocalDb()
      if (!db.records) db.records = {}
      if (!db.records['homepage_sections']) db.records['homepage_sections'] = []

      const idx = db.records['homepage_sections'].findIndex(
        (s) => (s as { section_key?: string }).section_key === section.section_key
      )
      const updatedSec = {
        ...section,
        id: section.id || section.section_key,
        updated_at: new Date().toISOString(),
      }

      if (idx >= 0) {
        db.records['homepage_sections'][idx] = { ...db.records['homepage_sections'][idx], ...updatedSec }
      } else {
        db.records['homepage_sections'].push(updatedSec)
      }
      const ok = saveLocalDb(db)
      if (!ok) {
        return { success: false, message: 'Gagal menulis pembaruan section ke database lokal.' }
      }

      revalidatePath('/', 'layout')
      revalidatePath('/', 'page')
      revalidatePath('/admin/homepage', 'page')
      return { success: true, message: 'Section homepage berhasil diperbarui & langsung aktif di landing page!' }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('homepage_sections')
      .upsert(
        {
          section_key: section.section_key,
          title: section.title,
          subtitle: section.subtitle,
          description: section.description,
          image_url: section.image_url,
          button_text: section.button_text,
          button_url: section.button_url,
          button_secondary_text: section.button_secondary_text,
          button_secondary_url: section.button_secondary_url,
          is_visible: section.is_visible,
          sort_order: section.sort_order,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section_key' }
      )

    if (error) throw error

    revalidatePath('/', 'layout')
    revalidatePath('/', 'page')
    revalidatePath('/admin/homepage', 'page')
    return { success: true, message: 'Section homepage berhasil diperbarui & langsung aktif di landing page!' }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan section'
    return { success: false, message }
  }
}
