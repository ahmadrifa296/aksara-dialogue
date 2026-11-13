import { createClient } from '@/lib/supabase/server'
import type {
  About,
  VisiMisi,
  Value,
  FocusArea,
  Program,
  ProgramCategory,
  News,
  Event,
  Album,
  Article,
  Opinion,
  Report,
  TeamMember,
  ContactInfo,
} from '@/types'

// ==========================================
// DUMMY SEED DATA MOCKS
// ==========================================

export const dummyAbout: About = {
  id: '1',
  page_type: 'profile',
  title: 'Tentang Aksara Dialogue',
  content: `
    <p class="lead">Aksara Dialogue adalah wadah independen masyarakat sipil yang berfokus pada penguatan ruang dialog publik, advokasi berbasis riset, dan gerakan kolaboratif untuk mendorong keadilan sosial serta keberlanjutan di Indonesia.</p>
    <p>Didirikan dengan keyakinan bahwa perubahan sosial yang bermakna bermula dari percakapan yang jujur, setara, dan berbasis bukti, Aksara Dialogue memfasilitasi temu pikiran antara pembuat kebijakan, akademisi, aktivis akar rumput, jurnalis, dan generasi muda.</p>
    <h3>Latar Belakang & Filosofi Gerakan</h3>
    <p>Di era disrupsi informasi dan meningkatnya polarisasi sosial, ruang-ruang deliberasi publik yang sehat sering kali terhimpit. Aksara Dialogue hadir untuk merajut kembali dialog yang konstruktif melalui tiga pilar utama:</p>
    <ul>
      <li><strong>Deliberasi Kritis:</strong> Menciptakan ruang dialog yang aman dan terbuka bagi semua perspektif untuk menguji gagasan.</li>
      <li><strong>Advokasi Berbasis Fakta:</strong> Mengolah data lapangan dan riset empiris menjadi rekomendasi kebijakan publik yang terukur.</li>
      <li><strong>Pengorganisasian Kolaboratif:</strong> Menghubungkan komunitas lokal dengan jejaring advokasi nasional untuk memperjuangkan hak-hak warga.</li>
    </ul>
    <h3>Perjalanan & Komitmen</h3>
    <p>Sejak awal berdiri, kami telah menginisiasi lebih dari 40 forum dialog multi-pihak, menerbitkan puluhan kajian kebijakan, serta mendampingi komunitas dalam memperjuangkan hak-hak ruang hidup dan tata kelola pemerintahan yang transparan.</p>
  `,
  image_url: null,
  video_url: null,
  quote: 'Dialog adalah jembatan nurani; tanpa ruang bicara yang setara, keadilan sosial hanyalah retorika.',
  quote_author: 'Dewan Pengarah Aksara Dialogue',
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const dummyVisiMisi: VisiMisi[] = [
  {
    id: '1',
    type: 'visi',
    content: 'Mewujudkan tatanan masyarakat demokratis yang kritis, berkeadilan sosial, dan berdaya melalui ruang dialog deliberatif yang inklusif dan partisipatif.',
    sort_order: 1,
    is_published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    type: 'misi',
    content: 'Menyelenggarakan forum-forum dialog publik berkala yang mempertemukan warga, pakar, dan pembuat regulasi.',
    sort_order: 1,
    is_published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    type: 'misi',
    content: 'Mendorong transparansi, integritas, dan akuntabilitas dalam perumusan kebijakan publik serta pengelolaan anggaran negara.',
    sort_order: 2,
    is_published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    type: 'misi',
    content: 'Memfasilitasi riset aksi dan advokasi berbasis bukti untuk melindungi hak-hak kelompok rentan dan masyarakat marjinal.',
    sort_order: 3,
    is_published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    type: 'misi',
    content: 'Mengembangkan ekosistem literasi kritis, jurnalisme publik, dan pengkaderan generasi muda untuk kepemimpinan masa depan.',
    sort_order: 4,
    is_published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '6',
    type: 'misi',
    content: 'Membangun jejaring solidaritas dan koalisi strategis lintas organisasi masyarakat sipil di tingkat nasional maupun internasional.',
    sort_order: 5,
    is_published: true,
    created_at: '',
    updated_at: '',
  },
]

export const dummyValues: Value[] = [
  {
    id: '1',
    title: 'Integritas & Independensi',
    description: 'Berdiri teguh atas kejujuran intelektual, fakta empiris, dan bebas dari konflik kepentingan politik praktis.',
    icon: 'ShieldCheck',
    image_url: null,
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Deliberasi Inklusif',
    description: 'Menjunjung tinggi kesetaraan setiap suara, membuka ruang bagi kelompok marjinal, dan menghargai keragaman perspektif.',
    icon: 'Users',
    image_url: null,
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Kolaborasi Transformatif',
    description: 'Meyakini bahwa perubahan struktural hanya dapat terwujud melalui kerja sama erat lintas elemen masyarakat.',
    icon: 'Sparkles',
    image_url: null,
    sort_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    title: 'Keberpihakan Keadilan',
    description: 'Konsisten membela hak-hak asasi manusia, keadilan ekologis, dan kesejahteraan bersama.',
    icon: 'Scale',
    image_url: null,
    sort_order: 4,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    title: 'Keberlanjutan Ekologis',
    description: 'Memastikan setiap inisiatif gerakan memperhatikan dampak jangka panjang terhadap bumi dan generasi mendatang.',
    icon: 'Leaf',
    image_url: null,
    sort_order: 5,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

export const dummyFocusAreas: FocusArea[] = [
  {
    id: '1',
    name: 'Keadilan Sosial & HAM',
    slug: 'keadilan-sosial-ham',
    description: 'Mengawal perlindungan hak-hak dasar warga, penguatan kelompok marjinal, serta pemerataan akses keadilan sosial di ruang publik.',
    content: `
      <p>Pilar ini berfokus pada advokasi perlindungan hak-hak asasi warga negara, pengentasan diskriminasi berbasis gender dan latar belakang sosial, serta pendampingan hukum dan sosial bagi komunitas yang rentan termarjinalkan.</p>
    `,
    image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
    icon: 'Users',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    name: 'Demokrasi & Kebijakan',
    slug: 'demokrasi-transparansi-kebijakan',
    description: 'Mendorong reformasi institusional, akuntabilitas anggaran publik, serta partisipasi aktif warga dalam perumusan undang-undang.',
    content: `
      <p>Pilar Demokrasi berfokus pada pengawasan independen terhadap tata kelola pemerintahan, audit sosial terhadap alokasi anggaran publik, dan perluasan ruang partisipasi warga.</p>
    `,
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    icon: 'Building2',
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    name: 'Wilayah Kelola Rakyat',
    slug: 'wilayah-kelola-rakyat',
    description: 'Perlindungan wilayah kelola masyarakat adat, kedaulatan tanah warga, dan keadilan agraria yang berpihak pada komunitas lokal.',
    content: `
      <p>Mengadvokasi pengakuan wilayah adat, penyelesaian konflik agraria struktural, dan pemulihan kedaulatan ekonomi masyarakat atas ruang hidupnya.</p>
    `,
    image_url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
    icon: 'Scale',
    sort_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    name: 'Ekologis & Keadilan Iklim',
    slug: 'ekologis-keadilan-iklim',
    description: 'Advokasi transisi energi yang adil, perlindungan hutan dan pesisir, serta penegakan hukum terhadap kejahatan perusak lingkungan.',
    content: `
      <p>Fokus ini mengawal kebijakan transisi energi bersih yang berkeadilan, perlindungan ekosistem alami dari eksploitasi perusak, dan edukasi krisis iklim.</p>
    `,
    image_url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
    icon: 'TreePine',
    sort_order: 4,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    name: 'Pulihkan Ruang Publik Indonesia',
    slug: 'pulihkan-ruang-publik',
    description: 'Konsolidasi nasional warga dan jejaring masyarakat sipil untuk memulihkan kedaulatan ruang dialog dan tata kelola berkeadilan.',
    content: `
      <p>Gerakan bersama lintas komunitas untuk merebut kembali ruang publik yang bebas dari intimidasi dan berpihak seutuhnya pada kemaslahatan rakyat.</p>
    `,
    image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
    icon: 'Sparkles',
    sort_order: 5,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

export const dummyPrograms: Program[] = [
  {
    id: '1',
    title: 'Forum Dialog Kebijakan Publik Nasional 2026',
    slug: 'dialog-kebijakan-publik-nasional-2026',
    category_id: '1',
    excerpt: 'Forum konsolidasi tahunan yang mempertemukan perwakilan masyarakat sipil, pembuat regulasi, dan pakar independen.',
    content: `
      <p>Forum Dialog Kebijakan Publik Nasional adalah program tahunan unggulan Aksara Dialogue yang mempertemukan berbagai pemangku kepentingan untuk mengkaji arah kebijakan strategis di Indonesia.</p>
      <p>Tahun ini, forum berfokus pada tiga agenda krusial: reformasi regulasi keterbukaan informasi, strategi mitigasi krisis iklim berbasis kearifan lokal, dan penguatan perlindungan sosial bagi pekerja sektor informal.</p>
      <h3>Format Pelaksanaan</h3>
      <p>Kegiatan diselenggarakan secara hybrid (luring di Jakarta dan daring melalui siaran interaktif) yang menghadirkan 500+ peserta dari 34 provinsi.</p>
    `,
    cover_image: null,
    location: 'Jakarta Convention Center & Online Zoom',
    start_date: '2026-09-15',
    end_date: '2026-09-17',
    status: 'published',
    is_featured: true,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', name: 'Advokasi Kebijakan', slug: 'advokasi-kebijakan', description: null, image_url: null, is_active: true, sort_order: 1, created_at: '', updated_at: '' },
  },
  {
    id: '2',
    title: 'Akademi Riset & Advokasi Pemuda',
    slug: 'akademi-riset-advokasi-pemuda',
    category_id: '2',
    excerpt: 'Pelatihan intensif 3 bulan pembekalan metodologi riset partisipatif dan strategi komunikasi publik untuk aktivis muda.',
    content: `
      <p>Program pengembangan kapasitas bagi 50 aktivis muda terpilih dari seluruh Indonesia. Peserta dibekali teknik pengumpulan data lapangan, analisis kebijakan anggaran, dan jurnalisme advokasi.</p>
    `,
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
    category: { id: '2', name: 'Pemberdayaan Pemuda', slug: 'pemberdayaan-pemuda', description: null, image_url: null, is_active: true, sort_order: 2, created_at: '', updated_at: '' },
  },
  {
    id: '3',
    title: 'Inisiatif Pemantauan Keadilan Iklim Pesisir',
    slug: 'inisiatif-pemantauan-keadilan-iklim',
    category_id: '3',
    excerpt: 'Jejaring kolaboratif pemantauan dampak krisis iklim pada komunitas pesisir dan wilayah adat di Indonesia.',
    content: `
      <p>Program pemantauan dan pendokumentasian dampak kenaikan muka air laut terhadap mata pencaharian nelayan tradisional dan masyarakat pesisir di 12 wilayah rawan bencana.</p>
    `,
    cover_image: null,
    location: 'Nasional (12 Titik Wilayah)',
    start_date: '2026-08-01',
    end_date: '2026-11-30',
    status: 'published',
    is_featured: true,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '3', name: 'Gerakan Lingkungan', slug: 'gerakan-lingkungan', description: null, image_url: null, is_active: true, sort_order: 3, created_at: '', updated_at: '' },
  },
]

export const dummyNews: News[] = [
  {
    id: '1',
    title: 'Aksara Dialogue Rilis Rekomendasi Keterbukaan Data Publik 2026',
    slug: 'aksara-dialogue-rilis-rekomendasi-keterbukaan-data-publik-2026',
    excerpt: 'Dokumen rekomendasi kebijakan telah diserahkan secara resmi untuk memperkuat transparansi informasi anggaran daerah.',
    content: `
      <p><strong>Jakarta</strong> — Aksara Dialogue secara resmi menyerahkan naskah rekomendasi kebijakan keterbukaan data anggaran publik kepada kementerian terkait dan perwakilan komisi legislatif.</p>
      <p>Naskah ini disusun berdasarkan hasil audit sosial di 15 kabupaten/kota yang menunjukkan pentingnya digitalisasi informasi anggaran yang mudah diakses dan dipahami oleh warga biasa.</p>
      <p>"Keterbukaan informasi bukan sekadar kewajiban administratif, melainkan hak asasi warga untuk memastikan setiap rupiah uang rakyat digunakan secara tepat sasaran," ungkap Dr. Ahmad Fauzi, Direktur Eksekutif Aksara Dialogue.</p>
    `,
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
    content: `
      <p>Diskusi meja bundar yang diselenggarakan secara daring dan luring di Jakarta dihadiri lebih dari 300 pegiat lingkungan, akademisi, dan perwakilan masyarakat adat pesisir.</p>
      <p>Pertemuan menyepakati pembentukan platform kolaboratif pemantauan proyek transisi energi agar tidak merugikan hak-hak ruang hidup komunitas lokal.</p>
    `,
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
]

export const dummyArticles: Article[] = [
  {
    id: '1',
    title: 'Menata Ulang Ruang Publik di Tengah Disrupsi Informasi',
    slug: 'menata-ulang-ruang-publik-tengah-disrupsi-informasi',
    excerpt: 'Tinjauan kritis mengenai bagaimana polarisasi digital menggerus etika deliberatif dan jalan keluar memulihkannya.',
    content: `
      <p>Ruang publik kontemporer menghadapi paradoks yang belum pernah terjadi sebelumnya. Di satu sisi, teknologi internet membuka pintu seluas-luasnya bagi siapa saja untuk bersuara. Namun di sisi lain, algoritma media sosial yang berorientasi pada sensasionalisme dan amplifikasi emosi kerap memperdalam fragmentasi serta polarisasi sosial.</p>
      <p>Ketika ruang publik direduksi menjadi arena saling serang tanpa kepedulian pada fakta dan nalar budi, proses deliberasi demokratis mengalami pembusukan dari dalam. Bagaimana kita dapat memulihkan kembali etika dialog publik?</p>
      <h3>Tiga Langkah Pemulihan</h3>
      <p>Pertama, penguatan literasi informasi kritis di semua jenjang pendidikan. Kedua, revitalisasi ruang temu fisik independen di tingkat komunitas. Ketiga, transparansi tata kelola algoritma platform digital demi menjaga kesehatan ekosistem informasi bersama.</p>
    `,
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
    content: `
      <p>Pengalaman advokasi di berbagai daerah membuktikan bahwa kemenangan perjuangan hak atas tanah dan wilayah kelola adat tidak pernah ditentukan oleh kehebatan naskah hukum semata, melainkan oleh kekuatan soliditas dan keterlibatan aktif warga di tingkat tapak.</p>
    `,
    thumbnail: null,
    author: 'Rahmat Hidayat, M.Si',
    category_id: '2',
    tags: ['Advokasi', 'Agraria', 'Sosial'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const dummyOpinions: Opinion[] = [
  {
    id: '1',
    title: 'Mengapa Dialog Publik Masih Relevan di Tengah Polarisasi?',
    slug: 'mengapa-dialog-publik-masih-relevan',
    excerpt: 'Opini mengenai pentingnya merawat nalar sehat dan ruang bicara bersama warga.',
    content: `
      <p>Bagi sebagian orang, dialog di tengah polarisasi politik kerap dipandang sebagai tindakan sia-sia. Namun sejarah peradaban mengajarkan bahwa alternatif dari ketiadaan dialog adalah kekerasan simbolik dan kebuntuan sosial.</p>
      <p>Dialog bukan berarti mencari kompromi semu, melainkan keberanian mendengarkan dan saling menguji argumen dengan kepala dingin demi kepentingan publik yang lebih luas.</p>
    `,
    thumbnail: null,
    author: 'Prof. Budi Hartono',
    category_id: '1',
    tags: ['Opini', 'Demokrasi'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const dummyReports: Report[] = [
  {
    id: '1',
    title: 'Laporan Tahunan Advokasi Kebijakan Publik 2025-2026',
    slug: 'laporan-tahunan-advokasi-kebijakan-2025-2026',
    description: 'Kompilasi hasil evaluasi program advokasi, capaian reformasi kebijakan keterbukaan anggaran, dan audit sosial tahunan.',
    cover_image: null,
    file_url: '#',
    file_name: 'Laporan-Tahunan-Aksara-2025-2026.pdf',
    category_id: '1',
    is_published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Kajian Dampak Krisis Iklim terhadap Masyarakat Pesisir',
    slug: 'kajian-dampak-krisis-iklim-masyarakat-pesisir',
    description: 'Naskah kebijakan komprehensif berdasarkan survei lapangan di 12 titik wilayah pesisir Indonesia.',
    cover_image: null,
    file_url: '#',
    file_name: 'Kajian-Krisis-Iklim-Pesisir-2026.pdf',
    category_id: '2',
    is_published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const dummyTeam: TeamMember[] = [
  { id: '1', name: 'Dr. Ahmad Fauzi', position: 'Direktur Eksekutif', bio: 'Pegiat hak asasi manusia dan advokasi kebijakan publik dengan pengalaman lebih dari 15 tahun.', photo: null, email: 'fauzi@aksaradialogue.org', instagram: '@ahmadfauzi', linkedin: 'in/ahmadfauzi', sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Siti Nurhaliza, M.A.', position: 'Manajer Riset & Advokasi', bio: 'Peneliti kebijakan sosial dan spesialis metodologi deliberatif berbasis data lapangan.', photo: null, email: 'siti@aksaradialogue.org', instagram: '@sitinurhaliza', linkedin: 'in/sitinurhaliza', sort_order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: '3', name: 'Rizki Pratama', position: 'Koordinator Gerakan & Komunitas', bio: 'Fasilitator jejaring pemuda dan pengorganisasian forum warga akar rumput.', photo: null, email: 'rizki@aksaradialogue.org', instagram: '@rizkipratama', linkedin: 'in/rizkipratama', sort_order: 3, is_active: true, created_at: '', updated_at: '' },
  { id: '4', name: 'Dewi Anggraini', position: 'Koordinator Komunikasi & Media', bio: 'Spesialis jurnalisme publik, pengelolaan publikasi, dan narasi strategis gerakan.', photo: null, email: 'dewi@aksaradialogue.org', instagram: '@dewianggraini', linkedin: 'in/dewianggraini', sort_order: 4, is_active: true, created_at: '', updated_at: '' },
]

export const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Diskusi Publik: Kebijakan Transisi Energi Berkeadilan',
    slug: 'diskusi-publik-kebijakan-transisi-energi',
    description: '<p>Forum mendiskusikan percepatan transisi energi terbarukan dan dampaknya pada masyarakat...</p>',
    poster: null,
    event_date: '2026-09-20',
    start_time: '13:30',
    end_time: '16:30',
    location: 'Gedung Pertemuan Aksara & Live Zoom',
    speaker: 'Dr. Ahmad Suharto & Prof. Siti Rahayu',
    registration_url: 'https://bit.ly/dialogue-energi-2026',
    status: 'published',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Pelatihan Advokasi Berbasis Data untuk Komunitas',
    slug: 'pelatihan-advokasi-berbasis-data-komunitas',
    description: '<p>Workshop intensif pengolahan data publik untuk pengawalan anggaran daerah...</p>',
    poster: null,
    event_date: '2026-10-05',
    start_time: '09:00',
    end_time: '15:00',
    location: 'Bandung Creative Hub',
    speaker: 'Tim Fasilitator Advokasi Data',
    registration_url: 'https://bit.ly/pelatihan-data-2026',
    status: 'published',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const dummyAlbums: Album[] = [
  {
    id: '1',
    title: 'Forum Dialog Nasional 2026',
    slug: 'forum-dialog-nasional-2026',
    description: 'Dokumentasi lengkap forum dialog nasional yang dihadiri lebih dari 500 perwakilan komunitas.',
    cover_image: null,
    event_date: '2026-08-15',
    location: 'Jakarta Convention Center',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photo_count: 8,
  },
  {
    id: '2',
    title: 'Konsolidasi & Pelatihan Riset Aksi',
    slug: 'konsolidasi-pelatihan-riset-aksi',
    description: 'Foto kegiatan workshop pelatihan metodologi advokasi pemuda di Yogyakarta.',
    cover_image: null,
    event_date: '2026-07-20',
    location: 'Yogyakarta',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photo_count: 5,
  },
]

export async function getMergedRecords<T>(table: string, defaultRecords: T[]): Promise<T[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabase = !!(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your_supabase_url_here') &&
    supabaseAnonKey &&
    !supabaseAnonKey.includes('your_supabase_anon_key_here')
  )

  // 1. Check Supabase first if connected
  if (isSupabase) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from(table).select('*')
      if (!error && data && data.length > 0) return data as unknown as T[]
    } catch {}
  }

  // 2. Fallback to local persistent store
  try {
    const { getLocalDb } = await import('@/lib/local-store')
    const db = getLocalDb()
    if (db.records && db.records[table] && db.records[table].length > 0) {
      return db.records[table] as unknown as T[]
    }
  } catch {}

  return defaultRecords
}
