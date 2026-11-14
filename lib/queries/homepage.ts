import { getDbClient } from '@/lib/supabase/server'
import { dummyEvents } from '@/lib/queries/content'
import type {
  HomepageSection,
  FocusArea,
  Program,
  News,
  Article,
  GalleryPhoto,
  Album,
  About,
  Value,
  Event,
} from '@/types'

export interface HomepageData {
  sections: Record<string, HomepageSection>
  about: About | null
  values: Value[]
  focusAreas: FocusArea[]
  programs: Program[]
  news: News[]
  events: Event[]
  articles?: Article[]
  gallery: (GalleryPhoto & { album_title?: string })[]
}

const defaultSections: Record<string, HomepageSection> = {
  hero: {
    id: 'hero',
    section_key: 'hero',
    title: 'Suara Publik. Ruang Dialog.',
    subtitle: 'GERAKAN SOSIAL & ADVOKASI KEBIJAKAN',
    description:
      'Membangun ruang dialog yang kritis, inklusif, dan partisipatif untuk mendorong perubahan sosial yang berkeadilan dan bermakna bagi seluruh lapisan masyarakat.',
    image_url: null,
    button_text: 'Jelajahi Program',
    button_url: '/program',
    button_secondary_text: 'Tentang Kami',
    button_secondary_url: '/tentang-kami/profil',
    sort_order: 1,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  },
  about: {
    id: 'about',
    section_key: 'about',
    title: 'Tentang Aksara Dialogue',
    subtitle: 'TENTANG KAMI',
    description:
      'Aksara Dialogue hadir sebagai katalis dialog publik yang mempertemukan gagasan kritis dan aksi nyata demi masa depan yang lebih inklusif.',
    image_url: null,
    button_text: 'Pelajari Profil Lengkap',
    button_url: '/tentang-kami/profil',
    button_secondary_text: null,
    button_secondary_url: null,
    sort_order: 2,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  },
  focus: {
    id: 'focus',
    section_key: 'focus',
    title: 'Pilar Fokus Gerakan',
    subtitle: 'FOKUS KAMI',
    description:
      'Inisiatif advokasi dan ruang diskursus kami terpusat pada isu-isu krusial yang berdampak langsung pada kehidupan berbangsa dan bermasyarakat.',
    image_url: null,
    button_text: 'Lihat Seluruh Fokus',
    button_url: '/fokus-gerakan',
    button_secondary_text: null,
    button_secondary_url: null,
    sort_order: 3,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  },
  programs: {
    id: 'programs',
    section_key: 'programs',
    title: 'Program Unggulan',
    subtitle: 'PROGRAM KAMI',
    description:
      'Rangkaian program berkelanjutan yang dirancang secara kolaboratif untuk memberdayakan komunitas dan mengawal kebijakan publik.',
    image_url: null,
    button_text: 'Lihat Semua Program',
    button_url: '/program',
    button_secondary_text: null,
    button_secondary_url: null,
    sort_order: 4,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  },
  news: {
    id: 'news',
    section_key: 'news',
    title: 'Kegiatan & Kabar Terbaru',
    subtitle: 'BERITA & AKTIVITAS',
    description:
      'Dinamika terkini seputar forum diskusi, workshop publik, riset lapangan, dan aksi advokasi yang kami jalankan.',
    image_url: null,
    button_text: 'Lihat Semua Berita',
    button_url: '/kegiatan/berita',
    button_secondary_text: null,
    button_secondary_url: null,
    sort_order: 5,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  },
  gallery: {
    id: 'gallery',
    section_key: 'gallery',
    title: 'Dokumentasi Visual',
    subtitle: 'GALERI KEGIATAN',
    description:
      'Potret momen penting dari ruang diskusi, temu wicara, dan konsolidasi gerakan bersama masyarakat.',
    image_url: null,
    button_text: 'Lihat Semua Album',
    button_url: '/kegiatan/dokumentasi',
    button_secondary_text: null,
    button_secondary_url: null,
    sort_order: 6,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  },
  cta: {
    id: 'cta',
    section_key: 'cta',
    title: 'Mari Terlibat Bersama Kami',
    subtitle: 'GERAKAN KOLABORATIF',
    description:
      'Bergabunglah dalam ikhtiar memperkuat ruang publik yang berkeadilan. Gagasan dan partisipasi Anda adalah energi perubahan.',
    image_url: null,
    button_text: 'Hubungi Kami',
    button_url: '/kontak',
    button_secondary_text: 'Pelajari Program',
    button_secondary_url: '/program',
    sort_order: 7,
    is_visible: true,
    metadata: null,
    created_at: '',
    updated_at: '',
  },
}

