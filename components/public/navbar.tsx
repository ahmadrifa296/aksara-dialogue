'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Navigation, SiteSettings } from '@/types'

interface NavbarProps {
  navigations: Navigation[]
  siteSettings: SiteSettings
}

export function Navbar({ navigations, siteSettings }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {siteSettings.logo_url ? (
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src={siteSettings.logo_url}
                  alt={siteSettings.site_name || 'Logo'}
                  fill
                  className="object-contain rounded-xl"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                A
              </div>
            )}
            <div>
              <span className="text-xl font-black tracking-tight text-neutral-950 dark:text-white font-serif block leading-none">
                {siteSettings.site_name || 'Aksara Dialogue'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-sans font-extrabold mt-1 block">
                Suara Publik · Ruang Dialog
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigations.map((item) => {
              const hasChildren = item.children && item.children.length > 0
              const isActive =
                pathname === item.url ||
                (hasChildren && item.children?.some((c) => pathname.startsWith(c.url)))

              if (hasChildren) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold transition-colors duration-150',
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-neutral-800 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400'
                      )}
                    >
                      {item.title}
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          activeDropdown === item.id && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.id && (
                      <div className="absolute top-full left-0 pt-2 w-56 animate-fade-in z-50">
                        <div className="rounded-xl bg-white dark:bg-neutral-900 p-2 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-1">
                          {item.children?.map((child) => (
                            <Link
                              key={child.id}
                              href={child.url}
                              target={child.open_new_tab ? '_blank' : undefined}
                              className={cn(
                                'block px-3.5 py-2 rounded-lg text-sm transition-colors duration-150',
                                pathname === child.url
                                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 font-bold'
                                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white font-medium'
                              )}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.open_new_tab ? '_blank' : undefined}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-bold transition-colors duration-150',
                    pathname === item.url
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-neutral-800 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400'
                  )}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 hover:shadow-primary-600/40 transition-all hover:scale-105 duration-150"
            >
              <span>Ikut Berdialog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white/98 dark:bg-neutral-950/98 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto animate-fade-in">
          <div className="flex flex-col gap-2">
            {navigations.map((item) => {
              const hasChildren = item.children && item.children.length > 0
              if (hasChildren) {
                const isOpen = activeDropdown === item.id
                return (
                  <div key={item.id} className="border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="flex items-center justify-between w-full py-2.5 text-base font-bold text-neutral-900 dark:text-white"
                    >
                      {item.title}
                      <ChevronDown
                        className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                      />
                    </button>
                    {isOpen && (
                      <div className="pl-4 space-y-1.5 py-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="block py-2 text-sm font-semibold text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-white"
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
                  key={item.id}
                  href={item.url}
                  className="py-2.5 text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800"
                >
                  {item.title}
                </Link>
              )
            })}

            <div className="pt-6 mt-4 flex flex-col gap-3">
              <Link
                href="/kontak"
                className="w-full text-center py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold uppercase tracking-wider text-sm shadow-md"
              >
                Ikut Berdialog Bersama Kami
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
