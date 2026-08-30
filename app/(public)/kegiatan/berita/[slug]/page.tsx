import { getSingleRecord } from '@/lib/queries/db'
import { dummyNews } from '@/lib/queries/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'
import type { News } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const fallback = dummyNews.find((n) => n.slug === slug) || dummyNews[0]
  const news = await getSingleRecord<News>('news', fallback, 'slug', slug)

  if (!news) {
    notFound()
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/kegiatan/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Kabar & Berita</span>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
            {news.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 border-y border-neutral-200 dark:border-neutral-800 py-3">
            {news.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary-600 shrink-0" />
                <span>Oleh {news.author}</span>
              </div>
            )}
            {news.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-600 shrink-0" />
                <span>{formatDate(news.published_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {news.thumbnail && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800">
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Excerpt Lead */}
        {news.excerpt && (
          <p className="text-lg font-serif italic text-neutral-700 dark:text-neutral-300 border-l-4 border-primary-600 pl-4 py-1">
            {news.excerpt}
          </p>
        )}

        {/* Content Body */}
        {news.content && (
          <div
            className="prose prose-lg dark:prose-invert max-w-none font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-neutral-400 shrink-0" />
            {news.tags.map((tag, idx) => (
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