const defaultFocusAreas: FocusArea[] = [
  {
    id: '57826379-5902-4f35-9afb-708c82237f2b',
    name: 'Keadilan Sosial & Hak Asasi Manusia',
    slug: 'keadilan-sosial-ham',
    description:
      'Mengawal perlindungan hak asasi warga, penguatan kelompok marjinal, serta pemerataan akses keadilan sosial di ruang publik.',
    content: null,
    image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1200&auto=format&fit=crop&q=80',
    icon: 'Users',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'c5a02711-07bf-4cc4-b8ed-92a83d0d0929',
    name: 'Demokrasi & Transparansi Kebijakan',
    slug: 'demokrasi-transparansi-kebijakan',
    description:
      'Mendorong akuntabilitas anggaran publik, reformasi tata kelola pemerintahan, serta perluasan ruang partisipasi warga.',
    content: null,
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
    icon: 'Building2',
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'f734de11-b25d-4f1e-9d15-83828aaa0307',
    name: 'Kelestarian Ekologis & Keadilan Iklim',
    slug: 'kelestarian-ekologis-keadilan-iklim',
    description:
      'Advokasi transisi energi yang berkeadilan, perlindungan wilayah kelola rakyat, serta kepastian hukum terhadap kelestarian alam.',
    content: null,
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
    icon: 'TreePine',
    sort_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'f9fc4a9b-6fdc-4c25-8f72-e12b8da73e77',
    name: 'Literasi Kritis & Kebebasan Berekspresi',
    slug: 'literasi-kritis-kebebasan-berekspresi',
    description:
      'Melindungi hak bersuara di ruang digital, jurnalisme warga yang berintegritas, serta peningkatan literasi informasi publik.',
    content: null,
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
    icon: 'BookOpen',
    sort_order: 4,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

const defaultPrograms: Program[] = [
  {
    id: '1',
    title: 'Dialog Kebijakan Publik Nasional 2026',
    slug: 'dialog-kebijakan-publik-nasional-2026',
    category_id: '1',
    excerpt: 'Forum konsolidasi tahunan yang mempertemukan perwakilan masyarakat sipil, pembuat regulasi, dan pakar independen.',
    content: '<p>Forum ini bertujuan mengevaluasi regulasi nasional terkini...</p>',
    cover_image: null,
    location: 'Jakarta & Hybrid Online',
    start_date: '2026-09-15',
    end_date: '2026-09-17',
    status: 'published',
    is_featured: true,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '1',
      name: 'Advokasi Kebijakan',
      slug: 'advokasi-kebijakan',
      description: null,
      image_url: null,
      is_active: true,
      sort_order: 1,
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: '2',
    title: 'Akademi Riset & Advokasi Pemuda',
    slug: 'akademi-riset-advokasi-pemuda',
    category_id: '2',
    excerpt: 'Pelatihan intensif 3 bulan pembekalan metodologi riset partisipatif dan strategi komunikasi publik untuk aktivis muda.',
    content: '<p>Program pengembangan kapasitas riset untuk advokasi berbasis data...</p>',
    cover_image: null,
    location: 'Bandung & Yogyakarta',
    start_date: '2026-10-01',
    end_date: '2026-12-30',
    status: 'published',
    is_featured: true,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '2',
      name: 'Pemberdayaan Pemuda',
      slug: 'pemberdayaan-pemuda',
      description: null,
      image_url: null,
      is_active: true,
      sort_order: 2,
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: '3',
    title: 'Inisiatif Pemantauan Keadilan Iklim',
    slug: 'inisiatif-pemantauan-keadilan-iklim',
    category_id: '3',
    excerpt: 'Jejaring kolaboratif pemantauan dampak krisis iklim pada komunitas pesisir dan wilayah adat di Indonesia.',
    content: '<p>Mengumpulkan data lapangan dan menyusun laporan advokasi berkala...</p>',
    cover_image: null,
    location: 'Nasional (12 Titik Wilayah)',
    start_date: '2026-08-01',
    end_date: null,
    status: 'published',
    is_featured: true,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '3',
      name: 'Gerakan Lingkungan',
      slug: 'gerakan-lingkungan',
      description: null,
      image_url: null,
      is_active: true,
      sort_order: 3,
      created_at: '',
      updated_at: '',
    },
  },
]

const defaultNews: News[] = [
  {
    id: '1',
    title: 'Aksara Dialogue Rilis Rekomendasi Keterbukaan Data Publik 2026',
    slug: 'aksara-dialogue-rilis-rekomendasi-keterbukaan-data-publik-2026',
    excerpt: 'Dokumen rekomendasi kebijakan telah diserahkan secara resmi untuk memperkuat transparansi informasi anggaran daerah.',
    content: '<p>Jakarta, Aksara Dialogue hari ini meluncurkan naskah rekomendasi kebijakan...</p>',
    thumbnail: null,
    author: 'Tim Komunikasi Aksara',
    category_id: '1',
    tags: ['Transparansi', 'Advokasi', 'Kebijakan'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', name: 'Rilis Pers', slug: 'rilis-pers', is_active: true, sort_order: 1, created_at: '' },
  },
  {
    id: '2',
    title: 'Ratusan Peserta Hadiri Diskusi Meja Bundar: Masa Depan Keadilan Iklim',
    slug: 'ratusan-peserta-hadiri-diskusi-meja-bundar-keadilan-iklim',
    excerpt: 'Pertemuan ini menghasilkan piagam kesepahaman lintas organisasi masyarakat sipil untuk mitigasi bencana ekologis.',
    content: '<p>Diskusi meja bundar berlangsung dinamis dengan kehadiran akademisi dan pegiat HAM...</p>',
    thumbnail: null,
    author: 'Redaksi Dialogue',
    category_id: '2',
    tags: ['Iklim', 'Diskusi', 'Komunitas'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '2', name: 'Liputan Kegiatan', slug: 'liputan-kegiatan', is_active: true, sort_order: 2, created_at: '' },
  },
  {
    id: '3',
    title: 'Peluncuran Modul Advokasi Hak Digital bagi Komunitas Akar Rumput',
    slug: 'peluncuran-modul-advokasi-hak-digital-komunitas',
    excerpt: 'Modul praktis terbuka yang dapat diunduh bebas untuk melindungi kebebasan berpendapat dan keamanan data warga.',
    content: '<p>Modul ini dirancang agar mudah dipahami oleh kelompok pendamping warga...</p>',
    thumbnail: null,
    author: 'Divisi Hak Digital',
    category_id: '3',
    tags: ['Hak Digital', 'Edukasi', 'Modul'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '3', name: 'Publikasi', slug: 'publikasi', is_active: true, sort_order: 3, created_at: '' },
  },
]

const defaultArticles: Article[] = [
  {
    id: '1',
    title: 'Menata Ulang Ruang Publik di Tengah Disrupsi Informasi',
    slug: 'menata-ulang-ruang-publik-tengah-disrupsi-informasi',
    excerpt: 'Tinjauan kritis mengenai bagaimana polarisasi digital menggerus etika deliberatif dan jalan keluar memulihkannya.',
    content: '<p>Ruang publik kontemporer membutuhkan ruang mediasi yang independen...</p>',
    thumbnail: null,
    author: 'Dr. Maya Indira',
    category_id: '1',
    tags: ['Etika Publik', 'Demokrasi'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Kekuatan Gerakan Kolektif: Pelajaran dari Advokasi Wilayah Kelola Rakyat',
    slug: 'kekuatan-gerakan-kolektif-advokasi-wilayah-kelola',
    excerpt: 'Analisis empiris atas keberhasilan kolaborasi masyarakat adat dan pendamping hukum dalam memperjuangkan hak ruang hidup.',
    content: '<p>Keberhasilan advokasi struktural terletak pada konsistensi pengorganisasian akar rumput...</p>',
    thumbnail: null,
    author: 'Rahmat Hidayat, M.Si',
    category_id: '2',
    tags: ['Advokasi', 'Agraria', 'Sosial'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Transparansi Fiskal: Mengapa Partisipasi Anggaran Warga Menentukan Kualitas Hidup',
    slug: 'transparansi-fiskal-partisipasi-anggaran-warga',
    excerpt: 'Mengapa audit sosial dan musyawarah perencanaan partisipatif menjadi benteng utama pencegahan kebocoran anggaran publik.',
    content: '<p>Anggaran adalah manifestasi komitmen moral dan politik suatu pemerintahan...</p>',
    thumbnail: null,
    author: 'Sari Dewi Kusuma',
    category_id: '3',
    tags: ['Transparansi', 'Fiskal', 'Kebijakan'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const defaultValues: Value[] = [
  { id: '1', title: 'Integritas & Independensi', description: 'Berdiri kokoh atas fakta, riset mendalam, dan keberpihakan tanpa kompromi pada kepentingan publik.', icon: 'ShieldCheck', image_url: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '2', title: 'Deliberasi Inklusif', description: 'Membuka pintu dialog setara bagi seluruh entitas masyarakat tanpa diskriminasi latar belakang.', icon: 'Users2', image_url: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: '3', title: 'Kolaborasi Transformasi', description: 'Meyakini sinergi lintas disiplin dan lintas generasi sebagai motor utama perubahan sosial yang lestari.', icon: 'Sparkles', image_url: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
]

export async function getHomepageData(): Promise<HomepageData> {
  const result: HomepageData = {
    sections: { ...defaultSections },
    about: {
      id: '1',
      page_type: 'profile',
      title: 'Aksara Dialogue: Ruang Temu Gagasan & Gerakan',
      content:
        '<p>Aksara Dialogue didirikan sebagai respons atas mendesaknya kebutuhan wadah diskursus yang berbobot, independen, dan berorientasi pada aksi nyata di Indonesia. Kami mempertemukan peneliti, jurnalis, aktivis, serta perwakilan warga untuk mengurai permasalahan struktural dan merumuskan solusi berkeadilan.</p>',
      image_url: null,
      video_url: null,
      quote: 'Dialog adalah jembatan nurani; tanpa ruang bicara yang setara, keadilan sosial hanyalah retorika.',
      quote_author: 'Dewan Pendiri Aksara Dialogue',
      is_published: true,
      created_at: '',
      updated_at: '',
    },
    values: defaultValues,
    focusAreas: defaultFocusAreas,
    programs: defaultPrograms,
    news: defaultNews,
    events: dummyEvents,
    articles: defaultArticles,
    gallery: [
      { id: '1', album_id: '1', image_url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&auto=format&fit=crop&q=80', caption: 'Forum Konsolidasi Kebijakan Publik Nasional 2026', sort_order: 1, is_featured: true, created_at: '', album_title: 'Forum Nasional 2026' },
      { id: '2', album_id: '1', image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80', caption: 'Temu Wicara Warga & Komunitas Akar Rumput', sort_order: 2, is_featured: true, created_at: '', album_title: 'Dialog Warga' },
      { id: '3', album_id: '2', image_url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop&q=80', caption: 'Workshop Advokasi Hak Digital dan Literasi Kritis', sort_order: 3, is_featured: true, created_at: '', album_title: 'Pelatihan 2026' },
      { id: '4', album_id: '2', image_url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80', caption: 'Riset Lapangan Bersama Komunitas Pesisir', sort_order: 4, is_featured: true, created_at: '', album_title: 'Riset Ekologis' },
    ],
  }

  // 1. Check local persistent store first
  try {
    const { getLocalDb } = await import('@/lib/local-store')
    const db = getLocalDb()
    if (db.records) {
      if (db.records['homepage_sections'] && db.records['homepage_sections'].length > 0) {
        db.records['homepage_sections'].forEach((sec) => {
          const s = sec as unknown as HomepageSection
          if (s.section_key) {
            result.sections[s.section_key] = {
              ...(result.sections[s.section_key] || {}),
              ...s,
            }
          }
        })
      }
      if (db.records['values'] && db.records['values'].length > 0) {
        result.values = db.records['values'] as unknown as Value[]
      }
      if (db.records['focus_areas'] && db.records['focus_areas'].length > 0) {
        result.focusAreas = db.records['focus_areas'] as unknown as FocusArea[]
      }
      if (db.records['programs'] && db.records['programs'].length > 0) {
        const cats = (db.records['program_categories'] || []) as unknown as { id: string; name: string }[]
        result.programs = (db.records['programs'] as unknown as Program[]).map((p) => {
          const cat = cats.find((c) => c.id === p.category_id)
          return cat ? { ...p, category: { id: cat.id, name: cat.name, slug: '', description: null, image_url: null, is_active: true, sort_order: 1, created_at: '', updated_at: '' } } : p
        })
      }
      if (db.records['news'] && db.records['news'].length > 0) {
        const cats = (db.records['news_categories'] || []) as unknown as { id: string; name: string }[]
        result.news = (db.records['news'] as unknown as News[]).map((n) => {
          const cat = cats.find((c) => c.id === n.category_id)
          return cat ? { ...n, category: { id: cat.id, name: cat.name, slug: '', is_active: true, sort_order: 1, created_at: '' } } : n
        })
      }
      if (db.records['events'] && db.records['events'].length > 0) {
        result.events = db.records['events'] as unknown as Event[]
      }
      if (db.records['about'] && db.records['about'].length > 0) {
        const prof = db.records['about'].find((a) => (a as unknown as About).page_type === 'profile')
        if (prof) result.about = prof as unknown as About
      }
      if (db.records['albums'] && db.records['albums'].length > 0) {
        const publishedAlbums = (db.records['albums'] as unknown as Album[]).filter((a) => a.is_published !== false)
        if (publishedAlbums.length > 0) {
          result.gallery = publishedAlbums.map((alb, i) => ({
            id: alb.id || String(i + 1),
            album_id: alb.id || '1',
            image_url: alb.cover_image || result.gallery[i % result.gallery.length]?.image_url || '',
            caption: alb.description || alb.title,
            sort_order: i + 1,
            is_featured: true,
            created_at: alb.created_at || '',
            album_title: alb.title,
          }))
        }
      }
    }
  } catch { }

  // 2. Fetch from Supabase if connected
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
      return result
    }

    const supabase = await getDbClient()

    // Fetch Sections
    const { data: sectionsData } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    if (sectionsData && sectionsData.length > 0) {
      sectionsData.forEach((sec) => {
        result.sections[sec.section_key] = sec
      })
    }

    // Fetch Focus Areas
    const { data: focusData } = await supabase
      .from('focus_areas')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(6)
    if (focusData && focusData.length > 0) result.focusAreas = focusData

    // Fetch Featured Programs
    const { data: programsData } = await supabase
      .from('programs')
      .select('*, category:program_categories(*)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(3)
    if (programsData && programsData.length > 0) result.programs = programsData

    // Fetch Latest News
    const { data: newsData } = await supabase
      .from('news')
      .select('*, category:news_categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)
    if (newsData && newsData.length > 0) result.news = newsData

    // Fetch Latest Articles
    const { data: articlesData } = await supabase
      .from('articles')
      .select('*, category:publication_categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)
    if (articlesData && articlesData.length > 0) result.articles = articlesData

    // Fetch About Profile
    const { data: aboutData } = await supabase
      .from('about')
      .select('*')
      .eq('page_type', 'profile')
      .eq('is_published', true)
      .single()
    if (aboutData) result.about = aboutData

    // Fetch Values
    const { data: valuesData } = await supabase
      .from('values')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    if (valuesData && valuesData.length > 0) result.values = valuesData

    // Fetch Events
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('event_date', { ascending: true })
      .limit(3)
    if (eventsData && eventsData.length > 0) result.events = eventsData

    // Fetch Albums / Gallery from Supabase
    let albumsQuery = await supabase
      .from('albums')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(8)
    if (albumsQuery.error) {
      albumsQuery = await supabase.from('albums').select('*').eq('is_published', true).limit(8)
    }

    if (!albumsQuery.error && albumsQuery.data && albumsQuery.data.length > 0) {
      result.gallery = albumsQuery.data.map((alb, i) => ({
        id: alb.id || String(i + 1),
        album_id: alb.id || '1',
        image_url: alb.cover_image || '',
        caption: alb.description || alb.title,
        sort_order: i + 1,
        is_featured: true,
        created_at: alb.event_date || alb.created_at || '',
        album_title: alb.title,
      }))
    }

    return result
  } catch {
    return result
  }
}
