import { getHomepageData } from '@/lib/queries/homepage'
import { HomepageManager } from './homepage-manager'

export default async function AdminHomepagePage() {
  const data = await getHomepageData()

  return <HomepageManager initialSections={data.sections} />
}
