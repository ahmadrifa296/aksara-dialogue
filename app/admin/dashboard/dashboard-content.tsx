'use client'

import {
  FolderOpen,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  Users,
  Clock,
  Target,
} from 'lucide-react'
import { StatsCard } from '@/components/admin/stats-card'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeDate } from '@/lib/utils/format-date'
import Link from 'next/link'
import type { DashboardStats } from '@/types'

interface RecentItem {
  id: string
  title: string
  status: string
  created_at: string
}

interface DashboardContentProps {
  stats: DashboardStats
  recentNews: RecentItem[]
  recentEvents: RecentItem[]
}

export function DashboardContent({ stats, recentNews, recentEvents }: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-sans">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Selamat datang di Aksara Dialogue CMS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Program Unggulan" value={stats.totalPrograms} icon={FolderOpen} />
        <StatsCard title="Berita & Kegiatan" value={stats.totalNews} icon={Newspaper} />
        <StatsCard title="Agenda Acara" value={stats.totalEvents} icon={Calendar} />
        <StatsCard title="Album Galeri" value={stats.totalAlbums} icon={ImageIcon} />
        <StatsCard title="Pilar Fokus Gerakan" value={5} icon={Target} />
        <StatsCard title="Anggota Tim" value={stats.totalTeamMembers} icon={Users} />
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 font-sans">
              Berita & Kegiatan Terbaru
            </h2>
            <Link
              href="/admin/kegiatan/berita"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentNews.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-neutral-400">
                Belum ada berita
              </div>
            ) : (
              recentNews.map((item) => (
                <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatRelativeDate(item.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Events / Agenda */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 font-sans">
              Agenda & Event Terjadwal
            </h2>
            <Link
              href="/admin/kegiatan/agenda"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentEvents.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-neutral-400">
                Belum ada agenda
              </div>
            ) : (
              recentEvents.map((item) => (
                <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatRelativeDate(item.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
