import Link from 'next/link'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format-date'
import type { HomepageSection, Program } from '@/types'

interface ProgramsSectionProps {
  section: HomepageSection
  programs: Program[]
}

export function ProgramsSection({ section, programs }: ProgramsSectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-neutral-950 border-b border-neutral-200/60 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with View All Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">
              {section.subtitle || 'PROGRAM UNGGULAN'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
              {section.title}
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-300 font-sans">
              {section.description}
            </p>
          </div>

          <Link
            href={section.button_url || '/program'}
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 shrink-0"
          >
            <span>{section.button_text || 'Lihat Semua Program'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((program) => (
            <article
              key={program.id}
              className="group rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-7 space-y-4">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="info">
                    {program.category?.name || 'Inisiatif Gerakan'}
                  </Badge>
                  {program.is_featured && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-400">
                      Unggulan
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  <Link href={`/program/${program.slug}`}>{program.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  {program.excerpt}
                </p>

                {/* Location / Date info */}
                <div className="pt-2 space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {program.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                      <span className="truncate">{program.location}</span>
                    </div>
                  )}
                  {program.start_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                      <span>{formatDate(program.start_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="px-7 py-4 bg-white/60 dark:bg-neutral-900/60 border-t border-neutral-200/60 dark:border-neutral-800">
                <Link
                  href={`/program/${program.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 uppercase tracking-wider"
                >
                  <span>Detail Program</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-10 md:hidden">
          <Link
            href={section.button_url || '/program'}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-semibold text-neutral-800 dark:text-neutral-200"
          >
            <span>{section.button_text || 'Lihat Semua Program'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
