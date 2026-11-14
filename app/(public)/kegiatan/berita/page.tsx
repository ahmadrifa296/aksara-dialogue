import { getTableData } from '@/lib/queries/db'
import { dummyNews } from '@/lib/queries/content'
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format-date'
import Image from 'next/image'
import Link from 'next/link'
import type { News } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewsPublicPage() {
  const newsList = await getTableData<News>('news', dummyNews)

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          <Newspaper className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>KABAR & DINAMIKA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Berita & Kegiatan Terbaru
        </h1>
        <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Liputan aksi lapangan, siaran pers resmi, dan kabar dinamika gerakan masyarakat sipil.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {newsList.map((item) => (
            <article
              key={item.id}
              className="rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:border-primary-500 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* News Thumbnail Image */}
                {item.thumbnail ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border-b border-neutral-200/60 dark:border-neutral-800">
                    <Newspaper className="h-6 w-6 sm:h-10 sm:w-10 text-primary-400" />
                  </div>
                )}

                <div className="p-3.5 sm:p-7 space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-500 gap-1">
                    <Badge variant="info" className="text-[9px] sm:text-xs">
                      {item.category?.name || 'Rilis'}
                    </Badge>
                    {item.published_at && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden sm:inline">{formatDate(item.published_at)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-xl font-serif font-bold text-neutral-900 dark:text-white hover:text-primary-700 dark:hover:text-primary-400 transition-colors line-clamp-2">
                    <Link href={`/kegiatan/berita/${item.slug}`}>{item.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>

                  {item.author && (
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 pt-1 sm:pt-2 truncate">
                      <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                      <span className="truncate">{item.author}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-3.5 py-2.5 sm:px-7 sm:py-4 bg-white/60 dark:bg-neutral-900/60 border-t border-neutral-200/60 dark:border-neutral-800">
                <Link
                  href={`/kegiatan/berita/${item.slug}`}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Baca</span>
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
