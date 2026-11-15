'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useEffect, useState } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Cari...',
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const [internal, setInternal] = useState(value)

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setInternal(value)
    })
    return () => cancelAnimationFrame(handle)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (internal !== value) {
        onChange(internal)
      }
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [internal, debounceMs, onChange, value])

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <input
        type="text"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-neutral-300 dark:border-neutral-600 pl-10 pr-10 py-2.5 text-sm',
          'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 dark:focus:ring-primary-900',
          'transition-colors duration-200'
        )}
      />
      {internal && (
        <button
          onClick={() => {
            setInternal('')
            onChange('')
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
