import { createClient } from '@/lib/supabase/server'
import { dummyReports } from '@/lib/queries/content'
import { FileText, Download, Calendar, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'

export default async function ReportsPublicPage() {
  let reports = dummyReports

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient()
      const { data } = await supabase.from('reports').select('*, category:publication_categories(*)').eq('is_published', true).order('created_at', { ascending: false })
      if (data && data.length > 0) reports = data
    }
  } catch {
    // fallback
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950 text-primary-800 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <FileText className="h-3.5 w-3.5" />
          <span>LAPORAN & RISET</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          Laporan & Dokumen Advokasi
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans">
          Unduh secara terbuka naskah riset kebijakan, laporan tahunan, dan lembar kerja advokasi kami.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 dark:text-primary-400">
                <span className="bg-primary-100/80 dark:bg-primary-950 px-2.5 py-0.5 rounded">
                  {report.category?.name || 'Dokumen'}
                </span>
                {report.published_at && (
                  <>
                    <span>·</span>
                    <span className="text-neutral-500">{formatDate(report.published_at)}</span>
                  </>
                )}
              </div>

              <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
                {report.title}
              </h3>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                {report.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono pt-1">
                <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span>{report.file_name}</span>
              </div>
            </div>

            <div className="shrink-0 pt-2 md:pt-0">
              <a
                href={report.file_url || '#'}
                download={report.file_name}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 text-sm font-semibold shadow-sm transition-colors"
              >
                <span>Unduh PDF</span>
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
