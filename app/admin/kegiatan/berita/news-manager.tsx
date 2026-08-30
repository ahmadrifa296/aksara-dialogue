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
import { SearchInput } from '@/components/ui/search-input'
import { StatusBadge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { slugify } from '@/lib/utils/slugify'
import { formatDate } from '@/lib/utils/format-date'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, Clock, User, Tag } from 'lucide-react'
import type { News, NewsCategory } from '@/types'

interface NewsManagerProps {
  initialNews: News[]
  categories: NewsCategory[]
}

const statusOptions = [
  { value: 'published', label: 'Published (Tayang)' },
  { value: 'draft', label: 'Draft (Draf)' },
  { value: 'unpublished', label: 'Unpublished (Tarik)' },
]

export function NewsManager({ initialNews, categories }: NewsManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<News[]>(initialNews)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<News | null>(null)
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
    thumbnail: null as string | null,
    author: 'Tim Redaksi Aksara',
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
      thumbnail: null,
      author: 'Tim Redaksi Aksara',
      tagsInput: 'Berita, Kegiatan',
      status: 'published',
    })
    setModalOpen(true)
  }

  const openEditModal = (item: News) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      slug: item.slug,
      category_id: item.category_id || '',
      excerpt: item.excerpt || '',
      content: item.content,
      thumbnail: item.thumbnail || null,
      author: item.author || 'Tim Redaksi Aksara',
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
        thumbnail: formData.thumbnail || null,
        author: formData.author,
        tags,
        status: formData.status,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      }

      if (editingItem) {
        const result = await updateRecord('news', editingItem.id, payload, ['/kegiatan/berita', '/', '/admin/kegiatan/berita'])
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
          toast('Berita berhasil diperbarui!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<News> = {
          ...payload,
          id: Date.now().toString(),
          category: categories.find((c) => c.id === payload.category_id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('news', payload, ['/kegiatan/berita', '/', '/admin/kegiatan/berita'])
        if (result.success) {
          setItems((prev) => [(result.data as News) || (newItem as News), ...prev])
          toast('Berita baru berhasil diterbitkan!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan berita', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('news', deletingId, ['/kegiatan/berita', '/', '/admin/kegiatan/berita'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Berita berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
        router.refresh()
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus berita', 'error')
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
        title="Berita & Kegiatan"
        description="Kelola publikasi berita, liputan forum, dan rilis pers resmi."
        action={{
          label: 'Tulis Berita Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari berita..."
            />
          </div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            aria-label="Filter kategori berita"
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
          Total: {filteredItems.length} Berita
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Penulis & Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    Tidak ada berita yang sesuai pencarian.
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
                        /kegiatan/berita/{item.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {item.category?.name || 'Umum'}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500 space-y-1">
                      <p className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                        <User className="h-3 w-3" />
                        <span>{item.author || 'Redaksi'}</span>
                      </p>
                      {item.published_at && (
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(item.published_at)}</span>
                        </p>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Berita' : 'Tulis Berita Baru'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Judul Berita"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Judul rilis atau berita kegiatan..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="judul-berita"
              required
            />

            <Select
              label="Kategori"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>

          <Textarea
            label="Ringkasan (Excerpt)"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Ringkasan 1-2 kalimat untuk preview di kartu berita..."
            rows={2}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Foto Sampul / Cover Kegiatan
            </label>
            <ImageUploader
              value={formData.thumbnail}
              onChange={(url) => setFormData({ ...formData, thumbnail: url })}
              folder="news"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Isi Konten Berita (Rich Text Editor)
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Tuliskan berita atau liputan kegiatan secara lengkap..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Nama Penulis"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Tim Redaksi Aksara"
            />

            <Input
              label="Tags (Pisahkan dengan koma)"
              value={formData.tagsInput}
              onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
              placeholder="Advokasi, Dialog, Rilis"
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
              {editingItem ? 'Simpan Perubahan' : 'Terbitkan Berita'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Berita?"
        message="Apakah Anda yakin ingin menghapus berita ini dari website?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
