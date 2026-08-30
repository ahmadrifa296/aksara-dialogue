import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardContent } from './dashboard-content'
import { getTableData } from '@/lib/queries/db'
import type { DashboardStats, News, Event, Program, Album, TeamMember } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fallbackRecentNews = [
  { id: '1', title: 'Aksara Dialogue Rilis Rekomendasi Keterbukaan Data Publik 2026', status: 'published', created_at: new Date().toISOString() },
  { id: '2', title: 'Ratusan Peserta Hadiri Diskusi Meja Bundar: Masa Depan Keadilan Iklim', status: 'published', created_at: new Date().toISOString() },
  { id: '3', title: 'Peluncuran Modul Advokasi Hak Digital bagi Komunitas Akar Rumput', status: 'published', created_at: new Date().toISOString() },
]

const fallbackRecentEvents = [
  { id: '1', title: 'Diskusi Meja Bundar: Masa Depan Keadilan Iklim di Indonesia', status: 'published', created_at: new Date().toISOString() },
  { id: '2', title: 'Workshop Advokasi Kebijakan Berbasis Bukti untuk Pemuda', status: 'published', created_at: new Date().toISOString() },
]

export default async function DashboardPage() {
  const [programs, news, events, albums, team] = await Promise.all([
    getTableData<Program>('programs', []),
    getTableData<News>('news', []),
    getTableData<Event>('events', []),
    getTableData<Album>('albums', []),
    getTableData<TeamMember>('team_members', []),
  ])

  const stats: DashboardStats = {
    totalArticles: 0,
    totalPrograms: programs.length || 6,
    totalNews: news.length || 8,
    totalEvents: events.length || 4,
    totalAlbums: albums.length || 5,
    totalTeamMembers: team.length || 4,
    totalMedia: 18,
    totalReports: 0,
  }

  const recentNewsItems = news.length > 0
    ? news.slice(0, 5).map((n) => ({ id: n.id, title: n.title, status: n.status, created_at: n.created_at || new Date().toISOString() }))
    : fallbackRecentNews

  const recentEventItems = events.length > 0
    ? events.slice(0, 5).map((e) => ({ id: e.id, title: e.title, status: e.status, created_at: e.created_at || new Date().toISOString() }))
    : fallbackRecentEvents

  return (
    <DashboardContent
      stats={stats}
      recentNews={recentNewsItems}
      recentEvents={recentEventItems}
    />
  )
}
