'use client'

import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

const variantStyles = {
  default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-semibold',
  success: 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800 font-semibold',
  warning: 'bg-primary-100 text-primary-800 dark:bg-primary-900/60 dark:text-primary-200 border border-primary-300 dark:border-primary-700 font-semibold',
  error: 'bg-neutral-950 text-white dark:bg-white dark:text-black border border-neutral-800 font-semibold',
  info: 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800 font-semibold',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// StatusBadge maps common statuses to badge variants
const statusMap: Record<string, { variant: BadgeProps['variant']; label: string }> = {
  published: { variant: 'success', label: 'Published' },
  draft: { variant: 'default', label: 'Draft' },
  unpublished: { variant: 'warning', label: 'Unpublished' },
  archived: { variant: 'error', label: 'Archived' },
  completed: { variant: 'info', label: 'Completed' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  active: { variant: 'success', label: 'Aktif' },
  inactive: { variant: 'default', label: 'Nonaktif' },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status] || { variant: 'default' as const, label: status }
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
