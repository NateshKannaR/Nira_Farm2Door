-- =============================================================================
-- KisanBandhan: Farmer Bulk Storage Photos & Dedicated Photo Column Migration
-- =============================================================================

-- 1. Add dedicated photo columns to product_listings for direct mapping
ALTER TABLE public.product_listings ADD COLUMN IF NOT EXISTS crop_photo_url TEXT;
ALTER TABLE public.product_listings ADD COLUMN IF NOT EXISTS aaloo_photo_url TEXT;

-- 2. Update existing potato listings with direct bulk storage photo
UPDATE public.product_listings
SET 
  image_url = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
  crop_photo_url = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
  aaloo_photo_url = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
  images = '["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=1200&q=80"]'::jsonb
WHERE lower(crop_name) LIKE '%potato%' OR lower(crop_name) LIKE '%aaloo%' OR lower(crop_name) LIKE '%aloo%';

-- 3. Create Dedicated Crop Photo Directory for easy key-value mapping
CREATE TABLE IF NOT EXISTS public.crop_photo_directory (
    crop_key TEXT PRIMARY KEY,
    crop_name_en TEXT NOT NULL,
    crop_name_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    bulk_storage_photo_url TEXT NOT NULL,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.crop_photo_directory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on crop_photo_directory" ON public.crop_photo_directory;
CREATE POLICY "Allow public read on crop_photo_directory" ON public.crop_photo_directory FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write on crop_photo_directory" ON public.crop_photo_directory;
CREATE POLICY "Allow public write on crop_photo_directory" ON public.crop_photo_directory FOR ALL USING (true);

-- Insert Curated Bulk Farm Storage Mappings
INSERT INTO public.crop_photo_directory (crop_key, crop_name_en, crop_name_hi, category, photo_url, bulk_storage_photo_url, photos)
VALUES
(
  'aaloo',
  'Potato',
  'आलू',
  'Vegetables',
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=1200&q=80"]'::jsonb
),
(
  'tamatar',
  'Tomato',
  'टमाटर',
  'Vegetables',
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"]'::jsonb
),
(
  'pyaz',
  'Onion',
  'प्याज',
  'Vegetables',
  'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=1200&q=80"]'::jsonb
),
(
  'gehun',
  'Wheat',
  'गेहूं',
  'Grains',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80"]'::jsonb
),
(
  'mirch',
  'Green Chilli',
  'हरी मिर्च',
  'Vegetables',
  'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80"]'::jsonb
),
(
  'matar',
  'Green Peas',
  'हरी मटर',
  'Vegetables',
  'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1592394533824-9440e5d68530?auto=format&fit=crop&w=1200&q=80"]'::jsonb
),
(
  'sarson',
  'Mustard Seeds',
  'सरसों',
  'Seeds',
  'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80"]'::jsonb
),
(
  'chawal',
  'Rice / Paddy',
  'धान / चावल',
  'Grains',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80"]'::jsonb
)
ON CONFLICT (crop_key) DO UPDATE SET
  photo_url = EXCLUDED.photo_url,
  bulk_storage_photo_url = EXCLUDED.bulk_storage_photo_url,
  photos = EXCLUDED.photos;
