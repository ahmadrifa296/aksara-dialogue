-- ==========================================
-- AKSARA DIALOGUE : Seed Data
-- 005: Sample/seed data for initial testing
-- NOTE: All seed data can be deleted through CMS
-- ==========================================

-- Site Settings
INSERT INTO site_settings (site_name, site_description, copyright)
VALUES (
  'Aksara Dialogue',
  'Organisasi yang berfokus pada ruang dialog dan gerakan sosial untuk perubahan yang bermakna.',
  '© 2026 Aksara Dialogue. All rights reserved.'
);

-- Footer Settings
INSERT INTO footer_settings (description, address, email, copyright)
VALUES (
  'Aksara Dialogue adalah organisasi yang berfokus pada ruang dialog dan gerakan sosial untuk perubahan yang bermakna.',
  'Jl. Dialog No. 1, Jakarta Selatan, Indonesia',
  'info@aksaradialogue.org',
  '© 2026 Aksara Dialogue. All rights reserved.'
);

-- Contact Info
INSERT INTO contact_info (email, phone, whatsapp, address)
VALUES (
  'info@aksaradialogue.org',
  '+62 21 1234 5678',
  '+62 812 3456 7890',
  'Jl. Dialog No. 1, Jakarta Selatan, Indonesia 12345'
);

-- Social Links
INSERT INTO social_links (platform, url, sort_order) VALUES
  ('instagram', 'https://instagram.com/aksaradialogue', 1),
  ('facebook', 'https://facebook.com/aksaradialogue', 2),
  ('youtube', 'https://youtube.com/@aksaradialogue', 3),
  ('twitter', 'https://twitter.com/aksaradialogue', 4),
  ('linkedin', 'https://linkedin.com/company/aksaradialogue', 5);

-- Navigation
INSERT INTO navigation (title, url, sort_order) VALUES
  ('Home', '/', 1);

INSERT INTO navigation (title, url, sort_order) VALUES
  ('Tentang Kami', '/tentang-kami/profil', 2);

-- Get the Tentang Kami parent ID
DO $$
DECLARE
  tentang_id UUID;
  kegiatan_id UUID;
  publikasi_id UUID;
BEGIN
  SELECT id INTO tentang_id FROM navigation WHERE title = 'Tentang Kami';

  INSERT INTO navigation (title, url, parent_id, sort_order) VALUES
    ('Profil', '/tentang-kami/profil', tentang_id, 1),
    ('Visi & Misi', '/tentang-kami/visi-misi', tentang_id, 2),
    ('Nilai-Nilai', '/tentang-kami/nilai-nilai', tentang_id, 3);

  INSERT INTO navigation (title, url, sort_order) VALUES ('Fokus Gerakan', '/fokus-gerakan', 3);
  INSERT INTO navigation (title, url, sort_order) VALUES ('Program', '/program', 4);

  INSERT INTO navigation (title, url, sort_order) VALUES ('Kegiatan', '/kegiatan/berita', 5);
  SELECT id INTO kegiatan_id FROM navigation WHERE title = 'Kegiatan';
  INSERT INTO navigation (title, url, parent_id, sort_order) VALUES
    ('Berita', '/kegiatan/berita', kegiatan_id, 1),
    ('Dokumentasi', '/kegiatan/dokumentasi', kegiatan_id, 2),
    ('Agenda', '/kegiatan/agenda', kegiatan_id, 3);

  INSERT INTO navigation (title, url, sort_order) VALUES ('Publikasi', '/publikasi/artikel', 6);
  SELECT id INTO publikasi_id FROM navigation WHERE title = 'Publikasi';
  INSERT INTO navigation (title, url, parent_id, sort_order) VALUES
    ('Artikel', '/publikasi/artikel', publikasi_id, 1),
    ('Opini', '/publikasi/opini', publikasi_id, 2),
    ('Laporan', '/publikasi/laporan', publikasi_id, 3);

  INSERT INTO navigation (title, url, sort_order) VALUES ('Tim', '/tim', 7);
  INSERT INTO navigation (title, url, sort_order) VALUES ('Kontak', '/kontak', 8);
END;
$$;

