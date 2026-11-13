'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getLocalDb, saveLocalDb, setLocalRecord } from '@/lib/local-store'

export interface ActionResult<T = unknown> {
  success: boolean
  message: string
  data?: T
}

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

export async function createRecord(
  table: string,
  data: Record<string, unknown>,
  revalidatePaths: string[] = ['/', '/admin']
): Promise<ActionResult> {
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

      const db = getLocalDb()
      if (!db.records) db.records = {}
      if (!db.records[table]) db.records[table] = []
      const newRecord = { ...data, id: Date.now().toString(), created_at: new Date().toISOString() }
      db.records[table].push(newRecord)
      const ok = saveLocalDb(db)
      if (!ok) {
        return { success: false, message: 'Gagal menulis data ke database lokal.' }
      }

      revalidatePaths.forEach((path) => {
        revalidatePath(path, 'layout')
        revalidatePath(path, 'page')
      })
      return { success: true, message: 'Data berhasil disimpan!', data: newRecord }
    }

    const supabase = await createClient()
    const { data: inserted, error } = await supabase.from(table).insert([data]).select().single()

    if (error) throw error

    revalidatePaths.forEach((path) => {
      revalidatePath(path, 'layout')
      revalidatePath(path, 'page')
    })
    return { success: true, message: 'Data berhasil ditambahkan!', data: inserted }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menambahkan data'
    return { success: false, message }
  }
}

export async function updateRecord(
  table: string,
  id: string,
  data: Record<string, unknown>,
  revalidatePaths: string[] = ['/', '/admin']
): Promise<ActionResult> {
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

      if (table === 'site_settings') {
        const ok = setLocalRecord('site_settings', data)
        if (!ok) return { success: false, message: 'Gagal memperbarui pengaturan website lokal.' }
      } else if (table === 'footer_settings') {
        const ok = setLocalRecord('footer_settings', data)
        if (!ok) return { success: false, message: 'Gagal memperbarui pengaturan footer lokal.' }
      } else {
        const db = getLocalDb()
        if (!db.records) db.records = {}
        if (!db.records[table]) db.records[table] = []
        const idx = db.records[table].findIndex((r) => r.id === id)
        if (idx >= 0) {
          db.records[table][idx] = { ...db.records[table][idx], ...data }
        } else {
          db.records[table].push({ ...data, id })
        }
        const ok = saveLocalDb(db)
        if (!ok) return { success: false, message: 'Gagal menulis pembaruan ke database lokal.' }
      }

      revalidatePaths.forEach((path) => {
        revalidatePath(path, 'layout')
        revalidatePath(path, 'page')
      })
      return { success: true, message: 'Data berhasil diperbarui!', data }
    }

    const supabase = await createClient()
    const { data: updated, error } = await supabase.from(table).update(data).eq('id', id).select().single()

    if (error) throw error

    revalidatePaths.forEach((path) => {
      revalidatePath(path, 'layout')
      revalidatePath(path, 'page')
    })
    return { success: true, message: 'Data berhasil diperbarui!', data: updated }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui data'
    return { success: false, message }
  }
}

export async function deleteRecord(
  table: string,
  id: string,
  revalidatePaths: string[] = ['/', '/admin']
): Promise<ActionResult> {
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

      const db = getLocalDb()
      if (db.records && db.records[table]) {
        db.records[table] = db.records[table].filter((r) => r.id !== id)
        const ok = saveLocalDb(db)
        if (!ok) return { success: false, message: 'Gagal menghapus data dari database lokal.' }
      }
      revalidatePaths.forEach((path) => {
        revalidatePath(path, 'layout')
        revalidatePath(path, 'page')
      })
      return { success: true, message: 'Data berhasil dihapus!' }
    }

    const supabase = await createClient()
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) throw error

    revalidatePaths.forEach((path) => {
      revalidatePath(path, 'layout')
      revalidatePath(path, 'page')
    })
    return { success: true, message: 'Data berhasil dihapus!' }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus data'
    return { success: false, message }
  }
}
