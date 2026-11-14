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
import { ImageUploader } from '@/components/ui/image-uploader'
import { useToast } from '@/components/ui/toast-provider'
import { createRecord, updateRecord, deleteRecord } from '@/lib/actions/crud'
import { Plus, Edit2, Trash2, User, Mail } from 'lucide-react'
import {
  InstagramIcon,
  LinkedInIcon,
  formatInstagramUrl,
  formatLinkedinUrl,
} from '@/components/ui/social-icons'
import type { TeamMember } from '@/types'

interface TeamManagerProps {
  initialMembers: TeamMember[]
}

export function TeamManager({ initialMembers }: TeamManagerProps) {
  const [items, setItems] = useState<TeamMember[]>(initialMembers)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    photo: null as string | null,
    email: '',
    instagram: '',
    linkedin: '',
    sort_order: 1,
    is_active: true,
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      position: '',
      bio: '',
      photo: null,
      email: '',
      instagram: '',
      linkedin: '',
      sort_order: items.length + 1,
      is_active: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: TeamMember) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      position: item.position,
      bio: item.bio || '',
      photo: item.photo || null,
      email: item.email || '',
      instagram: item.instagram || '',
      linkedin: item.linkedin || '',
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
        const result = await updateRecord('team_members', editingItem.id, formData, ['/tim', '/', '/admin/tim'])
        if (result.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it))
          )
          toast('Data anggota tim berhasil diperbarui!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      } else {
        const newItem: Partial<TeamMember> = {
          ...formData,
          id: Date.now().toString(),
          photo: formData.photo || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const result = await createRecord('team_members', formData, ['/tim', '/', '/admin/tim'])
        if (result.success) {
          setItems((prev) => [...prev, (result.data as TeamMember) || (newItem as TeamMember)])
          toast('Anggota tim baru berhasil ditambahkan!', 'success')
          setModalOpen(false)
        } else {
          toast(result.message, 'error')
        }
      }
    } catch {
      toast('Terjadi kesalahan saat menyimpan data tim', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsSubmitting(true)

    try {
      const result = await deleteRecord('team_members', deletingId, ['/tim', '/', '/admin/tim'])
      if (result.success) {
        setItems((prev) => prev.filter((it) => it.id !== deletingId))
        toast('Anggota tim berhasil dihapus!', 'success')
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
      it.position.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tim & Pengurus"
        description="Kelola profil pengurus, manajer riset, koordinator program, dan dewan penasihat organisasi."
        action={{
          label: 'Tambah Anggota Tim',
          onClick: openCreateModal,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama atau jabatan..."
          />
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          Total: {filteredItems.length} Anggota
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-neutral-400">
                  #{member.sort_order}
                </span>
                <StatusBadge status={member.is_active ? 'active' : 'inactive'} />
              </div>

              <div className="h-20 w-20 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-950/60 border-2 border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 mx-auto shadow-sm">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-bold text-neutral-900 dark:text-white font-sans text-base">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                  {member.position}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 pt-1">
                  {member.bio || 'Tidak ada biodata'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3 text-neutral-400">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    title={`Email: ${member.email}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={formatInstagramUrl(member.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    title={`Instagram: ${member.instagram}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={formatLinkedinUrl(member.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    title={`LinkedIn: ${member.linkedin}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    <LinkedInIcon className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-1">
              <button
                onClick={() => openEditModal(member)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setDeletingId(member.id)
                  setDeleteConfirmOpen(true)
                }}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Anggota Tim' : 'Tambah Anggota Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap & Gelar"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Dr. Ahmad Fauzi"
            required
          />

          <Input
            label="Jabatan / Peran"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Contoh: Direktur Eksekutif"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Foto Profil Pengurus
            </label>
            <ImageUploader
              value={formData.photo}
              onChange={(url) => setFormData({ ...formData, photo: url })}
              folder="team"
            />
          </div>

          <Textarea
            label="Biodata Singkat (Bio)"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Latar belakang pengalaman dan keahlian..."
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nama@domain.org"
            />
            <Input
              label="Instagram"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@username"
            />
            <Input
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="in/username"
            />
          </div>

          <Input
            label="Nomor Urutan Tampilan"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="team_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="team_active" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Tampilkan di halaman publik Tim
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
              {editingItem ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Anggota Tim?"
        message="Apakah Anda yakin ingin menghapus data anggota tim ini?"
        isLoading={isSubmitting}
      />
    </div>
  )
}