-- Homepage Sections
INSERT INTO homepage_sections (section_key, title, subtitle, description, button_text, button_url, sort_order, is_visible) VALUES
  ('hero', 'Suara Publik. Ruang Dialog.', 'Aksara Dialogue', 'Membangun ruang dialog yang inklusif untuk perubahan sosial yang bermakna melalui gerakan kolaboratif dan advokasi publik.', 'Jelajahi Program', '/program', 1, true),
  ('about', 'Tentang Kami', 'Siapa Kami', 'Aksara Dialogue adalah organisasi yang berfokus pada pembangunan ruang dialog publik, advokasi sosial, dan gerakan kolaboratif untuk perubahan yang bermakna.', 'Selengkapnya', '/tentang-kami/profil', 2, true),
  ('focus', 'Fokus Gerakan', 'Area Fokus', 'Kami bergerak di berbagai bidang untuk menciptakan dampak positif bagi masyarakat.', NULL, NULL, 3, true),
  ('programs', 'Program Unggulan', 'Program Kami', 'Program-program yang dirancang untuk menciptakan dampak nyata di masyarakat.', 'Lihat Semua Program', '/program', 4, true),
  ('news', 'Kegiatan Terbaru', 'Berita & Aktivitas', 'Ikuti perkembangan terbaru dari kegiatan dan program kami.', 'Lihat Semua Berita', '/kegiatan/berita', 5, true),
  ('articles', 'Artikel Terbaru', 'Publikasi', 'Pemikiran dan analisis dari tim kami tentang isu-isu terkini.', 'Lihat Semua Artikel', '/publikasi/artikel', 6, true),
  ('gallery', 'Dokumentasi', 'Galeri Kegiatan', 'Dokumentasi visual dari berbagai kegiatan dan program kami.', 'Lihat Semua', '/kegiatan/dokumentasi', 7, true),
  ('cta', 'Bergabung Bersama Kami', NULL, 'Mari bersama-sama membangun ruang dialog yang inklusif dan gerakan sosial yang bermakna.', 'Hubungi Kami', '/kontak', 8, true);

-- About (Profile)
INSERT INTO about (page_type, title, content, quote, quote_author) VALUES
  ('profile', 'Tentang Aksara Dialogue',
   '<p>Aksara Dialogue adalah organisasi independen yang berfokus pada pembangunan ruang dialog publik dan gerakan sosial. Didirikan dengan keyakinan bahwa perubahan bermakna dimulai dari dialog yang inklusif dan partisipasi aktif masyarakat.</p><p>Kami percaya bahwa setiap suara memiliki nilai dan setiap perspektif layak untuk didengar. Melalui berbagai program dan inisiatif, kami berusaha menciptakan ruang di mana ide-ide dapat bertemu, berdiskusi, dan bertransformasi menjadi aksi nyata.</p>',
   'Perubahan dimulai dari dialog.',
   'Aksara Dialogue');

-- Visi & Misi
INSERT INTO visi_misi (type, content, sort_order) VALUES
  ('visi', 'Mewujudkan masyarakat yang kritis, partisipatif, dan berkeadilan melalui dialog publik dan gerakan sosial yang bermakna.', 1),
  ('misi', 'Membangun ruang dialog yang inklusif dan aman bagi seluruh lapisan masyarakat.', 1),
  ('misi', 'Mendorong partisipasi publik dalam proses pengambilan keputusan.', 2),
  ('misi', 'Mengadvokasi kebijakan yang berkeadilan sosial dan lingkungan.', 3),
  ('misi', 'Memfasilitasi gerakan kolaboratif untuk perubahan sosial.', 4),
  ('misi', 'Memproduksi dan menyebarluaskan pengetahuan melalui riset dan publikasi.', 5);

-- Values (Nilai-Nilai)
INSERT INTO values (title, description, icon, sort_order) VALUES
  ('Inklusivitas', 'Kami percaya bahwa setiap suara memiliki nilai. Ruang dialog kami terbuka untuk semua.', 'Users', 1),
  ('Keberanian', 'Kami berani mengangkat isu-isu kritis dan menantang status quo untuk perubahan.', 'Shield', 2),
  ('Kolaborasi', 'Perubahan terjadi ketika kita bekerja bersama. Kami membangun jejaring dan kemitraan.', 'Handshake', 3),
  ('Integritas', 'Transparansi dan akuntabilitas adalah fondasi dari setiap langkah kami.', 'Heart', 4),
  ('Keberlanjutan', 'Kami berkomitmen pada dampak jangka panjang, bukan solusi instan.', 'Leaf', 5);

