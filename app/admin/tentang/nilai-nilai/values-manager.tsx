'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatusBadge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast-provider'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, Heart, ShieldCheck, Users, Sparkles, Scale, Leaf } from 'lucide-react'
import type { Value } from '@/types'

interface ValuesManagerProps {
  initialValues: Value[]
}

const iconOptions = [
  { value: 'ShieldCheck', label: 'ShieldCheck (Integritas / Keamanan)' },
  { value: 'Users', label: 'Users (Inklusivitas / Warga)' },
  { value: 'Sparkles', label: 'Sparkles (Kolaborasi / Transformasi)' },
  { value: 'Heart', label: 'Heart (Kemanusiaan / Empati)' },
  { value: 'Scale', label: 'Scale (Keadilan)' },
  { value: 'Leaf', label: 'Leaf (Keberlanjutan)' },
]

export function ValuesManager({ initialValues }: ValuesManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<Value[]>(initialValues)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Value | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'ShieldCheck',
    sort_order: 1,
    is_active: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      icon: 'ShieldCheck',
      sort_order: items.length + 1,
      is_active: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Value) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon || 'ShieldCheck',
      sort_order: item.sort_order,
      is_active: item.is_active,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingItem) {
        const result = await updateRecord('values', editingItem.id, formData, ['/tentang-kami/nilai-nilai', '/', '/admin/tentang/nilai-nilai'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it))
          )
          toast('Nilai organisasi berhasil diperbarui!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<Value> = {
          ...formData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('values', formData, ['/tentang-kami/nilai-nilai', '/', '/admin/tentang/nilai-nilai'])
        if (result.success) {
          setItems((prev) => [...prev, (result.data as Value) || (newItem as Value)])
          toast('Nilai baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Gagal menyimpan nilai organisasi', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('values', deletingId, ['/tentang-kami/nilai-nilai', '/', '/admin/tentang/nilai-nilai'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Nilai organisasi berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
        router.refresh()
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus nilai', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Nilai-Nilai Organisasi"
        description="Kelola prinsip dan nilai-nilai fundamental gerakan Aksara Dialogue."
        action={{
          label: 'Tambah Nilai Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((val) => (
          <div
            key={val.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-neutral-400">
                  #{val.sort_order}
                </span>
                <StatusBadge status={val.is_active ? 'active' : 'inactive'} />
              </div>

              <h4 className="text-lg font-bold text-neutral-900 dark:text-white font-sans">
                {val.title}
              </h4>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {val.description}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-primary-600 dark:text-primary-400">
                {val.icon || 'ShieldCheck'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(val)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setDeletingId(val.id)
                    setDeleteConfirmOpen(true)
                  }}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Hapus"
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
        title={editingItem ? 'Edit Nilai Organisasi' : 'Tambah Nilai Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Nilai"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Integritas & Independensi"
            required
          />

          <Textarea
            label="Deskripsi Nilai"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan makna dan penerapan nilai ini..."
            rows={3}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              options={iconOptions}
            />

            <Input
              label="Urutan"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="val_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="val_active" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Aktifkan nilai ini di website
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
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan Nilai'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Nilai Organisasi?"
        message="Apakah Anda yakin ingin menghapus nilai ini?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
