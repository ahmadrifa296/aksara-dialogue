import { getTableData } from '@/lib/queries/db'
import { NavManager } from './nav-manager'
import type { Navigation } from '@/types'

const defaultNavs: Navigation[] = [
  { id: '1', title: 'Home', url: '/', parent_id: null, sort_order: 1, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '2', title: 'Tentang Kami', url: '/tentang-kami/profil', parent_id: null, sort_order: 2, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '2-1', title: 'Profil Organisasi', url: '/tentang-kami/profil', parent_id: '2', sort_order: 1, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '2-2', title: 'Visi & Misi', url: '/tentang-kami/visi-misi', parent_id: '2', sort_order: 2, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '2-3', title: 'Nilai-Nilai', url: '/tentang-kami/nilai-nilai', parent_id: '2', sort_order: 3, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '3', title: 'Fokus Gerakan', url: '/fokus-gerakan', parent_id: null, sort_order: 3, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '4', title: 'Program', url: '/program', parent_id: null, sort_order: 4, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '5', title: 'Kegiatan', url: '/kegiatan/berita', parent_id: null, sort_order: 5, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '5-1', title: 'Berita & Liputan', url: '/kegiatan/berita', parent_id: '5', sort_order: 1, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '5-2', title: 'Dokumentasi', url: '/kegiatan/dokumentasi', parent_id: '5', sort_order: 2, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '5-3', title: 'Agenda', url: '/kegiatan/agenda', parent_id: '5', sort_order: 3, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '6', title: 'Tim', url: '/tim', parent_id: null, sort_order: 6, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
  { id: '7', title: 'Kontak', url: '/kontak', parent_id: null, sort_order: 7, is_active: true, open_new_tab: false, created_at: '', updated_at: '' },
]

export default async function AdminNavigationPage() {
  const navs = await getTableData<Navigation>('navigations', defaultNavs)
  return <NavManager initialNavs={navs} />
}
