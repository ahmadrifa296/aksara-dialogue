'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Home,
  Info,
  Target,
  FolderOpen,
  Newspaper,
  Users,
  Phone,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  children?: { title: string; href: string }[]
}

const menuItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: 'Homepage', href: '/admin/homepage', icon: <Home className="h-5 w-5" /> },
  {
    title: 'Tentang',
    href: '/admin/tentang',
    icon: <Info className="h-5 w-5" />,
    children: [
      { title: 'Profil', href: '/admin/tentang/profil' },
      { title: 'Visi & Misi', href: '/admin/tentang/visi-misi' },
      { title: 'Nilai-Nilai', href: '/admin/tentang/nilai-nilai' },
    ],
  },
  { title: 'Fokus Gerakan', href: '/admin/fokus-gerakan', icon: <Target className="h-5 w-5" /> },
  {
    title: 'Program',
    href: '/admin/program',
    icon: <FolderOpen className="h-5 w-5" />,
    children: [
      { title: 'Daftar Program', href: '/admin/program' },
      { title: 'Kategori', href: '/admin/program/kategori' },
    ],
  },
  {
    title: 'Kegiatan',
    href: '/admin/kegiatan',
    icon: <Newspaper className="h-5 w-5" />,
    children: [
      { title: 'Berita', href: '/admin/kegiatan/berita' },
      { title: 'Dokumentasi', href: '/admin/kegiatan/dokumentasi' },
      { title: 'Agenda', href: '/admin/kegiatan/agenda' },
    ],
  },
  { title: 'Tim', href: '/admin/tim', icon: <Users className="h-5 w-5" /> },
  { title: 'Kontak', href: '/admin/kontak', icon: <Phone className="h-5 w-5" /> },
  { title: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string[]>([])

  const toggleExpand = (title: string) => {
    setExpanded((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  const isParentActive = (item: SidebarItem) => {
    if (item.children) {
      return item.children.some((child) => pathname === child.href || pathname.startsWith(child.href + '/'))
    }
    return isActive(item.href)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'admin-sidebar fixed top-0 left-0 z-50 h-full w-64 bg-neutral-950 text-white',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">AKSARA</p>
              <p className="text-[10px] text-neutral-400 -mt-0.5 tracking-widest">DIALOGUE CMS</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const active = isParentActive(item)
            const isExpanded = expanded.includes(item.title) || active

            if (item.children) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors',
                      active
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-5 mt-1 space-y-0.5 border-l border-neutral-800 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            'block px-3 py-2 rounded-lg text-sm transition-colors',
                            pathname === child.href || pathname.startsWith(child.href + '/')
                              ? 'bg-primary-600/20 text-primary-300 font-medium'
                              : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/30'
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-primary-600/20 text-primary-300 font-medium'
                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800">
          <p className="text-[10px] text-neutral-600 text-center">Aksara Dialogue CMS v1.0</p>
        </div>
      </aside>
    </>
  )
}
