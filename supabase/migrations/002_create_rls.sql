-- ==========================================
-- AKSARA DIALOGUE — Row Level Security
-- 002: Create RLS policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE visi_misi ENABLE ROW LEVEL SECURITY;
ALTER TABLE values ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opinions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Helper function: Check if user is admin
-- ==========================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- PROFILES
-- ==========================================
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- SITE SETTINGS — public read, admin write
-- ==========================================
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "site_settings_admin_all" ON site_settings
  FOR ALL USING (is_admin());

-- ==========================================
-- SEO SETTINGS — public read, admin write
-- ==========================================
CREATE POLICY "seo_settings_public_read" ON seo_settings
  FOR SELECT USING (true);
CREATE POLICY "seo_settings_admin_all" ON seo_settings
  FOR ALL USING (is_admin());

-- ==========================================
-- NAVIGATION — public reads active, admin all
-- ==========================================
CREATE POLICY "navigation_public_read" ON navigation
  FOR SELECT USING (is_active = true);
CREATE POLICY "navigation_admin_all" ON navigation
  FOR ALL USING (is_admin());

-- ==========================================
-- FOOTER SETTINGS — public read, admin write
-- ==========================================
CREATE POLICY "footer_settings_public_read" ON footer_settings
  FOR SELECT USING (true);
CREATE POLICY "footer_settings_admin_all" ON footer_settings
  FOR ALL USING (is_admin());

-- ==========================================
-- SOCIAL LINKS — public reads active, admin all
-- ==========================================
CREATE POLICY "social_links_public_read" ON social_links
  FOR SELECT USING (is_active = true);
CREATE POLICY "social_links_admin_all" ON social_links
  FOR ALL USING (is_admin());

-- ==========================================
-- HOMEPAGE SECTIONS — public reads visible, admin all
-- ==========================================
CREATE POLICY "homepage_public_read" ON homepage_sections
  FOR SELECT USING (is_visible = true);
CREATE POLICY "homepage_admin_all" ON homepage_sections
  FOR ALL USING (is_admin());

-- ==========================================
-- ABOUT — public reads published, admin all
-- ==========================================
CREATE POLICY "about_public_read" ON about
  FOR SELECT USING (is_published = true);
CREATE POLICY "about_admin_all" ON about
  FOR ALL USING (is_admin());

-- ==========================================
-- VISI MISI — public reads published, admin all
-- ==========================================
CREATE POLICY "visi_misi_public_read" ON visi_misi
  FOR SELECT USING (is_published = true);
CREATE POLICY "visi_misi_admin_all" ON visi_misi
  FOR ALL USING (is_admin());

-- ==========================================
-- VALUES — public reads active, admin all
-- ==========================================
CREATE POLICY "values_public_read" ON values
  FOR SELECT USING (is_active = true);
CREATE POLICY "values_admin_all" ON values
  FOR ALL USING (is_admin());

-- ==========================================
-- FOCUS AREAS — public reads active, admin all
-- ==========================================
CREATE POLICY "focus_areas_public_read" ON focus_areas
  FOR SELECT USING (is_active = true);
CREATE POLICY "focus_areas_admin_all" ON focus_areas
  FOR ALL USING (is_admin());

-- ==========================================
-- PROGRAM CATEGORIES — public reads active, admin all
-- ==========================================
CREATE POLICY "program_cat_public_read" ON program_categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "program_cat_admin_all" ON program_categories
  FOR ALL USING (is_admin());

-- ==========================================
-- PROGRAMS — public reads published, admin all
-- ==========================================
CREATE POLICY "programs_public_read" ON programs
  FOR SELECT USING (is_published = true);
CREATE POLICY "programs_admin_all" ON programs
  FOR ALL USING (is_admin());

-- ==========================================
-- NEWS CATEGORIES — public reads active, admin all
-- ==========================================
CREATE POLICY "news_cat_public_read" ON news_categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "news_cat_admin_all" ON news_categories
  FOR ALL USING (is_admin());

-- ==========================================
-- NEWS — public reads published, admin all
-- ==========================================
CREATE POLICY "news_public_read" ON news
  FOR SELECT USING (status = 'published');
CREATE POLICY "news_admin_all" ON news
  FOR ALL USING (is_admin());

-- ==========================================
-- EVENTS — public reads published, admin all
-- ==========================================
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (is_published = true);
CREATE POLICY "events_admin_all" ON events
  FOR ALL USING (is_admin());

-- ==========================================
-- ALBUMS — public reads published, admin all
-- ==========================================
CREATE POLICY "albums_public_read" ON albums
  FOR SELECT USING (is_published = true);
CREATE POLICY "albums_admin_all" ON albums
  FOR ALL USING (is_admin());

-- ==========================================
-- GALLERY — public reads (via published album), admin all
-- ==========================================
CREATE POLICY "gallery_public_read" ON gallery
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = gallery.album_id
      AND albums.is_published = true
    )
  );
CREATE POLICY "gallery_admin_all" ON gallery
  FOR ALL USING (is_admin());

-- ==========================================
-- PUBLICATION CATEGORIES — public reads active, admin all
-- ==========================================
CREATE POLICY "pub_cat_public_read" ON publication_categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "pub_cat_admin_all" ON publication_categories
  FOR ALL USING (is_admin());

-- ==========================================
-- ARTICLES — public reads published, admin all
-- ==========================================
CREATE POLICY "articles_public_read" ON articles
  FOR SELECT USING (status = 'published');
CREATE POLICY "articles_admin_all" ON articles
  FOR ALL USING (is_admin());

-- ==========================================
-- OPINIONS — public reads published, admin all
-- ==========================================
CREATE POLICY "opinions_public_read" ON opinions
  FOR SELECT USING (status = 'published');
CREATE POLICY "opinions_admin_all" ON opinions
  FOR ALL USING (is_admin());

-- ==========================================
-- REPORTS — public reads published, admin all
-- ==========================================
CREATE POLICY "reports_public_read" ON reports
  FOR SELECT USING (is_published = true);
CREATE POLICY "reports_admin_all" ON reports
  FOR ALL USING (is_admin());

-- ==========================================
-- TEAM MEMBERS — public reads active, admin all
-- ==========================================
CREATE POLICY "team_public_read" ON team_members
  FOR SELECT USING (is_active = true);
CREATE POLICY "team_admin_all" ON team_members
  FOR ALL USING (is_admin());

-- ==========================================
-- CONTACT INFO — public read, admin write
-- ==========================================
CREATE POLICY "contact_public_read" ON contact_info
  FOR SELECT USING (true);
CREATE POLICY "contact_admin_all" ON contact_info
  FOR ALL USING (is_admin());

-- ==========================================
-- MEDIA — public read, admin all
-- ==========================================
CREATE POLICY "media_public_read" ON media
  FOR SELECT USING (true);
CREATE POLICY "media_admin_all" ON media
  FOR ALL USING (is_admin());
