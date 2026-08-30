import { getTableData } from '@/lib/queries/db'
import { AgendaManager } from './agenda-manager'
import { dummyEvents } from '@/lib/queries/content'
import type { Event } from '@/types'

export default async function AdminEventsPage() {
  const events = await getTableData<Event>('events', dummyEvents)
  return <AgendaManager initialEvents={events} />
}
