'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { updateRecord } from '@/lib/actions/crud'
import { Save, Settings, Globe, Image as ImageIcon } from 'lucide-react'
import type { SiteSettings } from '@/types'

interface SettingsManagerProps {
  initialSettings: SiteSettings
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<SiteSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        site_name: formData.site_name,
        site_description: formData.site_description,
        logo_url: formData.logo_url,
        logo_dark_url: formData.logo_dark_url,
        favicon_url: formData.favicon_url,
        default_og_image: formData.default_og_image,
        updated_at: new Date().toISOString(),
      }

      const result = await updateRecord('site_settings', formData.id, payload, ['/', '/admin/settings', '/tentang-kami/profil'])
      if (result.success) {
        toast('Pengaturan logo & website berhasil disimpan!', 'success')
        router.refresh()
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menyimpan pengaturan', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Pengaturan Website & Logo"
        description="Kelola logo profil organisasi, favicon tab browser, banner OpenGraph media sosial, dan SEO."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo & Media Assets Box */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary-600" />
            <span>Unggah Logo & Identitas Visual Organisasi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Logo Utama Perusahaan / Organisasi (Light Mode)
              </label>
              <ImageUploader
                value={formData.logo_url}
                onChange={(url) => setFormData({ ...formData, logo_url: url })}
                folder="logo"
              />
              <p className="text-[11px] text-neutral-400">
                Format PNG/SVG transparan atau WebP (Disarankan rasio kotak / persegi panjang).
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Banner OpenGraph (OG Image / Social Share)
              </label>
              <ImageUploader
                value={formData.default_og_image}
                onChange={(url) => setFormData({ ...formData, default_og_image: url })}
                folder="general"
              />
              <p className="text-[11px] text-neutral-400">
                Tampil saat link website dibagikan di WhatsApp, Twitter/X, atau LinkedIn (1200x630 px).
              </p>
            </div>
          </div>
        </div>

        {/* Global Identity & SEO */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary-600" />
            <span>Identitas Global & Meta SEO</span>
          </h3>

          <Input
            label="Nama Organisasi / Situs"
            value={formData.site_name}
            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            placeholder="Aksara Dialogue"
            required
            helperText="Nama yang tampil pada navbar, footer, dan tab browser"
          />

          <Textarea
            label="Deskripsi Meta Global (Default SEO)"
            value={formData.site_description}
            onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
            placeholder="Deskripsi ringkas yang tampil di hasil pencarian Google..."
            rows={3}
            required
          />

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <Button type="submit" isLoading={isSaving}>
              <Save className="h-4 w-4" />
              Simpan Pengaturan & Logo
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
