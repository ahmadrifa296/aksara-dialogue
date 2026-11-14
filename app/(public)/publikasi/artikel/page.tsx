import { getTableData } from '@/lib/queries/db'
import { dummyArticles } from '@/lib/queries/content'
import { BookOpen, ArrowRight, Calendar, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format-date'
import Link from 'next/link'
import type { Article } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArticlesPublicPage() {
  const articles = await getTableData<Article>('articles', dummyArticles)

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>PUBLIKASI & ARTIKEL</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Wacana & Kajian Kritis
        </h1>
        <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Kumpulan esai analisis kebijakan, kajian empiris independen, dan artikel reflektif.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:border-primary-500 transition-all flex flex-col justify-between"
            >
              <div className="p-3.5 sm:p-7 space-y-2 sm:space-y-4">
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-500 gap-1">
                  <Badge variant="info" className="text-[9px] sm:text-xs">
                    {article.category?.name || 'Wacana'}
                  </Badge>
                  {article.published_at && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">{formatDate(article.published_at)}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-sm sm:text-xl font-serif font-bold text-neutral-900 dark:text-white hover:text-primary-700 transition-colors line-clamp-2">
                  <Link href={`/publikasi/artikel/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 sm:line-clamp-3">
                  {article.excerpt}
                </p>

                {article.author && (
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 pt-1 sm:pt-2 truncate">
                    <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span className="truncate">{article.author}</span>
                  </div>
                )}
              </div>

              <div className="px-3.5 py-2.5 sm:px-7 sm:py-4 bg-white/60 dark:bg-neutral-900/60 border-t border-neutral-200/60 dark:border-neutral-800">
                <Link
                  href={`/publikasi/artikel/${article.slug}`}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider"
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
