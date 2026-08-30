import { FileQuestion } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = 'Tidak ada data',
  description = 'Data belum tersedia.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-4 mb-4">
        {icon || <FileQuestion className="h-8 w-8 text-neutral-400" />}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1 font-sans">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}
