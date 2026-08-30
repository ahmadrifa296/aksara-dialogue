'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { updateRecord, createRecord } from '@/lib/actions/crud'
import { Save, Quote } from 'lucide-react'
import type { About } from '@/types'

interface ProfileManagerProps {
  initialAbout: About
}

export function ProfileManager({ initialAbout }: ProfileManagerProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialAbout.title || '',
    content: initialAbout.content || '',
    image_url: initialAbout.image_url || null,
    quote: initialAbout.quote || '',
    quote_author: initialAbout.quote_author || '',
    is_published: initialAbout.is_published ?? true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        ...formData,
        page_type: 'profile',
        updated_at: new Date().toISOString(),
      }

      const targetId = initialAbout.id || '1'
      const result = await updateRecord('about', targetId, payload, [
        '/tentang-kami/profil',
        '/',
        '/admin/tentang/profil',
      ])

      if (result.success) {
        toast('Profil organisasi berhasil disimpan!', 'success')
        router.refresh()
      } else {
        toast(result.message || 'Gagal menyimpan profil', 'error')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan profil'
      toast(msg, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Profil Organisasi"
        description="Kelola teks pengantar, narasi sejarah/latar belakang, foto profil, dan kutipan resmi organisasi."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-5">
          <Input
            label="Judul Halaman Profil"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Aksara Dialogue: Ruang Temu Gagasan & Gerakan"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Foto / Banner Profil Organisasi
            </label>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="general"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Konten / Narasi Lengkap Profil (Rich Text)
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Tuliskan latar belakang pendirian, fokus utama, dan manifesto organisasi..."
            />
          </div>

          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">
              <Quote className="h-4 w-4" />
              <span>Kutipan Utama (Featured Quote)</span>
            </div>

            <Input
              label="Teks Kutipan / Quote"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="Perubahan dimulai dari ruang dialog yang terbuka..."
            />

            <Input
              label="Penulis / Sumber Kutipan"
              value={formData.quote_author}
              onChange={(e) => setFormData({ ...formData, quote_author: e.target.value })}
              placeholder="Contoh: Dewan Pengarah Aksara Dialogue"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" isLoading={isSaving}>
              <Save className="h-4 w-4" />
              Simpan Profil Organisasi
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
