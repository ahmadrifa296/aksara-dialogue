import { getSingleRecord } from '@/lib/queries/db'
import { dummyAbout } from '@/lib/queries/content'
import { Quote, Sparkles } from 'lucide-react'
import type { About } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AboutProfilePage() {
  const about = await getSingleRecord<About>('about', dummyAbout, 'page_type', 'profile')

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>TENTANG KAMI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          {about.title}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Mengenal visi perjuangan, latar belakang, dan komitmen gerakan masyarakat sipil Aksara Dialogue.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Quote Card */}
        {about.quote && (
          <div className="relative rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-neutral-900 p-8 sm:p-10 text-white shadow-xl overflow-hidden">
            <Quote className="h-16 w-16 text-white/10 absolute top-4 right-4" />
            <div className="relative z-10 space-y-4">
              <p className="text-xl sm:text-2xl font-serif font-semibold italic text-primary-50 leading-relaxed">
                "{about.quote}"
              </p>
              <div className="pt-2">
                <p className="text-sm font-bold text-white tracking-wide">
                  {about.quote_author || 'Aksara Dialogue'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rich Text Body */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: about.content }}
        />
      </div>
    </div>
  )
}
