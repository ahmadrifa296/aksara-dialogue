'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SearchInput } from '@/components/ui/search-input'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { createRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Trash2, Copy, Check, Image as ImageIcon, FileText, Folder } from 'lucide-react'
import Image from 'next/image'
import type { Media } from '@/types'

interface MediaManagerProps {
  initialMedia: Media[]
}

const folders = ['all', 'general', 'programs', 'news', 'publications', 'team']

export function MediaManager({ initialMedia }: MediaManagerProps) {
  const [items, setItems] = useState<Media[]>(initialMedia)
  const [search, setSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    file_name: '',
    original_name: '',
    file_url: '',
    file_type: 'image' as 'image' | 'document',
    folder: 'general',
    alt_text: '',
  })

  const openUploadModal = () => {
    setFormData({
      file_name: '',
      original_name: '',
      file_url: '',
      file_type: 'image',
      folder: activeFolder === 'all' ? 'general' : activeFolder,
      alt_text: '',
    })
    setModalOpen(true)
  }

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast('URL berhasil disalin ke clipboard!', 'info')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newMedia: Partial<Media> = {
        ...formData,
        id: Date.now().toString(),
        file_path: `${formData.folder}/${formData.file_name}`,
        mime_type: formData.file_type === 'image' ? 'image/webp' : 'application/pdf',
        file_size: 150000,
        uploaded_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await createRecord('media', newMedia, ['/admin/media'])
      if (result.success) {
        setItems((prev) => [(result.data as Media) || (newMedia as Media), ...prev])
        toast('Berkas media berhasil ditambahkan!', 'success')
        setModalOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal mengunggah media', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('media', deletingId, ['/admin/media'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Berkas media berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus berkas', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter((it) => {
    const matchSearch =
      it.file_name.toLowerCase().includes(search.toLowerCase()) ||
      (it.alt_text && it.alt_text.toLowerCase().includes(search.toLowerCase()))
    const matchFolder = activeFolder === 'all' || it.folder === activeFolder
    return matchSearch && matchFolder
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pustaka Media (Media Library)"
        description="Kelola aset gambar, infografis, foto dokumentasi, dan berkas lampiran pendukung website."
        action={{
          label: 'Unggah Berkas Baru',
          onClick: openUploadModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      {/* Folder Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Folders */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                activeFolder === f
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {f === 'all' ? 'Semua Berkas' : f}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama berkas..."
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredItems.map((media) => (
          <div
            key={media.id}
            className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Preview Box */}
            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
              {media.file_type === 'image' && media.file_url ? (
                <Image
                  src={media.file_url}
                  alt={media.alt_text || media.file_name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <FileText className="h-10 w-10 text-neutral-400" />
              )}

              {/* Hover Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopyUrl(media.file_url, media.id)}
                  className="p-2 rounded-lg bg-white/90 text-neutral-800 hover:bg-white transition-colors"
                  title="Salin URL"
                >
                  {copiedId === media.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setDeletingId(media.id)
                    setDeleteConfirmOpen(true)
                  }}
                  className="p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-600 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-2.5 space-y-0.5">
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                {media.file_name}
              </p>
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="uppercase">{media.folder}</span>
                <span>{(media.file_size / 1024).toFixed(0)} KB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Unggah / Tambah Berkas Media"
      >
        <form onSubmit={handleCreateMedia} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Pilih Berkas / Foto
            </label>
            <ImageUploader
              value={formData.file_url}
              onChange={(url, file) => {
                setFormData((prev) => ({
                  ...prev,
                  file_url: url || '',
                  file_name: file ? file.name : prev.file_name || 'media-upload',
                  original_name: file ? file.name : prev.original_name || 'media-upload',
                }))
              }}
              folder={formData.folder}
            />
          </div>

          <Input
            label="Nama Berkas"
            value={formData.file_name}
            onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
            placeholder="banner-kegiatan.webp"
            required
          />

          <Input
            label="URL Berkas / Path"
            value={formData.file_url}
            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            placeholder="https://... atau URL storage"
            required
          />

          <Input
            label="Teks Alternatif (Alt Text)"
            value={formData.alt_text}
            onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
            placeholder="Deskripsi visual gambar..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={formData.folder}
              onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
              aria-label="Pilih folder tujuan"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            >
              <option value="general">Folder: general</option>
              <option value="programs">Folder: programs</option>
              <option value="news">Folder: news</option>
              <option value="publications">Folder: publications</option>
              <option value="team">Folder: team</option>
            </select>

            <select
              value={formData.file_type}
              onChange={(e) => setFormData({ ...formData, file_type: e.target.value as 'image' | 'document' })}
              aria-label="Pilih jenis berkas"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            >
              <option value="image">Jenis: Gambar (Image)</option>
              <option value="document">Jenis: Dokumen (PDF)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Tambahkan Media
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Berkas Media?"
        message="Apakah Anda yakin ingin menghapus berkas ini dari pustaka media?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
