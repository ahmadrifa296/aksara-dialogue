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
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          <ImageIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>DOKUMENTASI VISUAL</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Galeri Aksi & Rekam Jejak
        </h1>
        <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Arsip visual kegiatan dialog publik, temu warga, dan advokasi di seluruh wilayah Indonesia.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {albums.map((album) => (
            <div
              key={album.id}
              className="rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all space-y-2.5 sm:space-y-4"
            >
              <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800 relative flex items-center justify-center text-neutral-400">
                {album.cover_image ? (
                  <img
                    src={album.cover_image}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12" />
                )}
              </div>

              <div className="p-3 sm:p-6 space-y-1.5 sm:space-y-3">
                <h3 className="text-sm sm:text-xl font-serif font-bold text-neutral-900 dark:text-white line-clamp-2">
                  {album.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {album.description}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-[11px] sm:text-xs text-neutral-500 pt-1.5 sm:pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
                  {album.event_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-600" />
                      <span>{formatDate(album.event_date)}</span>
                    </div>
                  )}
                  {album.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-600" />
                      <span className="truncate max-w-[100px] sm:max-w-none">{album.location}</span>
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
