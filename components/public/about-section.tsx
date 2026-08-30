import Link from 'next/link'
import { ArrowRight, Quote, CheckCircle2 } from 'lucide-react'
import type { HomepageSection, About, Value } from '@/types'

interface AboutSectionProps {
  section: HomepageSection
  about: About | null
  values: Value[]
}

export function AboutSection({ section, about, values }: AboutSectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-neutral-950 border-b border-neutral-200/60 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">
              {section.subtitle || 'TENTANG KAMI'}
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
              {section.title}
            </h2>

            <div
              className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans space-y-4"
              dangerouslySetInnerHTML={{
                __html: section.description || about?.content || '',
              }}
            />

            {/* Core Values List */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.slice(0, 4).map((val) => (
                <div key={val.id} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white font-sans">
                      {val.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {section.button_text && (
              <div className="pt-4">
                <Link
                  href={section.button_url || '/tentang-kami/profil'}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 hover:underline"
                >
                  <span>{section.button_text}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Quote Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 sm:p-10 text-white shadow-xl shadow-primary-500/20 overflow-hidden border border-primary-500/30">
              <Quote className="h-14 w-14 text-white/20 absolute top-6 right-6" />
              <div className="relative z-10 space-y-6">
                <p className="text-xl sm:text-2xl font-serif font-semibold leading-snug italic text-white">
                  "{about?.quote || 'Perubahan dimulai dari ruang dialog yang terbuka dan keadilan yang diperjuangkan bersama.'}"
                </p>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm font-bold text-white tracking-wide">
                    {about?.quote_author || 'Aksara Dialogue'}
                  </p>
                  <p className="text-xs text-primary-100 mt-0.5">
                    Gerakan Sipil & Kebijakan Partisipatif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
