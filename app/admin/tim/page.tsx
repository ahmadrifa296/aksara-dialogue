import { getTableData } from '@/lib/queries/db'
import { TeamManager } from './team-manager'
import { dummyTeam } from '@/lib/queries/content'
import type { TeamMember } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminTeamPage() {
  const team = await getTableData<TeamMember>('team_members', dummyTeam)
  return <TeamManager initialMembers={team} />
}
