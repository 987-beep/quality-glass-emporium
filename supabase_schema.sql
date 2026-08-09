-- ========================================================
-- QUALITY GLASS EMPORIUM - COMPLETE SUPABASE SQL SCHEMA DDL
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User accounts & Staff Admin Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  icon TEXT DEFAULT 'frame',
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_slug TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2) DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 20,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  description TEXT,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  is_customizable BOOLEAN DEFAULT FALSE,
  is_frame BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  frame_material TEXT DEFAULT 'Natural Wood',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BANNERS TABLE (Homepage Hero Carousel)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10, 2) DEFAULT 0.00,
  shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
  tax_amount NUMERIC(10, 2) DEFAULT 0.00,
  payment_method TEXT DEFAULT 'UPI / QR Code',
  utr_number TEXT,
  payment_screenshot TEXT,
  payment_status TEXT DEFAULT 'Pending Verification',
  payment_approval_status TEXT DEFAULT 'Pending Approval',
  order_status TEXT DEFAULT 'Processing',
  tracking_number TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  quantity INT NOT NULL DEFAULT 1,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  custom_options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  min_spend NUMERIC(10, 2) DEFAULT 0.00,
  expiry_date TEXT,
  usage_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. SETTINGS TABLE (Store Info, Branding, SEO, Shipping, Tax & Payment Gateways)
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'Quality Glass Emporium',
  tagline TEXT DEFAULT 'Bespoke Framing, Photo Studio & Customized Gifts',
  email TEXT DEFAULT 'contact@qualityglassemporium.com',
  phone TEXT DEFAULT '+91 94150 12345',
  address TEXT DEFAULT 'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh',
  currency TEXT DEFAULT '₹',
  logo TEXT DEFAULT 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
  meta_title TEXT DEFAULT 'Quality Glass Emporium | Custom Frames, Passport Studio & Gifts',
  meta_description TEXT DEFAULT 'Bespoke photo frames, acrylic sheets, canvas prints, passport photos, photo lamps, custom mugs & gifts in Raebareli.',
  meta_keywords TEXT DEFAULT 'photo frames, acrylic frames, canvas prints, passport photos, photo studio, custom gifts, photo lamps, mugs, keychains, Raebareli',
  hero_config JSONB DEFAULT '{}'::jsonb,
  promo_config JSONB DEFAULT '{}'::jsonb,
  announcement_bar JSONB DEFAULT '{}'::jsonb,
  section_headlines JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  shipping_threshold NUMERIC(10, 2) DEFAULT 999.00,
  shipping_flat_rate NUMERIC(10, 2) DEFAULT 79.00,
  express_shipping_rate NUMERIC(10, 2) DEFAULT 149.00,
  enable_local_pickup BOOLEAN DEFAULT TRUE,
  tax_rate_percentage NUMERIC(5, 2) DEFAULT 18.00,
  include_tax_in_price BOOLEAN DEFAULT TRUE,
  gstin_number TEXT DEFAULT '09AAAFQ1234A1Z5',
  upi_id TEXT DEFAULT 'qualityglass@upi',
  account_holder TEXT DEFAULT 'Quality Glass Emporium',
  qr_image_url TEXT DEFAULT 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium',
  qr_instructions TEXT DEFAULT 'Scan QR using GPay, PhonePe, Paytm or BHIM. Enter your 12-digit UTR reference number and upload screenshot.',
  bank_transfer_enabled BOOLEAN DEFAULT TRUE,
  bank_name TEXT DEFAULT 'State Bank of India',
  account_number TEXT DEFAULT '389201004921',
  ifsc_code TEXT DEFAULT 'SBIN0000465',
  branch TEXT DEFAULT 'Raebareli Main Branch',
  cod_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. INVENTORY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  change_amount INT NOT NULL,
  reason TEXT DEFAULT 'Manual Admin Adjustment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES ON COMMONLY QUERIED FIELDS
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- SEED INITIAL ADMIN PROFILES (Owner & Developer)
INSERT INTO public.profiles (name, username, password_hash, role)
VALUES 
  ('Ajmal (Owner)', '@OWNERAJMAL69', 'AJMA6958@', 'owner'),
  ('Kaatya (Developer)', '@KAATYA_OG_', 'KAATYA6547', 'developer')
ON CONFLICT (username) DO NOTHING;

-- SEED INITIAL STORE SETTINGS ROW
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
