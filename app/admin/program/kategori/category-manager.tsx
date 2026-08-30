'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SearchInput } from '@/components/ui/search-input'
import { StatusBadge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast-provider'
import { slugify } from '@/lib/utils/slugify'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { ProgramCategory } from '@/types'

interface ProgramCategoryManagerProps {
  initialCategories: ProgramCategory[]
}

export function ProgramCategoryManager({ initialCategories }: ProgramCategoryManagerProps) {
  const [items, setItems] = useState<ProgramCategory[]>(initialCategories)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProgramCategory | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 1,
    is_active: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      sort_order: items.length + 1,
      is_active: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: ProgramCategory) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      sort_order: item.sort_order,
      is_active: item.is_active,
    })
    setModalOpen(true)
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingItem ? prev.slug : slugify(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingItem) {
        const result = await updateRecord('program_categories', editingItem.id, formData, ['/program', '/admin/program', '/admin/program/kategori'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it))
          )
          toast('Kategori program berhasil diperbarui!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<ProgramCategory> = {
          ...formData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('program_categories', formData, ['/program', '/admin/program', '/admin/program/kategori'])
        if (result.success) {
          setItems((prev) => [...prev, (result.data as ProgramCategory) || (newItem as ProgramCategory)])
          toast('Kategori program baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan data', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('program_categories', deletingId, ['/program', '/admin/program', '/admin/program/kategori'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Kategori program berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus kategori program', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter((it) =>
    it.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori Program"
        description="Kelola kategori pengelompokan program dan inisiatif organisasi."
        action={{
          label: 'Tambah Kategori Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      >
        <Link
          href="/admin/program"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Daftar Program
        </Link>
      </PageHeader>

      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari kategori..."
          />
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          Total: {filteredItems.length} Kategori
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Urutan</th>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Slug URL</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    Tidak ada kategori program yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-semibold">
                      #{item.sort_order}
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                      {item.slug}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400">
                      {item.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Kategori Program' : 'Tambah Kategori Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Kategori"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Contoh: Advokasi Kebijakan"
            required
          />

          <Input
            label="Slug URL"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="advokasi-kebijakan"
            required
          />

          <Textarea
            label="Deskripsi Kategori"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Deskripsi singkat mengenai jenis program dalam kategori ini..."
            rows={3}
          />

          <Input
            label="Urutan"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="cat_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="cat_active" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Aktifkan kategori ini
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
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan Kategori'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Kategori Program?"
        message="Apakah Anda yakin ingin menghapus kategori ini? Program yang menggunakan kategori ini tidak akan terhapus."
        isLoading={isSubmitting}
      />
    </div>
  )
}
