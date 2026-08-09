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

// Dynamic Admin Product File Persistence Helper
const storeJsonPath = path.join(__dirname, 'products_store.json');

function loadDynamicProducts() {
  try {
    if (fs.existsSync(storeJsonPath)) {
      const raw = fs.readFileSync(storeJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveDynamicProducts(prods) {
  try {
    fs.writeFileSync(storeJsonPath, JSON.stringify(prods, null, 2), 'utf8');
  } catch {}
}

let dynamicAdminProducts = loadDynamicProducts();

// Dynamic Registered Users File Persistence Helper
const usersJsonPath = path.join(__dirname, 'users_store.json');

function loadDynamicUsers() {
  try {
    if (fs.existsSync(usersJsonPath)) {
      const raw = fs.readFileSync(usersJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveDynamicUsers(users) {
  try {
    fs.writeFileSync(usersJsonPath, JSON.stringify(users, null, 2), 'utf8');
  } catch {}
}

let dynamicRegisteredUsers = loadDynamicUsers();

// Staff Admin Accounts (Owner & Developer & Store Admin)
export const defaultUsers = [
  { id: "usr-1", name: "Ajmal (Owner)", username: "@OWNERAJMAL69", password: "AJMA6958@", role: "owner" },
  { id: "usr-2", name: "Kaatya (Developer)", username: "@KAATYA_OG_", password: "KAATYA6547", role: "developer" },
  { id: "usr-3", name: "Store Admin", username: "admin", password: "admin123", role: "admin" },
  { id: "usr-4", name: "Store Admin", username: "@admin", password: "admin123", role: "admin" },
  { id: "usr-5", name: "Store Admin", username: "admin", password: "admin", role: "admin" }
];

const defaultCategories = [
  { id: "photo-frames", name: "Photo Frames", slug: "photo-frames", description: "Bespoke Walnut & Hardwood Custom Photo Frames", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80", icon: "filter", display_order: 1 },
  { id: "anime", name: "Anime", slug: "anime", description: "Vibrant Anime Wall Posters, Glass Art & Acrylic Displays", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80", icon: "smart_toy", display_order: 2 },
  { id: "religious", name: "Religious", slug: "religious", description: "Sacred Devotional Photo Frames, Glass Icons & Wall Shrine Prints", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80", icon: "temple_hindu", display_order: 3 },
  { id: "manwha", name: "Manwha", slug: "manwha", description: "Korean Webtoon & Manwha Character Art & Glass Prints", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80", icon: "auto_stories", display_order: 4 },
  { id: "gifts", name: "Gifts", slug: "gifts", description: "Customized Photo Lamps, Mugs, Keychains & Personal Keepsakes", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80", icon: "redeem", display_order: 5 },
  { id: "acrylic-frames", name: "Acrylic Frames", slug: "acrylic-frames", description: "Luminous Frameless Acrylic Blocks & Custom Cut Sheets", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80", icon: "aspect_ratio", display_order: 6 }
];

// Clean Base Store Seed - Dynamic products are added via Admin Panel
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
  },
  {
    id: "prod-4",
    name: "Solo Leveling - Sung Jin-Woo Shadow Monarch Glass Poster",
    slug: "solo-leveling-sung-jin-woo-glass-poster",
    category_id: "anime",
    price: 999,
    original_price: 1499,
    stock: 20,
    rating: 5.0,
    reviews_count: 15,
    description: "Vibrant HD acrylic glass print featuring Sung Jin-Woo with glowing shadow army aura.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    is_customizable: false,
    is_frame: true,
    frame_material: "Tempered Glass",
    display_order: 4
  },
  {
    id: "prod-5",
    name: "Jujutsu Kaisen - Satoru Gojo Domain Expansion Acrylic Frame",
    slug: "jujutsu-kaisen-satoru-gojo-acrylic-frame",
    category_id: "anime",
    price: 1099,
    original_price: 1599,
    stock: 18,
    rating: 4.9,
    reviews_count: 29,
    description: "Satoru Gojo Infinite Void UV acrylic glass block with metallic back layer.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    is_customizable: false,
    is_frame: true,
    frame_material: "Acrylic",
    display_order: 5
  },
  {
    id: "prod-6",
    name: "Sacred Shri Ram Darbar Gold Foil Glass Frame",
    slug: "shri-ram-darbar-gold-foil-glass-frame",
    category_id: "religious",
    price: 1299,
    original_price: 1899,
    stock: 40,
    rating: 5.0,
    reviews_count: 56,
    description: "Divine gold embossed 3D glass print of Lord Ram, Sita, Lakshman & Hanuman with polished teak finish.",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    is_customizable: false,
    is_frame: true,
    frame_material: "Gold Foil & Teak Wood",
    display_order: 6
  },
  {
    id: "prod-7",
    name: "Radha Krishna Devotional Acrylic Wall Print",
    slug: "radha-krishna-devotional-acrylic-wall-print",
    category_id: "religious",
    price: 1149,
    original_price: 1649,
    stock: 22,
    rating: 4.9,
    reviews_count: 31,
    description: "Eternal Love Radha Krishna glowing acrylic wall frame with scratch-resistant coat.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    is_customizable: false,
    is_frame: true,
    frame_material: "Acrylic Glass",
    display_order: 7
  },
  {
    id: "prod-8",
    name: "Tower of God - Bam & Khun Manwha Glass Art",
    slug: "tower-of-god-bam-khun-manwha-glass-art",
    category_id: "manwha",
    price: 949,
    original_price: 1399,
    stock: 12,
    rating: 4.8,
    reviews_count: 14,
    description: "Korean Webtoon & Manwha character glass poster print.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    is_customizable: false,
    is_frame: true,
    frame_material: "Glass",
    display_order: 8
  },
  {
    id: "prod-9",
    name: "Custom Heat-Sensitive Magic Photo Mug",
    slug: "custom-heat-sensitive-magic-photo-mug",
    category_id: "gifts",
    price: 499,
    original_price: 799,
    stock: 50,
    rating: 4.9,
    reviews_count: 88,
    description: "Black ceramic mug that reveals your custom photo when hot liquid is poured.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    is_customizable: true,
    is_frame: false,
    frame_material: "Ceramic",
    display_order: 9
  },
  {
    id: "prod-10",
    name: "Customized Acrylic Keychain Set (Pack of 3)",
    slug: "customized-acrylic-keychain-set",
    category_id: "gifts",
    price: 299,
    original_price: 499,
    stock: 100,
    rating: 4.8,
    reviews_count: 65,
    description: "Personalized double-sided acrylic photo keychains with stainless steel ring.",
    image: "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=80",
    is_customizable: true,
    is_frame: false,
    frame_material: "Acrylic",
    display_order: 10
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

// Banners JSON persistence helper
const bannersJsonPath = path.join(__dirname, 'banners_store.json');
function loadDynamicBanners() {
  try {
    if (fs.existsSync(bannersJsonPath)) {
      const raw = fs.readFileSync(bannersJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [...defaultBanners];
}
function saveDynamicBanners(banners) {
  try {
    fs.writeFileSync(bannersJsonPath, JSON.stringify(banners, null, 2), 'utf8');
  } catch {}
}

// Categories JSON persistence helper
const categoriesJsonPath = path.join(__dirname, 'categories_store.json');
function loadDynamicCategories() {
  try {
    if (fs.existsSync(categoriesJsonPath)) {
      const raw = fs.readFileSync(categoriesJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [...defaultCategories];
}
function saveDynamicCategories(cats) {
  try {
    fs.writeFileSync(categoriesJsonPath, JSON.stringify(cats, null, 2), 'utf8');
  } catch {}
}

// Coupons JSON persistence helper
const defaultCoupons = [
  { id: "coup-1", code: "WELCOME10", discount_type: "percentage", discount_value: 10, min_spend: 499, expiry_date: "2027-12-31", usage_count: 0, is_active: 1 },
  { id: "coup-2", code: "GLASS100", discount_type: "fixed", discount_value: 100, min_spend: 999, expiry_date: "2027-12-31", usage_count: 0, is_active: 1 }
];

const couponsJsonPath = path.join(__dirname, 'coupons_store.json');
function loadDynamicCoupons() {
  try {
    if (fs.existsSync(couponsJsonPath)) {
      const raw = fs.readFileSync(couponsJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [...defaultCoupons];
}
function saveDynamicCoupons(coups) {
  try {
    fs.writeFileSync(couponsJsonPath, JSON.stringify(coups, null, 2), 'utf8');
  } catch {}
}

// Settings JSON persistence helper
const settingsJsonPath = path.join(__dirname, 'settings_store.json');
function loadDynamicSettings() {
  try {
    if (fs.existsSync(settingsJsonPath)) {
      const raw = fs.readFileSync(settingsJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}
  return null;
}
function saveDynamicSettings(settingsObj) {
  try {
    fs.writeFileSync(settingsJsonPath, JSON.stringify(settingsObj, null, 2), 'utf8');
  } catch {}
}

const loadedSettings = loadDynamicSettings();

// Memory Data Store for High-Performance Fallback
const memoryStore = {
  products: [...defaultProducts, ...dynamicAdminProducts],
  categories: loadDynamicCategories(),
  banners: loadDynamicBanners(),
  users: [...defaultUsers, ...dynamicRegisteredUsers],
  orders: [],
  coupons: loadDynamicCoupons(),
  reviews: [],
  siteSettings: loadedSettings?.siteSettings || {
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
    hero_config: '{}',
    promo_config: '{}',
    announcement_bar: '{}',
    section_headlines: '{}',
    features: '[]'
  },
  paymentSettings: loadedSettings?.paymentSettings || {
    id: 1,
    qr_code_enabled: 1,
    upi_id: 'qualityglass@upi',
    account_holder: 'Quality Glass Emporium',
    qr_image_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium',
    qr_instructions: 'Scan QR code using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR reference number and upload the payment screenshot.',
    bank_transfer_enabled: 1,
    bank_name: 'State Bank of India',
    account_number: '389201004921',
    ifsc_code: 'SBIN0000465',
    branch: 'Raebareli Main Branch',
    bank_instructions: 'Transfer total order amount via IMPS / NEFT / RTGS to store bank account. Enter 12-digit Bank UTR reference number and upload screenshot.',
    cod_enabled: 1
  },
  shippingSettings: loadedSettings?.shippingSettings || {
    id: 1,
    free_shipping_threshold: 999,
    flat_shipping_rate: 79,
    express_delivery_rate: 149,
    enable_local_pickup: 1,
    estimated_delivery_days: '2-4 Business Days'
  },
  taxSettings: loadedSettings?.taxSettings || {
    id: 1,
    tax_rate_percentage: 18,
    include_tax_in_price: 1,
    gstin_number: '09AAAFQ1234A1Z5'
  }
};

function persistAllSettings() {
  saveDynamicSettings({
    siteSettings: memoryStore.siteSettings,
    paymentSettings: memoryStore.paymentSettings,
    shippingSettings: memoryStore.shippingSettings,
    taxSettings: memoryStore.taxSettings
  });
}

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
    return new Promise((resolve) => {
      const trimmed = sqlText.trim().toUpperCase();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
        sqliteDb.all(sqlText, params, (err, rows) => {
          if (err) {
            console.error("SQLite select error:", err.message, sqlText);
            resolve([]);
          } else {
            resolve(rows || []);
          }
        });
      } else {
        sqliteDb.run(sqlText, params, function (err) {
          if (err) {
            console.error("SQLite run error:", err.message, sqlText);
            resolve([{ id: 1, changes: 0 }]);
          } else {
            resolve([{ id: this.lastID, changes: this.changes }]);
          }
        });
      }
    });
  } else {
    // Fallback Memory Data Engine with JSON persistence
    const sqlUpper = sqlText.toUpperCase();
    
    if (sqlUpper.startsWith('SELECT')) {
      if (sqlUpper.includes('FROM PRODUCTS')) {
        let list = [...memoryStore.products];
        if (params.length > 0 && typeof params[0] === 'string' && params[0] !== 'all') {
          const cat = params[0].toLowerCase();
          list = list.filter(p => (p.category_id && p.category_id.toLowerCase() === cat) || (p.slug && p.slug.toLowerCase() === cat));
        }
        return list;
      }
      if (sqlUpper.includes('FROM CATEGORIES')) return memoryStore.categories;
      if (sqlUpper.includes('FROM BANNERS')) {
        return memoryStore.banners.map(b => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          imageUrl: b.image_url || b.imageUrl,
          ctaText: b.cta_text || b.ctaText,
          ctaLink: b.cta_link || b.ctaLink,
          displayOrder: b.display_order || b.displayOrder || 1,
          isActive: b.is_active !== undefined ? Boolean(b.is_active) : true
        }));
      }
      if (sqlUpper.includes('FROM USERS')) {
        if (params.length > 0 && typeof params[0] === 'string') {
          const target = params[0].trim().toLowerCase().replace(/^@/, '');
          return memoryStore.users.filter(u => u.username && u.username.trim().toLowerCase().replace(/^@/, '') === target);
        }
        return memoryStore.users;
      }
      if (sqlUpper.includes('FROM ORDERS')) return memoryStore.orders;
      if (sqlUpper.includes('FROM REVIEWS')) return memoryStore.reviews;
      if (sqlUpper.includes('FROM COUPONS')) {
        if (params.length > 0 && typeof params[0] === 'string') {
          const targetCode = params[0].trim().toUpperCase();
          return memoryStore.coupons.filter(c => c.code && c.code.trim().toUpperCase() === targetCode);
        }
        return memoryStore.coupons.map(c => ({
          id: c.id,
          code: c.code,
          discountType: c.discount_type || c.discountType || 'percentage',
          discountValue: parseFloat(c.discount_value || c.discountValue || 0),
          minSpend: parseFloat(c.min_spend || c.minSpend || 0),
          expiryDate: c.expiry_date || c.expiryDate || '2027-12-31',
          usageCount: parseInt(c.usage_count || c.usageCount || 0, 10),
          isActive: c.is_active !== undefined ? Boolean(c.is_active) : true,
          discount_type: c.discount_type || c.discountType || 'percentage',
          discount_value: c.discount_value || c.discountValue || 0,
          min_spend: c.min_spend || c.minSpend || 0,
          expiry_date: c.expiry_date || c.expiryDate || '2027-12-31'
        }));
      }
      if (sqlUpper.includes('FROM PAYMENT_SETTINGS')) return [memoryStore.paymentSettings];
      if (sqlUpper.includes('FROM SITE_SETTINGS')) return [memoryStore.siteSettings];
      if (sqlUpper.includes('FROM SHIPPING_SETTINGS')) return [memoryStore.shippingSettings];
      if (sqlUpper.includes('FROM TAX_SETTINGS')) return [memoryStore.taxSettings];
      return [{ count: 1, total: 0 }];
    } else if (sqlUpper.startsWith('INSERT INTO COUPONS')) {
      const [cId, code, discountType, discountValue, minSpend, expiryDate] = params;
      const newCoupon = {
        id: cId,
        code: code ? code.toUpperCase() : '',
        discount_type: discountType || 'percentage',
        discount_value: parseFloat(discountValue || 0),
        min_spend: parseFloat(minSpend || 0),
        expiry_date: expiryDate || '2027-12-31',
        usage_count: 0,
        is_active: 1
      };
      memoryStore.coupons.unshift(newCoupon);
      saveDynamicCoupons(memoryStore.coupons);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('DELETE FROM COUPONS')) {
      const targetId = params[0];
      memoryStore.coupons = memoryStore.coupons.filter(c => c.id !== targetId && c.code !== targetId);
      saveDynamicCoupons(memoryStore.coupons);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('UPDATE PAYMENT_SETTINGS')) {
      const [qrEnabled, upiId, accountHolder, qrImageUrl, qrInstructions, bankEnabled, bankName, accountNumber, ifscCode, branch, bankInstructions, codEnabled] = params;
      memoryStore.paymentSettings = {
        ...memoryStore.paymentSettings,
        qr_code_enabled: qrEnabled ? 1 : 0,
        upi_id: upiId !== undefined ? upiId : memoryStore.paymentSettings.upi_id,
        account_holder: accountHolder !== undefined ? accountHolder : memoryStore.paymentSettings.account_holder,
        qr_image_url: qrImageUrl !== undefined ? qrImageUrl : memoryStore.paymentSettings.qr_image_url,
        qr_instructions: qrInstructions !== undefined ? qrInstructions : memoryStore.paymentSettings.qr_instructions,
        bank_transfer_enabled: bankEnabled ? 1 : 0,
        bank_name: bankName !== undefined ? bankName : memoryStore.paymentSettings.bank_name,
        account_number: accountNumber !== undefined ? accountNumber : memoryStore.paymentSettings.account_number,
        ifsc_code: ifscCode !== undefined ? ifscCode : memoryStore.paymentSettings.ifsc_code,
        branch: branch !== undefined ? branch : memoryStore.paymentSettings.branch,
        bank_instructions: bankInstructions !== undefined ? bankInstructions : memoryStore.paymentSettings.bank_instructions,
        cod_enabled: codEnabled ? 1 : 0
      };
      persistAllSettings();
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('UPDATE SITE_SETTINGS')) {
      if (sqlUpper.includes('HERO_CONFIG')) {
        const [hero, promo, ann, sec, feat] = params;
        memoryStore.siteSettings = {
          ...memoryStore.siteSettings,
          hero_config: hero,
          promo_config: promo,
          announcement_bar: ann,
          section_headlines: sec,
          features: feat
        };
      } else {
        const [sName, tag, eml, ph, addr, lg, mTitle, mDesc, mKey] = params;
        memoryStore.siteSettings = {
          ...memoryStore.siteSettings,
          store_name: sName || memoryStore.siteSettings.store_name,
          tagline: tag || memoryStore.siteSettings.tagline,
          email: eml || memoryStore.siteSettings.email,
          phone: ph || memoryStore.siteSettings.phone,
          address: addr || memoryStore.siteSettings.address,
          logo: lg || memoryStore.siteSettings.logo,
          meta_title: mTitle || memoryStore.siteSettings.meta_title,
          meta_description: mDesc || memoryStore.siteSettings.meta_description,
          meta_keywords: mKey || memoryStore.siteSettings.meta_keywords
        };
      }
      persistAllSettings();
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('UPDATE SHIPPING_SETTINGS')) {
      const [rate, thresh] = params;
      if (rate !== null && rate !== undefined) memoryStore.shippingSettings.flat_shipping_rate = rate;
      if (thresh !== null && thresh !== undefined) memoryStore.shippingSettings.free_shipping_threshold = thresh;
      persistAllSettings();
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('UPDATE TAX_SETTINGS')) {
      const [rate] = params;
      if (rate !== null && rate !== undefined) memoryStore.taxSettings.tax_rate_percentage = rate;
      persistAllSettings();
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('INSERT INTO BANNERS')) {
      const [bId, title, subtitle, imageUrl, ctaText, ctaLink] = params;
      const newBanner = { id: bId, title, subtitle, image_url: imageUrl, cta_text: ctaText, cta_link: ctaLink, display_order: memoryStore.banners.length + 1, is_active: true };
      memoryStore.banners.push(newBanner);
      saveDynamicBanners(memoryStore.banners);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('DELETE FROM BANNERS')) {
      const bannerId = params[0];
      memoryStore.banners = memoryStore.banners.filter(b => b.id !== bannerId);
      saveDynamicBanners(memoryStore.banners);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('INSERT INTO CATEGORIES')) {
      const [cId, name, slug, description, image, icon] = params;
      const newCat = { id: cId, name, slug, description, image, icon: icon || 'category', display_order: memoryStore.categories.length + 1 };
      memoryStore.categories.push(newCat);
      saveDynamicCategories(memoryStore.categories);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('UPDATE CATEGORIES')) {
      const catId = params[params.length - 1];
      const found = memoryStore.categories.find(c => c.id === catId);
      if (found && params.length >= 4) {
        found.name = params[0];
        found.description = params[1];
        found.image = params[2];
        found.icon = params[3];
        saveDynamicCategories(memoryStore.categories);
      }
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('DELETE FROM CATEGORIES')) {
      const catId = params[0];
      memoryStore.categories = memoryStore.categories.filter(c => c.id !== catId);
      saveDynamicCategories(memoryStore.categories);
      return [{ id: 1, changes: 1 }];
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
      dynamicAdminProducts.unshift(newProd);
      saveDynamicProducts(dynamicAdminProducts);
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('UPDATE PRODUCTS')) {
      const prodId = params[params.length - 1];
      const found = memoryStore.products.find(p => p.id === prodId);
      if (found && params.length >= 11) {
        found.name = params[0];
        found.slug = params[1];
        found.category_id = params[2];
        found.price = params[3];
        found.original_price = params[4];
        found.stock = params[5];
        found.description = params[6];
        found.image = params[7];
        found.is_customizable = params[8];
        found.is_frame = params[9];
        found.frame_material = params[10];

        const dynFound = dynamicAdminProducts.find(p => p.id === prodId);
        if (dynFound) {
          Object.assign(dynFound, found);
          saveDynamicProducts(dynamicAdminProducts);
        }
      }
      return [{ id: 1, changes: 1 }];
    } else if (sqlUpper.startsWith('INSERT INTO USERS')) {
      const [newId, name, username, password, role] = params;
      const newUser = { id: newId, name, username, password, role: role || 'customer', created_at: new Date().toISOString() };
      memoryStore.users.push(newUser);
      dynamicRegisteredUsers.push(newUser);
      saveDynamicUsers(dynamicRegisteredUsers);
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
      dynamicAdminProducts = dynamicAdminProducts.filter(p => p.id !== prodId);
      saveDynamicProducts(dynamicAdminProducts);
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
      await pgPool.query(`CREATE TABLE IF NOT EXISTS site_settings (id INT PRIMARY KEY DEFAULT 1, store_name TEXT, tagline TEXT, email TEXT, phone TEXT, address TEXT, currency TEXT, logo TEXT, meta_title TEXT, meta_description TEXT, meta_keywords TEXT, hero_config TEXT, promo_config TEXT, announcement_bar TEXT, section_headlines TEXT, features TEXT)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS shipping_settings (id INT PRIMARY KEY DEFAULT 1, free_shipping_threshold NUMERIC(10,2), flat_shipping_rate NUMERIC(10,2), express_delivery_rate NUMERIC(10,2), enable_local_pickup BOOLEAN, estimated_delivery_days VARCHAR(100))`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS tax_settings (id INT PRIMARY KEY DEFAULT 1, tax_rate_percentage NUMERIC(5,2), include_tax_in_price BOOLEAN, gstin_number VARCHAR(100))`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS payment_settings (id INT PRIMARY KEY DEFAULT 1, qr_code_enabled INT, upi_id VARCHAR(255), account_holder VARCHAR(255), qr_image_url TEXT, qr_instructions TEXT, bank_transfer_enabled INT, bank_name VARCHAR(255), account_number VARCHAR(255), ifsc_code VARCHAR(100), branch VARCHAR(255), bank_instructions TEXT, cod_enabled INT)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS coupons (id VARCHAR(255) PRIMARY KEY, code VARCHAR(100) UNIQUE, discount_type VARCHAR(50), discount_value NUMERIC(10,2), min_spend NUMERIC(10,2), expiry_date VARCHAR(100), usage_count INT DEFAULT 0, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pgPool.query(`CREATE TABLE IF NOT EXISTS reviews (id VARCHAR(255) PRIMARY KEY, product_id VARCHAR(255), customer_name VARCHAR(255), rating INT, comment TEXT, is_approved BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

      // Seed settings row id=1
      await pgPool.query(`INSERT INTO site_settings (id, store_name, tagline, email, phone, address, currency, logo, meta_title, meta_description, meta_keywords) VALUES (1, 'Quality Glass Emporium', 'Bespoke Framing, Photo Studio & Customized Gifts', 'contact@qualityglassemporium.com', '+91 94150 12345', 'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh', '₹', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80', 'Quality Glass Emporium | Custom Frames, Passport Studio & Gifts', 'Bespoke photo frames, acrylic sheets, canvas prints, passport photos, photo lamps, custom mugs & gifts in Raebareli.', 'photo frames, acrylic frames, canvas prints, passport photos, photo studio, custom gifts, photo lamps, mugs, keychains, Raebareli') ON CONFLICT DO NOTHING`);
      await pgPool.query(`INSERT INTO shipping_settings (id, free_shipping_threshold, flat_shipping_rate, express_delivery_rate) VALUES (1, 999.00, 79.00, 149.00) ON CONFLICT DO NOTHING`);
      await pgPool.query(`INSERT INTO tax_settings (id, tax_rate_percentage) VALUES (1, 18.00) ON CONFLICT DO NOTHING`);
      await pgPool.query(`INSERT INTO payment_settings (id, qr_code_enabled, upi_id, account_holder, qr_image_url, qr_instructions, bank_transfer_enabled, bank_name, account_number, ifsc_code, branch, bank_instructions, cod_enabled) VALUES (1, 1, 'qualityglass@upi', 'Quality Glass Emporium', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium', 'Scan QR code using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR reference number and upload payment screenshot.', 1, 'State Bank of India', '389201004921', 'SBIN0000465', 'Raebareli Main Branch', 'Transfer total order amount via IMPS / NEFT / RTGS to store bank account.', 1) ON CONFLICT DO NOTHING`);

      for (const u of defaultUsers) {
        await pgPool.query(`INSERT INTO users (id, name, username, password, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, [u.id, u.name, u.username, u.password, u.role]);
      }

      for (const p of defaultProducts) {
        await pgPool.query(
          `INSERT INTO products (id, name, slug, category_id, price, original_price, stock, rating, reviews_count, description, image, is_customizable, is_frame, frame_material, display_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           ON CONFLICT DO NOTHING`,
          [p.id, p.name, p.slug, p.category_id, p.price, p.original_price, p.stock, p.rating || 5.0, p.reviews_count || 0, p.description, p.image, p.is_customizable, p.is_frame, p.frame_material, p.display_order]
        );
      }

      for (const c of defaultCategories) {
        await pgPool.query(
          `INSERT INTO categories (id, name, slug, description, image, icon, display_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT DO NOTHING`,
          [c.id, c.name, c.slug, c.description, c.image, c.icon, c.display_order]
        );
      }

      for (const b of defaultBanners) {
        await pgPool.query(
          `INSERT INTO banners (id, title, subtitle, image_url, cta_text, cta_link, display_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT DO NOTHING`,
          [b.id, b.title, b.subtitle, b.image_url, b.cta_text, b.cta_link, b.display_order, b.is_active]
        );
      }
    } catch (err) {
      console.warn("Init DB Postgres notice:", err.message);
    }
  }

  if (sqliteDb) {
    sqliteDb.serialize(() => {
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT, slug TEXT, category_id TEXT, price REAL, original_price REAL, stock INTEGER, rating REAL, reviews_count INTEGER, description TEXT, image TEXT, is_customizable INTEGER, is_frame INTEGER, frame_material TEXT, display_order INTEGER, created_at TEXT)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, username TEXT UNIQUE, password TEXT, role TEXT, created_at TEXT)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, slug TEXT, description TEXT, image TEXT, icon TEXT, display_order INTEGER, created_at TEXT)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS banners (id TEXT PRIMARY KEY, title TEXT, subtitle TEXT, image_url TEXT, cta_text TEXT, cta_link TEXT, display_order INTEGER, is_active INTEGER, created_at TEXT)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, order_number TEXT, user_id TEXT, username TEXT, customer_name TEXT, customer_email TEXT, customer_phone TEXT, shipping_address TEXT, total_amount REAL, discount_amount REAL, shipping_fee REAL, tax_amount REAL, payment_method TEXT, utr_number TEXT, payment_screenshot TEXT, payment_status TEXT, payment_approval_status TEXT, order_status TEXT, tracking_number TEXT, items TEXT, admin_notes TEXT, created_at TEXT)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY DEFAULT 1, store_name TEXT, tagline TEXT, email TEXT, phone TEXT, address TEXT, currency TEXT, logo TEXT, meta_title TEXT, meta_description TEXT, meta_keywords TEXT, hero_config TEXT, promo_config TEXT, announcement_bar TEXT, section_headlines TEXT, features TEXT)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS shipping_settings (id INTEGER PRIMARY KEY DEFAULT 1, free_shipping_threshold REAL DEFAULT 999.00, flat_shipping_rate REAL DEFAULT 79.00, express_delivery_rate REAL DEFAULT 149.00, enable_local_pickup INTEGER DEFAULT 1, estimated_delivery_days TEXT DEFAULT '2-4 Business Days')`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS tax_settings (id INTEGER PRIMARY KEY DEFAULT 1, tax_rate_percentage REAL DEFAULT 18.00, include_tax_in_price INTEGER DEFAULT 1, gstin_number TEXT DEFAULT '09AAAFQ1234A1Z5')`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS payment_settings (id INTEGER PRIMARY KEY DEFAULT 1, qr_code_enabled INTEGER DEFAULT 1, upi_id TEXT DEFAULT 'qualityglass@upi', account_holder TEXT DEFAULT 'Quality Glass Emporium', qr_image_url TEXT DEFAULT 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium', qr_instructions TEXT DEFAULT 'Scan QR code using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR reference number and upload payment screenshot.', bank_transfer_enabled INTEGER DEFAULT 1, bank_name TEXT DEFAULT 'State Bank of India', account_number TEXT DEFAULT '389201004921', ifsc_code TEXT DEFAULT 'SBIN0000465', branch TEXT DEFAULT 'Raebareli Main Branch', bank_instructions TEXT DEFAULT 'Transfer total order amount via IMPS / NEFT / RTGS to store bank account.', cod_enabled INTEGER DEFAULT 1)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS coupons (id TEXT PRIMARY KEY, code TEXT UNIQUE, discount_type TEXT, discount_value REAL, min_spend REAL, expiry_date TEXT, usage_count INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at TEXT)`);
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, product_id TEXT, customer_name TEXT, rating INTEGER, comment TEXT, is_approved INTEGER DEFAULT 1, created_at TEXT)`);

      // Seed settings row id=1
      sqliteDb.run(`INSERT OR IGNORE INTO site_settings (id, store_name, tagline, email, phone, address, currency, logo, meta_title, meta_description, meta_keywords) VALUES (1, 'Quality Glass Emporium', 'Bespoke Framing, Photo Studio & Customized Gifts', 'contact@qualityglassemporium.com', '+91 94150 12345', 'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh', '₹', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80', 'Quality Glass Emporium | Custom Frames, Passport Studio & Gifts', 'Bespoke photo frames, acrylic sheets, canvas prints, passport photos, photo lamps, custom mugs & gifts in Raebareli.', 'photo frames, acrylic frames, canvas prints, passport photos, photo studio, custom gifts, photo lamps, mugs, keychains, Raebareli')`);
      sqliteDb.run(`INSERT OR IGNORE INTO shipping_settings (id, free_shipping_threshold, flat_shipping_rate, express_delivery_rate) VALUES (1, 999.00, 79.00, 149.00)`);
      sqliteDb.run(`INSERT OR IGNORE INTO tax_settings (id, tax_rate_percentage) VALUES (1, 18.00)`);
      sqliteDb.run(`INSERT OR IGNORE INTO payment_settings (id, qr_code_enabled, upi_id, account_holder, qr_image_url, qr_instructions, bank_transfer_enabled, bank_name, account_number, ifsc_code, branch, bank_instructions, cod_enabled) VALUES (1, 1, 'qualityglass@upi', 'Quality Glass Emporium', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium', 'Scan QR code using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR reference number and upload payment screenshot.', 1, 'State Bank of India', '389201004921', 'SBIN0000465', 'Raebareli Main Branch', 'Transfer total order amount via IMPS / NEFT / RTGS to store bank account.', 1)`);

      for (const p of defaultProducts) {
        sqliteDb.run(
          `INSERT OR IGNORE INTO products (id, name, slug, category_id, price, original_price, stock, rating, reviews_count, description, image, is_customizable, is_frame, frame_material, display_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [p.id, p.name, p.slug, p.category_id, p.price, p.original_price, p.stock, p.rating || 5.0, p.reviews_count || 0, p.description, p.image, p.is_customizable ? 1 : 0, p.is_frame ? 1 : 0, p.frame_material, p.display_order]
        );
      }

      for (const u of defaultUsers) {
        sqliteDb.run(
          `INSERT OR IGNORE INTO users (id, name, username, password, role, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          [u.id, u.name, u.username, u.password, u.role]
        );
      }

      for (const c of defaultCategories) {
        sqliteDb.run(
          `INSERT OR IGNORE INTO categories (id, name, slug, description, image, icon, display_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [c.id, c.name, c.slug, c.description, c.image, c.icon, c.display_order]
        );
      }

      for (const b of defaultBanners) {
        sqliteDb.run(
          `INSERT OR IGNORE INTO banners (id, title, subtitle, image_url, cta_text, cta_link, display_order, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [b.id, b.title, b.subtitle, b.image_url, b.cta_text, b.cta_link, b.display_order, b.is_active ? 1 : 0]
        );
      }
    });
  }
}

// Auto-run initDb
initDb().catch(() => {});

