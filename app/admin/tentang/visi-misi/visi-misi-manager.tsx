'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatusBadge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast-provider'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, Compass } from 'lucide-react'
import type { VisiMisi } from '@/types'

interface VisiMisiManagerProps {
  initialItems: VisiMisi[]
}

export function VisiMisiManager({ initialItems }: VisiMisiManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<VisiMisi[]>(initialItems)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<VisiMisi | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: 'misi' as 'visi' | 'misi',
    content: '',
    sort_order: 1,
    is_published: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      type: 'misi',
      content: '',
      sort_order: items.filter((i) => i.type === 'misi').length + 1,
      is_published: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: VisiMisi) => {
    setEditingItem(item)
    setFormData({
      type: item.type,
      content: item.content,
      sort_order: item.sort_order,
      is_published: item.is_published,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingItem) {
        const result = await updateRecord('visi_misi', editingItem.id, formData, ['/tentang-kami/visi-misi', '/', '/admin/tentang/visi-misi'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it))
          )
          toast('Visi / Misi berhasil diperbarui!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<VisiMisi> = {
          ...formData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('visi_misi', formData, ['/tentang-kami/visi-misi', '/', '/admin/tentang/visi-misi'])
        if (result.success) {
          setItems((prev) => [...prev, (result.data as VisiMisi) || (newItem as VisiMisi)])
          toast('Poin baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
          router.refresh()
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
      const result = await deleteRecord('visi_misi', deletingId, ['/tentang-kami/visi-misi', '/', '/admin/tentang/visi-misi'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Poin berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
        router.refresh()
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

  const visiList = items.filter((it) => it.type === 'visi')
  const misiList = items.filter((it) => it.type === 'misi').sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="Visi & Misi"
        description="Kelola visi utama dan daftar butir misi strategis gerakan organisasi."
        action={{
          label: 'Tambah Poin Visi / Misi',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      {/* Visi Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">
            <Compass className="h-4 w-4" />
            <span>Visi Utama</span>
          </div>
        </div>

        {visiList.length === 0 ? (
          <p className="text-sm text-neutral-400 italic">Belum ada rumusan visi.</p>
        ) : (
          visiList.map((v) => (
            <div key={v.id} className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
              <p className="text-base font-serif font-medium text-neutral-900 dark:text-white leading-relaxed">
                &ldquo;{v.content}&rdquo;
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditModal(v)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  title="Edit Visi"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Misi List */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans">
            Daftar Butir Misi ({misiList.length})
          </h3>
          <Button onClick={openCreateModal} size="sm" variant="outline">
            <Plus className="h-3.5 w-3.5" />
            Tambah Misi
          </Button>
        </div>

        <div className="space-y-2">
          {misiList.map((m, idx) => (
            <div
              key={m.id}
              className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-normal">
                  {m.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditModal(m)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setDeletingId(m.id)
                    setDeleteConfirmOpen(true)
                  }}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Poin' : 'Tambah Poin Visi / Misi'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Jenis Poin"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'visi' | 'misi' })}
            options={[
              { value: 'visi', label: 'Visi Organisasi' },
              { value: 'misi', label: 'Misi Strategis' },
            ]}
          />

          <Textarea
            label="Rumusan Kalimat"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Tuliskan rumusan visi atau misi..."
            rows={4}
            required
          />

          <Input
            label="Nomor Urutan"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
          />

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
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Butir Misi?"
        message="Apakah Anda yakin ingin menghapus butir misi ini dari sistem?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
