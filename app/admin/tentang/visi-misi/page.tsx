import { getTableData } from '@/lib/queries/db'
import { VisiMisiManager } from './visi-misi-manager'
import { dummyVisiMisi } from '@/lib/queries/content'
import type { VisiMisi } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminVisiMisiPage() {
  const items = await getTableData<VisiMisi>('visi_misi', dummyVisiMisi)
  return <VisiMisiManager initialItems={items} />
}
