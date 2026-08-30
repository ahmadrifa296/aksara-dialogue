import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { HomepageSection } from '@/types'

interface CtaSectionProps {
  section: HomepageSection
}

export function CtaSection({ section }: CtaSectionProps) {
  const subtitle = section.subtitle || 'PANTAU & DUKUNG GERAKAN'
  const title = section.title || 'Pantau Kebijakan & Ruang Dialog Warga'
  const description =
    section.description ||
    'Mari bersama menjaga kedaulatan ruang publik, mengawal kebijakan pro-rakyat, dan menyuarakan keadilan sosial di seluruh Indonesia.'
  const buttonText = section.button_text || 'Hubungi Kami'
  const buttonUrl = section.button_url || '/kontak'

  return (
    <section className="py-14 sm:py-20 bg-primary-50/50 dark:bg-neutral-950 border-b border-primary-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 p-8 sm:p-12 lg:p-14 shadow-2xl shadow-primary-500/25 text-white relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Background image if uploaded */}
          {section.image_url && (
            <div className="absolute inset-0 z-0">
              <Image
                src={section.image_url}
                alt={title}
                fill
                className="object-cover brightness-50"
                unoptimized
              />
              <div className="absolute inset-0 bg-primary-950/80 backdrop-blur-[2px]" />
            </div>
          )}

          {/* Decorative ambient blurs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-800/20 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Heading & Narrative */}
          <div className="max-w-2xl space-y-4 relative z-10">
            {subtitle && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-white border border-white/30 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>{subtitle}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black uppercase text-white tracking-tight leading-tight">
              {title}
            </h2>

            {description && (
              <p className="text-base sm:text-lg text-primary-50 leading-relaxed font-sans font-normal">
                {description}
              </p>
            )}
          </div>

          {/* Right: Side Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3.5 relative z-10 shrink-0">
            {buttonText && (
              <Link
                href={buttonUrl}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-neutral-50 active:bg-neutral-100 text-primary-700 font-extrabold text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <span>{buttonText}</span>
                <ArrowRight className="h-4 w-4 text-primary-700" />
              </Link>
            )}

            {section.button_secondary_text && (
              <Link
                href={section.button_secondary_url || '/program'}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/30 text-white font-bold text-sm uppercase tracking-wider transition-all duration-200"
              >
                <span>{section.button_secondary_text}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
