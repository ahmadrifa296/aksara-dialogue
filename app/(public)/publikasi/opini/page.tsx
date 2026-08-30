import { createClient } from '@/lib/supabase/server'
import { dummyOpinions } from '@/lib/queries/content'
import { MessageSquare, Clock, User, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'
import Link from 'next/link'

export default async function OpinionsPublicPage() {
  let opinions = dummyOpinions

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient()
      const { data } = await supabase.from('opinions').select('*, category:publication_categories(*)').eq('status', 'published').order('published_at', { ascending: false })
      if (data && data.length > 0) opinions = data
    }
  } catch {
    // fallback
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>KOLOM OPINI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Opini & Perspektif Publik
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Gagasan terbuka dari aktivis, akademisi, peneliti, dan warga tentang isu kebangsaan.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {opinions.map((op) => (
            <article
              key={op.id}
              className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:border-primary-500 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-400">
                  Kolom Opini
                </span>

                <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white leading-snug">
                  <Link href={`/publikasi/opini/${op.slug}`}>{op.title}</Link>
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans line-clamp-3">
                  {op.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <span className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                  <User className="h-3.5 w-3.5" />
                  {op.author || 'Penulis'}
                </span>

                <Link
                  href={`/publikasi/opini/${op.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-400 hover:text-primary-800"
                >
                  <span>Baca Opini</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
