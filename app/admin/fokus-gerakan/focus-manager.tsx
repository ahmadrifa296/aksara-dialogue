'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ImageUploader } from '@/components/ui/image-uploader'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SearchInput } from '@/components/ui/search-input'
import { StatusBadge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast-provider'
import { slugify } from '@/lib/utils/slugify'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react'
import type { FocusArea } from '@/types'

interface FocusManagerProps {
  initialFocusAreas: FocusArea[]
}

const iconOptions = [
  { value: 'Users', label: 'Users (Sosial / HAM)' },
  { value: 'Building2', label: 'Building (Politik / Kebijakan)' },
  { value: 'Scale', label: 'Scale (Hukum & Agraria)' },
  { value: 'TreePine', label: 'TreePine (Ekologis / Iklim)' },
  { value: 'BookOpen', label: 'BookOpen (Literasi & Media)' },
  { value: 'Heart', label: 'Heart (Kemanusiaan)' },
]

export function FocusManager({ initialFocusAreas }: FocusManagerProps) {
  const [items, setItems] = useState<FocusArea[]>(initialFocusAreas)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FocusArea | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: null as string | null,
    icon: 'Users',
    sort_order: 1,
    is_active: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: null,
      icon: 'Users',
      sort_order: items.length + 1,
      is_active: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: FocusArea) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description,
      image_url: item.image_url || null,
      icon: item.icon || 'Users',
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
        const result = await updateRecord('focus_areas', editingItem.id, formData, [
          '/',
          '/fokus-gerakan',
          '/admin/fokus-gerakan',
        ])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it))
          )
          toast('Foto dan data fokus gerakan berhasil diperbarui!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<FocusArea> = {
          ...formData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('focus_areas', formData, [
          '/',
          '/fokus-gerakan',
          '/admin/fokus-gerakan',
        ])
        if (result.success) {
          setItems((prev) => [...prev, (result.data as FocusArea) || (newItem as FocusArea)])
          toast('Fokus gerakan baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan sistem saat menyimpan data', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('focus_areas', deletingId, [
        '/',
        '/fokus-gerakan',
        '/admin/fokus-gerakan',
      ])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Fokus gerakan berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus data', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter(
    (it) =>
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fokus Gerakan"
        description="Kelola pilar fokus gerakan organisasi. Anda dapat mengganti foto banner kartu, judul, deskripsi, dan urutan tampilan."
        action={{
          label: 'Tambah Fokus Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari fokus gerakan..."
          />
        </div>
        <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
          Total: {filteredItems.length} Bidang Fokus
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Urutan</th>
                <th className="px-6 py-4">Foto Banner</th>
                <th className="px-6 py-4">Nama Fokus</th>
                <th className="px-6 py-4">Slug / URL</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                    Tidak ada data fokus gerakan yang cocok.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-neutral-500">
                      #{item.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-primary-600 dark:text-primary-400">
                      /fokus-gerakan/{item.slug}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg text-neutral-700 hover:text-primary-600 hover:bg-primary-50 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit / Ganti Foto"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(item.id)
                          setDeleteConfirmOpen(true)
                        }}
                        className="p-2 rounded-lg text-neutral-700 hover:text-red-600 hover:bg-red-50 dark:text-neutral-300 dark:hover:bg-red-950/40 transition-colors"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Fokus Gerakan & Ganti Foto' : 'Tambah Fokus Gerakan Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Fokus Gerakan"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Contoh: Keadilan Sosial & HAM"
            required
          />

          <Input
            label="Slug URL"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="keadilan-sosial-ham"
            required
            helperText="URL halaman publik: /fokus-gerakan/[slug]"
          />

          {/* Photo Uploader */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Foto Banner Kartu Fokus
            </p>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Unggah atau Ganti Foto Kartu Fokus Gerakan"
            />
          </div>

          <Textarea
            label="Deskripsi Singkat"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan ruang lingkup dan tujuan dari fokus gerakan ini..."
            rows={3}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Icon Representasi"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              options={iconOptions}
            />

            <Input
              label="Urutan Tampilan"
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })
              }
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
            >
              Aktifkan fokus gerakan ini (tampil di landing page & website publik)
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
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan Fokus'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Fokus Gerakan?"
        message="Apakah Anda yakin ingin menghapus fokus gerakan ini? Data yang terhapus tidak dapat dikembalikan."
        isLoading={isSubmitting}
      />
    </div>
  )
}
