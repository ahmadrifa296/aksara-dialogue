import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'local-db.json')

export interface LocalDb {
  site_settings?: Record<string, unknown>
  footer_settings?: Record<string, unknown>
  smtp_settings?: Record<string, unknown>
  records?: Record<string, Record<string, unknown>[]>
}

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2), 'utf-8')
    }
  } catch {}
}

export function getLocalDb(): LocalDb {
  ensureDataDir()
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8')
      return JSON.parse(content || '{}')
    }
  } catch {}
  return {}
}

export function saveLocalDb(data: LocalDb) {
  ensureDataDir()
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch {}
}

export function getLocalRecord<T = Record<string, unknown>>(key: keyof LocalDb): T | null {
  const db = getLocalDb()
  return (db[key] as T) || null
}

export function setLocalRecord(key: keyof LocalDb, value: unknown) {
  const db = getLocalDb()
  // @ts-expect-error dynamic assignment
  db[key] = value
  saveLocalDb(db)
}

export const saveLocalRecord = setLocalRecord
