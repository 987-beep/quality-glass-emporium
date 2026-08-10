-- ============================================================
-- QUALITY GLASS EMPORIUM - SEED DATA SCRIPT
-- ============================================================

-- 1. STORE SETTINGS SEED
INSERT INTO public.site_settings (
    id, store_name, logo_url, phone, email, address, business_hours, tax_rate, shipping_fee, free_shipping_min, meta_title, meta_description
) VALUES (
    1,
    'Quality Glass Emporium And Photo Framing Center',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    '+91-9999535535',
    'contact@qualityglassemporium.com',
    'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh',
    'Mon - Sun: 9:00 AM - 9:00 PM',
    5.00,
    50.00,
    1000.00,
    'Quality Glass Emporium And Photo Framing Center - Raebareli',
    'Premier glass dealer and photo framing center in Raebareli, UP. Offering high-grade custom glasswork, floating acrylic frames, ornate mirrors, and architectural glazing.'
) ON CONFLICT (id) DO UPDATE SET 
store_name = EXCLUDED.store_name,
address = EXCLUDED.address,
phone = EXCLUDED.phone;

-- 2. CATEGORIES SEED
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order) VALUES
('c1111111-1111-1111-1111-111111111111', 'Photo Frames', 'photo-frames', 'Handcrafted solid wooden, metal, and glass photo frames for home decor.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80', 1),
('c2222222-2222-2222-2222-222222222222', 'Acrylic & Float Glass', 'acrylic-float-glass', 'Edge-to-edge frameless acrylic floating frames and ultra-clear glass panels.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', 2),
('c3333333-3333-3333-3333-333333333333', 'Custom Mirrors', 'custom-mirrors', 'Beveled wall mirrors, vanity mirrors, and decorative gilded framed mirrors.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80', 3),
('c4444444-4444-4444-4444-444444444444', 'Architectural Glass', 'architectural-glass', 'Toughened glass tabletops, window panes, and custom cut architectural sheets.', 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80', 4)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUCTS SEED
INSERT INTO public.products (id, name, slug, description, price, sale_price, sku, inventory_count, status, category_id, image_url, is_featured, rating, reviews_count) VALUES
(
    'p1111111-1111-1111-1111-111111111111',
    'Gallery Standard Black Wooden Frame',
    'gallery-standard-black-wooden-frame',
    'Solid wood frame with museum-grade UV-filtering clear glass and archival matting. Perfect for high-resolution photo prints and art gallery displays.',
    45.00, 39.99, 'FRM-BLK-001', 45, 'published',
    'c1111111-1111-1111-1111-111111111111',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    true, 4.9, 12
),
(
    'p2222222-2222-2222-2222-222222222222',
    'Modern Acrylic Float Frame (16x24 in)',
    'modern-acrylic-float-frame-16x24',
    'Frameless edge-to-edge acrylic floating glass sheet with stainless steel standoff mounts. Delivers a modern minimalist, floating artistic perspective.',
    65.00, 59.00, 'ACR-FLT-002', 30, 'published',
    'c2222222-2222-2222-2222-222222222222',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    true, 5.0, 8
),
(
    'p3333333-3333-3333-3333-333333333333',
    'Heritage Gold Leaf Gilded Wall Mirror',
    'heritage-gold-leaf-gilded-wall-mirror',
    'Artisanal hand-gilded antique finish gold leaf frame paired with a 5mm high-reflectivity beveled glass mirror panel.',
    120.00, 105.00, 'MIR-GLD-003', 15, 'published',
    'c3333333-3333-3333-3333-333333333333',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    true, 4.8, 19
),
(
    'p4444444-4444-4444-4444-444444444444',
    'Clear Toughened Glass Tabletop (Custom Cut)',
    'clear-toughened-glass-tabletop-custom-cut',
    '8mm heavy-duty tempered safety glass sheet with polished polished flat edges. Resistant to heat and impact.',
    95.00, NULL, 'GLS-TBL-004', 25, 'published',
    'c4444444-4444-4444-4444-444444444444',
    false, 4.9, 6
),
(
    'p5555555-5555-5555-5555-555555555555',
    'Smart LED Backlit Touch Vanity Mirror',
    'smart-led-backlit-touch-vanity-mirror',
    'High-definition vanity wall mirror with dimmable LED backlight, anti-fog heater pad, and touch sensor controls.',
    150.00, 135.00, 'MIR-LED-005', 10, 'published',
    'c3333333-3333-3333-3333-333333333333',
    true, 5.0, 15
)
ON CONFLICT (slug) DO NOTHING;

-- 4. BANNERS SEED
INSERT INTO public.banners (id, title, subtitle, image_url, link_url, button_text, sort_order, is_active) VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'Frame Your Memories in Perfect Clarity',
    'Discover our curated collection of premium glass & acrylic frames handcrafted in Raebareli.',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    '#catalog',
    'Shop Collections',
    1,
    true
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Custom Glass Cutting & Photo Framing',
    'Tailored solutions for homes, offices, art galleries, and custom glass architectural panels.',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    '#configurator',
    'Custom Framing',
    2,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 5. COUPONS SEED
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_amount, is_active) VALUES
('GLASS10', '10% Discount on all glass orders', 'percentage', 10.00, 50.00, true),
('WELCOME20', 'Flat $20 off on your first frame purchase', 'fixed', 20.00, 80.00, true),
('FREESHIP', 'Free shipping on orders over $100', 'fixed', 50.00, 100.00, true)
ON CONFLICT (code) DO NOTHING;

-- 6. ADMIN ACCOUNTS REGISTRATION NOTE & SEED MAPPING
-- Default Admin 1: Developer (@kaatya6547 / email: kaatya6547@qualityglass.internal / Pass: Vis6547@)
-- Default Admin 2: Owner (@Ajmal6547 / email: ajmal6547@qualityglass.internal / Pass: Vis6547@)
-- (Managed via Supabase Auth & Profile roles)
