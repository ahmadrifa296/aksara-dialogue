import { getSingleRecord } from '@/lib/queries/db'
import { dummyPrograms } from '@/lib/queries/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FolderOpen, MapPin, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format-date'
import type { Program } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const fallback = dummyPrograms.find((p) => p.slug === slug) || dummyPrograms[0]
  const program = await getSingleRecord<Program>('programs', fallback, 'slug', slug)

  if (!program) {
    notFound()
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/program"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Semua Program</span>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="info">{program.category?.name || 'Inisiatif Advokasi'}</Badge>
            {program.is_featured && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-400">
                Unggulan
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
            {program.title}
          </h1>

          <div className="flex flex-wrap gap-4 pt-2 text-sm text-neutral-500 border-y border-neutral-200 dark:border-neutral-800 py-3">
            {program.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600 shrink-0" />
                <span>{program.location}</span>
              </div>
            )}
            {program.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-600 shrink-0" />
                <span>
                  {formatDate(program.start_date)}
                  {program.end_date ? ` – ${formatDate(program.end_date)}` : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        {program.content && (
          <div
            className="prose prose-lg dark:prose-invert max-w-none font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: program.content }}
          />
        )}
      </div>
    </div>
  )
}
