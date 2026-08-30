import { getFooterSettings, getSocialLinks } from '@/lib/queries/navigation'
import { getEffectiveSmtpConfig } from '@/lib/services/mail'
import { getLocalDb } from '@/lib/local-store'
import { ContactManager } from './contact-manager'
import type { ContactMessage } from '@/lib/actions/contact'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminContactPage() {
  const [footer, socialLinks] = await Promise.all([
    getFooterSettings(),
    getSocialLinks(),
  ])

  let messages: ContactMessage[] = []
  try {
    const db = getLocalDb()
    if (db.records && db.records['contact_messages']) {
      messages = db.records['contact_messages'] as unknown as ContactMessage[]
    }
  } catch {}

  const smtpConfig = getEffectiveSmtpConfig()

  return (
    <ContactManager
      initialFooter={footer}
      initialSocialLinks={socialLinks}
      initialMessages={messages}
      initialSmtpConfig={smtpConfig}
    />
  )
}
