import { getTableData } from '@/lib/queries/db'
import { FocusManager } from './focus-manager'
import { dummyFocusAreas } from '@/lib/queries/content'
import type { FocusArea } from '@/types'

export default async function AdminFocusPage() {
  const focusAreas = await getTableData<FocusArea>('focus_areas', dummyFocusAreas)
  return <FocusManager initialFocusAreas={focusAreas} />
}
