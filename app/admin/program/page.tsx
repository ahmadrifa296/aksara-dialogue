import { getTableData } from '@/lib/queries/db'
import { ProgramManager } from './program-manager'
import { dummyPrograms } from '@/lib/queries/content'
import type { Program, ProgramCategory } from '@/types'

const defaultCategories: ProgramCategory[] = [
  { id: '1', name: 'Advokasi Kebijakan', slug: 'advokasi-kebijakan', description: null, image_url: null, is_active: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '2', name: 'Pemberdayaan Pemuda', slug: 'pemberdayaan-pemuda', description: null, image_url: null, is_active: true, sort_order: 2, created_at: '', updated_at: '' },
  { id: '3', name: 'Gerakan Lingkungan', slug: 'gerakan-lingkungan', description: null, image_url: null, is_active: true, sort_order: 3, created_at: '', updated_at: '' },
]

export default async function AdminProgramsPage() {
  const [programs, categories] = await Promise.all([
    getTableData<Program>('programs', dummyPrograms),
    getTableData<ProgramCategory>('program_categories', defaultCategories),
  ])

  return <ProgramManager initialPrograms={programs} categories={categories} />
}
