'use client'

import { Menu, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AdminHeaderProps {
  onMenuToggle: () => void
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    document.cookie = 'admin_demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <button
          onClick={onMenuToggle}
          className="lg:hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5">
            <User className="h-4 w-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-300">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
