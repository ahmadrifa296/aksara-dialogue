'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { updateHomepageSection } from '@/lib/actions/homepage'
import {
  Sparkles,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  LayoutTemplate,
  Info,
  Target,
  FolderOpen,
  Newspaper,
  BookOpen,
  Image as ImageIcon,
  Megaphone,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { HomepageSection } from '@/types'

interface HomepageManagerProps {
  initialSections: Record<string, HomepageSection>
}

const sectionMeta: Record<
  string,
  { label: string; icon: typeof LayoutTemplate; desc: string }
> = {
  hero: { label: 'Hero Banner', icon: LayoutTemplate, desc: 'Tampilan utama paling atas di landing page' },
  about: { label: 'Tentang Singkat', icon: Info, desc: 'Ringkasan profil dan kutipan organisasi' },
  focus: { label: 'Fokus Gerakan', icon: Target, desc: 'Pilar fokus isu dan advokasi' },
  programs: { label: 'Program Unggulan', icon: FolderOpen, desc: 'Highlight program kegiatan utama' },
  news: { label: 'Kegiatan & Berita', icon: Newspaper, desc: 'Kabar dan liputan kegiatan terkini' },
  gallery: { label: 'Dokumentasi Visual', icon: ImageIcon, desc: 'Galeri foto dokumentasi' },
  cta: { label: 'Call To Action', icon: Megaphone, desc: 'Banner ajakan bergabung dan kolaborasi' },
}

export function HomepageManager({ initialSections }: HomepageManagerProps) {
  const router = useRouter()
  const [sections, setSections] = useState<Record<string, HomepageSection>>(initialSections)
  const [activeKey, setActiveKey] = useState<string>('hero')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const currentSection = sections[activeKey] || {
    id: activeKey,
    section_key: activeKey,
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_url: '',
    button_secondary_text: '',
    button_secondary_url: '',
    sort_order: 1,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  }

  const handleFieldChange = (field: keyof HomepageSection, value: unknown) => {
    setSections((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateHomepageSection(currentSection)
      if (result.success) {
        toast(result.message, 'success')
        router.refresh()
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menyimpan perubahan section', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const currentMeta = sectionMeta[activeKey] || {
    label: activeKey,
    icon: LayoutTemplate,
    desc: '',
  }
  const IconComponent = currentMeta.icon

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Homepage"
        description="Kelola teks, judul, tombol, dan urutan seluruh section di halaman landing page utama."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Section Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-3 py-2">
              Daftar Section
            </p>
            <div className="space-y-1">
              {Object.keys(sectionMeta).map((key) => {
                const meta = sectionMeta[key]
                const sec = sections[key]
                const Icon = meta.icon
                const isActive = activeKey === key

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveKey(key)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-lg text-left text-sm transition-all duration-150',
                      isActive
                        ? 'bg-primary-50 text-primary-900 dark:bg-primary-950/60 dark:text-primary-200 font-semibold shadow-sm border border-primary-200/60 dark:border-primary-800'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'p-1.5 rounded-md shrink-0',
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <p className="truncate leading-tight">{meta.label}</p>
                        <p className="text-[11px] text-neutral-400 font-normal truncate mt-0.5">
                          {sec?.title || 'Belum diatur'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {sec?.is_visible ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/40 px-1.5 py-0.5 rounded">
                          <Eye className="h-3 w-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                          <EyeOff className="h-3 w-3" />
                          Nonaktif
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Section Editor Form (8 cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-6">
            {/* Header of Active Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-neutral-200 dark:border-neutral-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
                    Edit {currentMeta.label}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {currentMeta.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleFieldChange('is_visible', !currentSection.is_visible)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                    currentSection.is_visible
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'
                  )}
                >
                  {currentSection.is_visible ? (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Tampil di Website
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Disembunyikan
                    </>
                  )}
                </button>

                <Button onClick={handleSave} isLoading={isSaving} size="sm">
                  <Save className="h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label="Sub-judul / Label Kategori"
                value={currentSection.subtitle || ''}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                placeholder="Contoh: GERAKAN SOSIAL & RUANG DIALOG"
                helperText="Label kecil yang muncul di atas judul utama section"
              />

              <Input
                label="Judul Section (Heading)"
                value={currentSection.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Judul section..."
                required
              />

              <Textarea
                label="Deskripsi / Teks Konten"
                value={currentSection.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Tuliskan narasi pengantar atau deskripsi untuk section ini..."
                rows={4}
              />

              {/* Background Photo Uploader */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  {activeKey === 'hero' ? 'Foto Background Hero Banner (Halaman Awal)' : 'Foto / Gambar Background Section'}
                </p>
                <ImageUploader
                  value={currentSection.image_url}
                  onChange={(url) => handleFieldChange('image_url', url)}
                  label={activeKey === 'hero' ? 'Unggah atau Ganti Foto Background Hero Halaman Awal' : 'Unggah Foto Background'}
                />
                <p className="text-[11px] text-neutral-400">
                  Foto ini akan menjadi latar belakang penuh beresolusi tinggi di bagian teratas website.
                </p>
              </div>

              {/* Button 1 Configuration */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Tombol Utama (Primary Button)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Teks Tombol"
                    value={currentSection.button_text || ''}
                    onChange={(e) => handleFieldChange('button_text', e.target.value)}
                    placeholder="Contoh: Jelajahi Program"
                  />
                  <Input
                    label="Link URL Tujuan"
                    value={currentSection.button_url || ''}
                    onChange={(e) => handleFieldChange('button_url', e.target.value)}
                    placeholder="Contoh: /program"
                  />
                </div>
              </div>

              {/* Button 2 Configuration (For Hero or CTA) */}
              {(activeKey === 'hero' || activeKey === 'cta') && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Tombol Sekunder (Secondary Button)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Teks Tombol Sekunder"
                      value={currentSection.button_secondary_text || ''}
                      onChange={(e) => handleFieldChange('button_secondary_text', e.target.value)}
                      placeholder="Contoh: Tentang Kami"
                    />
                    <Input
                      label="Link URL Tujuan"
                      value={currentSection.button_secondary_url || ''}
                      onChange={(e) => handleFieldChange('button_secondary_url', e.target.value)}
                      placeholder="Contoh: /tentang-kami/profil"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <Button onClick={handleSave} isLoading={isSaving} size="md">
                <Save className="h-4 w-4" />
                Simpan Perubahan Section
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
