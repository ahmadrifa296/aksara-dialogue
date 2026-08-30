import { getSingleRecord } from '@/lib/queries/db'
import { dummyFocusAreas } from '@/lib/queries/content'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Target, Sparkles } from 'lucide-react'
import type { FocusArea } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function FocusAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const fallback = dummyFocusAreas.find((f) => f.slug === slug) || dummyFocusAreas[0]
  const focusArea = await getSingleRecord<FocusArea>('focus_areas', fallback, 'slug', slug)

  if (!focusArea) {
    notFound()
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/fokus-gerakan"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Fokus Gerakan</span>
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-extrabold uppercase tracking-wider border border-primary-200/80 dark:border-primary-800">
            <Target className="h-3.5 w-3.5" />
            <span>PILAR FOKUS GERAKAN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black uppercase text-neutral-900 dark:text-white leading-tight">
            {focusArea.name}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
            {focusArea.description}
          </p>
        </div>

        {/* Featured Banner Photo */}
        {focusArea.image_url && (
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-900">
            <Image
              src={focusArea.image_url}
              alt={focusArea.name}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Content Body */}
        {focusArea.content && (
          <div
            className="prose prose-lg dark:prose-invert max-w-none font-sans text-neutral-700 dark:text-neutral-300 pt-6 border-t border-neutral-200 dark:border-neutral-800"
            dangerouslySetInnerHTML={{ __html: focusArea.content }}
          />
        )}

        {/* Collaboration Banner */}
        <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 mt-12">
          <div className="flex items-center gap-2 text-primary-600">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-xl font-bold font-serif text-neutral-900 dark:text-white">
              Ingin Berkolaborasi di Isu Ini?
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-sans">
            Kami menyambut kolaborasi bersama akademisi, komunitas warga, dan praktisi hukum/kebijakan untuk memperkuat gerakan advokasi.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm uppercase tracking-wider shadow-md"
          >
            Hubungi Tim Advokasi
          </Link>
        </div>
      </div>
    </div>
  )
}
