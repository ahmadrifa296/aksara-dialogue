import { getTableData } from '@/lib/queries/db'
import { dummyValues } from '@/lib/queries/content'
import { Sparkles, ShieldCheck, Users, Scale, Leaf, Heart } from 'lucide-react'
import type { Value } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const iconMap: Record<string, typeof ShieldCheck> = {
  ShieldCheck: ShieldCheck,
  Users: Users,
  Sparkles: Sparkles,
  Scale: Scale,
  Leaf: Leaf,
  Heart: Heart,
}

export default async function NilaiNilaiPage() {
  const values = await getTableData<Value>('values', dummyValues)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>NILAI-NILAI KAMI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Prinsip & Nilai Fundamental
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Fondasi etika yang memandu setiap langkah advokasi, riset, dan dialog publik kami.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val) => {
            const IconComp = (val.icon && iconMap[val.icon]) || Sparkles
            return (
              <div
                key={val.id}
                className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4 hover:border-primary-500 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                  {val.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {val.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
