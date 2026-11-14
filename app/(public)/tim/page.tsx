import { getTableData } from '@/lib/queries/db'
import { dummyTeam } from '@/lib/queries/content'
import { Users2, Mail, User } from 'lucide-react'
import {
  InstagramIcon,
  LinkedInIcon,
  formatInstagramUrl,
  formatLinkedinUrl,
} from '@/components/ui/social-icons'
import type { TeamMember } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TeamPublicPage() {
  const allTeam = await getTableData<TeamMember>('team_members', dummyTeam)
  const team = allTeam.filter((m) => m.is_active !== false)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <Users2 className="h-3.5 w-3.5" />
          <span>STRUKTUR & PENGURUS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Tim & Penggerak Aksara
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Mengenal orang-orang di balik riset, advokasi, dan fasilitasi dialog masyarakat sipil.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-4 hover:shadow-lg transition-all"
            >
              <div className="h-28 w-28 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center text-neutral-400 border-2 border-primary-500/30">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12" />
                )}
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-400 mt-1">
                  {member.position}
                </p>
              </div>

              {member.bio && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {member.bio}
                </p>
              )}

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-lg text-neutral-500 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title={`Email: ${member.email}`}
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={formatLinkedinUrl(member.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-neutral-500 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="LinkedIn"
                    aria-label={`LinkedIn ${member.name}`}
                  >
                    <LinkedInIcon className="h-4 w-4" />
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={formatInstagramUrl(member.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-neutral-500 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Instagram"
                    aria-label={`Instagram ${member.name}`}
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
