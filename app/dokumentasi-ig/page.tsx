'use client'

import React, { useState } from 'react'
import {
  Download,
  Eye,
  Grid,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  Smartphone,
  Globe,
  Users2,
  Mail,
  Home,
  Target,
  FolderOpen,
  Newspaper,
  LayoutDashboard
} from 'lucide-react'
import { InstagramIcon, LinkedInIcon } from '@/components/ui/social-icons'
import html2canvas from 'html2canvas'

export default function IgDocumentationPage() {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single')
  const [zoomMode, setZoomMode] = useState<'fit' | 'full'>('fit')
  const [isDownloading, setIsDownloading] = useState(false)
  const totalSlides = 6

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : totalSlides))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : 1))
  }

  const downloadSlide = async (slideIndex: number) => {
    const el = document.getElementById(`ig-slide-${slideIndex}`)
    if (!el) return
    setIsDownloading(true)

    const origTransform = el.style.transform
    const origPosition = el.style.position

    el.style.transform = 'scale(1)'
    el.style.position = 'relative'

    try {
      const canvas = await html2canvas(el, {
        scale: 1,
        width: 1080,
        height: 1350,
        backgroundColor: '#080e21',
        useCORS: true,
      })

      el.style.transform = origTransform
      el.style.position = origPosition

      const link = document.createElement('a')
      link.download = `AksaraDialogue-Slide-${slideIndex}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
      el.style.transform = origTransform
      el.style.position = origPosition
      alert('Gagal mendownload secara otomatis. Silakan gunakan tombol Cetak/PDF atau screenshot browser.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center py-6 px-4 selection:bg-primary-500 selection:text-white">
      {/* Top Floating Control Toolbar */}
      <header className="sticky top-4 z-50 bg-neutral-900/90 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-full shadow-2xl flex flex-wrap items-center justify-between gap-3 max-w-5xl w-full mb-8">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            Instagram Carousel
          </span>
          <span className="text-xs font-bold text-neutral-300 hidden sm:inline">
            1080 &times; 1350 px (4:5)
          </span>
        </div>

        {/* Carousel Slider Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            title="Slide Sebelumnya"
            aria-label="Slide Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-extrabold text-primary-400 min-w-[70px] text-center">
            Slide {currentSlide} / {totalSlides}
          </span>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            title="Slide Berikutnya"
            aria-label="Slide Berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'all' : 'single')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {viewMode === 'all' ? 'Slide Tunggal' : 'Lihat Semua (Grid)'}
            </span>
          </button>

          <button
            onClick={() => setZoomMode(zoomMode === 'fit' ? 'full' : 'fit')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              zoomMode === 'full'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {zoomMode === 'full' ? 'Fit Layar (50%)' : '100% Asli'}
            </span>
          </button>

          <button
            onClick={() => downloadSlide(currentSlide)}
            disabled={isDownloading}
            className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isDownloading ? 'Memproses...' : 'Download PNG'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Cetak / Export PDF"
            aria-label="Cetak / Export PDF"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Presentation Slides Container */}
      <main
        className={`w-full flex justify-center items-center gap-10 ${
          viewMode === 'all'
            ? 'flex-wrap max-w-[1900px]'
            : 'flex-col'
        }`}
      >
        {/* ======================================================== */}
        {/* SLIDE 1: COVER (HASIL RANCANG BANGUN AKSARA DIALOGUE)     */}
        {/* ======================================================== */}
        <div
          className={`relative transition-all duration-300 ${
            viewMode === 'single' && currentSlide !== 1 ? 'hidden' : 'block'
          } ${
            zoomMode === 'full'
              ? 'w-[1080px] h-[1350px]'
              : 'w-[540px] h-[675px]'
          }`}
        >
          <div
            id="ig-slide-1"
            className={`w-[1080px] h-[1350px] bg-[#080e21] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-16 select-none origin-top-left relative ${
              zoomMode === 'full' ? 'scale-100 relative' : 'scale-50 absolute top-0 left-0'
            }`}
          >
            {/* Background Tech Grid & Ambience */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />
              <div className="absolute -top-32 -right-32 w-[650px] h-[650px] bg-blue-600/30 rounded-full blur-[90px]" />
              <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-orange-600/25 rounded-full blur-[90px]" />

              {/* 3D Isometric Floor Grid */}
              <div
                className="absolute -bottom-32 -left-32 -right-32 h-[500px] opacity-35"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                  transform: 'perspective(600px) rotateX(65deg)',
                  transformOrigin: 'bottom center',
                }}
              />

              {/* Sparkle 4-point stars */}
              <span className="absolute top-44 left-56 text-3xl text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse">
                ✦
              </span>
              <span className="absolute top-52 right-64 text-2xl text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse">
                ✦
              </span>
              <span className="absolute top-[480px] left-60 text-xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                ✦
              </span>
              <span className="absolute top-[470px] right-60 text-3xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                ✦
              </span>

              {/* Curved 3D Paint / Ribbon Strokes */}
              <svg className="absolute -left-10 bottom-24 w-[480px] h-[180px] z-10" viewBox="0 0 500 200" fill="none">
                <path
                  d="M-50 160C100 160 220 80 480 30"
                  stroke="#ea580c"
                  strokeWidth="26"
                  strokeLinecap="round"
                  className="drop-shadow-[0_10px_15px_rgba(234,88,12,0.6)]"
                />
              </svg>
              <svg className="absolute -right-6 bottom-32 w-[520px] h-[200px] z-10" viewBox="0 0 500 200" fill="none">
                <path
                  d="M-20 40C200 90 320 170 520 180"
                  stroke="#2563eb"
                  strokeWidth="28"
                  strokeLinecap="round"
                  className="drop-shadow-[0_10px_20px_rgba(37,99,235,0.7)]"
                />
              </svg>
            </div>

            {/* Slide Header */}
            <div className="relative z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black tracking-tight text-white flex items-center gap-1.5 relative">
                  <span>ARF</span>
                  <div className="flex gap-0.5 -mt-3">
                    <span className="w-1.5 h-3 bg-sky-400 rounded-full rotate-12 inline-block" />
                    <span className="w-1.5 h-3 bg-orange-500 rounded-full rotate-12 inline-block" />
                    <span className="w-1.5 h-3 bg-amber-400 rounded-full rotate-12 inline-block" />
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-3 border-l border-white/20">
                  Civic Tech &amp; Web Platform
                </span>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold tracking-wider text-neutral-200">
                SLIDE 01 / 06
              </div>
            </div>

            {/* Slide Body: Giant Typography & Realistic Web Output Mockup */}
            <div className="relative z-20 flex-1 flex flex-col justify-center my-6">
              <div className="text-center mb-6">
                <h1 className="text-7xl font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-lg">
                  PROJEK<br />
                  PERTAMA<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 drop-shadow">
                    KREATIF
                  </span>
                </h1>
                <p className="text-2xl font-semibold text-neutral-300 mt-3 font-sans">
                  Dokumentasi &amp; Hasil Rancang Bangun: Aksara Dialogue Web
                </p>
              </div>

              {/* Realistic Web & Mobile Output Showcase */}
              <div className="relative w-full h-[520px] flex items-center justify-center mt-2">
                {/* 1. Main Laptop / Browser Mockup Showing Real Homepage Output */}
                <div className="w-[660px] bg-neutral-900/95 border-2 border-neutral-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md z-20">
                  {/* Browser Bar */}
                  <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="px-6 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                      <Globe className="h-3 w-3 text-primary-400" />
                      <span>https://aksara-dialogue.vercel.app</span>
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Real Web Render Preview: Navbar + Hero Banner */}
                  <div className="p-5 bg-neutral-950 space-y-4 font-sans">
                    {/* Mini Navbar */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-serif font-black text-white text-sm shadow">
                          A
                        </div>
                        <div>
                          <p className="text-xs font-serif font-black text-white leading-tight">Aksara Dialogue</p>
                          <p className="text-[8px] text-primary-400 font-bold uppercase tracking-wider">Suara Publik &bull; Ruang Dialog</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-neutral-300">
                        <span>Home</span>
                        <span>Tentang</span>
                        <span>Fokus Gerakan</span>
                        <span>Program</span>
                        <span>Tim</span>
                        <span className="px-2.5 py-1 rounded-md bg-primary-600 text-white font-extrabold uppercase text-[9px]">
                          Ikut Berdialog
                        </span>
                      </div>
                    </div>

                    {/* Mini Hero Section */}
                    <div className="relative rounded-xl overflow-hidden p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-600 text-[9px] font-extrabold uppercase text-white mb-2">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>RUANG DIALOG &bull; GERAKAN SIPIL</span>
                      </div>
                      <h3 className="text-base font-serif font-black uppercase text-white leading-snug max-w-sm">
                        Memperjuangkan Ruang Dialog di Tengah Disrupsi Sosial
                      </h3>
                      <p className="text-[10px] text-neutral-400 mt-1.5 max-w-md leading-relaxed">
                        Wadah independen masyarakat sipil untuk mengawal hak-hak dasar warga, mempertemukan gagasan kritis, serta mendorong transparansi kebijakan.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-3 py-1 bg-primary-600 text-white rounded text-[10px] font-bold">Jelajahi Program &rarr;</span>
                        <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded text-[10px] font-medium border border-neutral-700">Pelajari Gerakan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Floating Phone Mockup Showing Real Mobile 2-Column Layout */}
                <div className="absolute -right-4 -bottom-4 w-[210px] bg-neutral-900 rounded-[28px] border-[3px] border-neutral-700 shadow-2xl p-2.5 z-30 transform rotate-[-3deg] backdrop-blur-md">
                  <div className="w-16 h-3 bg-neutral-950 rounded-full mx-auto mb-2" />
                  <div className="bg-neutral-950 rounded-2xl p-2 space-y-2 border border-neutral-800">
                    <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                      <span className="text-[9px] font-bold text-white">Aksara Mobile</span>
                      <span className="text-[8px] bg-primary-600/30 text-primary-400 px-1 rounded font-mono">Shopee-Grid</span>
                    </div>
                    {/* 2-Column Cards Inside Phone */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-neutral-900 p-1.5 rounded-lg border border-neutral-800 text-center space-y-1">
                        <div className="w-8 h-8 mx-auto rounded-full bg-primary-600/30 flex items-center justify-center text-[10px]">⚖️</div>
                        <p className="text-[8px] font-bold text-white truncate">Keadilan HAM</p>
                      </div>
                      <div className="bg-neutral-900 p-1.5 rounded-lg border border-neutral-800 text-center space-y-1">
                        <div className="w-8 h-8 mx-auto rounded-full bg-primary-600/30 flex items-center justify-center text-[10px]">🏛️</div>
                        <p className="text-[8px] font-bold text-white truncate">Demokrasi</p>
                      </div>
                    </div>
                    {/* Mini Bottom Nav */}
                    <div className="pt-1.5 border-t border-neutral-800 flex justify-around text-[7px] text-neutral-400">
                      <span className="text-primary-400 font-bold">Home</span>
                      <span>Fokus</span>
                      <span>Program</span>
                      <span>Tim</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <footer className="relative z-20 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-extrabold text-white">@arf.creative</span>
              <span className="text-sm font-semibold text-sky-400 flex items-center gap-1">
                <span>Aksara Dialogue Platform</span>
                <span>&rarr;</span>
              </span>
            </footer>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SLIDE 2: HASIL BERANDA & 4 PILAR FOKUS GERAKAN           */}
        {/* ======================================================== */}
        <div
          className={`relative transition-all duration-300 ${
            viewMode === 'single' && currentSlide !== 2 ? 'hidden' : 'block'
          } ${
            zoomMode === 'full'
              ? 'w-[1080px] h-[1350px]'
              : 'w-[540px] h-[675px]'
          }`}
        >
          <div
            id="ig-slide-2"
            className={`w-[1080px] h-[1350px] bg-[#080e21] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-16 select-none origin-top-left relative ${
              zoomMode === 'full' ? 'scale-100 relative' : 'scale-50 absolute top-0 left-0'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-blue-600/25 rounded-full blur-[80px]" />

            <div className="relative z-20 flex items-center justify-between">
              <div className="text-3xl font-black text-white">ARF <span className="text-xs font-bold text-neutral-400 pl-2">Civic Tech</span></div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-extrabold text-neutral-200">SLIDE 02 / 06</div>
            </div>

            <div className="relative z-20 my-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-black uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" />
                <span>Hasil Rancang Bangun: Beranda &amp; Pilar Isu</span>
              </div>

              <h2 className="text-5xl font-black uppercase text-white leading-tight">
                ARSITEKTUR ADVOKASI &amp;<br />
                <span className="text-amber-400">EMPAT PILAR STRATEGIS</span>
              </h2>

              <p className="text-xl text-neutral-300 leading-relaxed font-sans max-w-3xl">
                Setiap pilar memiliki halaman dinamis terpisah, terhubung langsung ke database Supabase sehingga dapat diperbarui secara mandiri oleh tim pengurus.
              </p>

              {/* Browser Window Mockup Showing 4 Focus Cards */}
              <div className="bg-neutral-900/90 border-2 border-neutral-700 rounded-2xl shadow-2xl overflow-hidden mt-6">
                <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">aksara-dialogue.vercel.app/fokus-gerakan</span>
                  <div className="w-8" />
                </div>

                <div className="p-6 bg-neutral-950 grid grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2 hover:border-primary-500 transition-colors">
                    <span className="text-[10px] font-black uppercase text-primary-400">PILAR 01</span>
                    <h4 className="text-sm font-serif font-black text-white">Keadilan Sosial &amp; Hak Asasi Manusia</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">Mengawal perlindungan hak-hak dasar warga, penguatan kelompok marjinal, serta pemerataan akses keadilan.</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2 hover:border-primary-500 transition-colors">
                    <span className="text-[10px] font-black uppercase text-primary-400">PILAR 02</span>
                    <h4 className="text-sm font-serif font-black text-white">Demokrasi &amp; Transparansi Kebijakan</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">Mendorong reformasi institusional, akuntabilitas anggaran publik, serta partisipasi aktif warga dalam regulasi.</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2 hover:border-primary-500 transition-colors">
                    <span className="text-[10px] font-black uppercase text-primary-400">PILAR 03</span>
                    <h4 className="text-sm font-serif font-black text-white">Kelestarian Ekologis &amp; Keadilan Iklim</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">Advokasi transisi energi yang adil, perlindungan wilayah kelola rakyat, dan pencegahan kerusakan lingkungan.</p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2 hover:border-primary-500 transition-colors">
                    <span className="text-[10px] font-black uppercase text-primary-400">PILAR 04</span>
                    <h4 className="text-sm font-serif font-black text-white">Keadilan Gender &amp; Inklusi Sosial</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">Membuka ruang setara bagi perempuan, penyandang disabilitas, dan kelompok rentan di semua level perumusan kebijakan.</p>
                  </div>
                </div>
              </div>
            </div>

            <footer className="relative z-20 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-extrabold text-white">@arf.creative</span>
              <span className="text-sm font-semibold text-sky-400">Geser untuk melihat Halaman Tim &rarr;</span>
            </footer>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SLIDE 3: HASIL HALAMAN STRUKTUR TIM (AHMAD RIFA)         */}
        {/* ======================================================== */}
        <div
          className={`relative transition-all duration-300 ${
            viewMode === 'single' && currentSlide !== 3 ? 'hidden' : 'block'
          } ${
            zoomMode === 'full'
              ? 'w-[1080px] h-[1350px]'
              : 'w-[540px] h-[675px]'
          }`}
        >
          <div
            id="ig-slide-3"
            className={`w-[1080px] h-[1350px] bg-[#080e21] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-16 select-none origin-top-left relative ${
              zoomMode === 'full' ? 'scale-100 relative' : 'scale-50 absolute top-0 left-0'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[90px]" />

            <div className="relative z-20 flex items-center justify-between">
              <div className="text-3xl font-black text-white">ARF <span className="text-xs font-bold text-neutral-400 pl-2">Civic Tech</span></div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-extrabold text-neutral-200">SLIDE 03 / 06</div>
            </div>

            <div className="relative z-20 my-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-black uppercase tracking-wider">
                <Users2 className="h-3.5 w-3.5" />
                <span>Hasil Rancang Bangun: Struktur Tim &amp; Pengurus</span>
              </div>

              <h2 className="text-5xl font-black uppercase text-white leading-tight">
                PROFIL PENGURUS &amp;<br />
                <span className="text-sky-400">JEJARING PROFESIONAL</span>
              </h2>

              <p className="text-xl text-neutral-300 leading-relaxed font-sans max-w-3xl">
                Transparansi organisasi ditampilkan melalui kartu profil yang memuat foto pengurus, jabatan terverifikasi, biodata peran, serta tautan langsung ke LinkedIn dan Instagram.
              </p>

              {/* Realistic Browser Window of Team Page */}
              <div className="bg-neutral-900/90 border-2 border-neutral-700 rounded-2xl shadow-2xl overflow-hidden mt-6">
                <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">aksara-dialogue.vercel.app/tim</span>
                  <div className="w-8" />
                </div>

                <div className="p-6 bg-neutral-950 grid grid-cols-3 gap-4">
                  {/* Card 1: Muhamad Syamsul Maarif */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 border-2 border-primary-500/40 flex items-center justify-center font-bold text-neutral-300">
                      MSM
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-black text-white">Muhamad Syamsul M.</h4>
                      <p className="text-[9px] font-bold text-primary-400 uppercase tracking-wider">Direktur Eksekutif</p>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-3">
                      Pegiat hak asasi manusia dan advokasi kebijakan publik dengan pengalaman lebih dari 3 tahun.
                    </p>
                    <div className="flex justify-center gap-2 pt-2 border-t border-neutral-800 text-neutral-400">
                      <Mail className="h-3 w-3" />
                      <LinkedInIcon className="h-3 w-3" />
                      <InstagramIcon className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Card 2: Ahmad Rifa (Highlight) */}
                  <div className="bg-neutral-900 border-2 border-amber-500/80 rounded-xl p-4 text-center space-y-2 shadow-lg shadow-amber-500/10 relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                      IT Lead
                    </span>
                    <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-400 overflow-hidden">
                      AR
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-black text-white">Ahmad Rifa</h4>
                      <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Koordinator IT &amp; Digital</p>
                    </div>
                    <p className="text-[10px] text-neutral-300 leading-relaxed line-clamp-3">
                      Pengembang sistem informasi dan civic tech yang berfokus pada keandalan infrastruktur digital, keterbukaan data publik, serta keamanan platform advokasi warga.
                    </p>
                    <div className="flex justify-center gap-2 pt-2 border-t border-neutral-800 text-amber-400">
                      <Mail className="h-3 w-3" />
                      <LinkedInIcon className="h-3 w-3" />
                      <InstagramIcon className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Card 3: Siti Nurhaliza */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 border-2 border-primary-500/40 flex items-center justify-center font-bold text-neutral-300">
                      SN
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-black text-white">Siti Nurhaliza, M.A.</h4>
                      <p className="text-[9px] font-bold text-primary-400 uppercase tracking-wider">Manajer Riset</p>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-3">
                      Peneliti kebijakan sosial dengan fokus pada demokrasi deliberatif dan tata kelola anggaran.
                    </p>
                    <div className="flex justify-center gap-2 pt-2 border-t border-neutral-800 text-neutral-400">
                      <Mail className="h-3 w-3" />
                      <LinkedInIcon className="h-3 w-3" />
                      <InstagramIcon className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="relative z-20 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-extrabold text-white">@arf.creative</span>
              <span className="text-sm font-semibold text-sky-400">Geser untuk melihat Mobile Reflow &rarr;</span>
            </footer>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SLIDE 4: TAMPILAN MOBILE ALA SHOPEE & BOTTOM NAV         */}
        {/* ======================================================== */}
        <div
          className={`relative transition-all duration-300 ${
            viewMode === 'single' && currentSlide !== 4 ? 'hidden' : 'block'
          } ${
            zoomMode === 'full'
              ? 'w-[1080px] h-[1350px]'
              : 'w-[540px] h-[675px]'
          }`}
        >
          <div
            id="ig-slide-4"
            className={`w-[1080px] h-[1350px] bg-[#080e21] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-16 select-none origin-top-left relative ${
              zoomMode === 'full' ? 'scale-100 relative' : 'scale-50 absolute top-0 left-0'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[100px]" />

            <div className="relative z-20 flex items-center justify-between">
              <div className="text-3xl font-black text-white">ARF <span className="text-xs font-bold text-neutral-400 pl-2">Civic Tech</span></div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-extrabold text-neutral-200">SLIDE 04 / 06</div>
            </div>

            <div className="relative z-20 my-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Hasil Rancang Bangun: Mobile Reflow</span>
              </div>

              <h2 className="text-5xl font-black uppercase text-white leading-tight">
                GRID 2 KOLOM &amp;<br />
                <span className="text-orange-400">BOTTOM NAVIGATION ALA SHOPEE</span>
              </h2>

              <p className="text-xl text-neutral-300 leading-relaxed font-sans max-w-3xl">
                Tampilan di ponsel dirancang ulang secara menyeluruh: bukan sekadar desktop yang diperkecil, melainkan layout reflow 2 kolom compact dengan bilah navigasi bawah yang pas di jempol.
              </p>

              {/* Dual Phone Showcase Side-by-Side */}
              <div className="flex items-center justify-center gap-8 pt-4">
                {/* Phone 1: Team Page 2-Column */}
                <div className="w-[340px] bg-neutral-900 rounded-[36px] border-[4px] border-neutral-700 shadow-2xl p-3 backdrop-blur-md">
                  <div className="w-24 h-4 bg-neutral-950 rounded-full mx-auto mb-3" />
                  <div className="bg-neutral-950 rounded-2xl p-3.5 space-y-3 border border-neutral-800">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <span className="text-xs font-serif font-black text-white">Tim &amp; Penggerak</span>
                      <span className="text-[9px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">Grid 2 Kolom</span>
                    </div>

                    {/* 2-Column Grid of Team Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-center space-y-1">
                        <div className="w-10 h-10 mx-auto rounded-full bg-primary-600/30 flex items-center justify-center text-xs">👤</div>
                        <p className="text-[10px] font-bold text-white truncate">Syamsul Maarif</p>
                        <p className="text-[8px] text-primary-400 uppercase">Direktur</p>
                      </div>

                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-amber-500/50 text-center space-y-1">
                        <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">AR</div>
                        <p className="text-[10px] font-bold text-white truncate">Ahmad Rifa</p>
                        <p className="text-[8px] text-amber-400 uppercase">IT Lead</p>
                      </div>

                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-center space-y-1">
                        <div className="w-10 h-10 mx-auto rounded-full bg-primary-600/30 flex items-center justify-center text-xs">👤</div>
                        <p className="text-[10px] font-bold text-white truncate">Siti Nurhaliza</p>
                        <p className="text-[8px] text-primary-400 uppercase">Manajer</p>
                      </div>

                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-center space-y-1">
                        <div className="w-10 h-10 mx-auto rounded-full bg-primary-600/30 flex items-center justify-center text-xs">👤</div>
                        <p className="text-[10px] font-bold text-white truncate">Rizki Pratama</p>
                        <p className="text-[8px] text-primary-400 uppercase">Koordinator</p>
                      </div>
                    </div>

                    {/* Fixed Bottom Nav Simulation */}
                    <div className="pt-2 border-t border-neutral-800 flex justify-around text-[9px] text-neutral-400">
                      <div className="flex flex-col items-center"><Home className="h-3 w-3" /><span>Home</span></div>
                      <div className="flex flex-col items-center"><Target className="h-3 w-3" /><span>Fokus</span></div>
                      <div className="flex flex-col items-center"><FolderOpen className="h-3 w-3" /><span>Program</span></div>
                      <div className="flex flex-col items-center text-primary-400 font-bold"><Users2 className="h-3 w-3" /><span>Tim</span></div>
                    </div>
                  </div>
                </div>

                {/* Phone 2: Dokumentasi / Album Grid 2-Column */}
                <div className="w-[340px] bg-neutral-900 rounded-[36px] border-[4px] border-neutral-700 shadow-2xl p-3 backdrop-blur-md">
                  <div className="w-24 h-4 bg-neutral-950 rounded-full mx-auto mb-3" />
                  <div className="bg-neutral-950 rounded-2xl p-3.5 space-y-3 border border-neutral-800">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <span className="text-xs font-serif font-black text-white">Galeri Aksi</span>
                      <span className="text-[9px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-bold">Album Warga</span>
                    </div>

                    {/* 2-Column Grid of Albums */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                        <div className="h-14 bg-blue-900/40 flex items-center justify-center text-xs">📸</div>
                        <div className="p-2 space-y-1">
                          <p className="text-[9px] font-bold text-white truncate">Forum Dialog 2026</p>
                          <p className="text-[7px] text-neutral-400">Jakarta &bull; 15 Des</p>
                        </div>
                      </div>

                      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                        <div className="h-14 bg-orange-900/40 flex items-center justify-center text-xs">📸</div>
                        <div className="p-2 space-y-1">
                          <p className="text-[9px] font-bold text-white truncate">Pelatihan Riset</p>
                          <p className="text-[7px] text-neutral-400">Bandung &bull; 20 Jan</p>
                        </div>
                      </div>

                      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                        <div className="h-14 bg-emerald-900/40 flex items-center justify-center text-xs">📸</div>
                        <div className="p-2 space-y-1">
                          <p className="text-[9px] font-bold text-white truncate">Temu Advokasi</p>
                          <p className="text-[7px] text-neutral-400">Yogya &bull; 10 Feb</p>
                        </div>
                      </div>

                      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                        <div className="h-14 bg-purple-900/40 flex items-center justify-center text-xs">📸</div>
                        <div className="p-2 space-y-1">
                          <p className="text-[9px] font-bold text-white truncate">Konsolidasi</p>
                          <p className="text-[7px] text-neutral-400">Surabaya &bull; 02 Mar</p>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Bottom Nav Simulation */}
                    <div className="pt-2 border-t border-neutral-800 flex justify-around text-[9px] text-neutral-400">
                      <div className="flex flex-col items-center"><Home className="h-3 w-3" /><span>Home</span></div>
                      <div className="flex flex-col items-center text-primary-400 font-bold"><Target className="h-3 w-3" /><span>Fokus</span></div>
                      <div className="flex flex-col items-center"><FolderOpen className="h-3 w-3" /><span>Program</span></div>
                      <div className="flex flex-col items-center"><Users2 className="h-3 w-3" /><span>Tim</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="relative z-20 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-extrabold text-white">@arf.creative</span>
              <span className="text-sm font-semibold text-sky-400">Geser untuk melihat Galeri &amp; Berita &rarr;</span>
            </footer>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SLIDE 5: HASIL DOKUMENTASI & BERITA TERBARU              */}
        {/* ======================================================== */}
        <div
          className={`relative transition-all duration-300 ${
            viewMode === 'single' && currentSlide !== 5 ? 'hidden' : 'block'
          } ${
            zoomMode === 'full'
              ? 'w-[1080px] h-[1350px]'
              : 'w-[540px] h-[675px]'
          }`}
        >
          <div
            id="ig-slide-5"
            className={`w-[1080px] h-[1350px] bg-[#080e21] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-16 select-none origin-top-left relative ${
              zoomMode === 'full' ? 'scale-100 relative' : 'scale-50 absolute top-0 left-0'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-blue-600/25 rounded-full blur-[90px]" />

            <div className="relative z-20 flex items-center justify-between">
              <div className="text-3xl font-black text-white">ARF <span className="text-xs font-bold text-neutral-400 pl-2">Civic Tech</span></div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-extrabold text-neutral-200">SLIDE 05 / 06</div>
            </div>

            <div className="relative z-20 my-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                <Newspaper className="h-3.5 w-3.5" />
                <span>Hasil Rancang Bangun: Kabar &amp; Arsip Visual</span>
              </div>

              <h2 className="text-5xl font-black uppercase text-white leading-tight">
                GALERI AKSI LAPANGAN &amp;<br />
                <span className="text-emerald-400">SIARAN PERS DINAMIKA WARGA</span>
              </h2>

              <p className="text-xl text-neutral-300 leading-relaxed font-sans max-w-3xl">
                Dokumentasi terstruktur membantu publik menelusuri rekam jejak advokasi dari waktu ke waktu, lengkap dengan laporan kajian yang dapat diunduh langsung dalam bentuk PDF.
              </p>

              {/* Browser Window Mockup Showing News & Gallery */}
              <div className="bg-neutral-900/90 border-2 border-neutral-700 rounded-2xl shadow-2xl overflow-hidden mt-6">
                <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">aksara-dialogue.vercel.app/kegiatan/berita</span>
                  <div className="w-8" />
                </div>

                <div className="p-6 bg-neutral-950 space-y-4">
                  {/* News Item 1 */}
                  <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                    <div className="w-24 h-16 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 shrink-0">
                      Rilis Pers
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span className="bg-primary-600/30 text-primary-400 px-1.5 py-0.5 rounded font-bold uppercase">Kebijakan</span>
                        <span>14 Nov 2026</span>
                      </div>
                      <h4 className="text-sm font-serif font-black text-white">Naskah Rekomendasi Keterbukaan Data Anggaran Publik Diserahkan</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1">Hasil audit sosial di 15 kabupaten/kota yang menunjukkan pentingnya digitalisasi informasi anggaran.</p>
                    </div>
                  </div>

                  {/* News Item 2 */}
                  <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                    <div className="w-24 h-16 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 shrink-0">
                      Dokumentasi
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span className="bg-emerald-600/30 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">Konsolidasi</span>
                        <span>10 Nov 2026</span>
                      </div>
                      <h4 className="text-sm font-serif font-black text-white">Ratusan Peserta Hadiri Diskusi Terbuka Refleksi Gerakan Demokrasi</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1">Pertemuan lintas organisasi masyarakat sipil dan mahasiswa membahas langkah advokasi ke depan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="relative z-20 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-extrabold text-white">@arf.creative</span>
              <span className="text-sm font-semibold text-sky-400">Geser untuk melihat Dashboard CMS &rarr;</span>
            </footer>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SLIDE 6: HASIL DASHBOARD CMS ADMIN & OUTRO               */}
        {/* ======================================================== */}
        <div
          className={`relative transition-all duration-300 ${
            viewMode === 'single' && currentSlide !== 6 ? 'hidden' : 'block'
          } ${
            zoomMode === 'full'
              ? 'w-[1080px] h-[1350px]'
              : 'w-[540px] h-[675px]'
          }`}
        >
          <div
            id="ig-slide-6"
            className={`w-[1080px] h-[1350px] bg-[#080e21] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-16 select-none origin-top-left relative ${
              zoomMode === 'full' ? 'scale-100 relative' : 'scale-50 absolute top-0 left-0'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[100px]" />

            <div className="relative z-20 flex items-center justify-between">
              <div className="text-3xl font-black text-white">ARF <span className="text-xs font-bold text-neutral-400 pl-2">Civic Tech</span></div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-extrabold text-neutral-200">SLIDE 06 / 06</div>
            </div>

            <div className="relative z-20 my-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-black uppercase tracking-wider">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Hasil Rancang Bangun: Portal CMS Admin</span>
              </div>

              <h2 className="text-5xl font-black uppercase text-white leading-tight">
                PORTAL CMS MANDIRI &amp;<br />
                <span className="text-purple-400">KEMUDAHAN KELOLA DATA</span>
              </h2>

              {/* Browser Window Mockup Showing Admin CMS Table */}
              <div className="bg-neutral-900/90 border-2 border-neutral-700 rounded-2xl shadow-2xl overflow-hidden mt-4">
                <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">aksara-dialogue.vercel.app/admin/dashboard</span>
                  <div className="w-8" />
                </div>

                <div className="p-5 bg-neutral-950 flex gap-4">
                  {/* Mini Admin Sidebar */}
                  <div className="w-44 bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-2 text-xs">
                    <div className="font-bold text-white flex items-center gap-1.5 pb-2 border-b border-neutral-800">
                      <div className="w-4 h-4 rounded bg-primary-600 flex items-center justify-center text-[10px]">A</div>
                      <span>AKSARA CMS</span>
                    </div>
                    <div className="space-y-1 text-neutral-400 text-[11px]">
                      <div className="p-1 rounded bg-neutral-800 text-white font-bold">Dashboard</div>
                      <div className="p-1">Fokus Gerakan</div>
                      <div className="p-1">Program</div>
                      <div className="p-1">Kabar Berita</div>
                      <div className="p-1">Dokumentasi</div>
                      <div className="p-1 text-primary-400 font-bold">&bull; Anggota Tim</div>
                      <div className="p-1">Pengaturan Web</div>
                    </div>
                  </div>

                  {/* Mini Admin Content Table */}
                  <div className="flex-1 bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Kelola Data Tim (Total 6 Anggota)</span>
                      <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        + Tambah Anggota
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <div className="flex items-center justify-between p-2 bg-neutral-950 rounded border border-neutral-800 text-[10px]">
                        <span className="font-bold text-white">Muhamad Syamsul Maarif</span>
                        <span className="text-neutral-400">Direktur Eksekutif</span>
                        <span className="text-emerald-400">Tayang</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-neutral-950 rounded border border-amber-500/40 text-[10px]">
                        <span className="font-bold text-amber-400">Ahmad Rifa</span>
                        <span className="text-neutral-300">Koordinator IT</span>
                        <span className="text-emerald-400">Tayang</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-neutral-950 rounded border border-neutral-800 text-[10px]">
                        <span className="font-bold text-white">Siti Nurhaliza, M.A.</span>
                        <span className="text-neutral-400">Manajer Riset</span>
                        <span className="text-emerald-400">Tayang</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Concluding CTA Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-neutral-900 to-orange-950 border border-white/15 text-center space-y-3">
                <p className="text-sm font-extrabold uppercase tracking-widest text-sky-400">Kunjungi Platform Resmi:</p>
                <div className="inline-block px-6 py-2 rounded-xl bg-neutral-950 border-2 border-orange-500 font-mono text-xl font-bold text-white shadow-lg">
                  aksara-dialogue.vercel.app
                </div>
                <p className="text-xs text-neutral-400">
                  Dibangun dengan dedikasi untuk transparansi data dan keandalan ruang diskursus publik.
                </p>
              </div>
            </div>

            <footer className="relative z-20 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-extrabold text-white">@arf.creative</span>
              <span className="text-sm font-semibold text-amber-400">Simpan &amp; Bagikan Postingan Ini 🔖</span>
            </footer>
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigator for quick jumps */}
      <footer className="mt-12 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentSlide(num)}
              className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                currentSlide === num
                  ? 'bg-primary-600 text-white scale-110 shadow-lg shadow-primary-600/40 ring-2 ring-primary-400'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="text-xs text-neutral-500 font-sans">
          Tekan tombol panah &larr; &rarr; pada keyboard untuk berpindah slide.
        </p>
      </footer>
    </div>
  )
}
