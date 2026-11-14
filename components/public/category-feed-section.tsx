import Link from 'next/link'
import { ArrowRight, Calendar, Newspaper, Image as ImageIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'
import type { Event, News, GalleryPhoto } from '@/types'

interface CategoryFeedSectionProps {
  events: Event[]
  news: News[]
  gallery: (GalleryPhoto & { album_title?: string })[]
}

export function CategoryFeedSection({
  events,
  news,
  gallery,
}: CategoryFeedSectionProps) {
  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-white dark:bg-neutral-950 border-b border-neutral-200/60 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-14 space-y-2 sm:space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            PUBLIKASI & PENGETAHUAN
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black uppercase text-neutral-900 dark:text-white tracking-tight leading-tight">
            Kategori publikasi & informasi terpadu yang dapat diakses publik.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans">
            Akses terbuka terhadap agenda forum diskusi masyarakat sipil, siaran pers kabar gerakan, dan arsip rekam jejak visual.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {/* Column 1: AGENDA KEGIATAN */}
          <div className="space-y-6">
            <div className="pb-3 border-b-2 border-primary-600 dark:border-primary-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-serif font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                  AGENDA FORUM
                </h3>
              </div>
              <Link
                href="/kegiatan/agenda"
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline uppercase"
              >
                Semua
              </Link>
            </div>

            <div className="space-y-5">
              {events.slice(0, 4).map((evt, idx) => (
                <article key={evt.id || idx} className="space-y-1 group">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
                    {evt.event_date ? formatDate(evt.event_date) : 'AGENDA MENDATANG'}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
                    <Link href="/kegiatan/agenda">{evt.title}</Link>
                  </h4>
                  {evt.location && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      📍 {evt.location}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* Column 2: SIARAN PERS & BERITA */}
          <div className="space-y-6">
            <div className="pb-3 border-b-2 border-primary-600 dark:border-primary-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-serif font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                  SIARAN PERS
                </h3>
              </div>
              <Link
                href="/kegiatan/berita"
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline uppercase"
              >
                Semua
              </Link>
            </div>

            <div className="space-y-5">
              {news.slice(0, 4).map((item, idx) => (
                <article key={item.id || idx} className="space-y-1 group">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
                    {item.published_at ? formatDate(item.published_at) : 'RILIS RESMI'}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/kegiatan/berita/${item.slug}`}>{item.title}</Link>
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Column 3: DOKUMENTASI & REKAM JEJAK */}
          <div className="space-y-6">
            <div className="pb-3 border-b-2 border-primary-600 dark:border-primary-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-serif font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                  DOKUMENTASI
                </h3>
              </div>
              <Link
                href="/kegiatan/dokumentasi"
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline uppercase"
              >
                Semua
              </Link>
            </div>

            <div className="space-y-5">
              {gallery.slice(0, 4).map((photo, idx) => (
                <article key={photo.id || idx} className="space-y-1 group">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
                    {photo.created_at ? formatDate(photo.created_at) : 'GALERI VISUAL'}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
                    <Link href="/kegiatan/dokumentasi">
                      {photo.caption || photo.album_title || 'Dokumentasi Forum Aksara Dialogue'}
                    </Link>
                  </h4>
                  {photo.album_title && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Album: {photo.album_title}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
