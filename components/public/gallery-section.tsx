import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'
import type { HomepageSection, GalleryPhoto } from '@/types'

interface GallerySectionProps {
  section: HomepageSection
  gallery: (GalleryPhoto & { album_title?: string })[]
}

export function GallerySection({ section, gallery }: GallerySectionProps) {
  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-neutral-50/70 dark:bg-neutral-950 border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-4">
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {section.subtitle || 'DOKUMENTASI VISUAL'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black uppercase text-neutral-900 dark:text-white tracking-tight leading-tight">
              {section.title || 'Galeri Aksi & Dokumentasi'}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans font-normal">
              {section.description ||
                'Rekam jejak visual pertemuan warga, pelatihan advokasi, dan konsolidasi forum nasional.'}
            </p>
          </div>

          <Link
            href={section.button_url || '/kegiatan/dokumentasi'}
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 uppercase tracking-wider shrink-0 group"
          >
            <span>{section.button_text || 'Lihat Galeri Lengkap'}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid Showcase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {gallery.map((photo, index) => (
            <Link
              key={photo.id || index}
              href="/kegiatan/dokumentasi"
              className="group relative rounded-xl sm:rounded-2xl bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden aspect-[4/3] flex flex-col justify-end p-3.5 sm:p-6 hover:border-primary-500 hover:shadow-xl transition-all duration-300 shadow-md block"
            >
              {/* Photo Image or fallback */}
              {photo.image_url ? (
                <Image
                  src={photo.image_url}
                  alt={photo.caption || photo.album_title || 'Foto Galeri'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-80 group-hover:brightness-95"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-800 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 sm:h-10 sm:w-10 text-neutral-500" />
                </div>
              )}

              {/* Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

              {/* Caption Content */}
              <div className="relative z-20 space-y-0.5 sm:space-y-1">
                {photo.album_title && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider text-primary-400 truncate block">
                    {photo.album_title}
                  </span>
                )}
                <p className="text-xs sm:text-sm font-serif font-bold text-white line-clamp-2 leading-snug">
                  {photo.caption || photo.album_title || 'Dokumentasi Forum Aksara Dialogue'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
