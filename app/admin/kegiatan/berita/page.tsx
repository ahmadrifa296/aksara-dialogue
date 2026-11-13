import { getTableData } from '@/lib/queries/db'
import { NewsManager } from './news-manager'
import { dummyNews } from '@/lib/queries/content'
import type { News, NewsCategory } from '@/types'

const defaultCategories: NewsCategory[] = [
  { id: '1', name: 'Rilis Pers', slug: 'rilis-pers', is_active: true, sort_order: 1, created_at: '' },
  { id: '2', name: 'Liputan Kegiatan', slug: 'liputan-kegiatan', is_active: true, sort_order: 2, created_at: '' },
  { id: '3', name: 'Kabar Advokasi', slug: 'kabar-advokasi', is_active: true, sort_order: 3, created_at: '' },
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
