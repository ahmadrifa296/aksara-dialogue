'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, FolderOpen, Newspaper, Users2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  {
    title: 'Beranda',
    href: '/',
    icon: Home,
  },
  {
    title: 'Fokus',
    href: '/fokus-gerakan',
    icon: Target,
  },
  {
    title: 'Program',
    href: '/program',
    icon: FolderOpen,
  },
  {
    title: 'Berita',
    href: '/kegiatan/berita',
    icon: Newspaper,
  },
  {
    title: 'Tim',
    href: '/tim',
    icon: Users2,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-1 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      aria-label="Navigasi Bawah Mobile"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] min-h-[46px]',
                isActive
                  ? 'text-primary-600 dark:text-primary-400 font-bold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium'
              )}
            >
              <div
                className={cn(
                  'p-1 rounded-lg transition-transform duration-150',
                  isActive ? 'scale-110' : ''
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-0.5">
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}