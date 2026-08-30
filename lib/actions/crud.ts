'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getLocalDb, saveLocalDb, setLocalRecord } from '@/lib/local-store'

export interface ActionResult<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export async function createRecord(
  table: string,
  data: Record<string, unknown>,
  revalidatePaths: string[] = ['/', '/admin']
): Promise<ActionResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
      const db = getLocalDb()
      if (!db.records) db.records = {}
      if (!db.records[table]) db.records[table] = []
      const newRecord = { ...data, id: Date.now().toString(), created_at: new Date().toISOString() }
      db.records[table].push(newRecord)
      saveLocalDb(db)
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
      if (table === 'site_settings') {
        setLocalRecord('site_settings', data)
      } else if (table === 'footer_settings') {
        setLocalRecord('footer_settings', data)
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
        saveLocalDb(db)
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
      const db = getLocalDb()
      if (db.records && db.records[table]) {
        db.records[table] = db.records[table].filter((r) => r.id !== id)
        saveLocalDb(db)
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
