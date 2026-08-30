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
import { useToast } from '@/components/ui/toast-provider'
import { slugify } from '@/lib/utils/slugify'
import { formatDate } from '@/lib/utils/format-date'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, FileText, Download, Upload } from 'lucide-react'
import type { Report, PublicationCategory } from '@/types'

interface ReportManagerProps {
  initialReports: Report[]
  categories: PublicationCategory[]
}

export function ReportManager({ initialReports, categories }: ReportManagerProps) {
  const [items, setItems] = useState<Report[]>(initialReports)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Report | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    file_name: '',
    file_url: '',
    category_id: categories[0]?.id || '',
    is_published: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      slug: '',
      description: '',
      file_name: 'Laporan-Aksara-Dialogue-2026.pdf',
      file_url: '#',
      category_id: categories[0]?.id || '',
      is_published: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Report) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || '',
      file_name: item.file_name,
      file_url: item.file_url,
      category_id: item.category_id || '',
      is_published: item.is_published,
    })
    setModalOpen(true)
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingItem ? prev.slug : slugify(title),
      file_name: editingItem ? prev.file_name : `${slugify(title)}.pdf`,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        category_id: formData.category_id || null,
        published_at: formData.is_published ? new Date().toISOString() : null,
      }

      if (editingItem) {
        const result = await updateRecord('reports', editingItem.id, payload, ['/publikasi/laporan', '/', '/admin/publikasi/laporan'])
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
          toast('Laporan berhasil diperbarui!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<Report> = {
          ...payload,
          id: Date.now().toString(),
          category: categories.find((c) => c.id === payload.category_id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('reports', payload, ['/publikasi/laporan', '/', '/admin/publikasi/laporan'])
        if (result.success) {
          setItems((prev) => [(result.data as Report) || (newItem as Report), ...prev])
          toast('Laporan baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan laporan', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('reports', deletingId, ['/publikasi/laporan', '/', '/admin/publikasi/laporan'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Laporan berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus laporan', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter(
    (it) =>
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      (it.description && it.description.toLowerCase().includes(search.toLowerCase())) ||
      it.file_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan & Riset"
        description="Kelola publikasi dokumen laporan tahunan, naskah riset kebijakan, dan file PDF unduhan warga."
        action={{
          label: 'Unggah Laporan Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari laporan..."
          />
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          Total: {filteredItems.length} Laporan
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((report) => (
          <div
            key={report.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2.5 py-1 rounded-md">
                  {report.category?.name || 'Dokumen'}
                </span>
                <StatusBadge status={report.is_published ? 'published' : 'draft'} />
              </div>

              <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white leading-snug">
                {report.title}
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                {report.description || 'Tidak ada ringkasan'}
              </p>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 truncate">
                  <FileText className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="truncate font-mono">{report.file_name}</span>
                </div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold shrink-0 ml-2">
                  PDF
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>{report.published_at ? formatDate(report.published_at) : 'Belum tayang'}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(report)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Edit Laporan"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setDeletingId(report.id)
                    setDeleteConfirmOpen(true)
                  }}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Hapus Laporan"
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
        title={editingItem ? 'Edit Laporan' : 'Unggah Laporan Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Laporan"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Laporan Tahunan Advokasi Kebijakan 2026"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="laporan-tahunan-2026"
              required
            />

            <Select
              label="Kategori Laporan"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>

          <Textarea
            label="Deskripsi / Ringkasan Dokumen"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan ruang lingkup riset dan hasil temuan utama dalam laporan ini..."
            rows={3}
          />

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Pengaturan Berkas PDF
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama File PDF"
                value={formData.file_name}
                onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
                placeholder="nama-file.pdf"
                required
              />
              <Input
                label="URL Download File PDF"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://... atau path storage"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="report_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="report_published" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Publikasikan laporan ini di halaman publik
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
              {editingItem ? 'Simpan Perubahan' : 'Terbitkan Laporan'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Laporan?"
        message="Apakah Anda yakin ingin menghapus laporan ini beserta berkas unduhannya?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
