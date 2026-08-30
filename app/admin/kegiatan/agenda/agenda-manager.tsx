'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
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
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, UserCheck, ExternalLink } from 'lucide-react'
import type { Event } from '@/types'

interface AgendaManagerProps {
  initialEvents: Event[]
}

const statusOptions = [
  { value: 'published', label: 'Published (Terjadwal)' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed (Selesai)' },
  { value: 'cancelled', label: 'Cancelled (Dibatalkan)' },
]

export function AgendaManager({ initialEvents }: AgendaManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<Event[]>(initialEvents)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Event | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    start_time: '13:00',
    end_time: '16:00',
    location: '',
    speaker: '',
    registration_url: '',
    status: 'published' as Event['status'],
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      slug: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      start_time: '13:00',
      end_time: '16:00',
      location: '',
      speaker: '',
      registration_url: '',
      status: 'published',
    })
    setModalOpen(true)
  }

  const openEditModal = (item: Event) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description,
      event_date: item.event_date,
      start_time: item.start_time || '13:00',
      end_time: item.end_time || '16:00',
      location: item.location || '',
      speaker: item.speaker || '',
      registration_url: item.registration_url || '',
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
      const payload = {
        ...formData,
        is_published: formData.status === 'published',
      }

      if (editingItem) {
        const result = await updateRecord('events', editingItem.id, payload, ['/kegiatan/agenda', '/', '/admin/kegiatan/agenda'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...payload } : it))
          )
          toast('Agenda kegiatan berhasil diperbarui!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<Event> = {
          ...payload,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('events', payload, ['/kegiatan/agenda', '/', '/admin/kegiatan/agenda'])
        if (result.success) {
          setItems((prev) => [(result.data as Event) || (newItem as Event), ...prev])
          toast('Agenda kegiatan baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan agenda', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('events', deletingId, ['/kegiatan/agenda', '/', '/admin/kegiatan/agenda'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Agenda berhasil dihapus!', 'success')
        setDeleteConfirmOpen(false)
        router.refresh()
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menghapus agenda', 'error')
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter(
    (it) =>
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      (it.location && it.location.toLowerCase().includes(search.toLowerCase())) ||
      (it.speaker && it.speaker.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda & Event"
        description="Kelola jadwal forum dialog, pelatihan, seminar, dan acara publik yang akan datang."
        action={{
          label: 'Buat Agenda Baru',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari agenda atau narasumber..."
          />
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          Total: {filteredItems.length} Agenda
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Judul Agenda</th>
                <th className="px-6 py-4">Tanggal & Waktu</th>
                <th className="px-6 py-4">Lokasi & Narasumber</th>
                <th className="px-6 py-4">Pendaftaran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    Tidak ada agenda kegiatan yang cocok.
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
                        /kegiatan/agenda/{item.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      <p className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                        <Calendar className="h-3.5 w-3.5 text-primary-500" />
                        {formatDate(item.event_date)}
                      </p>
                      {(item.start_time || item.end_time) && (
                        <p className="flex items-center gap-1.5 text-neutral-500">
                          <Clock className="h-3 w-3" />
                          {item.start_time} - {item.end_time} WIB
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      {item.location && (
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary-500" />
                          <span className="truncate max-w-[160px]">{item.location}</span>
                        </p>
                      )}
                      {item.speaker && (
                        <p className="flex items-center gap-1 text-neutral-500">
                          <UserCheck className="h-3 w-3" />
                          <span className="truncate max-w-[160px]">{item.speaker}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {item.registration_url ? (
                        <a
                          href={item.registration_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                        >
                          <span>Link Daftar</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-neutral-400">Terbuka Umum</span>
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
        title={editingItem ? 'Edit Agenda Event' : 'Buat Agenda Baru'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Agenda / Nama Event"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Diskusi Publik Kebijakan Energi 2026"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="diskusi-kebijakan-energi"
              required
            />
            <Input
              label="Tanggal Acara"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Waktu Mulai"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
            <Input
              label="Waktu Selesai"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Lokasi / Tempat"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Contoh: Gedung Aksara / Zoom Online"
            />
            <Input
              label="Narasumber / Pembicara"
              value={formData.speaker}
              onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              placeholder="Nama pemateri..."
            />
          </div>

          <Input
            label="URL Pendaftaran / Registrasi (Opsional)"
            value={formData.registration_url}
            onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
            placeholder="https://bit.ly/..."
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Deskripsi Agenda (Rich Text)
            </label>
            <RichTextEditor
              content={formData.description}
              onChange={(html) => setFormData({ ...formData, description: html })}
              placeholder="Deskripsi detail topik diskusi, latar belakang, dan rundown..."
            />
          </div>

          <Select
            label="Status Agenda"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'draft' | 'published' | 'completed' | 'cancelled',
              })
            }
            options={statusOptions}
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
              {editingItem ? 'Simpan Perubahan' : 'Jadwalkan Agenda'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Agenda?"
        message="Apakah Anda yakin ingin menghapus agenda kegiatan ini?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