-- Focus Areas
INSERT INTO focus_areas (name, slug, description, icon, sort_order) VALUES
  ('Sosial', 'sosial', 'Membangun kesadaran dan partisipasi masyarakat dalam isu-isu sosial yang mempengaruhi kehidupan sehari-hari.', 'Heart', 1),
  ('Politik', 'politik', 'Mendorong transparansi, akuntabilitas, dan partisipasi publik dalam proses politik dan kebijakan.', 'Building2', 2),
  ('Lingkungan', 'lingkungan', 'Mengadvokasi kebijakan lingkungan yang berkelanjutan dan mendorong kesadaran ekologis.', 'TreePine', 3);

-- Program Categories
INSERT INTO program_categories (name, slug, description, sort_order) VALUES
  ('Program Sosial', 'program-sosial', 'Program-program yang berfokus pada isu-isu sosial masyarakat.', 1),
  ('Program Lingkungan', 'program-lingkungan', 'Program-program yang berfokus pada pelestarian lingkungan.', 2),
  ('Program Advokasi', 'program-advokasi', 'Program-program advokasi kebijakan publik.', 3);

-- Programs
INSERT INTO programs (title, slug, category_id, excerpt, content, status, is_featured, is_published, published_at) VALUES
  ('Dialog Publik: Masa Depan Pendidikan', 'dialog-publik-masa-depan-pendidikan',
   (SELECT id FROM program_categories WHERE slug = 'program-sosial'),
   'Forum dialog terbuka membahas tantangan dan peluang pendidikan di Indonesia.',
   '<p>Dialog Publik: Masa Depan Pendidikan adalah program unggulan Aksara Dialogue yang menghadirkan berbagai pemangku kepentingan untuk mendiskusikan isu-isu kritis dalam dunia pendidikan Indonesia.</p><p>Program ini bertujuan untuk mengidentifikasi tantangan utama, berbagi praktik terbaik, dan merumuskan rekomendasi kebijakan yang dapat meningkatkan kualitas pendidikan.</p>',
   'published', true, true, now()),
  ('Sekolah Lingkungan Hidup', 'sekolah-lingkungan-hidup',
   (SELECT id FROM program_categories WHERE slug = 'program-lingkungan'),
   'Program edukasi lingkungan untuk generasi muda.',
   '<p>Sekolah Lingkungan Hidup adalah program edukasi yang dirancang untuk meningkatkan kesadaran lingkungan di kalangan generasi muda. Program ini menggabungkan pembelajaran di kelas dengan kegiatan lapangan.</p>',
   'published', true, true, now()),
  ('Advokasi Kebijakan Publik', 'advokasi-kebijakan-publik',
   (SELECT id FROM program_categories WHERE slug = 'program-advokasi'),
   'Mendorong kebijakan publik yang lebih adil dan transparan.',
   '<p>Program Advokasi Kebijakan Publik bertujuan untuk memastikan bahwa suara masyarakat didengar dalam proses pembuatan kebijakan. Kami bekerja sama dengan berbagai organisasi dan lembaga untuk mengawal kebijakan.</p>',
   'published', true, true, now());

-- News Categories
INSERT INTO news_categories (name, slug, sort_order) VALUES
  ('Kegiatan', 'kegiatan', 1),
  ('Pengumuman', 'pengumuman', 2),
  ('Liputan', 'liputan', 3);

-- News
INSERT INTO news (title, slug, excerpt, content, author, category_id, status, published_at) VALUES
  ('Aksara Dialogue Gelar Forum Dialog Nasional', 'aksara-dialogue-gelar-forum-dialog-nasional',
   'Forum dialog nasional berhasil menghadirkan 500 peserta dari berbagai latar belakang.',
   '<p>Aksara Dialogue berhasil menyelenggarakan Forum Dialog Nasional yang dihadiri oleh 500 peserta dari berbagai latar belakang. Forum ini membahas isu-isu strategis terkait pembangunan sosial dan partisipasi publik.</p><p>Berbagai rekomendasi dihasilkan dari forum ini, termasuk perlunya peningkatan ruang dialog di tingkat komunitas dan penguatan mekanisme partisipasi publik dalam kebijakan.</p>',
   'Tim Redaksi', (SELECT id FROM news_categories WHERE slug = 'kegiatan'),
   'published', now() - interval '2 days'),
  ('Kemitraan Baru untuk Program Lingkungan', 'kemitraan-baru-program-lingkungan',
   'Aksara Dialogue menjalin kemitraan baru untuk memperluas program lingkungan.',
   '<p>Dalam upaya memperluas dampak program lingkungan, Aksara Dialogue menjalin kemitraan strategis dengan beberapa organisasi lingkungan nasional dan internasional.</p>',
   'Tim Redaksi', (SELECT id FROM news_categories WHERE slug = 'pengumuman'),
   'published', now() - interval '5 days'),
  ('Laporan Kegiatan: Workshop Jurnalisme Warga', 'laporan-workshop-jurnalisme-warga',
   'Workshop jurnalisme warga berhasil melatih 50 peserta dari 10 komunitas.',
   '<p>Workshop Jurnalisme Warga yang diselenggarakan oleh Aksara Dialogue berhasil melatih 50 peserta dari 10 komunitas berbeda. Workshop ini bertujuan untuk membekali warga dengan keterampilan jurnalistik dasar.</p>',
   'Tim Redaksi', (SELECT id FROM news_categories WHERE slug = 'liputan'),
   'published', now() - interval '7 days');

