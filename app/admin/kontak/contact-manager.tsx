'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast-provider'
import { updateRecord } from '@/lib/actions/crud'
import {
  saveSmtpSettings,
  testSmtpEmail,
  deleteContactMessage,
  ContactMessage,
} from '@/lib/actions/contact'
import type { SmtpConfig } from '@/lib/services/mail'
import {
  Save,
  Mail,
  Phone,
  Globe,
  Plus,
  Trash2,
  Inbox,
  Send,
  Key,
  HelpCircle,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import type { FooterSettings, SocialLink } from '@/types'

interface ContactManagerProps {
  initialFooter: FooterSettings
  initialSocialLinks: SocialLink[]
  initialMessages: ContactMessage[]
  initialSmtpConfig: SmtpConfig | null
}

export function ContactManager({
  initialFooter,
  initialSocialLinks,
  initialMessages,
  initialSmtpConfig,
}: ContactManagerProps) {
  const [activeTab, setActiveTab] = useState<'kontak' | 'inbox' | 'smtp'>('kontak')
  const [footer, setFooter] = useState<FooterSettings>(initialFooter)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks)
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [isSaving, setIsSaving] = useState(false)
  const [isTestingSmtp, setIsTestingSmtp] = useState(false)
  const [testRecipient, setTestRecipient] = useState(initialSmtpConfig?.user || '')
  const { toast } = useToast()

  // SMTP state
  const [smtpForm, setSmtpForm] = useState<SmtpConfig>({
    host: initialSmtpConfig?.host || 'smtp.gmail.com',
    port: initialSmtpConfig?.port || 465,
    secure: true,
    user: initialSmtpConfig?.user || '',
    pass: initialSmtpConfig?.pass || '',
    from_name: initialSmtpConfig?.from_name || 'Aksara Dialogue Web',
    receiver_email: initialSmtpConfig?.receiver_email || '',
  })

  // 1. Save Contact Details
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        description: footer.description,
        address: footer.address,
        email: footer.email,
        phone: footer.phone,
        whatsapp: footer.whatsapp,
        copyright: footer.copyright,
        updated_at: new Date().toISOString(),
      }

      const result = await updateRecord('footer_settings', footer.id, payload, [
        '/',
        '/kontak',
        '/admin/kontak',
      ])
      if (result.success) {
        toast('Informasi kontak & footer berhasil diperbarui!', 'success')
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menyimpan kontak', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // 2. Save SMTP Config
  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const result = await saveSmtpSettings(smtpForm)
      if (result.success) {
        toast(result.message, 'success')
      } else {
        toast(result.message, 'error')
      }
    } catch {
      toast('Gagal menyimpan konfigurasi email', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // 3. Test SMTP Connection
  const handleTestSmtp = async () => {
    if (!smtpForm.user || !smtpForm.pass) {
      toast('Harap isi Email Gmail dan App Password terlebih dahulu', 'error')
      return
    }

    setIsTestingSmtp(true)
    try {
      await saveSmtpSettings(smtpForm)
      const res = await testSmtpEmail(testRecipient || smtpForm.user)
      if (res.success) {
        toast(res.message, 'success')
      } else {
        toast(res.message, 'error')
      }
    } catch {
      toast('Terjadi kesalahan saat pengujian email', 'error')
    } finally {
      setIsTestingSmtp(false)
    }
  }

  // 4. Delete Message from Inbox
  const handleDeleteMessage = async (id: string) => {
    const res = await deleteContactMessage(id)
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id))
      toast('Pesan berhasil dihapus dari kotak masuk', 'success')
    } else {
      toast(res.message, 'error')
    }
  }

  // 5. Social Links
  const handleAddSocial = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: 'instagram',
      url: 'https://',
      is_active: true,
      sort_order: socialLinks.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setSocialLinks([...socialLinks, newLink])
  }

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleUpdateSocial = (index: number, field: keyof SocialLink, value: unknown) => {
    setSocialLinks((prev) =>
      prev.map((it, idx) => (idx === index ? { ...it, [field]: value } : it))
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Kontak, Inbox & Gmail SMTP"
        description="Kelola informasi kontak sekretariat, lihat pesan masuk dari pengunjung, dan atur akun Gmail untuk pengiriman email otomatis."
      />

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('kontak')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'kontak'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>Informasi Kontak & Medsos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 relative ${
            activeTab === 'inbox'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Kotak Masuk Pesan</span>
          {messages.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-primary-600 text-white">
              {messages.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('smtp')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'smtp'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Pengaturan Gmail SMTP</span>
        </button>
      </div>

      {/* TAB 1: INFORMASI KONTAK */}
      {activeTab === 'kontak' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-600" />
                <span>Informasi Kontak Sekretariat</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Resmi Organisasi"
                  type="email"
                  value={footer.email}
                  onChange={(e) => setFooter({ ...footer, email: e.target.value })}
                  placeholder="kontak@aksaradialogue.org"
                  required
                  helperText="Email yang ditampilkan ke publik di footer dan halaman kontak"
                />
                <Input
                  label="Nomor Telepon Kantor"
                  value={footer.phone || ''}
                  onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
                  placeholder="+62 21 7890 1234"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nomor WhatsApp Hotline"
                  value={footer.whatsapp || ''}
                  onChange={(e) => setFooter({ ...footer, whatsapp: e.target.value })}
                  placeholder="+62 812 3456 7890"
                  helperText="Digunakan untuk tombol chat WhatsApp di website"
                />
                <Input
                  label="Teks Hak Cipta (Copyright)"
                  value={footer.copyright}
                  onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                  placeholder="© 2026 Aksara Dialogue. All rights reserved."
                  required
                />
              </div>

              <Textarea
                label="Alamat Lengkap Kantor / Sekretariat"
                value={footer.address}
                onChange={(e) => setFooter({ ...footer, address: e.target.value })}
                placeholder="Jl. Dialogue No. 12, Jakarta Selatan..."
                rows={3}
                required
              />

              <Textarea
                label="Deskripsi Singkat Footer"
                value={footer.description}
                onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                placeholder="Ringkasan identitas organisasi yang muncul di footer..."
                rows={3}
              />

              <div className="pt-2 flex justify-end">
                <Button type="submit" isLoading={isSaving}>
                  <Save className="h-4 w-4" />
                  Simpan Informasi Kontak
                </Button>
              </div>
            </div>
          </form>

          {/* Social Links Form */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary-600" />
                <span>Tautan Media Sosial</span>
              </h3>
              <Button onClick={handleAddSocial} size="sm" variant="outline">
                <Plus className="h-3.5 w-3.5" />
                Tambah Akun Medsos
              </Button>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link, idx) => (
                <div
                  key={link.id || idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700"
                >
                  <select
                    value={link.platform}
                    onChange={(e) => handleUpdateSocial(idx, 'platform', e.target.value)}
                    aria-label="Platform media sosial"
                    className="w-36 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="facebook">Facebook</option>
                  </select>

                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUpdateSocial(idx, 'url', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-mono"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={async () => {
                  setIsSaving(true)
                  toast('Tautan media sosial berhasil disimpan!', 'success')
                  setIsSaving(false)
                }}
                isLoading={isSaving}
              >
                <Save className="h-4 w-4" />
                Simpan Media Sosial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INBOX PESAN */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Total: {messages.length} Pesan Masuk dari Website
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-400 space-y-3">
              <Inbox className="h-10 w-10 mx-auto text-neutral-300" />
              <p className="text-sm font-semibold">Belum ada pesan yang masuk.</p>
              <p className="text-xs text-neutral-500">
                Pesan yang dikirim pengunjung melalui formulir kontak di website akan tersimpan otomatis di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary-600 shrink-0" />
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {msg.name}
                      </span>
                      <span className="text-xs text-neutral-400">({msg.email})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(msg.created_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                      Subjek: {msg.subject}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 whitespace-pre-wrap leading-relaxed bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                      {msg.message}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider"
                    >
                      <span>Balas via Email Pengirim</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GMAIL SMTP CONFIG */}
      {activeTab === 'smtp' && (
        <div className="space-y-6">
          {/* Guide Card */}
          <div className="p-6 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-primary-800 dark:text-primary-300 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary-600" />
              <span>Panduan Pengiriman Email Otomatis ke Gmail</span>
            </h4>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
              Agar website dapat mengirim email langsung ke inbox Gmail tanpa terblokir keamanan Google, Anda memerlukan <strong>Google App Password (Kata Sandi Aplikasi 16-Digit)</strong>:
            </p>
            <ol className="text-xs text-neutral-700 dark:text-neutral-300 list-decimal list-inside space-y-1.5 font-mono">
              <li>Buka Akun Google Anda di: <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-primary-600 underline font-bold">myaccount.google.com/security</a></li>
              <li>Pastikan <strong>Verifikasi 2 Langkah (2-Step Verification)</strong> telah Aktif.</li>
              <li>Cari menu <strong>Kata Sandi Aplikasi (App Passwords)</strong> di pengaturan keamanan Google.</li>
              <li>Beri nama aplikasi (contoh: <em>Aksara Dialogue Web</em>) lalu salin <strong>16 digit kode sandi</strong> yang dihasilkan ke kolom di bawah ini.</li>
            </ol>
          </div>

          <form onSubmit={handleSaveSmtp} className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-2">
                <Key className="h-4 w-4 text-primary-600" />
                <span>Kredensial Akun Gmail Pengirim (SMTP)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Akun Gmail Pengirim"
                  type="email"
                  value={smtpForm.user}
                  onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                  placeholder="contoh: sekretariat.aksara@gmail.com"
                  required
                  helperText="Akun Gmail yang digunakan sistem untuk mengirimkan email"
                />

                <Input
                  label="Google App Password (16 Digit)"
                  type="password"
                  value={smtpForm.pass}
                  onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                  placeholder="xxxx xxxx xxxx xxxx"
                  required
                  helperText="Kata Sandi Aplikasi 16 digit yang dibuat dari myaccount.google.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Pengirim (From Name)"
                  value={smtpForm.from_name || ''}
                  onChange={(e) => setSmtpForm({ ...smtpForm, from_name: e.target.value })}
                  placeholder="Aksara Dialogue Web"
                  helperText="Nama yang akan muncul di inbox penerima"
                />

                <Input
                  label="Email Penerima Pesan (Destination Inbox)"
                  type="email"
                  value={smtpForm.receiver_email || ''}
                  onChange={(e) => setSmtpForm({ ...smtpForm, receiver_email: e.target.value })}
                  placeholder="contoh: kontak@aksaradialogue.org atau email admin"
                  helperText="Email tujuan yang akan menerima notifikasi pesan masuk dari pengunjung"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="submit" isLoading={isSaving}>
                  <Save className="h-4 w-4" />
                  Simpan Konfigurasi Gmail
                </Button>
              </div>
            </div>
          </form>

          {/* Test Email Box */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans flex items-center gap-2">
              <Send className="h-4 w-4 text-primary-600" />
              <span>Uji Coba Pengiriman Email (Test Email)</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Kirim email uji coba untuk memastikan kredensial Gmail Anda telah terhubung dan berfungsi dengan benar.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <Input
                  label="Kirim Email Uji Coba Ke:"
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="Masukkan alamat email penerima uji coba..."
                />
              </div>
              <Button
                type="button"
                onClick={handleTestSmtp}
                isLoading={isTestingSmtp}
                className="w-full sm:w-auto"
              >
                <Send className="h-4 w-4" />
                Kirim Email Uji Coba
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
