import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { HomepageSection } from '@/types'

interface HeroSectionProps {
  section: HomepageSection
}

export function HeroSection({ section }: HeroSectionProps) {
  const heroBackground =
    section.image_url ||
    'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=1600&auto=format&fit=crop&q=85'

  return (
    <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden bg-neutral-950 text-white pt-28 pb-16 lg:pt-36 lg:pb-24">
      {/* 1. Full-bleed Background Photo (User replaceable from CMS) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackground}
          alt={section.title || 'Aksara Dialogue Ruang Diskusi Warga'}
          fill
          priority
          className="object-cover object-center brightness-90 contrast-105"
          unoptimized
        />
        {/* Dark cinematic vignette & linear gradients for ultra-sharp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          {/* Tag / Category Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary-600 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest shadow-md">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>{section.subtitle || 'RUANG DIALOG & GERAKAN SOSIAL'}</span>
          </div>

          {/* Main Tall Condensed Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black uppercase text-white tracking-tight leading-[1.08] max-w-3xl drop-shadow-md">
            {section.title || 'MEMPERJUANGKAN RUANG DIALOG DI TENGAH DISRUPSI SOSIAL'}
          </h1>

          {/* Narrative Description */}
          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-sans max-w-2xl font-normal drop-shadow">
            {section.description ||
              'Wadah independen masyarakat sipil untuk mengawal hak-hak dasar warga, mempertemukan gagasan kritis multi-pihak, serta mendorong keadilan sosial yang berkelanjutan.'}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {section.button_text && (
              <Link
                href={section.button_url || '/program'}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-primary-600/30 hover:shadow-primary-600/50 hover:scale-105 transition-all duration-200"
              >
                <span>{section.button_text}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {section.button_secondary_text && (
              <Link
                href={section.button_secondary_url || '/tentang-kami/profil'}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white font-bold text-sm uppercase tracking-wider transition-all duration-200"
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
