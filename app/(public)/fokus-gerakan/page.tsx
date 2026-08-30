import { getTableData } from '@/lib/queries/db'
import { dummyFocusAreas } from '@/lib/queries/content'
import { Target, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { FocusArea } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function FocusAreasPublicPage() {
  const focusAreas = await getTableData<FocusArea>('focus_areas', dummyFocusAreas)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-extrabold uppercase tracking-wider border border-primary-200/80 dark:border-primary-800">
          <Target className="h-3.5 w-3.5" />
          <span>FOKUS GERAKAN</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-black uppercase text-neutral-900 dark:text-white leading-tight">
          Pilar Isu & Advokasi Strategis
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Ruang kerja advokasi dan diskursus publik kami terpusat pada isu-isu mendasar yang berdampak langsung bagi masyarakat.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {focusAreas.map((area) => (
            <div
              key={area.id}
              className="group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-500 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Photo */}
                {area.image_url ? (
                  <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden">
                    <Image
                      src={area.image_url}
                      alt={area.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full bg-primary-50 dark:bg-neutral-800 flex items-center justify-center text-primary-500">
                    <Target className="h-10 w-10" />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    PILAR FOKUS
                  </span>
                  <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white uppercase group-hover:text-primary-600 transition-colors leading-snug">
                    <Link href={`/fokus-gerakan/${area.slug}`}>{area.name}</Link>
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed line-clamp-3">
                    {area.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/fokus-gerakan/${area.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 hover:text-primary-700 group-hover:translate-x-1 transition-transform"
                >
                  <span>Pelajari Fokus Ini</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
