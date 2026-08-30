import { getTableData } from '@/lib/queries/db'
import { ArticleManager } from './article-manager'
import { dummyArticles } from '@/lib/queries/content'
import type { Article, PublicationCategory } from '@/types'

const defaultCategories: PublicationCategory[] = [
  { id: '1', name: 'Wacana Kritis', slug: 'wacana-kritis', type: 'article', is_active: true, sort_order: 1, created_at: '' },
  { id: '2', name: 'Kajian Kebijakan', slug: 'kajian-kebijakan', type: 'article', is_active: true, sort_order: 2, created_at: '' },
  { id: '3', name: 'Kolom Opini', slug: 'kolom-opini', type: 'opinion', is_active: true, sort_order: 3, created_at: '' },
]

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    getTableData<Article>('articles', dummyArticles),
    getTableData<PublicationCategory>('publication_categories', defaultCategories),
  ])

  return <ArticleManager initialArticles={articles} categories={categories} />
}
