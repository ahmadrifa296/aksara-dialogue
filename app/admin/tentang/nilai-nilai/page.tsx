import { getTableData } from '@/lib/queries/db'
import { ValuesManager } from './values-manager'
import { dummyValues } from '@/lib/queries/content'
import type { Value } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminValuesPage() {
  const values = await getTableData<Value>('values', dummyValues)
  return <ValuesManager initialValues={values} />
}
