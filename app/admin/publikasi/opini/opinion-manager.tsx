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
import { useToast } from '@/components/ui/toast-provider'
import { slugify } from '@/lib/utils/slugify'
import { formatDate } from '@/lib/utils/format-date'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, Clock, User } from 'lucide-react'
import type { Opinion, PublicationCategory } from '@/types'

interface OpinionManagerProps {
  initialOpinions: Opinion[]
  categories: PublicationCategory[]
}

const statusOptions = [
  { value: 'published', label: 'Published (Tayang)' },
  { value: 'draft', label: 'Draft' },
  { value: 'unpublished', label: 'Unpublished' },
]

export function OpinionManager({ initialOpinions, categories }: OpinionManagerProps) {
  const [items, setItems] = useState<Opinion[]>(initialOpinions)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Opinion | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: categories[0]?.id || '',
    excerpt: '',
    content: '',
    author: '',
    tagsInput: '',
    status: 'published' as 'draft' | 'published' | 'unpublished',
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      slug: '',
      category_id: categories[0]?.id || '',
      excerpt: '',
      content: '',
      author: '',
      tagsInput: 'Opini, Demokrasi',
      status: 'published',
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Opinion) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      slug: item.slug,
      category_id: item.category_id || '',
      excerpt: item.excerpt || '',
      content: item.content,
      author: item.author || '',
      tagsInput: item.tags ? item.tags.join(', ') : '',
      status: item.status,
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
      const tags = formData.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title,
        slug: formData.slug,
        category_id: formData.category_id || null,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        tags,
        status: formData.status,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      }

      if (editingItem) {
        const result = await updateRecord('opinions', editingItem.id, payload, ['/publikasi/opini', '/', '/admin/publikasi/opini'])
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
          toast('Opini berhasil diperbarui!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<Opinion> = {
          ...payload,
          id: Date.now().toString(),
          category: categories.find((c) => c.id === payload.category_id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('opinions', payload, ['/publikasi/opini', '/', '/admin/publikasi/opini'])
        if (result.success) {
          setItems((prev) => [(result.data as Opinion) || (newItem as Opinion), ...prev])
          toast('Opini baru berhasil diterbitkan!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan opini', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('opinions', deletingId, ['/publikasi/opini', '/', '/admin/publikasi/opini'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Opini berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus opini', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter(
    (it) =>
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      (it.author && it.author.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kolom Opini Publik"
        description="Kelola tulisan opini, gagasan kritis, dan sudut pandang dari kontributor eksternal."
        action={{
          label: 'Tulis Opini Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari opini atau penulis..."
          />
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          Total: {filteredItems.length} Opini
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Judul Opini</th>
                <th className="px-6 py-4">Penulis</th>
                <th className="px-6 py-4">Tanggal Tayang</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    Tidak ada tulisan opini yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <p className="font-bold text-neutral-900 dark:text-white leading-tight">
                        {item.title}
                      </p>
                      <p className="font-mono text-[11px] text-neutral-400 mt-1 truncate">
                        /publikasi/opini/{item.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {item.author || 'Anonim'}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {item.published_at ? formatDate(item.published_at) : '-'}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Opini' : 'Tulis Opini Baru'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Judul Opini"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Judul tulisan opini..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="judul-opini"
              required
            />

            <Input
              label="Nama Penulis / Afiliasi"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Prof. Budi Hartono (Pakar Kebijakan)"
              required
            />
          </div>

          <Textarea
            label="Ringkasan Opini (Excerpt)"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Ringkasan gagasan utama..."
            rows={2}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Naskah Lengkap Opini (Rich Text Editor)
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Tuliskan naskah opini lengkap..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tags"
              value={formData.tagsInput}
              onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
              placeholder="Opini, Demokrasi"
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'draft' | 'published' | 'unpublished',
                })
              }
              options={statusOptions}
            />
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
              {editingItem ? 'Simpan Perubahan' : 'Terbitkan Opini'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Opini?"
        message="Apakah Anda yakin ingin menghapus tulisan opini ini?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
