import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'
import type { HomepageSection, Article } from '@/types'

interface ArticlesSectionProps {
  section: HomepageSection
  articles: Article[]
}

export function ArticlesSection({ section, articles }: ArticlesSectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-neutral-950 border-b border-neutral-200/60 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">
              {section.subtitle || 'RUANG PUBLIKASI'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
              {section.title}
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-300 font-sans">
              {section.description}
            </p>
          </div>

          <Link
            href={section.button_url || '/publikasi/artikel'}
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 shrink-0"
          >
            <span>{section.button_text || 'Jelajahi Publikasi'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Articles List (Editorial layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group border-b md:border-b-0 md:border-r last:border-none border-neutral-200 dark:border-neutral-800 pb-8 md:pb-0 md:pr-8 last:pr-0 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-primary-700 dark:text-primary-400 font-semibold uppercase tracking-wider">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Wacana Kritis</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  <Link href={`/publikasi/artikel/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5" />
                  {article.author || 'Kontributor'}
                </span>
                {article.published_at && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(article.published_at)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
