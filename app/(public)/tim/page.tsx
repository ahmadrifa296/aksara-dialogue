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
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          <Users2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>STRUKTUR & PENGURUS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Tim & Penggerak Aksara
        </h1>
        <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Mengenal orang-orang di balik riset, advokasi, dan fasilitasi dialog masyarakat sipil.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="p-3.5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-2.5 sm:space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-2 sm:space-y-3">
                <div className="h-20 w-20 sm:h-28 sm:w-28 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center text-neutral-400 border-2 border-primary-500/30 shrink-0">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 sm:h-12 sm:w-12" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm sm:text-lg lg:text-xl font-serif font-bold text-neutral-900 dark:text-white line-clamp-1 sm:line-clamp-none">
                    {member.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-400 mt-0.5 sm:mt-1 line-clamp-2">
                    {member.position}
                  </p>
                </div>

                {member.bio && (
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 sm:gap-3 pt-2.5 sm:pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-1.5 sm:p-2 rounded-lg text-neutral-500 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title={`Email: ${member.email}`}
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={formatLinkedinUrl(member.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 sm:p-2 rounded-lg text-neutral-500 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="LinkedIn"
                    aria-label={`LinkedIn ${member.name}`}
                  >
                    <LinkedInIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={formatInstagramUrl(member.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 sm:p-2 rounded-lg text-neutral-500 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Instagram"
                    aria-label={`Instagram ${member.name}`}
                  >
                    <InstagramIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
