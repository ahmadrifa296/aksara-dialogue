import { getFooterSettings, getSocialLinks } from '@/lib/queries/navigation'
import { ContactForm } from '@/components/public/contact-form'
import { Mail, MapPin, Phone, MessageSquare, Globe, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ContactPublicPage() {
  const [footer, socialLinks] = await Promise.all([
    getFooterSettings(),
    getSocialLinks(),
  ])

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-xs font-extrabold uppercase tracking-wider border border-primary-200/80 dark:border-primary-800">
          <Mail className="h-3.5 w-3.5" />
          <span>HUBUNGI KAMI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-black uppercase text-neutral-900 dark:text-white leading-tight">
          Mari Membangun Dialog Bersama
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Pintu kami selalu terbuka untuk inisiatif kolaborasi, riset bersama, pengaduan publik, dan forum diskusi.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-neutral-950 text-white border border-neutral-800 space-y-6 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-white">
                Sekretariat Aksara Dialogue
              </h3>

              <div className="space-y-5 text-sm text-neutral-300">
                <div className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Alamat Kantor</p>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {footer.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Email Resmi</p>
                    <a href={`mailto:${footer.email}`} className="text-xs text-primary-400 hover:text-primary-300 mt-1 block font-medium">
                      {footer.email}
                    </a>
                  </div>
                </div>

                {footer.phone && (
                  <div className="flex items-start gap-3.5">
                    <Phone className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Telepon Kantor</p>
                      <p className="text-xs text-neutral-400 mt-1">{footer.phone}</p>
                    </div>
                  </div>
                )}

                {footer.whatsapp && (
                  <div className="flex items-start gap-3.5">
                    <MessageSquare className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">WhatsApp Hotline</p>
                      <a
                        href={`https://wa.me/${footer.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary-400 hover:text-primary-300 font-semibold mt-1 block"
                      >
                        {footer.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white font-sans">
                Jam Pelayanan Sekretariat
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Senin – Jumat: 09:00 – 17:00 WIB<br />
                Sabtu – Minggu: Tutup (Kecuali ada jadwal agenda forum khusus)
              </p>
            </div>
          </div>

          {/* Contact Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-black uppercase text-neutral-900 dark:text-white">
                  Kirimkan Pesan atau Gagasan
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Pesan Anda akan langsung masuk ke kotak masuk email sekretariat dan sistem admin kami.
                </p>
              </div>

              {/* Dynamic Interactive Contact Form */}
              <ContactForm receiverEmail={footer.email} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