-- Events
INSERT INTO events (title, slug, description, event_date, start_time, end_time, location, speaker, status, is_published) VALUES
  ('Diskusi Publik: Kebijakan Energi Terbarukan', 'diskusi-publik-kebijakan-energi-terbarukan',
   '<p>Diskusi publik yang membahas kebijakan energi terbarukan di Indonesia dan tantangan transisi energi.</p>',
   CURRENT_DATE + interval '14 days', '14:00', '17:00',
   'Aula Utama Aksara Dialogue, Jakarta', 'Dr. Ahmad Suharto, Prof. Siti Rahayu',
   'published', true),
  ('Pelatihan Advokasi Komunitas', 'pelatihan-advokasi-komunitas',
   '<p>Pelatihan intensif selama dua hari tentang teknik advokasi komunitas yang efektif.</p>',
   CURRENT_DATE + interval '30 days', '09:00', '16:00',
   'Gedung Pelatihan Aksara, Bandung', 'Tim Fasilitator Aksara Dialogue',
   'published', true);

-- Albums
INSERT INTO albums (title, slug, description, event_date, location, is_published) VALUES
  ('Forum Dialog Nasional 2026', 'forum-dialog-nasional-2026',
   'Dokumentasi lengkap Forum Dialog Nasional 2026 yang dihadiri 500 peserta.',
   CURRENT_DATE - interval '30 days', 'Jakarta Convention Center',
   true);

-- Publication Categories
INSERT INTO publication_categories (name, slug, type, sort_order) VALUES
  ('Analisis Kebijakan', 'analisis-kebijakan', 'article', 1),
  ('Isu Sosial', 'isu-sosial', 'article', 2),
  ('Perspektif', 'perspektif', 'opinion', 1),
  ('Kajian', 'kajian', 'opinion', 2),
  ('Laporan Tahunan', 'laporan-tahunan', 'report', 1),
  ('Riset', 'riset', 'report', 2);

-- Articles
INSERT INTO articles (title, slug, excerpt, content, author, category_id, status, published_at) VALUES
  ('Membangun Demokrasi Partisipatif di Era Digital', 'membangun-demokrasi-partisipatif-era-digital',
   'Bagaimana teknologi digital dapat memperkuat partisipasi publik dalam proses demokrasi.',
   '<p>Era digital membawa peluang baru bagi demokrasi partisipatif. Teknologi informasi dan komunikasi memungkinkan partisipasi publik yang lebih luas dan lebih cepat dalam proses pengambilan keputusan.</p><p>Namun, tantangan seperti kesenjangan digital, disinformasi, dan polarisasi juga perlu diatasi agar teknologi benar-benar dapat memperkuat demokrasi.</p>',
   'Dr. Maya Indira', (SELECT id FROM publication_categories WHERE slug = 'analisis-kebijakan'),
   'published', now() - interval '3 days'),
  ('Peran Pemuda dalam Gerakan Sosial Kontemporer', 'peran-pemuda-gerakan-sosial-kontemporer',
   'Analisis tentang kontribusi generasi muda dalam gerakan sosial masa kini.',
   '<p>Generasi muda memainkan peran yang semakin penting dalam gerakan sosial kontemporer. Dari isu perubahan iklim hingga keadilan sosial, pemuda di seluruh dunia menunjukkan kesadaran dan komitmen yang tinggi.</p>',
   'Rahmat Hidayat', (SELECT id FROM publication_categories WHERE slug = 'isu-sosial'),
   'published', now() - interval '6 days'),
  ('Transformasi Ruang Publik di Perkotaan', 'transformasi-ruang-publik-perkotaan',
   'Bagaimana ruang publik di perkotaan bertransformasi dan dampaknya bagi kehidupan sosial.',
   '<p>Ruang publik di kawasan perkotaan mengalami transformasi yang signifikan. Perubahan ini mempengaruhi cara masyarakat berinteraksi, berdiskusi, dan membangun komunitas.</p>',
   'Sari Dewi', (SELECT id FROM publication_categories WHERE slug = 'isu-sosial'),
   'published', now() - interval '10 days');

