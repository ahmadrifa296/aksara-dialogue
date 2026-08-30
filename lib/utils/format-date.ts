import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { id } from 'date-fns/locale'

function toValidDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return isValid(d) ? d : null
  } catch {
    return null
  }
}

export function formatDate(date: string | Date | null | undefined, formatStr: string = 'd MMMM yyyy'): string {
  const d = toValidDate(date)
  if (!d) return '-'
  try {
    return format(d, formatStr, { locale: id })
  } catch {
    return '-'
  }
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  const d = toValidDate(date)
  if (!d) return 'Baru saja'
  try {
    return formatDistanceToNow(d, { addSuffix: true, locale: id })
  } catch {
    return 'Baru saja'
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  const d = toValidDate(date)
  if (!d) return '-'
  try {
    return format(d, 'd MMMM yyyy, HH:mm', { locale: id })
  } catch {
    return '-'
  }
}
