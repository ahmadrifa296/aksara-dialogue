'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Info, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@aksaradialogue.org')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const activeEmail = (email || 'admin@aksaradialogue.org').trim()
      const activePassword = password || 'admin123'
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

      // 1. Prioritaskan akses login default jika kredensial sesuai
      if (
        (activeEmail.toLowerCase() === 'admin@aksaradialogue.org' && activePassword === 'admin123') ||
        (activeEmail.toLowerCase() === 'admin' && activePassword === 'admin')
      ) {
        document.cookie = 'admin_demo_session=true; path=/; max-age=86400'
        window.location.href = '/admin/dashboard'
        return
      }

      // 2. Jika bukan kredensial default dan Supabase tersedia, coba otentikasi Supabase Auth
      if (supabaseUrl && supabaseUrl.startsWith('http')) {
        const supabase = createClient()
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: activeEmail,
          password: activePassword,
        })

        if (!authError) {
          document.cookie = 'admin_demo_session=true; path=/; max-age=86400'
          window.location.href = '/admin/dashboard'
          return
        }
      }

      setError('Email atau password salah. Silakan gunakan default: admin@aksaradialogue.org / admin123')
    } catch {
      setError('Terjadi kesalahan saat masuk. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 mb-4 shadow-lg shadow-primary-600/30">
            <span className="text-2xl font-bold text-white font-serif">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-serif">
            Aksara Dialogue
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-sans">
            Content Management System (CMS)
          </p>
        </div>

        {/* Login form */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans">
              Portal Admin Masuk
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Administrator"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aksaradialogue.org"
              required
            />
            <Input
              label="Kata Sandi / Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Masuk ke Dashboard
            </Button>
          </form>

          {/* Dev Hint Box */}
          <div className="mt-6 p-3.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/60 text-xs text-primary-800 dark:text-primary-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>Akses Login Default (Local Dev):</span>
            </p>
            <p className="font-mono text-[11px] text-primary-900 dark:text-primary-200 pl-5">
              Email: <b>admin@aksaradialogue.org</b>
            </p>
            <p className="font-mono text-[11px] text-primary-900 dark:text-primary-200 pl-5">
              Password: <b>admin123</b>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          © 2026 Aksara Dialogue. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  )
}
