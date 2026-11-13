import { getSiteSettings } from '@/lib/queries/navigation'
import { SettingsManager } from './settings-manager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSettingsPage() {
  const siteSettings = await getSiteSettings()

  return <SettingsManager initialSettings={siteSettings} />
}
