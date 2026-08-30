import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { HomepageSection, FocusArea } from '@/types'

interface FocusSectionProps {
  section: HomepageSection
  focusAreas: FocusArea[]
}

const defaultFocusPhotos = [
  'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
]

export function FocusSection({ section, focusAreas }: FocusSectionProps) {
  const displayAreas = focusAreas.slice(0, 5)

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading & Narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {section.subtitle || 'KAMPANYE & FOKUS'}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black uppercase text-neutral-900 dark:text-white tracking-tight leading-[1.12]">
              {section.title || 'Gerakan dan Inisiatif'}
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans font-normal">
              {section.description ||
                'Inisiatif advokasi dan gerakan kolaboratif yang secara konsisten dikawal bersama komunitas akar rumput, akademisi, dan organisasi masyarakat sipil.'}
            </p>

            <div className="pt-2">
              <Link
                href={section.button_url || '/fokus-gerakan'}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 uppercase tracking-wider group"
              >
                <span>{section.button_text || 'Lihat Semua Fokus Gerakan'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Photo Grid + Wide Span Card (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayAreas.slice(0, 4).map((area, index) => {
                const photo =
                  area.image_url || defaultFocusPhotos[index % defaultFocusPhotos.length]
                return (
                  <Link
                    key={area.id || index}
                    href={`/fokus-gerakan/${area.slug}`}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] block bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <Image
                      src={photo}
                      alt={area.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

                    <div className="absolute inset-x-0 bottom-0 p-5 z-20 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-400">
                        KAMPANYE
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-white uppercase group-hover:text-primary-300 transition-colors leading-snug">
                        {area.name}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Bottom 5th Wide Featured Card */}
            {displayAreas[4] && (
              <Link
                href={`/fokus-gerakan/${displayAreas[4].slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[21/9] block bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={displayAreas[4].image_url || defaultFocusPhotos[4]}
                  alt={displayAreas[4].name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

                <div className="absolute inset-x-0 bottom-0 p-6 z-20 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-400">
                    INISIASI UTAMA
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white uppercase group-hover:text-primary-300 transition-colors leading-snug">
                    {displayAreas[4].name}
                  </h3>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