-- Opinions
INSERT INTO opinions (title, slug, excerpt, content, author, category_id, status, published_at) VALUES
  ('Mengapa Dialog Publik Masih Relevan?', 'mengapa-dialog-publik-masih-relevan',
   'Di tengah polarisasi yang meningkat, dialog publik menjadi semakin penting.',
   '<p>Di era di mana polarisasi semakin menguat dan ruang dialog semakin menyempit, kebutuhan akan dialog publik yang berkualitas justru semakin mendesak. Dialog bukan sekadar percakapan : ia adalah fondasi dari masyarakat demokratis.</p>',
   'Prof. Budi Hartono', (SELECT id FROM publication_categories WHERE slug = 'perspektif'),
   'published', now() - interval '4 days'),
  ('Masyarakat Sipil dan Tantangan Baru', 'masyarakat-sipil-tantangan-baru',
   'Organisasi masyarakat sipil menghadapi tantangan baru di abad ke-21.',
   '<p>Organisasi masyarakat sipil menghadapi tantangan yang belum pernah ada sebelumnya. Dari digitalisasi hingga perubahan lanskap politik, organisasi perlu beradaptasi tanpa kehilangan esensi dari misi mereka.</p>',
   'Rina Kusumawati', (SELECT id FROM publication_categories WHERE slug = 'perspektif'),
   'published', now() - interval '8 days');

-- Team Members
INSERT INTO team_members (name, position, bio, sort_order) VALUES
  ('Ahmad Fauzi', 'Direktur Eksekutif', 'Berpengalaman lebih dari 15 tahun dalam gerakan sosial dan advokasi kebijakan publik.', 1),
  ('Siti Nurhaliza', 'Manajer Program', 'Ahli dalam desain dan implementasi program pemberdayaan masyarakat.', 2),
  ('Rizki Pratama', 'Koordinator Riset', 'Peneliti dengan fokus pada isu-isu demokrasi dan partisipasi publik.', 3),
  ('Dewi Anggraini', 'Koordinator Media', 'Spesialis komunikasi dan jurnalisme dengan pengalaman di media nasional.', 4);

-- SEO Settings (default pages)
INSERT INTO seo_settings (page_key, title, description) VALUES
  ('home', 'Aksara Dialogue: Suara Publik, Ruang Dialog', 'Aksara Dialogue adalah organisasi yang berfokus pada ruang dialog dan gerakan sosial untuk perubahan yang bermakna.'),
  ('about', 'Tentang Kami - Aksara Dialogue', 'Kenali lebih dekat Aksara Dialogue, organisasi yang berfokus pada dialog publik dan gerakan sosial.'),
  ('programs', 'Program - Aksara Dialogue', 'Program-program Aksara Dialogue untuk menciptakan dampak nyata di masyarakat.'),
  ('news', 'Berita - Aksara Dialogue', 'Ikuti perkembangan terbaru dari kegiatan dan program Aksara Dialogue.'),
  ('contact', 'Kontak - Aksara Dialogue', 'Hubungi Aksara Dialogue untuk informasi lebih lanjut atau kerjasama.'),
  ('team', 'Tim - Aksara Dialogue', 'Kenali tim di balik Aksara Dialogue.'),
  ('articles', 'Artikel - Aksara Dialogue', 'Pemikiran dan analisis dari tim Aksara Dialogue tentang isu-isu terkini.'),
  ('opinions', 'Opini - Aksara Dialogue', 'Opini dan perspektif dari kontributor Aksara Dialogue.'),
  ('reports', 'Laporan - Aksara Dialogue', 'Laporan dan publikasi dari Aksara Dialogue.');


