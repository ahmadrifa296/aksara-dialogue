import { getHomepageData } from '@/lib/queries/homepage'
import { HeroSection } from '@/components/public/hero-section'
import { FocusSection } from '@/components/public/focus-section'
import { NewsSection } from '@/components/public/news-section'
import { CtaSection } from '@/components/public/cta-section'
import { CategoryFeedSection } from '@/components/public/category-feed-section'
import { GallerySection } from '@/components/public/gallery-section'
import { AboutSection } from '@/components/public/about-section'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const { sections, about, values, focusAreas, news, events, gallery } =
    await getHomepageData()

  return (
    <main className="flex flex-col">
      {/* 1. Hero Section (Full-bleed Photo Banner with Bold Headline & Highlight Card) */}
      {sections.hero?.is_visible && <HeroSection section={sections.hero} />}

      {/* 2. Gerakan dan Kampanye / Fokus Gerakan (2-Column Photo Grid) */}
      {sections.focus?.is_visible && (
        <FocusSection section={sections.focus} focusAreas={focusAreas} />
      )}

      {/* 3. Enam Berita / Tulisan Terbaru (6-Card Grid with Photo Thumbnails) */}
      {sections.news?.is_visible && (
        <NewsSection section={sections.news} news={news} />
      )}

      {/* 4. Pantau Gerakan / Call To Action Banner */}
      {sections.cta?.is_visible && <CtaSection section={sections.cta} />}

      {/* 5. 3-Column Category Feeds (Agenda Forum, Siaran Pers, Dokumentasi) */}
      <CategoryFeedSection events={events} news={news} gallery={gallery} />

      {/* 6. Galeri Dokumentasi Visual (Album Showcase) */}
      {sections.gallery?.is_visible && (
        <GallerySection section={sections.gallery} gallery={gallery} />
      )}

      {/* 7. Tentang Singkat & Nilai Organisasi */}
      {sections.about?.is_visible && (
        <AboutSection section={sections.about} about={about} values={values} />
      )}
    </main>
  )
}
