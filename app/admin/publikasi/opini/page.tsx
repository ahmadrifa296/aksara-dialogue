import { getTableData } from '@/lib/queries/db'
import { OpinionManager } from './opinion-manager'
import { dummyOpinions } from '@/lib/queries/content'
import type { Opinion, PublicationCategory } from '@/types'

const defaultCategories: PublicationCategory[] = [
  { id: '1', name: 'Wacana Kritis', slug: 'wacana-kritis', type: 'article', is_active: true, sort_order: 1, created_at: '' },
  { id: '2', name: 'Kajian Kebijakan', slug: 'kajian-kebijakan', type: 'article', is_active: true, sort_order: 2, created_at: '' },
  { id: '3', name: 'Kolom Opini', slug: 'kolom-opini', type: 'opinion', is_active: true, sort_order: 3, created_at: '' },
]

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminOpinionsPage() {
  const [opinions, categories] = await Promise.all([
    getTableData<Opinion>('opinions', dummyOpinions),
    getTableData<PublicationCategory>('publication_categories', defaultCategories),
  ])

  return <OpinionManager initialOpinions={opinions} categories={categories} />
}
