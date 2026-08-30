export const SITE_NAME = 'Aksara Dialogue'

export const FILE_SIZE_LIMIT = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]

export const ALLOWED_DOCUMENT_TYPES = ['application/pdf']

export const ITEMS_PER_PAGE = 10

export const STORAGE_BUCKET = 'media'

export const STORAGE_FOLDERS = {
  LOGO: 'logo',
  HERO: 'hero',
  ABOUT: 'about',
  FOCUS: 'focus',
  PROGRAMS: 'programs',
  NEWS: 'news',
  EVENTS: 'events',
  GALLERY: 'gallery',
  ARTICLES: 'articles',
  OPINIONS: 'opinions',
  TEAM: 'team',
  REPORTS: 'reports',
  GENERAL: 'general',
} as const

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
] as const

export const EVENT_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const
