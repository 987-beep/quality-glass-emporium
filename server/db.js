import pg from 'pg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isPostgres = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
const isVercel = Boolean(process.env.VERCEL);

let pgPool = null;
let sqliteDb = null;

if (isPostgres) {
  try {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    pgPool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  } catch (err) {
    console.warn("Postgres pool creation notice:", err.message);
  }
} else if (!isVercel) {
  try {
    const sqlite3Mod = await import('sqlite3');
    const sqlite3 = sqlite3Mod.default || sqlite3Mod;
    const dbPath = path.join(__dirname, 'database.sqlite');
    sqliteDb = new sqlite3.Database(dbPath);
  } catch (err) {
    console.warn("SQLite optional load notice:", err.message);
  }
}

// Staff Admin Accounts (Owner & Developer)
export const defaultUsers = [
  { id: "usr-1", name: "Ajmal (Owner)", username: "@OWNERAJMAL69", password: "AJMA6958@", role: "owner" },
  { id: "usr-2", name: "Kaatya (Developer)", username: "@KAATYA_OG_", password: "KAATYA6547", role: "developer" }
];

const defaultCategories = [
  { id: "anime", name: "Anime", slug: "anime", description: "Vibrant Anime Wall Posters, Glass Art & Acrylic Displays", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80", icon: "smart_toy", display_order: 1 },
  { id: "religious", name: "Religious", slug: "religious", description: "Sacred Devotional Photo Frames, Glass Icons & Wall Shrine Prints", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80", icon: "temple_hindu", display_order: 2 },
  { id: "manwha", name: "Manwha", slug: "manwha", description: "Korean Webtoon & Manwha Character Art & Glass Prints", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80", icon: "auto_stories", display_order: 3 },
  { id: "gifts", name: "Gifts", slug: "gifts", description: "Customized Photo Lamps, Mugs, Keychains & Personal Keepsakes", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80", icon: "redeem", display_order: 4 },
  { id: "acrylic-frames", name: "Acrylic Frames", slug: "acrylic-frames", description: "Luminous Frameless Acrylic Blocks & Custom Cut Sheets", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80", icon: "aspect_ratio", display_order: 5 }
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
    category_id: "gifts",
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

const defaultBanners = [
  {
    id: "banner-1",
    title: "Curate Your Space with Bespoke Framing",
    subtitle: "Museum-quality wooden & acrylic frames handcrafted with precision and glass clarity.",
    image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
    cta_text: "Explore Collections",
    cta_link: "/collection",
    display_order: 1,
    is_active: true
  },
  {
    id: "banner-2",
    title: "Custom Photo Studio & Passport Prints",
    subtitle: "Instant passport photos, acrylic wall sheets & personalized gifts crafted with love.",
    image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80",
    cta_text: "Passport Photo Studio",
    cta_link: "/passport-studio",
    display_order: 2,
    is_active: true
  }
];

// Memory Data Store for High-Performance Fallback
const memoryStore = {
  products: [...defaultProducts],
  categories: [...defaultCategories],
  banners: [...defaultBanners],
  users: [...defaultUsers],
  orders: [],
  coupons: [],
  reviews: [],
  settings: [{
    id: 1,
    store_name: 'Quality Glass Emporium',
    tagline: 'Bespoke Framing, Photo Studio & Customized Gifts',
    email: 'contact@qualityglassemporium.com',
    phone: '+91 94150 12345',
    address: 'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh',
    currency: '₹',
    logo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    meta_title: 'Quality Glass Emporium | Custom Frames, Passport Studio & Gifts',
    meta_description: 'Bespoke photo frames, acrylic sheets, canvas prints, passport photos, photo lamps, custom mugs & gifts in Raebareli.',
    meta_keywords: 'photo frames, acrylic frames, canvas prints, passport photos, photo studio, custom gifts, photo lamps, mugs, keychains, Raebareli',
    flat_shipping_rate: 79,
    free_shipping_threshold: 999,
    tax_rate_percentage: 18,
    qr_code_enabled: 1,
    upi_id: 'qualityglass@upi',
    account_holder: 'Quality Glass Emporium',
    qr_image_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium',
    qr_instructions: 'Scan QR code using PhonePe, GPay, Paytm or BHIM. Enter your 12-digit UTR number.',
    bank_transfer_enabled: 1,
    bank_name: 'State Bank of India',
    account_number: '389201004921',
    ifsc_code: 'SBIN0000465',
    branch: 'Raebareli Main Branch',
    cod_enabled: 1
  }]
};

// Universal Async Query Runner
export async function query(sqlText, params = []) {
  if (isPostgres && pgPool) {
    let pgSql = sqlText;
    let paramIndex = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${paramIndex++}`);
    }
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  } else if (sqliteDb) {
    return new Promise((resolve, reject) => {
      const trimmed = sqlText.trim().toUpperCase();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
        sqliteDb.all(sqlText, params, (err, rows) => {
          if (err) resolve([]);
          else resolve(rows || []);
        });
      } else {
        sqliteDb.run(sqlText, params, function (err) {
          if (err) resolve([{ id: 1, changes: 1 }]);
          else resolve([{ id: this.lastID, changes: this.changes }]);
        });
      }
    });
  } else {
    // Fallback Memory Data Engine
    const sqlUpper = sqlText.toUpperCase();
    
    if (sqlUpper.startsWith('SELECT')) {
      if (sqlUpper.includes('FROM PRODUCTS')) return memoryStore.products;
      if (sqlUpper.includes('FROM CATEGORIES')) return memoryStore.categories;
      if (sqlUpper.includes('FROM BANNERS')) return memoryStore.banners;
      if (sqlUpper.includes('FROM USERS')) return memoryStore.users;
      if (sqlUpper.includes('FROM ORDERS')) return memoryStore.orders;
      if (sqlUpper.includes('FROM REVIEWS')) return memoryStore.reviews;
      if (sqlUpper.includes('FROM COUPONS')) return memoryStore.coupons;
      if (sqlUpper.includes('FROM SITE_SETTINGS') || sqlUpper.includes('FROM SHIPPING_SETTINGS') || sqlUpper.includes('FROM TAX_SETTINGS') || sqlUpper.includes('FROM PAYMENT_SETTINGS') || sqlUpper.includes('FROM SETTINGS')) return memoryStore.settings;
      return [{ count: 1, total: 0 }];
    } else if (sqlUpper.startsWith('INSERT INTO ORDERS')) {
      const [orderId, orderNumber, userId, username, customerName, customerEmail, customerPhone, shippingAddress, totalAmount, discountAmount, shippingFee, taxAmount, paymentMethod, utrNumber, paymentScreenshot, paymentStatus, paymentApprovalStatus, orderStatus, trackingNumber, itemsJson] = params;
      const newOrder = {
        id: orderId,
        order_number: orderNumber,
        user_id: userId,
        username,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        shipping_fee: shippingFee,
        tax_amount: taxAmount,
        payment_method: paymentMethod,
        utr_number: utrNumber,
        payment_screenshot: paymentScreenshot,
        payment_status: paymentStatus,
        payment_approval_status: paymentApprovalStatus,
        order_status: orderStatus,
        tracking_number: trackingNumber,
        items: itemsJson,
        created_at: new Date().toISOString()
      };
      memoryStore.orders.unshift(newOrder);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('INSERT INTO PRODUCTS')) {
      const [prodId, cleanName, slug, categoryId, price, originalPrice, stock, description, image, isCustomizable, isFrame, frameMaterial] = params;
      const newProd = {
        id: prodId,
        name: cleanName,
        slug,
        category_id: categoryId,
        price,
        original_price: originalPrice,
        stock,
        description,
        image,
        is_customizable: isCustomizable,
        is_frame: isFrame,
        frame_material: frameMaterial,
        rating: 5.0,
        reviews_count: 0,
        display_order: 1,
        created_at: new Date().toISOString()
      };
      memoryStore.products.unshift(newProd);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('UPDATE ORDERS')) {
      const orderId = params[params.length - 1];
      const found = memoryStore.orders.find(o => o.id === orderId);
      if (found) {
        if (params.length === 5) {
          found.payment_approval_status = params[0];
          found.payment_status = params[1];
          found.order_status = params[2];
          found.admin_notes = params[3];
        } else if (params.length === 3) {
          found.order_status = params[0];
          found.tracking_number = params[1];
        }
      }
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('DELETE FROM PRODUCTS')) {
      const prodId = params[0];
      memoryStore.products = memoryStore.products.filter(p => p.id !== prodId);
      return [{ id: 1, changes: 1 }];
    }

    return [{ id: 1, changes: 1 }];
  }
}

// Initialize Tables
export async function initDb() {
  if (isPostgres && pgPool) {
    try {
      await pgPool.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), username VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS products (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), slug VARCHAR(255), category_id VARCHAR(255), price NUMERIC(10,2), original_price NUMERIC(10,2), stock INT, rating NUMERIC(3,1), reviews_count INT, description TEXT, image TEXT, is_customizable BOOLEAN, is_frame BOOLEAN, frame_material VARCHAR(255), display_order INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS orders (id VARCHAR(255) PRIMARY KEY, order_number VARCHAR(255), user_id VARCHAR(255), username VARCHAR(255), customer_name VARCHAR(255), customer_email VARCHAR(255), customer_phone VARCHAR(255), shipping_address TEXT, total_amount NUMERIC(10,2), discount_amount NUMERIC(10,2), shipping_fee NUMERIC(10,2), tax_amount NUMERIC(10,2), payment_method VARCHAR(255), utr_number VARCHAR(255), payment_screenshot TEXT, payment_status VARCHAR(255), payment_approval_status VARCHAR(255), order_status VARCHAR(255), tracking_number VARCHAR(255), items JSONB, admin_notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS categories (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), slug VARCHAR(255), description TEXT, image TEXT, icon VARCHAR(100), display_order INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS banners (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), subtitle TEXT, image_url TEXT, cta_text VARCHAR(100), cta_link VARCHAR(255), display_order INT, is_active BOOLEAN, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS site_settings (id INT PRIMARY KEY DEFAULT 1, store_name VARCHAR(255), tagline TEXT, email VARCHAR(255), phone VARCHAR(100), address TEXT, currency VARCHAR(10), logo TEXT, meta_title TEXT, meta_description TEXT, meta_keywords TEXT)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS shipping_settings (id INT PRIMARY KEY DEFAULT 1, flat_shipping_rate NUMERIC(10,2), free_shipping_threshold NUMERIC(10,2), express_delivery_rate NUMERIC(10,2))`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS tax_settings (id INT PRIMARY KEY DEFAULT 1, tax_rate_percentage NUMERIC(5,2))`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS payment_settings (id INT PRIMARY KEY DEFAULT 1, qr_code_enabled BOOLEAN, upi_id VARCHAR(255), account_holder VARCHAR(255), qr_image_url TEXT, qr_instructions TEXT, bank_transfer_enabled BOOLEAN, bank_name VARCHAR(255), account_number VARCHAR(255), ifsc_code VARCHAR(255), branch VARCHAR(255), bank_instructions TEXT, cod_enabled BOOLEAN)`);

      const existingUsers = await pgPool.query(`SELECT COUNT(*) as count FROM users`);
      if (parseInt(existingUsers.rows[0]?.count || 0, 10) === 0) {
        for (const u of defaultUsers) {
          await pgPool.query(`INSERT INTO users (id, name, username, password, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, [u.id, u.name, u.username, u.password, u.role]);
        }
      }
    } catch (err) {
      console.warn("Init DB notice:", err.message);
    }
  }
}
