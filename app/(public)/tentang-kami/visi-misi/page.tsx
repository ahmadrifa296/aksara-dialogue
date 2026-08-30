import { getTableData } from '@/lib/queries/db'
import { dummyVisiMisi } from '@/lib/queries/content'
import { Compass, Target } from 'lucide-react'
import type { VisiMisi } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function VisiMisiPage() {
  const items = await getTableData<VisiMisi>('visi_misi', dummyVisiMisi)

  const visi = items.find((i) => i.type === 'visi') || dummyVisiMisi[0]
  const misiList = items.filter((i) => i.type === 'misi').sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <Compass className="h-3.5 w-3.5" />
          <span>VISI & MISI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Arah dan Tujuan Gerakan
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Pedoman strategis Aksara Dialogue dalam mewujudkan ruang dialog deliberatif di Indonesia.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Visi Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900 text-white border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-400">
            <Compass className="h-4 w-4" />
            <span>Visi Utama</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-semibold leading-relaxed text-primary-50">
            "{visi.content}"
          </p>
        </div>

        {/* Misi Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">
            <Target className="h-4 w-4" />
            <span>Misi Strategis</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {misiList.map((misi, index) => (
              <div
                key={misi.id || index}
                className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-4 shadow-sm"
              >
                <div className="h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-base text-neutral-800 dark:text-neutral-200 font-sans leading-relaxed">
                  {misi.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
