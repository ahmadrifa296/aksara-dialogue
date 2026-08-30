import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKET, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES, FILE_SIZE_LIMIT } from '@/lib/utils/constants'

interface UploadResult {
  path: string
  url: string
}

interface UploadOptions {
  folder: string
  file: File
  onProgress?: (progress: number) => void
}

export function validateFile(file: File, type: 'image' | 'document' = 'image'): string | null {
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES
  const maxSize = type === 'image' ? FILE_SIZE_LIMIT.IMAGE : FILE_SIZE_LIMIT.DOCUMENT

  if (!allowedTypes.includes(file.type)) {
    return `Tipe file tidak didukung. Gunakan: ${allowedTypes.join(', ')}`
  }

  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024)
    return `Ukuran file terlalu besar. Maksimal ${maxMB}MB`
  }

  return null
}

export function generateFileName(file: File, folder: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const ext = file.name.split('.').pop()
  return `${folder}/${timestamp}-${randomStr}.${ext}`
}

export async function uploadFile({ folder, file }: UploadOptions): Promise<UploadResult> {
  const supabase = createClient()
  const filePath = generateFileName(file, folder)

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)

  return {
    path: filePath,
    url: urlData.publicUrl,
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath])

  if (error) {
    throw new Error(`Hapus file gagal: ${error.message}`)
  }
}

export async function replaceFile(oldPath: string, newFile: File, folder: string): Promise<UploadResult> {
  // Upload new file first
  const result = await uploadFile({ folder, file: newFile })

  // Then delete old file (don't fail if old file doesn't exist)
  try {
    await deleteFile(oldPath)
  } catch {
    // Old file might not exist, that's okay
  }

  return result
}

export function getPublicUrl(path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)
  return data.publicUrl
}
