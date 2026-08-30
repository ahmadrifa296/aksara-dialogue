import { cn } from '@/lib/utils/cn'

interface RichTextRendererProps {
  content: string
  className?: string
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  return (
    <div
      className={cn('prose-content', className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
