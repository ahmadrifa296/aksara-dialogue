import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: string
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6',
        'hover:shadow-medium transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-sans">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-neutral-400 mt-1">{trend}</p>
          )}
        </div>
        <div className="rounded-lg bg-primary-50 dark:bg-primary-950/30 p-2.5">
          <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </div>
  )
}
