import { getTableData } from '@/lib/queries/db'
import { ValuesManager } from './values-manager'
import { dummyValues } from '@/lib/queries/content'
import type { Value } from '@/types'

export default async function AdminValuesPage() {
  const values = await getTableData<Value>('values', dummyValues)
  return <ValuesManager initialValues={values} />
}
