import { getTableData } from '@/lib/queries/db'
import { ReportManager } from './report-manager'
import { dummyReports } from '@/lib/queries/content'
import type { Report, PublicationCategory } from '@/types'

const defaultCategories: PublicationCategory[] = [
  { id: '1', name: 'Wacana Kritis', slug: 'wacana-kritis', type: 'report', is_active: true, sort_order: 1, created_at: '' },
  { id: '2', name: 'Kajian Kebijakan', slug: 'kajian-kebijakan', type: 'report', is_active: true, sort_order: 2, created_at: '' },
]

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminReportsPage() {
  const [reports, categories] = await Promise.all([
    getTableData<Report>('reports', dummyReports),
    getTableData<PublicationCategory>('publication_categories', defaultCategories),
  ])

  return <ReportManager initialReports={reports} categories={categories} />
}
