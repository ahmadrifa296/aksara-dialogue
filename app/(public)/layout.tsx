import type { ReactNode } from 'react'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import {
  getNavigations,
  getSiteSettings,
  getFooterSettings,
  getSocialLinks,
} from '@/lib/queries/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [navigations, siteSettings, footerSettings, socialLinks] = await Promise.all([
    getNavigations(),
    getSiteSettings(),
    getFooterSettings(),
    getSocialLinks(),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar navigations={navigations} siteSettings={siteSettings} />
      <div className="flex-1">{children}</div>
      <Footer
        footerSettings={footerSettings}
        socialLinks={socialLinks}
        navigations={navigations}
      />
    </div>
  )
}
