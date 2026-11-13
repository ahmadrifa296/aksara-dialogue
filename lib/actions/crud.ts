'use server'

import { getDbClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getLocalDb, saveLocalDb, setLocalRecord } from '@/lib/local-store'

export interface ActionResult<T = unknown> {
  success: boolean
  message: string
  data?: T
}

function checkSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY
  return !!(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your_supabase_url_here') &&
    supabaseKey &&
    !supabaseKey.includes('your_')
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

    const supabase = await getDbClient()
    const { id: potentialId, ...cleanData } = data
    // Supabase auto-generates UUID, only pass id if it is already a valid UUID
    const insertPayload =
      potentialId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(potentialId))
        ? { ...cleanData, id: potentialId }
        : cleanData

    const { data: inserted, error } = await supabase.from(table).insert([insertPayload]).select().single()

    if (error) {
      console.error(`Supabase insert error on ${table}:`, error)
      throw new Error(error.message || 'Gagal menyimpan ke Supabase')
    }

    revalidatePaths.forEach((path) => {
      revalidatePath(path, 'layout')
      revalidatePath(path, 'page')
    })
    return { success: true, message: 'Data berhasil ditambahkan ke Supabase!', data: inserted }
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

    const supabase = await getDbClient()
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    // Jika id bukan UUID (misal data dummy "1", "2"), lakukan insert ke Supabase sebagai baris baru
    if (!isUuid) {
      const { id: _ignored, ...cleanData } = data
      const { data: inserted, error: insertError } = await supabase
        .from(table)
        .insert([cleanData])
        .select()
        .single()

      if (insertError) {
        console.error(`Supabase fallback insert error on ${table}:`, insertError)
        throw new Error(insertError.message || 'Gagal menyimpan ke Supabase')
      }

      // Perbarui juga cache lokal
      try {
        const db = getLocalDb()
        if (db.records && db.records[table]) {
          db.records[table] = db.records[table].filter((r) => r.id !== id)
          db.records[table].push(inserted)
          saveLocalDb(db)
        }
      } catch {}

      revalidatePaths.forEach((path) => {
        revalidatePath(path, 'layout')
        revalidatePath(path, 'page')
      })
      return { success: true, message: 'Data berhasil disimpan ke Supabase!', data: inserted }
    }

    // ID sudah valid UUID, lakukan update normal
    const { id: _ignoredId, ...updateData } = data
    const { data: updated, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Supabase update error on ${table} [${id}]:`, error)
      throw new Error(error.message || 'Gagal memperbarui data di Supabase')
    }

    revalidatePaths.forEach((path) => {
      revalidatePath(path, 'layout')
      revalidatePath(path, 'page')
    })
    return { success: true, message: 'Data berhasil diperbarui di Supabase!', data: updated }
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

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    if (!isUuid) {
      try {
        const db = getLocalDb()
        if (db.records && db.records[table]) {
          db.records[table] = db.records[table].filter((r) => r.id !== id)
          saveLocalDb(db)
        }
      } catch {}
      revalidatePaths.forEach((path) => {
        revalidatePath(path, 'layout')
        revalidatePath(path, 'page')
      })
      return { success: true, message: 'Data berhasil dihapus!' }
    }

    const supabase = await getDbClient()
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) {
      console.error(`Supabase delete error on ${table} [${id}]:`, error)
      throw new Error(error.message || 'Gagal menghapus data dari Supabase')
    }

    revalidatePaths.forEach((path) => {
      revalidatePath(path, 'layout')
      revalidatePath(path, 'page')
    })
    return { success: true, message: 'Data berhasil dihapus dari Supabase!' }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus data'
    return { success: false, message }
  }
}
