import { getSingleRecord } from '@/lib/queries/db'
import { ProfileManager } from './profile-manager'
import { dummyAbout } from '@/lib/queries/content'
import type { About } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProfilePage() {
  const about = await getSingleRecord<About>('about', dummyAbout, 'page_type', 'profile')
  return <ProfileManager initialAbout={about} />
}
