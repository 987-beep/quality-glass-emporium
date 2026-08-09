-- Quality Glass Emporium - PostgreSQL Database Schema
-- All 11 Core E-Commerce Tables

-- 1. Users Table (Admin & Customers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id VARCHAR(255) REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    original_price NUMERIC(10, 2) DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 20,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    description TEXT,
    image TEXT,
    is_customizable BOOLEAN DEFAULT FALSE,
    is_frame BOOLEAN DEFAULT FALSE,
    frame_material VARCHAR(255) DEFAULT 'Natural Wood',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    username VARCHAR(255),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(100),
    shipping_address TEXT,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(255),
    utr_number VARCHAR(255),
    payment_screenshot TEXT,
    payment_status VARCHAR(100) DEFAULT 'Pending Verification',
    payment_approval_status VARCHAR(100) DEFAULT 'Pending Approval',
    order_status VARCHAR(100) DEFAULT 'Processing',
    tracking_number VARCHAR(255),
    items JSONB DEFAULT '[]'::jsonb,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    discount_type VARCHAR(50) NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    min_spend NUMERIC(10, 2) DEFAULT 0.00,
    expiry_date VARCHAR(100),
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Banners Table
CREATE TABLE IF NOT EXISTS banners (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    cta_text VARCHAR(100),
    cta_link VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(255) DEFAULT 'Quality Glass Emporium',
    tagline TEXT DEFAULT 'Bespoke Framing, Photo Studio & Customized Gifts',
    email VARCHAR(255) DEFAULT 'contact@qualityglassemporium.com',
    phone VARCHAR(100) DEFAULT '+91 94150 12345',
    address TEXT DEFAULT 'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh',
    currency VARCHAR(10) DEFAULT '₹',
    logo TEXT DEFAULT 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    meta_title TEXT DEFAULT 'Quality Glass Emporium | Custom Frames, Passport Studio & Gifts',
    meta_description TEXT DEFAULT 'Bespoke photo frames, acrylic sheets, canvas prints, passport photos, photo lamps, custom mugs & gifts in Raebareli.',
    meta_keywords TEXT DEFAULT 'photo frames, acrylic frames, canvas prints, passport photos, photo studio, custom gifts, photo lamps, mugs, keychains, Raebareli',
    hero_config JSONB DEFAULT '{}'::jsonb,
    promo_config JSONB DEFAULT '{}'::jsonb,
    announcement_bar JSONB DEFAULT '{}'::jsonb,
    section_headlines JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb
);

-- 9. Shipping Settings Table
CREATE TABLE IF NOT EXISTS shipping_settings (
    id INT PRIMARY KEY DEFAULT 1,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 999.00,
    flat_shipping_rate NUMERIC(10, 2) DEFAULT 79.00,
    express_delivery_rate NUMERIC(10, 2) DEFAULT 149.00,
    enable_local_pickup BOOLEAN DEFAULT TRUE,
    estimated_delivery_days VARCHAR(100) DEFAULT '2-4 Business Days'
);

-- 10. Tax Settings Table
CREATE TABLE IF NOT EXISTS tax_settings (
    id INT PRIMARY KEY DEFAULT 1,
    tax_rate_percentage NUMERIC(5, 2) DEFAULT 18.00,
    include_tax_in_price BOOLEAN DEFAULT TRUE,
    gstin_number VARCHAR(100) DEFAULT '09AAAFQ1234A1Z5'
);

-- 11. Payment Settings Table
CREATE TABLE IF NOT EXISTS payment_settings (
    id INT PRIMARY KEY DEFAULT 1,
    qr_code_enabled BOOLEAN DEFAULT TRUE,
    upi_id VARCHAR(255) DEFAULT 'qualityglass@upi',
    account_holder VARCHAR(255) DEFAULT 'Quality Glass Emporium',
    qr_image_url TEXT DEFAULT 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium',
    qr_instructions TEXT DEFAULT 'Scan the Admin uploaded QR code using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR transaction reference number and upload the screenshot proof.',
    bank_transfer_enabled BOOLEAN DEFAULT TRUE,
    bank_name VARCHAR(255) DEFAULT 'State Bank of India',
    account_number VARCHAR(255) DEFAULT '389201004921',
    ifsc_code VARCHAR(100) DEFAULT 'SBIN0000465',
    branch VARCHAR(255) DEFAULT 'Raebareli Main Branch',
    bank_instructions TEXT DEFAULT 'Transfer total order amount via IMPS / NEFT / RTGS to the store bank account. Enter your 12-digit Bank UTR reference number and upload the payment screenshot proof.',
    cod_enabled BOOLEAN DEFAULT TRUE
);
