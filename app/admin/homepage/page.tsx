import { getHomepageData } from '@/lib/queries/homepage'
import { HomepageManager } from './homepage-manager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminHomepagePage() {
  const data = await getHomepageData()

  return <HomepageManager initialSections={data.sections} />
}
