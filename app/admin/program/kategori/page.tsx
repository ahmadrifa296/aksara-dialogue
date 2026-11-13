import { getTableData } from '@/lib/queries/db'
import { ProgramCategoryManager } from './category-manager'
import type { ProgramCategory } from '@/types'

const defaultCategories: ProgramCategory[] = [
  { id: '1', name: 'Advokasi Kebijakan', slug: 'advokasi-kebijakan', description: null, image_url: null, is_active: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '2', name: 'Pemberdayaan Pemuda', slug: 'pemberdayaan-pemuda', description: null, image_url: null, is_active: true, sort_order: 2, created_at: '', updated_at: '' },
  { id: '3', name: 'Gerakan Lingkungan', slug: 'gerakan-lingkungan', description: null, image_url: null, is_active: true, sort_order: 3, created_at: '', updated_at: '' },
]

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProgramCategoriesPage() {
  const categories = await getTableData<ProgramCategory>('program_categories', defaultCategories)
  return <ProgramCategoryManager initialCategories={categories} />
}
