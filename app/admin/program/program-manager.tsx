'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SearchInput } from '@/components/ui/search-input'
import { StatusBadge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { slugify } from '@/lib/utils/slugify'
import { formatDate } from '@/lib/utils/format-date'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, MapPin, Calendar, Star, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import type { Program, ProgramCategory } from '@/types'

interface ProgramManagerProps {
  initialPrograms: Program[]
  categories: ProgramCategory[]
}

const statusOptions = [
  { value: 'published', label: 'Published (Publikasikan)' },
  { value: 'draft', label: 'Draft (Draf)' },
  { value: 'archived', label: 'Archived (Arsipkan)' },
]

export function ProgramManager({ initialPrograms, categories }: ProgramManagerProps) {
  const [items, setItems] = useState<Program[]>(initialPrograms)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Program | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: categories[0]?.id || '',
    excerpt: '',
    content: '',
    cover_image: '' as string | null,
    location: '',
    start_date: '',
    end_date: '',
    status: 'published' as 'draft' | 'published' | 'archived',
    is_featured: false,
    is_published: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      slug: '',
      category_id: categories[0]?.id || '',
      excerpt: '',
      content: '',
      cover_image: null,
      location: '',
      start_date: '',
      end_date: '',
      status: 'published',
      is_featured: false,
      is_published: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Program) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      slug: item.slug,
      category_id: item.category_id || '',
      excerpt: item.excerpt || '',
      content: item.content,
      cover_image: item.cover_image,
      location: item.location || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      status: item.status,
      is_featured: item.is_featured,
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
      const payload = {
        ...formData,
        is_published: formData.status === 'published',
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      }

      if (editingItem) {
        const result = await updateRecord('programs', editingItem.id, payload, ['/', '/program', '/admin/program'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === editingItem.id
                ? {
                    ...it,
                    ...payload,
                    category: categories.find((c) => c.id === payload.category_id),
                  }
                : it
            )
          )
          toast('Program berhasil diperbarui!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<Program> = {
          ...payload,
          id: Date.now().toString(),
          category: categories.find((c) => c.id === payload.category_id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('programs', payload, ['/', '/program', '/admin/program'])
        if (result.success) {
          setItems((prev) => [(result.data as Program) || (newItem as Program), ...prev])
          toast('Program baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan program', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('programs', deletingId, ['/', '/program', '/admin/program'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Program berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus program', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter((it) => {
    const matchSearch =
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      (it.excerpt && it.excerpt.toLowerCase().includes(search.toLowerCase()))
    const matchCat = selectedCat === 'all' || it.category_id === selectedCat
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Program"
        description="Kelola seluruh program kegiatan, inisiatif riset, dan forum advokasi masyarakat."
        action={{
          label: 'Tambah Program Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      >
        <Link
          href="/admin/program/kategori"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          Kelola Kategori Program
        </Link>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari program..."
            />
          </div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            aria-label="Filter berdasarkan kategori"
            className="w-full sm:w-52 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-neutral-500 font-medium">
          Total: {filteredItems.length} Program
        </div>
      </div>

      {/* Program Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Judul Program</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Lokasi & Tanggal</th>
                <th className="px-6 py-4">Unggulan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    Tidak ada program yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 max-w-sm">
                      <p className="font-bold text-neutral-900 dark:text-white leading-tight">
                        {item.title}
                      </p>
                      <p className="font-mono text-[11px] text-neutral-400 mt-1 truncate">
                        /program/{item.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {item.category?.name || 'Umum'}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500 space-y-1">
                      {item.location && (
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary-500" />
                          <span className="truncate max-w-[150px]">{item.location}</span>
                        </p>
                      )}
                      {item.start_date && (
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary-500" />
                          <span>{formatDate(item.start_date)}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-accent-700 dark:text-accent-400 font-semibold">
                          <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                          Ya
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(item.id)
                          setDeleteConfirmOpen(true)
                        }}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 dark:text-neutral-400 dark:hover:bg-red-950/40 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Program' : 'Tambah Program Baru'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Judul Program"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Dialog Kebijakan Publik Nasional 2026"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="dialog-kebijakan-publik"
              required
            />

            <Select
              label="Kategori Program"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>

          <Textarea
            label="Ringkasan Singkat (Excerpt)"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Tuliskan 1-2 kalimat ringkasan yang akan tampil pada kartu program..."
            rows={2}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Foto Banner / Sampul Program
            </label>
            <ImageUploader
              value={formData.cover_image}
              onChange={(url) => setFormData({ ...formData, cover_image: url })}
              folder="programs"
            />
          </div>

          {/* TipTap Rich Text Editor for Content */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Deskripsi & Narasi Lengkap Program
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Jelaskan latar belakang, tujuan, sasaran peserta, dan jadwal program..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Lokasi Kegiatan"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Jakarta / Online Zoom"
            />
            <Input
              label="Tanggal Mulai"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Select
              label="Status Publikasi"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'draft' | 'published' | 'archived',
                })
              }
              options={statusOptions}
            />

            <div className="flex items-center gap-2 sm:pt-7">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Tandai sebagai Program Unggulan (Tampil di Homepage)
              </label>
            </div>
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
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan Program'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Program?"
        message="Apakah Anda yakin ingin menghapus program ini dari sistem? Perubahan langsung berlaku di website."
        isLoading={isSubmitting}
      />
    </div>
  )
}
