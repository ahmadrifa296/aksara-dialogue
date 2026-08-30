'use client'

import { useCallback, useState, useRef } from 'react'
import { X, ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { validateFile } from '@/lib/supabase/storage'
import { createClient } from '@/lib/supabase/client'

interface ImageUploaderProps {
  value?: string | null
  onChange: (value: string | null, file?: File | null) => void
  onRemove?: () => void
  folder?: string
  accept?: string
  maxSize?: number
  className?: string
  type?: 'image' | 'document'
  label?: string
}

async function compressImageToDataUrl(file: File, maxDimension = 1600, quality = 0.85): Promise<string> {
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(img.src)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }

    img.onerror = () => {
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  folder = 'general',
  accept = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif',
  className,
  type = 'image',
  label,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      const validationError = validateFile(file, type)
      if (validationError) {
        setError(validationError)
        return
      }

      setIsUploading(true)

      try {
        // Step 1: Compress and generate optimized Data URL
        const dataUrl = await compressImageToDataUrl(file)
        setPreview(dataUrl)

        // Step 2: Try uploading to Supabase Storage if configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (supabaseUrl && supabaseUrl.startsWith('http')) {
          try {
            const supabase = createClient()
            const timestamp = Date.now()
            const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase()
            const filePath = `${folder}/${timestamp}-${safeName}`

            const { error: uploadErr } = await supabase.storage
              .from('media')
              .upload(filePath, file, { cacheControl: '3600', upsert: true })

            if (!uploadErr) {
              const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath)
              onChange(urlData.publicUrl, file)
              setIsUploading(false)
              return
            }
          } catch {
            // fallback to local dataURL
          }
        }

        // Fallback to optimized dataURL for local preview & offline demo
        onChange(dataUrl, file)
      } catch {
        setError('Gagal memproses file gambar')
      } finally {
        setIsUploading(false)
      }
    },
    [folder, onChange, type]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    setPreview(null)
    setError(null)
    onChange(null, null)
    onRemove?.()
    if (inputRef.current) inputRef.current.value = ''
  }, [onChange, onRemove])

  const displayImage = preview || value

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}

      {displayImage && type === 'image' ? (
        <div className="relative group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 aspect-video max-h-56 flex items-center justify-center">
          <Image
            src={displayImage}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
              <span>Memproses foto...</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors shadow"
            >
              Ganti Foto
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors text-center',
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
              : 'border-neutral-300 hover:border-primary-400 dark:border-neutral-700 dark:hover:border-primary-500 bg-neutral-50/60 dark:bg-neutral-900/60'
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin mb-2" />
          ) : (
            <ImageIcon className="h-8 w-8 text-neutral-400 mb-2" />
          )}

          <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {isUploading ? 'Sedang memproses gambar...' : 'Klik untuk Pilih Foto atau Seret ke Sini'}
          </p>
          <p className="text-[10px] text-neutral-400 mt-1">
            Format JPG, PNG, WebP, SVG (Maks. 10MB)
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-1">
          <X className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
