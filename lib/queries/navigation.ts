import { createClient } from '@/lib/supabase/server'
import type { Navigation, SiteSettings, FooterSettings, SocialLink } from '@/types'

const defaultNavigation: Navigation[] = [
  {
    id: '1',
    title: 'Home',
    url: '/',
    parent_id: null,
    sort_order: 1,
    is_active: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Tentang Kami',
    url: '/tentang-kami/profil',
    parent_id: null,
    sort_order: 2,
    is_active: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    children: [
      {
        id: '2-1',
        title: 'Profil Organisasi',
        url: '/tentang-kami/profil',
        parent_id: '2',
        sort_order: 1,
        is_active: true,
        open_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2-2',
        title: 'Visi & Misi',
        url: '/tentang-kami/visi-misi',
        parent_id: '2',
        sort_order: 2,
        is_active: true,
        open_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2-3',
        title: 'Nilai-Nilai',
        url: '/tentang-kami/nilai-nilai',
        parent_id: '2',
        sort_order: 3,
        is_active: true,
        open_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: '3',
    title: 'Fokus Gerakan',
    url: '/fokus-gerakan',
    parent_id: null,
    sort_order: 3,
    is_active: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Program',
    url: '/program',
    parent_id: null,
    sort_order: 4,
    is_active: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Kegiatan',
    url: '/kegiatan/berita',
    parent_id: null,
    sort_order: 5,
    is_active: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    children: [
      {
        id: '5-1',
        title: 'Berita & Liputan',
        url: '/kegiatan/berita',
        parent_id: '5',
        sort_order: 1,
        is_active: true,
        open_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5-2',
        title: 'Dokumentasi / Galeri',
        url: '/kegiatan/dokumentasi',
        parent_id: '5',
        sort_order: 2,
        is_active: true,
        open_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5-3',
        title: 'Agenda & Event',
        url: '/kegiatan/agenda',
        parent_id: '5',
        sort_order: 3,
        is_active: true,
        open_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: '6',
    title: 'Tim',
    url: '/tim',
    parent_id: null,
    sort_order: 6,
    is_active: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Kontak',
    url: '/kontak',
    parent_id: null,
    sort_order: 7,
    is_active: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your_supabase_url_here') &&
    supabaseAnonKey &&
    !supabaseAnonKey.includes('your_supabase_anon_key_here')
  )
}

export async function getNavigations(): Promise<Navigation[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('navigation')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (!error && data && data.length > 0) {
        const parents = data.filter((item) => !item.parent_id)
        return parents.map((parent) => ({
          ...parent,
          children: data.filter((item) => item.parent_id === parent.id),
        }))
      }
    } catch {}
  }

  return defaultNavigation
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    id: '1',
    site_name: 'Aksara Dialogue',
    site_description: 'Organisasi independen yang berfokus pada pembangunan ruang dialog publik dan gerakan sosial untuk perubahan bermakna.',
    logo_url: null,
    logo_dark_url: null,
    favicon_url: null,
    default_og_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // 1. Check Supabase first if connected
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from('site_settings').select('*').single()
      if (!error && data) return { ...fallback, ...data }
    } catch {}
  }

  // 2. Check persistent local file store fallback
  try {
    const { getLocalRecord } = await import('@/lib/local-store')
    const local = getLocalRecord<SiteSettings>('site_settings')
    if (local) {
      return { ...fallback, ...local }
    }
  } catch {}

  return fallback
}

export async function getFooterSettings(): Promise<FooterSettings> {
  const fallback: FooterSettings = {
    id: '1',
    logo_url: null,
    description: 'Aksara Dialogue adalah wadah kolaborasi masyarakat sipil, akademisi, dan pemuda untuk memperkuat ruang dialog kritis, inklusif, dan berkeadilan.',
    address: 'Jl. Dialogue No. 12, Jakarta Selatan, Indonesia 12190',
    email: 'kontak@aksaradialogue.org',
    phone: '+62 21 7890 1234',
    whatsapp: '+62 812 3456 7890',
    copyright: '© 2026 Aksara Dialogue. Hak Cipta Dilindungi.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // 1. Check Supabase first if connected
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from('footer_settings').select('*').single()
      if (!error && data) return { ...fallback, ...data }
    } catch {}
  }

  // 2. Check persistent local file store fallback
  try {
    const { getLocalRecord } = await import('@/lib/local-store')
    const localFooter = getLocalRecord<FooterSettings>('footer_settings')
    const localSite = getLocalRecord<SiteSettings>('site_settings')
    if (localFooter) {
      return {
        ...fallback,
        ...localFooter,
        logo_url: localSite?.logo_url || localFooter.logo_url || fallback.logo_url,
      }
    }
    if (localSite && localSite.logo_url) {
      return { ...fallback, logo_url: localSite.logo_url }
    }
  } catch {}

  return fallback
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const fallback: SocialLink[] = [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/aksaradialogue', is_active: true, sort_order: 1, created_at: '', updated_at: '' },
    { id: '2', platform: 'youtube', url: 'https://youtube.com/@aksaradialogue', is_active: true, sort_order: 2, created_at: '', updated_at: '' },
    { id: '3', platform: 'linkedin', url: 'https://linkedin.com/company/aksaradialogue', is_active: true, sort_order: 3, created_at: '', updated_at: '' },
    { id: '4', platform: 'twitter', url: 'https://twitter.com/aksaradialogue', is_active: true, sort_order: 4, created_at: '', updated_at: '' },
  ]

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (!error && data && data.length > 0) return data
    } catch {}
  }

  return fallback
}
