import pg from 'pg';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isPostgres = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);

let pgPool = null;
let sqliteDb = null;

if (isPostgres) {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  pgPool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });
} else {
  const dbPath = path.join(__dirname, 'database.sqlite');
  sqliteDb = new sqlite3.Database(dbPath);
}

// Universal Async Query Runner (Works with Postgres & SQLite)
export async function query(sqlText, params = []) {
  if (isPostgres && pgPool) {
    // Translate SQLite positional markers (?) or Keep Postgres ($1, $2...)
    let pgSql = sqlText;
    let paramIndex = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${paramIndex++}`);
    }
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  } else {
    // SQLite Runner
    return new Promise((resolve, reject) => {
      const trimmed = sqlText.trim().toUpperCase();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
        sqliteDb.all(sqlText, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      } else {
        sqliteDb.run(sqlText, params, function (err) {
          if (err) reject(err);
          else resolve([{ id: this.lastID, changes: this.changes }]);
        });
      }
    });
  }
}

// Default Seed Data
const defaultCategories = [
  { id: "photo-frames", name: "Photo Frames", slug: "photo-frames", description: "Bespoke Wood, Metal & Glass Frames", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80", icon: "frame", display_order: 1 },
  { id: "acrylic-frames", name: "Acrylic Frames & Sheets", slug: "acrylic-frames", description: "Luminous Frameless Acrylic Blocks & Custom Cut Sheets", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80", icon: "aspect_ratio", display_order: 2 },
  { id: "canvas-prints", name: "Canvas Prints", slug: "canvas-prints", description: "Gallery Wrapped Cotton Canvas Art Prints", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80", icon: "palette", display_order: 3 },
  { id: "photo-studio", name: "Photo Studio & Passport", slug: "photo-studio", description: "Digital Photo Printing, Passport/Visa Photos & Lamination", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80", icon: "center_focus_strong", display_order: 4 },
  { id: "custom-gifts", name: "Customized Gifts", slug: "custom-gifts", description: "Photo Lamps, Custom Mugs, T-Shirts, Keychains & Covers", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80", icon: "redeem", display_order: 5 },
  { id: "photo-albums", name: "Photo Albums & Memory Books", slug: "photo-albums", description: "Leatherette & Hardcover Wedding & Event Albums", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", icon: "auto_stories", display_order: 6 }
];

const defaultProducts = [
  {
    id: "prod-1",
    name: "Classic Walnut Wooden Frame",
    slug: "classic-walnut-wooden-frame",
    category_id: "photo-frames",
    price: 899,
    original_price: 1299,
    stock: 25,
    rating: 4.9,
    reviews_count: 18,
    description: "Handcrafted organic walnut solid wood moulding with 99.9% optical clear glass clarity.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    is_customizable: true,
    is_frame: true,
    frame_material: "Walnut Wood",
    display_order: 1
  },
  {
    id: "prod-2",
    name: "Luxe Frameless Floating Acrylic Block",
    slug: "luxe-frameless-floating-acrylic-block",
    category_id: "acrylic-frames",
    price: 1499,
    original_price: 1999,
    stock: 15,
    rating: 5.0,
    reviews_count: 24,
    description: "High-gloss crystal clear acrylic photo block with magnetic corner mounts.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    is_customizable: true,
    is_frame: true,
    frame_material: "Premium Acrylic",
    display_order: 2
  },
  {
    id: "prod-3",
    name: "Personalized Glowing 3D Photo Lamp",
    slug: "personalized-glowing-3d-photo-lamp",
    category_id: "custom-gifts",
    price: 1199,
    original_price: 1699,
    stock: 30,
    rating: 4.8,
    reviews_count: 42,
    description: "Warm LED glowing acrylic photo frame cutout with solid beech wood base.",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80",
    is_customizable: true,
    is_frame: false,
    frame_material: "Acrylic & Wood",
    display_order: 3
  }
];

const defaultUsers = [
  { id: "usr-1", name: "Ajmal (Owner)", username: "@OWNERAJMAL69", password: "AJMA6958@", role: "owner" },
  { id: "usr-2", name: "Kaatya (Developer)", username: "@KAATYA_OG_", password: "KAATYA6547", role: "developer" },
  { id: "usr-3", name: "Rahul Sharma", username: "@rahul_sharma", password: "password123", role: "customer" }
];

const defaultBanners = [
  {
    id: "banner-1",
    title: "Curate Your Space with Bespoke Framing",
    subtitle: "Museum-quality wooden & acrylic frames handcrafted with precision and glass clarity.",
    image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
    cta_text: "Launch Frame Studio",
    cta_link: "frame-studio",
    display_order: 1,
    is_active: true
  },
  {
    id: "banner-2",
    title: "Instant Passport & Visa Photo Studio",
    subtitle: "Compliant high-resolution biometric prints with instant white/blue background styling.",
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
    cta_text: "Order Passport Prints",
    cta_link: "passport-studio",
    display_order: 2,
    is_active: true
  }
];

const defaultCoupons = [
  {
    id: "coup-1",
    code: "WELCOME10",
    discount_type: "percentage",
    discount_value: 10,
    min_spend: 499,
    expiry_date: "2027-12-31",
    usage_count: 14,
    is_active: true
  },
  {
    id: "coup-2",
    code: "LUXE200",
    discount_type: "flat",
    discount_value: 200,
    min_spend: 1499,
    expiry_date: "2027-12-31",
    usage_count: 8,
    is_active: true
  }
];

// Initialize Database Tables & Seed Once
export async function initDb() {
  try {
    const isPg = isPostgres;
    const textType = isPg ? 'TEXT' : 'TEXT';
    const jsonType = isPg ? 'JSONB' : 'TEXT';
    const tsType = isPg ? 'TIMESTAMP WITH TIME ZONE' : 'DATETIME';

    // 1. Users Table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        created_at ${tsType} DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Categories Table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        icon VARCHAR(100),
        display_order INT DEFAULT 0,
        created_at ${tsType} DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Products Table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category_id VARCHAR(255),
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
        created_at ${tsType} DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Orders Table
    await query(`
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
        items ${jsonType} DEFAULT '[]',
        admin_notes TEXT,
        created_at ${tsType} DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Coupons Table
    await query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id VARCHAR(255) PRIMARY KEY,
        code VARCHAR(100) UNIQUE NOT NULL,
        discount_type VARCHAR(50) NOT NULL DEFAULT 'percentage',
        discount_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        min_spend NUMERIC(10, 2) DEFAULT 0.00,
        expiry_date VARCHAR(100),
        usage_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at ${tsType} DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Banners Table
    await query(`
      CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        image_url TEXT NOT NULL,
        cta_text VARCHAR(100),
        cta_link VARCHAR(255),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at ${tsType} DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Reviews Table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255),
        customer_name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT TRUE,
        created_at ${tsType} DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Site Settings Table
    await query(`
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
        hero_config ${jsonType} DEFAULT '{}',
        promo_config ${jsonType} DEFAULT '{}',
        announcement_bar ${jsonType} DEFAULT '{}',
        section_headlines ${jsonType} DEFAULT '{}',
        features ${jsonType} DEFAULT '[]'
      );
    `);

    // 9. Shipping Settings Table
    await query(`
      CREATE TABLE IF NOT EXISTS shipping_settings (
        id INT PRIMARY KEY DEFAULT 1,
        free_shipping_threshold NUMERIC(10, 2) DEFAULT 999.00,
        flat_shipping_rate NUMERIC(10, 2) DEFAULT 79.00,
        express_delivery_rate NUMERIC(10, 2) DEFAULT 149.00,
        enable_local_pickup BOOLEAN DEFAULT TRUE,
        estimated_delivery_days VARCHAR(100) DEFAULT '2-4 Business Days'
      );
    `);

    // 10. Tax Settings Table
    await query(`
      CREATE TABLE IF NOT EXISTS tax_settings (
        id INT PRIMARY KEY DEFAULT 1,
        tax_rate_percentage NUMERIC(5, 2) DEFAULT 18.00,
        include_tax_in_price BOOLEAN DEFAULT TRUE,
        gstin_number VARCHAR(100) DEFAULT '09AAAFQ1234A1Z5'
      );
    `);

    // 11. Payment Settings Table
    await query(`
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
    `);

    // --- SEED DEFAULTS ONCE IF EMPTY ---

    // Seed Users
    const existingUsers = await query(`SELECT COUNT(*) as count FROM users`);
    const uCount = parseInt(existingUsers[0]?.count || 0, 10);
    if (uCount === 0) {
      for (const u of defaultUsers) {
        await query(
          `INSERT INTO users (id, name, username, password, role) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
          [u.id, u.name, u.username, u.password, u.role]
        );
      }
    }

    // Seed Categories
    const existingCats = await query(`SELECT COUNT(*) as count FROM categories`);
    const cCount = parseInt(existingCats[0]?.count || 0, 10);
    if (cCount === 0) {
      for (const c of defaultCategories) {
        await query(
          `INSERT INTO categories (id, name, slug, description, image, icon, display_order) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
          [c.id, c.name, c.slug, c.description, c.image, c.icon, c.display_order]
        );
      }
    }

    // Seed Products
    const existingProds = await query(`SELECT COUNT(*) as count FROM products`);
    const pCount = parseInt(existingProds[0]?.count || 0, 10);
    if (pCount === 0) {
      for (const p of defaultProducts) {
        await query(
          `INSERT INTO products (id, name, slug, category_id, price, original_price, stock, rating, reviews_count, description, image, is_customizable, is_frame, frame_material, display_order) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
          [p.id, p.name, p.slug, p.category_id, p.price, p.original_price, p.stock, p.rating, p.reviews_count, p.description, p.image, p.is_customizable, p.is_frame, p.frame_material, p.display_order]
        );
      }
    }

    // Seed Banners
    const existingBanners = await query(`SELECT COUNT(*) as count FROM banners`);
    const bCount = parseInt(existingBanners[0]?.count || 0, 10);
    if (bCount === 0) {
      for (const b of defaultBanners) {
        await query(
          `INSERT INTO banners (id, title, subtitle, image_url, cta_text, cta_link, display_order, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
          [b.id, b.title, b.subtitle, b.image_url, b.cta_text, b.cta_link, b.display_order, b.is_active]
        );
      }
    }

    // Seed Coupons
    const existingCoupons = await query(`SELECT COUNT(*) as count FROM coupons`);
    const coupCount = parseInt(existingCoupons[0]?.count || 0, 10);
    if (coupCount === 0) {
      for (const coup of defaultCoupons) {
        await query(
          `INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, expiry_date, usage_count, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
          [coup.id, coup.code, coup.discount_type, coup.discount_value, coup.min_spend, coup.expiry_date, coup.usage_count, coup.is_active]
        );
      }
    }

    // Seed Site Settings
    const existingSettings = await query(`SELECT COUNT(*) as count FROM site_settings`);
    const sCount = parseInt(existingSettings[0]?.count || 0, 10);
    if (sCount === 0) {
      const hero = JSON.stringify({
        badge: "Quality Glass Emporium • Raebareli",
        title: "Curate Your Space with Bespoke Framing.",
        subtitle: "Museum-quality bespoke wood, metal & floating acrylic frames designed to elevate your memories. Handcrafted precision meets digital photo studio.",
        bgImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
        primaryCtaText: "🎨 Launch Frame Studio",
        primaryCtaLink: "frame-studio",
        secondaryCtaText: "📸 Passport Photo Studio",
        secondaryCtaLink: "passport-studio"
      });
      const promo = JSON.stringify({
        badge: "Specialized Gift Shop",
        title: "Personalized 3D Photo Lamps, Custom Mugs & Keychains",
        description: "Create unforgettable keepsakes! Print your loved ones' photos on warm glowing 3D acrylic lamps, heat-sensitive magic mugs, customized T-shirts, mobile cases, and keychains with lifetime print guarantee.",
        image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80",
        ctaText: "Shop Custom Gifts",
        ctaLink: "custom-gifts"
      });
      const annBar = JSON.stringify({
        enabled: true,
        text: "⚡ Special Offer: Free Express Shipping on Custom Frame & Glass Orders above ₹999 in Raebareli!",
        link: "/collection",
        bgStyle: "primary"
      });
      const headlines = JSON.stringify({
        categoriesTitle: "Framing & Gift Collections",
        categoriesSubtitle: "Store Taxonomy",
        productsTitle: "Trending Framing & Custom Gifts",
        productsSubtitle: "Handcrafted Products"
      });
      const feats = JSON.stringify([
        { icon: "workspace_premium", title: "Museum-Grade Quality", description: "Organic solid wood moulding & 99.9% optical clear glass." },
        { icon: "center_focus_strong", title: "Instant AI Passport Studio", description: "Compliant biometric photos with background replacement." },
        { icon: "palette", title: "Custom 3D Gift Printing", description: "Personalized photo lamps, mugs, keychains & acrylic cutouts." },
        { icon: "local_shipping", title: "Raebareli Express Delivery", description: "Same-day doorstep delivery & local store pickup available." }
      ]);

      await query(
        `INSERT INTO site_settings (id, hero_config, promo_config, announcement_bar, section_headlines, features)
         VALUES (1, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        [hero, promo, annBar, headlines, feats]
      );
    }

    // Seed Shipping Settings
    const existingShip = await query(`SELECT COUNT(*) as count FROM shipping_settings`);
    if (parseInt(existingShip[0]?.count || 0, 10) === 0) {
      await query(`INSERT INTO shipping_settings (id) VALUES (1) ON CONFLICT DO NOTHING`);
    }

    // Seed Tax Settings
    const existingTax = await query(`SELECT COUNT(*) as count FROM tax_settings`);
    if (parseInt(existingTax[0]?.count || 0, 10) === 0) {
      await query(`INSERT INTO tax_settings (id) VALUES (1) ON CONFLICT DO NOTHING`);
    }

    // Seed Payment Settings
    const existingPay = await query(`SELECT COUNT(*) as count FROM payment_settings`);
    if (parseInt(existingPay[0]?.count || 0, 10) === 0) {
      await query(`INSERT INTO payment_settings (id) VALUES (1) ON CONFLICT DO NOTHING`);
    }

    console.log("Database initialized and verified successfully!");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}
