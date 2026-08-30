import { createClient } from '@/lib/supabase/server'
import { MediaManager } from './media-manager'
import type { Media } from '@/types'

const defaultMedia: Media[] = [
  {
    id: '1',
    file_name: 'hero-banner-forum.webp',
    original_name: 'Dokumentasi Forum Dialog Nasional.webp',
    file_path: 'general/hero-banner-forum.webp',
    file_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    file_type: 'image',
    mime_type: 'image/webp',
    file_size: 245000,
    folder: 'general',
    alt_text: 'Suasana Forum Dialog Nasional',
    uploaded_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    file_name: 'pelatihan-pemuda-2026.webp',
    original_name: 'Pelatihan Riset Aksi.webp',
    file_path: 'programs/pelatihan-pemuda-2026.webp',
    file_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    file_type: 'image',
    mime_type: 'image/webp',
    file_size: 180000,
    folder: 'programs',
    alt_text: 'Peserta Workshop Riset',
    uploaded_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default async function AdminMediaPage() {
  let mediaList = defaultMedia

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient()
      const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false })
      if (data && data.length > 0) mediaList = data
    }
  } catch {
    // fallback
  }

  return <MediaManager initialMedia={mediaList} />
}
