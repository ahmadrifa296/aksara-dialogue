'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'
import { sendContactMessage } from '@/lib/actions/contact'

interface ContactFormProps {
  receiverEmail?: string
}

export function ContactForm({ receiverEmail }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      const res = await sendContactMessage(formData)
      setResult(res)
      if (res.success) {
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch {
      setResult({
        success: false,
        message: 'Terjadi gangguan jaringan saat mengirim pesan. Silakan coba kembali atau gunakan email langsung.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const directGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    receiverEmail || 'kontak@aksaradialogue.org'
  )}&su=${encodeURIComponent(formData.subject || 'Inquiry Aksara Dialogue')}&body=${encodeURIComponent(
    formData.message || ''
  )}`

  return (
    <div className="space-y-6">
      {result && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 border ${
            result.success
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800'
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-bold">{result.success ? 'Pesan Berhasil Terkirim!' : 'Gagal Mengirim Pesan'}</p>
            <p className="text-xs leading-relaxed">{result.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nama lengkap Anda"
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Alamat Email Anda *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nama@email.com"
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            Subjek / Topik Pesan *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Contoh: Kolaborasi Riset Kebijakan / Usulan Topik Dialog"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            Isi Pesan / Gagasan *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tuliskan pesan, pertanyaan, atau rincian tawaran kolaborasi secara lengkap..."
            rows={5}
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengirim Pesan...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Kirim Pesan Sekarang</span>
              </>
            )}
          </button>

          <a
            href={directGmailUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold text-xs transition-colors"
            title="Buka langsung di aplikasi Gmail"
          >
            <Mail className="h-4 w-4 text-primary-600" />
            <span>Buka di Gmail</span>
          </a>
        </div>
      </form>
    </div>
  )
}
