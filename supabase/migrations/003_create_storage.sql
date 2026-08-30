-- ==========================================
-- AKSARA DIALOGUE — Storage Setup
-- 003: Create storage bucket and policies
-- ==========================================

-- Create the media bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB max
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ]
);

-- Public read access
CREATE POLICY "media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Authenticated users can upload
CREATE POLICY "media_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

-- Authenticated users can update their uploads
CREATE POLICY "media_auth_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

-- Authenticated users can delete
CREATE POLICY "media_auth_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );
