import { getSingleRecord } from '@/lib/queries/db'
import { dummyArticles } from '@/lib/queries/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'
import type { Article } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const fallback = dummyArticles.find((a) => a.slug === slug) || dummyArticles[0]
  const article = await getSingleRecord<Article>('articles', fallback, 'slug', slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/publikasi/artikel"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Publikasi</span>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 border-y border-neutral-200 dark:border-neutral-800 py-3">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary-600 shrink-0" />
                <span>Oleh {article.author}</span>
              </div>
            )}
            {article.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-600 shrink-0" />
                <span>{formatDate(article.published_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt Lead */}
        {article.excerpt && (
          <p className="text-lg font-serif italic text-neutral-700 dark:text-neutral-300 border-l-4 border-primary-600 pl-4 py-1">
            {article.excerpt}
          </p>
        )}

        {/* Content Body */}
        {article.content && (
          <div
            className="prose prose-lg dark:prose-invert max-w-none font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-neutral-400 shrink-0" />
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
