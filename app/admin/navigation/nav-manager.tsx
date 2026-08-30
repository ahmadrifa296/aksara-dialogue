'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatusBadge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast-provider'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, CornerDownRight } from 'lucide-react'
import type { Navigation } from '@/types'

interface NavManagerProps {
  initialNavs: Navigation[]
}

export function NavManager({ initialNavs }: NavManagerProps) {
  const [items, setItems] = useState<Navigation[]>(initialNavs)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Navigation | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    parent_id: '' as string | null,
    sort_order: 1,
    is_active: true,
    open_new_tab: false,
  })

  const parentOptions = [
    { value: '', label: '-- Menu Utama (Induk / Root) --' },
    ...items
      .filter((it) => !it.parent_id)
      .map((it) => ({ value: it.id, label: `Submenu dari: ${it.title}` })),
  ]

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      url: '/',
      parent_id: '',
      sort_order: items.length + 1,
      is_active: true,
      open_new_tab: false,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Navigation) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      url: item.url,
      parent_id: item.parent_id || '',
      sort_order: item.sort_order,
      is_active: item.is_active,
      open_new_tab: item.open_new_tab,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        parent_id: formData.parent_id || null,
      }

      if (editingItem) {
        const result = await updateRecord('navigation', editingItem.id, payload, ['/', '/admin/navigation'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...payload } : it))
          )
          toast('Menu navigasi berhasil diperbarui!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<Navigation> = {
          ...payload,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('navigation', payload, ['/', '/admin/navigation'])
        if (result.success) {
          setItems((prev) => [...prev, (result.data as Navigation) || (newItem as Navigation)])
          toast('Menu navigasi baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan menu navigasi', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('navigation', deletingId, ['/', '/admin/navigation'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId && it.parent_id !== deletingId))
        toast('Menu navigasi berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus menu', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const parents = items.filter((it) => !it.parent_id).sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Pengaturan Navigasi Website"
        description="Kelola struktur tautan navbar, urutan menu, dan hierarki dropdown submenu secara dinamis."
        action={{
          label: 'Tambah Menu Navigasi',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase text-neutral-600 dark:text-neutral-300">
          Struktur Hirarki Menu Navbar
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {parents.map((parent) => {
            const children = items
              .filter((it) => it.parent_id === parent.id)
              .sort((a, b) => a.sort_order - b.sort_order)

            return (
              <div key={parent.id} className="p-4 space-y-3">
                {/* Parent Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      #{parent.sort_order}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-neutral-900 dark:text-white">
                        {parent.title}
                      </p>
                      <p className="font-mono text-xs text-neutral-500">{parent.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={parent.is_active ? 'active' : 'inactive'} />
                    <button
                      onClick={() => openEditModal(parent)}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      title="Edit Menu"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(parent.id)
                        setDeleteConfirmOpen(true)
                      }}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 dark:text-neutral-400 dark:hover:bg-red-950/40"
                      title="Hapus Menu"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Submenu Children List */}
                {children.length > 0 && (
                  <div className="ml-8 pl-4 border-l-2 border-primary-200 dark:border-primary-900 space-y-2">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40"
                      >
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            {child.title}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400">
                            ({child.url})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge status={child.is_active ? 'active' : 'inactive'} />
                          <button
                            onClick={() => openEditModal(child)}
                            className="p-1 rounded text-neutral-500 hover:text-primary-700"
                            title="Edit Submenu"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(child.id)
                              setDeleteConfirmOpen(true)
                            }}
                            className="p-1 rounded text-neutral-500 hover:text-red-600"
                            title="Hapus Submenu"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Menu Navigasi' : 'Tambah Menu Navigasi Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Label / Teks Menu"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Fokus Gerakan"
            required
          />

          <Input
            label="Link URL Tujuan"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="Contoh: /fokus-gerakan"
            required
          />

          <Select
            label="Menu Induk (Parent) / Hierarki"
            value={formData.parent_id || ''}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            options={parentOptions}
          />

          <Input
            label="Urutan Tampilan"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
          />

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="nav_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="nav_active" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Tampilkan menu ini di navbar website
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="nav_blank"
                checked={formData.open_new_tab}
                onChange={(e) => setFormData({ ...formData, open_new_tab: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="nav_blank" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Buka di tab baru (target _blank)
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
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan Menu'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Menu Navigasi?"
        message="Apakah Anda yakin ingin menghapus menu navigasi ini? Jika menu ini memiliki submenu, submenu di dalamnya juga akan terhapus."
        isLoading={isSubmitting}
      />
    </div>
  )
}
