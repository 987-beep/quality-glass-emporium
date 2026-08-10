-- ========================================================
-- QUALITY GLASS EMPORIUM - SEED DATA SCRIPT
-- ========================================================

-- 1. SITE SETTINGS SEED
INSERT INTO public.site_settings (id, store_name, tagline, phone, email, address, opening_hours, seo_title, seo_description)
VALUES (
  1,
  'Quality Glass Emporium And Photo Framing Center',
  'Frame Your Memories in Perfect Clarity',
  '+91 98765 43210',
  'contact@qualityglass.in',
  'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh',
  'Open daily until 9:00 PM (Rating: 4.9/5 stars)',
  'Quality Glass Emporium & Photo Framing Center | Raebareli',
  'Premium custom photo framing, museum-grade non-reflective glass, toughened structural glass, acrylic float frames, and designer mirror work in Raebareli.'
) ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  address = EXCLUDED.address,
  opening_hours = EXCLUDED.opening_hours;

-- 2. CATEGORIES SEED
INSERT INTO public.categories (id, name, slug, description, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Custom Photo Framing', 'custom-photo-framing', 'Artisanal handcrafted frames for memories, paintings, and certificates.', 1),
('c1000000-0000-0000-0000-000000000002', 'Museum & Non-Reflective Glass', 'museum-glass', '99% UV protection anti-glare crystal glass for artwork and preservation.', 2),
('c1000000-0000-0000-0000-000000000003', 'Modern Acrylic Float', 'acrylic-float', 'Edge-to-edge frameless acrylic floating mounting panels.', 3),
('c1000000-0000-0000-0000-000000000004', 'Toughened Architectural Glass', 'toughened-glass', 'High-durability safety glass panels for partitions and shelves.', 4),
('c1000000-0000-0000-0000-000000000005', 'Designer Mirror Solutions', 'designer-mirrors', 'Beveled edge LED and antique decorative wall mirrors.', 5)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUCTS SEED
INSERT INTO public.products (id, name, slug, description, price, sale_price, sku, stock_quantity, category_id, is_featured) VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'Gallery Standard Black Frame',
  'gallery-standard-black-frame',
  'Solid Burmese teak wood frame with matte black finish and 99% clear protective glass pane.',
  45.00,
  39.99,
  'QG-BLK-1218',
  50,
  'c1000000-0000-0000-0000-000000000001',
  true
),
(
  'p1000000-0000-0000-0000-000000000002',
  'Modern Acrylic Float Panel 16x24',
  'modern-acrylic-float-panel-16x24',
  'Frameless edge-to-edge optical clarity acrylic panel with stainless steel standoffs.',
  65.00,
  59.00,
  'QG-ACR-1624',
  35,
  'c1000000-0000-0000-0000-000000000003',
  true
),
(
  'p1000000-0000-0000-0000-000000000003',
  'Museum Grade Anti-Reflective UV Glass Sheet (Custom Size)',
  'museum-grade-anti-reflective-uv-glass',
  'Ultra-pure low-iron anti-reflective glass designed to prevent glare and protect against UV fading.',
  85.00,
  75.00,
  'QG-MUS-UVGL',
  100,
  'c1000000-0000-0000-0000-000000000002',
  true
),
(
  'p1000000-0000-0000-0000-000000000004',
  'Royal Teak Gold Leaf Carved Mirror Frame',
  'royal-teak-gold-leaf-carved-mirror-frame',
  'Hand-carved premium hardwood frame embellished with fine metallic gold accents.',
  120.00,
  105.00,
  'QG-MIR-GOLD',
  15,
  'c1000000-0000-0000-0000-000000000005',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 4. BANNERS SEED
INSERT INTO public.banners (id, title, subtitle, image_url, link_url, display_order) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'Frame Your Memories in Perfect Clarity',
  'Discover our curated collection of premium glass and acrylic frames, custom crafted in Raebareli.',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
  '#collections',
  1
),
(
  'b1000000-0000-0000-0000-000000000002',
  'Museum-Grade Conservation Glass',
  '99% UV radiation blocking with non-reflective optical finish for heirloom artwork.',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  '#museum-glass',
  2
)
ON CONFLICT DO NOTHING;

-- 5. DEFAULT ADMIN ACCOUNTS NOTE:
-- Default Admin credentials initialized in application seed handler:
-- Admin 1 (Developer): Login @kaatya6547 / Password Vis6547@
-- Admin 2 (Owner): Login @Ajmal6547 / Password Vis6547@
