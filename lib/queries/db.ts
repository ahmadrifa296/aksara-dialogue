import { getDbClient } from '@/lib/supabase/server'
import { getLocalDb } from '@/lib/local-store'

function isSupabaseConfigured(): boolean {
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

export async function getTableData<T>(table: string, fallback: T[]): Promise<T[]> {
  // 1. Check Supabase first if connected
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbClient()
      
      // Try order by sort_order
      let res = await supabase.from(table).select('*').order('sort_order', { ascending: true })
      
      // If error (e.g. column sort_order does not exist), try created_at or un-ordered
      if (res.error) {
        res = await supabase.from(table).select('*').order('created_at', { ascending: false })
      }
      if (res.error) {
        res = await supabase.from(table).select('*')
      }

      if (!res.error && res.data && res.data.length > 0) {
        return res.data as unknown as T[]
      }
    } catch (e) {
      console.error(`Error fetching table ${table} from Supabase:`, e)
    }
  }

  // 2. Check local persistent store fallback
  try {
    const db = getLocalDb()
    if (db.records && db.records[table] && db.records[table].length > 0) {
      return db.records[table] as unknown as T[]
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
  // 1. Check Supabase first if connected
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbClient()
      let query = supabase.from(table).select('*')
      if (filterKey && filterValue !== undefined) {
        query = query.eq(filterKey, filterValue)
      }
      const { data, error } = await query.single()
      if (!error && data) return { ...fallback, ...data } as T
    } catch {}
  }

  // 2. Check local persistent store fallback
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

  return fallback
}
