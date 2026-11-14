import { getTableData } from '@/lib/queries/db'
import { NewsManager } from './news-manager'
import { dummyNews } from '@/lib/queries/content'
import type { News, NewsCategory } from '@/types'

const defaultCategories: NewsCategory[] = [
  { id: 'e15f9ced-4e8a-42c5-8a4f-32f6e7789059', name: 'Rilis Pers', slug: 'rilis-pers', is_active: true, sort_order: 1, created_at: '' },
  { id: '3a7dd63e-e2f6-4749-b697-315052854a63', name: 'Liputan Kegiatan', slug: 'liputan-kegiatan', is_active: true, sort_order: 2, created_at: '' },
  { id: '273d32ef-f7a1-444f-9437-950ae138e219', name: 'Kabar Advokasi', slug: 'kabar-advokasi', is_active: true, sort_order: 3, created_at: '' },
]

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminNewsPage() {
  const [news, categories] = await Promise.all([
    getTableData<News>('news', dummyNews),
    getTableData<NewsCategory>('news_categories', defaultCategories),
  ])

  return <NewsManager initialNews={news} categories={categories} />
}
