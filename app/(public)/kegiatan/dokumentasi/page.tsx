import { getTableData } from '@/lib/queries/db'
import { dummyAlbums } from '@/lib/queries/content'
import { Image as ImageIcon, Calendar, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'
import type { Album } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DocumentationPublicPage() {
  const albums = await getTableData<Album>('albums', dummyAlbums)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>DOKUMENTASI VISUAL</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Galeri Aksi & Rekam Jejak
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Arsip visual kegiatan dialog publik, temu warga, dan advokasi di seluruh wilayah Indonesia.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <div
              key={album.id}
              className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all space-y-4"
            >
              <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800 relative flex items-center justify-center text-neutral-400">
                {album.cover_image ? (
                  <img
                    src={album.cover_image}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12" />
                )}
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                  {album.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {album.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-neutral-500 pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
                  {album.event_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary-600" />
                      <span>{formatDate(album.event_date)}</span>
                    </div>
                  )}
                  {album.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary-600" />
                      <span>{album.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
