import { getTableData } from '@/lib/queries/db'
import { AlbumManager } from './album-manager'
import { dummyAlbums } from '@/lib/queries/content'
import type { Album } from '@/types'

export default async function AdminDocumentationPage() {
  const albums = await getTableData<Album>('albums', dummyAlbums)
  return <AlbumManager initialAlbums={albums} />
}
