import { getTableData } from '@/lib/queries/db'
import { dummyPrograms } from '@/lib/queries/content'
import { FolderOpen, ArrowRight, MapPin, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format-date'
import Link from 'next/link'
import type { Program } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProgramsPublicPage() {
  const programs = await getTableData<Program>('programs', dummyPrograms)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <FolderOpen className="h-3.5 w-3.5" />
          <span>PROGRAM & INISIATIF</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Inisiatif Aksi & Program Berkelanjutan
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Rangkaian program kolaboratif untuk memperkuat ruang diskursus warga dan mengawal transparansi kebijakan.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <article
              key={prog.id}
              className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:border-primary-500 transition-all flex flex-col justify-between"
            >
              <div className="p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{prog.category?.name || 'Inisiatif Advokasi'}</Badge>
                  {prog.is_featured && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-400">
                      Unggulan
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white hover:text-primary-700 transition-colors">
                  <Link href={`/program/${prog.slug}`}>{prog.title}</Link>
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                  {prog.excerpt}
                </p>

                <div className="pt-2 space-y-1.5 text-xs text-neutral-500">
                  {prog.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                      <span>{prog.location}</span>
                    </div>
                  )}
                  {prog.start_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                      <span>{formatDate(prog.start_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-7 py-4 bg-white/60 dark:bg-neutral-900/60 border-t border-neutral-200/60 dark:border-neutral-800">
                <Link
                  href={`/program/${prog.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider"
                >
                  <span>Detail Program</span>
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
