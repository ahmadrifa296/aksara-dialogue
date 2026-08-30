import { createClient } from '@/lib/supabase/server'
import { getLocalDb } from '@/lib/local-store'

export async function getTableData<T>(table: string, fallback: T[]): Promise<T[]> {
  // 1. Check local persistent store first
  try {
    const db = getLocalDb()
    if (db.records && db.records[table] && db.records[table].length > 0) {
      return db.records[table] as unknown as T[]
    }
  } catch {}

  // 2. Check Supabase if connected
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient()
      const { data } = await supabase.from(table).select('*')
      if (data && data.length > 0) return data as unknown as T[]
    }
  } catch {}

  return fallback
}

export async function getSingleRecord<T>(
  table: string,
  fallback: T,
  filterKey?: string,
  filterValue?: unknown
): Promise<T> {
  // 1. Check local persistent store
  try {
    const db = getLocalDb()
    if (table === 'site_settings' && db.site_settings) {
      return { ...fallback, ...db.site_settings } as T
    }
    if (table === 'footer_settings' && db.footer_settings) {
      return { ...fallback, ...db.footer_settings } as T
    }
    if (db.records && db.records[table] && db.records[table].length > 0) {
      if (filterKey && filterValue !== undefined) {
        const found = db.records[table].find((r) => (r as Record<string, unknown>)[filterKey] === filterValue)
        if (found) return { ...fallback, ...found } as T
      } else {
        return { ...fallback, ...db.records[table][0] } as T
      }
    }
  } catch {}

  // 2. Check Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient()
      let query = supabase.from(table).select('*')
      if (filterKey && filterValue !== undefined) {
        query = query.eq(filterKey, filterValue)
      }
      const { data } = await query.single()
      if (data) return { ...fallback, ...data } as T
    }
  } catch {}

  return fallback
}
