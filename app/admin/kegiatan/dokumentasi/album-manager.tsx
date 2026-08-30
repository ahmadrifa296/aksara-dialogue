'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SearchInput } from '@/components/ui/search-input'
import { StatusBadge } from '@/components/ui/badge'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { slugify } from '@/lib/utils/slugify'
import { formatDate } from '@/lib/utils/format-date'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, Image as ImageIcon, MapPin, Calendar } from 'lucide-react'
import type { Album } from '@/types'

interface AlbumManagerProps {
  initialAlbums: Album[]
}

export function AlbumManager({ initialAlbums }: AlbumManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<Album[]>(initialAlbums)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Album | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    cover_image: null as string | null,
    event_date: '',
    location: '',
    is_published: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      slug: '',
      description: '',
      cover_image: null,
      event_date: new Date().toISOString().split('T')[0],
      location: 'Jakarta',
      is_published: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Album) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || '',
      cover_image: item.cover_image || null,
      event_date: item.event_date || '',
      location: item.location || '',
      is_published: item.is_published,
    })
    setModalOpen(true)
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingItem ? prev.slug : slugify(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingItem) {
        const result = await updateRecord('albums', editingItem.id, formData, ['/kegiatan/dokumentasi', '/', '/admin/kegiatan/dokumentasi'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it))
          )
          toast('Album dokumentasi berhasil diperbarui!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<Album> = {
          ...formData,
          id: Date.now().toString(),
          photo_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('albums', formData, ['/kegiatan/dokumentasi', '/', '/admin/kegiatan/dokumentasi'])
        if (result.success) {
          setItems((prev) => [(result.data as Album) || (newItem as Album), ...prev])
          toast('Album dokumentasi baru berhasil dibuat!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan album', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('albums', deletingId, ['/kegiatan/dokumentasi', '/', '/admin/kegiatan/dokumentasi'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Album berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
        router.refresh()
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus album', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter(
    (it) =>
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      (it.location && it.location.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dokumentasi & Album"
        description="Kelola album foto dokumentasi kegiatan, forum wicara, dan galeri aksi."
        action={{
          label: 'Buat Album Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari album foto..."
          />
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          Total: {filteredItems.length} Album
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((album) => (
          <div
            key={album.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="h-36 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                <ImageIcon className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-primary-700 dark:text-primary-400">
                    {album.photo_count || 0} Foto Dokumentasi
                  </span>
                  <StatusBadge status={album.is_published ? 'published' : 'draft'} />
                </div>

                <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white leading-snug">
                  {album.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {album.description || 'Tidak ada deskripsi'}
                </p>
              </div>

              <div className="pt-2 space-y-1 text-xs text-neutral-500">
                {album.location && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-primary-500" />
                    <span>{album.location}</span>
                  </p>
                )}
                {album.event_date && (
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-primary-500" />
                    <span>{formatDate(album.event_date)}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-mono">
                /kegiatan/dokumentasi/{album.slug}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(album)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-primary-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  title="Edit Album"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setDeletingId(album.id)
                    setDeleteConfirmOpen(true)
                  }}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Hapus Album"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Album Dokumentasi' : 'Buat Album Foto Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Album / Judul Dokumentasi"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Forum Dialog Nasional 2026"
            required
          />

          <Input
            label="Slug URL"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="forum-dialog-nasional-2026"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Foto Cover Album Dokumentasi
            </label>
            <ImageUploader
              value={formData.cover_image}
              onChange={(url) => setFormData({ ...formData, cover_image: url })}
              folder="gallery"
            />
          </div>

          <Textarea
            label="Deskripsi Album"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Deskripsi singkat kegiatan dalam album dokumentasi ini..."
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tanggal Kegiatan"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            />
            <Input
              label="Lokasi Kegiatan"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Jakarta Convention Center"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="album_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="album_published" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Publikasikan album ini di galeri dokumentasi
            </label>
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
              {editingItem ? 'Simpan Perubahan' : 'Buat Album'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Album Foto?"
        message="Apakah Anda yakin ingin menghapus album ini beserta foto-foto di dalamnya?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
