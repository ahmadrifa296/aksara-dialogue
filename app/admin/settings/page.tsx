import { getSiteSettings } from '@/lib/queries/navigation'
import { SettingsManager } from './settings-manager'

export default async function AdminSettingsPage() {
  const siteSettings = await getSiteSettings()

  return <SettingsManager initialSettings={siteSettings} />
}
