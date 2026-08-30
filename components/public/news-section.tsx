import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Newspaper } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'
import type { HomepageSection, News } from '@/types'

interface NewsSectionProps {
  section: HomepageSection
  news: News[]
}

const defaultNewsPhotos = [
  'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
]

export function NewsSection({ section, news }: NewsSectionProps) {
  // Ensure we display up to 6 latest items
  const displayNews = news.slice(0, 6)

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {section.subtitle || 'KABAR & RILIS TERKINI'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black uppercase text-neutral-900 dark:text-white tracking-tight leading-tight">
              {section.title || 'Enam tulisan terbaru dari konten yang sudah terbit.'}
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-sans font-normal">
              {section.description ||
                'Dokumentasi liputan aksi lapangan, pernyataan sikap publik, dan kabar advokasi masyarakat sipil.'}
            </p>
          </div>

          <Link
            href={section.button_url || '/kegiatan/berita'}
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 uppercase tracking-wider shrink-0 group"
          >
            <span>{section.button_text || 'Lihat Semua Konten'}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6-Card Grid in Orange & White theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayNews.map((item, index) => {
            const thumbnail =
              item.thumbnail || defaultNewsPhotos[index % defaultNewsPhotos.length]
            return (
              <article
                key={item.id || index}
                className="group flex flex-col justify-between bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800 hover:border-primary-500 hover:shadow-xl transition-all duration-300 shadow-sm"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-50 dark:bg-neutral-800">
                        <Newspaper className="h-10 w-10 text-primary-400" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                      <span>{item.published_at ? formatDate(item.published_at) : 'Rilis Berita'}</span>
                      {item.category?.name && (
                        <span className="text-neutral-500 font-medium">
                          {item.category.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-neutral-900 dark:text-white uppercase group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/kegiatan/berita/${item.slug}`}>{item.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-sans">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Oleh {item.author || 'Redaksi Aksara'}
                  </span>

                  <Link
                    href={`/kegiatan/berita/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Baca</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href={section.button_url || '/kegiatan/berita'}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary-500/20"
          >
            <span>{section.button_text || 'Lihat Semua Berita'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
