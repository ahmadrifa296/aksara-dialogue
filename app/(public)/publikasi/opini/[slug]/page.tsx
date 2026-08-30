import { createClient } from '@/lib/supabase/server'
import { dummyOpinions } from '@/lib/queries/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Tag, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'

export default async function OpinionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let opinion = dummyOpinions.find((o) => o.slug === slug)

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient()
      const { data } = await supabase.from('opinions').select('*, category:publication_categories(*)').eq('slug', slug).single()
      if (data) opinion = data
    }
  } catch {
    // fallback
  }

  if (!opinion) {
    notFound()
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/publikasi/opini"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Kolom Opini</span>
        </Link>

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-700 dark:text-accent-400">
            Kolom Opini Warga & Pakar
          </span>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
            {opinion.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
              <User className="h-3.5 w-3.5 text-primary-600" />
              {opinion.author || 'Penulis Opini'}
            </span>
            <span>·</span>
            {opinion.published_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary-600" />
                {formatDate(opinion.published_at)}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed pt-4"
          dangerouslySetInnerHTML={{ __html: opinion.content }}
        />
      </article>
    </div>
  )
}
