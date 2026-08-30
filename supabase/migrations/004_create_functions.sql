-- ==========================================
-- AKSARA DIALOGUE — Database Functions
-- 004: Helper functions
-- ==========================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalArticles', (SELECT COUNT(*) FROM articles),
    'totalPrograms', (SELECT COUNT(*) FROM programs),
    'totalNews', (SELECT COUNT(*) FROM news),
    'totalEvents', (SELECT COUNT(*) FROM events),
    'totalAlbums', (SELECT COUNT(*) FROM albums),
    'totalTeamMembers', (SELECT COUNT(*) FROM team_members),
    'totalMedia', (SELECT COUNT(*) FROM media),
    'totalReports', (SELECT COUNT(*) FROM reports)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
