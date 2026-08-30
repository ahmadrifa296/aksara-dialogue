// ==========================================
// Database Types for Aksara Dialogue
// ==========================================

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: 'admin' | 'editor'
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  site_name: string
  site_description: string
  logo_url: string | null
  logo_dark_url: string | null
  favicon_url: string | null
  default_og_image: string | null
  created_at: string
  updated_at: string
}

export interface SeoSettings {
  id: string
  page_key: string
  title: string
  description: string
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical_url: string | null
  created_at: string
  updated_at: string
}

export interface Navigation {
  id: string
  title: string
  url: string
  parent_id: string | null
  sort_order: number
  is_active: boolean
  open_new_tab: boolean
  created_at: string
  updated_at: string
  children?: Navigation[]
}

export interface FooterSettings {
  id: string
  logo_url: string | null
  description: string
  address: string
  email: string
  phone: string | null
  whatsapp: string | null
  copyright: string
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface HomepageSection {
  id: string
  section_key: string
  title: string
  subtitle: string | null
  description: string | null
  image_url: string | null
  button_text: string | null
  button_url: string | null
  button_secondary_text: string | null
  button_secondary_url: string | null
  sort_order: number
  is_visible: boolean
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface About {
  id: string
  page_type: string
  title: string
  content: string
  image_url: string | null
  video_url: string | null
  quote: string | null
  quote_author: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface VisiMisi {
  id: string
  type: 'visi' | 'misi'
  content: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Value {
  id: string
  title: string
  description: string
  icon: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FocusArea {
  id: string
  name: string
  slug: string
  description: string
  content: string | null
  image_url: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProgramCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  title: string
  slug: string
  category_id: string | null
  excerpt: string | null
  content: string
  cover_image: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  category?: ProgramCategory
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface News {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  thumbnail: string | null
  author: string | null
  category_id: string | null
  tags: string[]
  status: 'draft' | 'published' | 'unpublished'
  published_at: string | null
  created_at: string
  updated_at: string
  category?: NewsCategory
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  poster: string | null
  event_date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  speaker: string | null
  registration_url: string | null
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Album {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  event_date: string | null
  location: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  photos?: GalleryPhoto[]
  photo_count?: number
}

export interface GalleryPhoto {
  id: string
  album_id: string
  image_url: string
  caption: string | null
  sort_order: number
  is_featured: boolean
  created_at: string
}

export interface PublicationCategory {
  id: string
  name: string
  slug: string
  type: 'article' | 'opinion' | 'report'
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  thumbnail: string | null
  author: string | null
  category_id: string | null
  tags: string[]
  status: 'draft' | 'published' | 'unpublished'
  published_at: string | null
  created_at: string
  updated_at: string
  category?: PublicationCategory
}

export interface Opinion {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  thumbnail: string | null
  author: string | null
  category_id: string | null
  tags: string[]
  status: 'draft' | 'published' | 'unpublished'
  published_at: string | null
  created_at: string
  updated_at: string
  category?: PublicationCategory
}

export interface Report {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  file_url: string
  file_name: string
  category_id: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  category?: PublicationCategory
}

export interface TeamMember {
  id: string
  name: string
  position: string
  bio: string | null
  photo: string | null
  email: string | null
  instagram: string | null
  linkedin: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactInfo {
  id: string
  email: string
  phone: string | null
  whatsapp: string | null
  address: string
  google_maps_url: string | null
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  file_name: string
  original_name: string
  file_path: string
  file_url: string
  file_type: 'image' | 'document'
  mime_type: string
  file_size: number
  folder: string
  alt_text: string | null
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

// ==========================================
// Utility Types
// ==========================================

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DashboardStats {
  totalArticles: number
  totalPrograms: number
  totalNews: number
  totalEvents: number
  totalAlbums: number
  totalTeamMembers: number
  totalMedia: number
  totalReports: number
}
