import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { query, initDb, defaultUsers } from './db.js';
import { generateToken, verifyToken, authMiddleware, adminOnlyMiddleware } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Schemas & Seed Defaults
initDb();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// URL Normalizer for Vercel Serverless Function Rewrites
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && !req.url.startsWith('/uploads') && !req.url.startsWith('/dist') && !req.url.includes('.')) {
    req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url;
  }
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Uploads static directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'user-photo-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Helper to parse JSON fields safely
function parseJsonField(val, fallback = {}) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// --- PUBLIC ROUTES ---

// Unified Store & SEO Settings
app.get('/api/settings', async (req, res) => {
  try {
    const siteRows = await query(`SELECT * FROM site_settings WHERE id = 1`);
    const shipRows = await query(`SELECT * FROM shipping_settings WHERE id = 1`);
    const taxRows = await query(`SELECT * FROM tax_settings WHERE id = 1`);

    const site = siteRows[0] || {};
    const ship = shipRows[0] || {};
    const tax = taxRows[0] || {};

    res.json({
      storeName: site.store_name || "Quality Glass Emporium",
      tagline: site.tagline || "Bespoke Framing, Photo Studio & Customized Gifts",
      email: site.email || "contact@qualityglassemporium.com",
      phone: site.phone || "+91 94150 12345",
      address: site.address || "Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh",
      currency: site.currency || "₹",
      logo: site.logo || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
      metaTitle: site.meta_title || "Quality Glass Emporium | Custom Frames, Passport Studio & Gifts",
      metaDescription: site.meta_description || "Bespoke photo frames, acrylic sheets, canvas prints, passport photos, photo lamps, custom mugs & gifts in Raebareli.",
      metaKeywords: site.meta_keywords || "photo frames, acrylic frames, canvas prints, passport photos, photo studio, custom gifts, photo lamps, mugs, keychains, Raebareli",
      freeShippingThreshold: parseFloat(ship.free_shipping_threshold || 999),
      flatShippingRate: parseFloat(ship.flat_shipping_rate || 79),
      expressDeliveryRate: parseFloat(ship.express_delivery_rate || 149),
      taxRatePercentage: parseFloat(tax.tax_rate_percentage || 18)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const rows = await query(`SELECT id, name, slug, description, image, icon, display_order FROM categories ORDER BY display_order ASC, created_at ASC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products List
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, isCustomizable, limit } = req.query;
    let sqlText = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      sqlText += ` AND (p.category_id = ? OR p.slug = ?)`;
      params.push(category);
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sqlText += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ?)`;
      params.push(`%${search.toLowerCase()}%`);
    }

    if (isCustomizable === 'true') {
      sqlText += ` AND p.is_customizable = true`;
    }

    if (sort === 'price-low') {
      sqlText += ` ORDER BY p.price ASC`;
    } else if (sort === 'price-high') {
      sqlText += ` ORDER BY p.price DESC`;
    } else if (sort === 'rating') {
      sqlText += ` ORDER BY p.rating DESC`;
    } else {
      sqlText += ` ORDER BY p.display_order ASC, p.created_at DESC`;
    }

    if (limit) {
      sqlText += ` LIMIT ${parseInt(limit, 10)}`;
    }

    const rows = await query(sqlText, params);
    const mapped = rows.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      categoryId: r.category_id,
      categoryName: r.category_name,
      price: parseFloat(r.price),
      originalPrice: parseFloat(r.original_price || r.price),
      stock: parseInt(r.stock, 10),
      rating: parseFloat(r.rating || 5.0),
      reviewsCount: parseInt(r.reviews_count || 0, 10),
      description: r.description || '',
      image: r.image || '',
      isCustomizable: Boolean(r.is_customizable),
      isFrame: Boolean(r.is_frame),
      frameMaterial: r.frame_material || 'Natural Wood',
      displayOrder: parseInt(r.display_order || 0, 10),
      createdAt: r.created_at
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Product Details
app.get('/api/products/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const rows = await query(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? OR p.slug = ?`, [idOrSlug, idOrSlug]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const r = rows[0];
    res.json({
      id: r.id,
      name: r.name,
      slug: r.slug,
      categoryId: r.category_id,
      categoryName: r.category_name,
      price: parseFloat(r.price),
      originalPrice: parseFloat(r.original_price || r.price),
      stock: parseInt(r.stock, 10),
      rating: parseFloat(r.rating || 5.0),
      reviewsCount: parseInt(r.reviews_count || 0, 10),
      description: r.description || '',
      image: r.image || '',
      isCustomizable: Boolean(r.is_customizable),
      isFrame: Boolean(r.is_frame),
      frameMaterial: r.frame_material || 'Natural Wood',
      displayOrder: parseInt(r.display_order || 0, 10),
      createdAt: r.created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Main Page Content Config
app.get('/api/main-page', async (req, res) => {
  try {
    const rows = await query(`SELECT hero_config, promo_config, announcement_bar, section_headlines, features FROM site_settings WHERE id = 1`);
    const r = rows[0] || {};
    res.json({
      hero: parseJsonField(r.hero_config),
      promo: parseJsonField(r.promo_config),
      announcementBar: parseJsonField(r.announcement_bar),
      sectionHeadlines: parseJsonField(r.section_headlines),
      features: parseJsonField(r.features, [])
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Banners List
app.get('/api/banners', async (req, res) => {
  try {
    const rows = await query(`SELECT id, title, subtitle, image_url as "imageUrl", cta_text as "ctaText", cta_link as "ctaLink", display_order as "displayOrder", is_active as "isActive" FROM banners WHERE is_active = true ORDER BY display_order ASC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload File
app.post('/api/upload', upload.any(), (req, res) => {
  if (req.files && req.files.length > 0) {
    const fileUrl = `/uploads/${req.files[0].filename}`;
    return res.json({ url: fileUrl, filename: req.files[0].filename });
  } else if (req.file) {
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl, filename: req.file.filename });
  }
  return res.status(400).json({ error: 'No image file uploaded' });
});

// Verify Coupon
app.post('/api/coupons/apply', async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();
    const rows = await query(`SELECT * FROM coupons WHERE UPPER(code) = ? AND is_active = true`, [cleanCode]);
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired coupon code' });
    }

    const c = rows[0];
    const minSpend = parseFloat(c.min_spend || 0);
    if (cartSubtotal < minSpend) {
      return res.status(400).json({ error: `Minimum subtotal of ₹${minSpend} required for this coupon` });
    }

    let discountAmount = 0;
    const discVal = parseFloat(c.discount_value);
    if (c.discount_type === 'percentage') {
      discountAmount = Math.round((cartSubtotal * discVal) / 100);
    } else {
      discountAmount = discVal;
    }

    res.json({
      code: c.code,
      discountAmount,
      message: `Coupon '${c.code}' applied successfully!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Store Payment Config
app.get('/api/payment-config', async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM payment_settings WHERE id = 1`);
    const p = rows[0] || {};
    res.json({
      qrCode: {
        enabled: Boolean(p.qr_code_enabled),
        upiId: p.upi_id,
        accountHolder: p.account_holder,
        qrImageUrl: p.qr_image_url,
        instructions: p.qr_instructions
      },
      bankTransfer: {
        enabled: Boolean(p.bank_transfer_enabled),
        accountHolder: p.account_holder,
        bankName: p.bank_name,
        accountNumber: p.account_number,
        ifscCode: p.ifsc_code,
        branch: p.branch,
        instructions: p.bank_instructions
      },
      cod: {
        enabled: Boolean(p.cod_enabled)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Order (Customer)
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName, customerEmail, customerPhone, shippingAddress,
      items, totalAmount, discountAmount, paymentMethod, couponCode,
      utrNumber, paymentScreenshot, userId: bodyUserId, username: bodyUsername
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let userId = bodyUserId || null;
    let username = bodyUsername || null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.id;
        username = decoded.username;
      }
    }

    const shipRows = await query(`SELECT free_shipping_threshold, flat_shipping_rate FROM shipping_settings WHERE id = 1`);
    const freeThresh = parseFloat(shipRows[0]?.free_shipping_threshold || 999);
    const flatRate = parseFloat(shipRows[0]?.flat_shipping_rate || 79);

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `QGE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isManualPayment = (paymentMethod || '').includes('UPI') || (paymentMethod || '').includes('Bank');

    const shippingFee = totalAmount > freeThresh ? 0 : flatRate;
    const taxAmount = Math.round(totalAmount * 0.18);
    const itemsJson = JSON.stringify(items);

    await query(
      `INSERT INTO orders (
        id, order_number, user_id, username, customer_name, customer_email, customer_phone,
        shipping_address, total_amount, discount_amount, shipping_fee, tax_amount,
        payment_method, utr_number, payment_screenshot, payment_status, payment_approval_status,
        order_status, tracking_number, items
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId, orderNumber, userId, username, customerName || 'Valued Customer',
        customerEmail || '', customerPhone || '', shippingAddress || 'Store Pickup',
        totalAmount || 0, discountAmount || 0, shippingFee, taxAmount,
        paymentMethod || 'UPI QR Code Payment', utrNumber || '', paymentScreenshot || '',
        isManualPayment ? 'Pending Verification' : 'Paid',
        isManualPayment ? 'Pending Approval' : 'Approved',
        isManualPayment ? 'Payment Verification Pending' : 'Processing',
        `AWB-QGE-${Math.floor(1000000 + Math.random() * 9000000)}`,
        itemsJson
      ]
    );

    if (couponCode) {
      await query(`UPDATE coupons SET usage_count = usage_count + 1 WHERE UPPER(code) = ?`, [couponCode.toUpperCase()]);
    }

    const newOrder = {
      id: orderId,
      orderNumber,
      userId,
      username,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      discountAmount,
      shippingFee,
      taxAmount,
      paymentMethod,
      utrNumber,
      paymentScreenshot,
      paymentStatus: isManualPayment ? 'Pending Verification' : 'Paid',
      paymentApprovalStatus: isManualPayment ? 'Pending Approval' : 'Approved',
      orderStatus: isManualPayment ? 'Payment Verification Pending' : 'Processing',
      items,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Personal Orders
app.get('/api/user/orders', authMiddleware, async (req, res) => {
  try {
    const rows = await query(
      `SELECT * FROM orders WHERE user_id = ? OR LOWER(username) = ? ORDER BY created_at DESC`,
      [req.user.id, (req.user.username || '').toLowerCase()]
    );
    const mapped = rows.map(r => ({
      id: r.id,
      orderNumber: r.order_number,
      userId: r.user_id,
      username: r.username,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      shippingAddress: r.shipping_address,
      totalAmount: parseFloat(r.total_amount),
      discountAmount: parseFloat(r.discount_amount || 0),
      shippingFee: parseFloat(r.shipping_fee || 0),
      taxAmount: parseFloat(r.tax_amount || 0),
      paymentMethod: r.payment_method,
      utrNumber: r.utr_number,
      paymentScreenshot: r.payment_screenshot,
      paymentStatus: r.payment_status,
      paymentApprovalStatus: r.payment_approval_status,
      orderStatus: r.order_status,
      trackingNumber: r.tracking_number,
      items: parseJsonField(r.items, []),
      createdAt: r.created_at
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track Order Status
app.get('/api/orders/track/:query', async (req, res) => {
  try {
    const q = req.params.query.trim().toLowerCase();
    const rows = await query(
      `SELECT * FROM orders WHERE LOWER(order_number) = ? OR LOWER(tracking_number) = ? OR customer_phone LIKE ?`,
      [q, q, `%${q}%`]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Order not found. Please verify tracking ID or phone number.' });
    }
    const r = rows[0];
    res.json({
      id: r.id,
      orderNumber: r.order_number,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      shippingAddress: r.shipping_address,
      totalAmount: parseFloat(r.total_amount),
      paymentMethod: r.payment_method,
      paymentStatus: r.payment_status,
      orderStatus: r.order_status,
      trackingNumber: r.tracking_number,
      items: parseJsonField(r.items, []),
      createdAt: r.created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reviews API
app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM reviews WHERE product_id = ? AND is_approved = true ORDER BY created_at DESC`, [req.params.productId]);
    const mapped = rows.map(r => ({
      id: r.id,
      productId: r.product_id,
      customerName: r.customer_name,
      rating: parseInt(r.rating, 10),
      comment: r.comment,
      date: new Date(r.created_at).toISOString().split('T')[0],
      isApproved: Boolean(r.is_approved)
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { productId, customerName, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    const revId = `rev-${Date.now()}`;
    await query(
      `INSERT INTO reviews (id, product_id, customer_name, rating, comment, is_approved) VALUES (?, ?, ?, ?, ?, true)`,
      [revId, productId, customerName || 'Verified Buyer', parseInt(rating, 10), comment]
    );

    // Recalculate average product rating
    const stats = await query(`SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ? AND is_approved = true`, [productId]);
    const count = parseInt(stats[0]?.count || 0, 10);
    const avg = parseFloat(parseFloat(stats[0]?.avg_rating || 5.0).toFixed(1));

    await query(`UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?`, [avg, count, productId]);

    res.status(201).json({
      id: revId,
      productId,
      customerName: customerName || 'Verified Buyer',
      rating: parseInt(rating, 10),
      comment,
      date: new Date().toISOString().split('T')[0],
      isApproved: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTHENTICATION
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username ID and password are required' });
    }

    await initDb().catch(() => {});

    const rawInput = (username || '').trim().toLowerCase();
    const normInput = rawInput.replace(/^@/, '');
    const cleanPass = (password || '').trim();

    let dbUsers = [];
    try {
      dbUsers = await query(`SELECT * FROM users`);
    } catch (dbErr) {
      console.warn("DB user query notice:", dbErr.message);
    }

    const allUsers = [...defaultUsers, ...(Array.isArray(dbUsers) ? dbUsers : [])];

    const user = allUsers.find(u => {
      if (!u || !u.username) return false;
      const normUser = u.username.trim().toLowerCase().replace(/^@/, '');
      const userPass = (u.password || '').trim();

      const isUsernameMatch = (normUser === normInput || u.username.trim().toLowerCase() === rawInput);
      const isPasswordMatch = (userPass === cleanPass || userPass.toLowerCase() === cleanPass.toLowerCase());

      return isUsernameMatch && isPasswordMatch;
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid Username ID or Password credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ error: 'All fields (Name, Username ID, Password) are required' });
    }

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }

    const existing = await query(`SELECT id FROM users WHERE LOWER(username) = ?`, [cleanUsername.toLowerCase()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'This Username ID is already taken. Please choose another.' });
    }

    const formattedUsername = cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}`;
    const newId = `usr-${Date.now()}`;

    await query(
      `INSERT INTO users (id, name, username, password, role) VALUES (?, ?, ?, ?, 'customer')`,
      [newId, name, formattedUsername, password]
    );

    const token = generateToken({ id: newId, name, username: formattedUsername, role: 'customer' });
    res.status(201).json({
      token,
      user: { id: newId, name, username: formattedUsername, role: 'customer' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN SECURE ROUTES ---

// Admin Stats
app.get('/api/admin/stats', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const revRows = await query(`SELECT SUM(total_amount) as total FROM orders`);
    const totalRevenue = parseFloat(revRows[0]?.total || 0);

    const ordRows = await query(`SELECT COUNT(*) as count FROM orders`);
    const totalOrders = parseInt(ordRows[0]?.count || 0, 10);

    const pendRows = await query(`SELECT COUNT(*) as count FROM orders WHERE order_status IN ('Processing', 'Pending', 'Payment Verification Pending')`);
    const pendingOrders = parseInt(pendRows[0]?.count || 0, 10);

    const lowStockRows = await query(`SELECT COUNT(*) as count FROM products WHERE stock < 10`);
    const lowStockProducts = parseInt(lowStockRows[0]?.count || 0, 10);

    const custRows = await query(`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`);
    const totalCustomers = parseInt(custRows[0]?.count || 0, 10);

    const recentRows = await query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`);
    const recentOrders = recentRows.map(r => ({
      id: r.id,
      orderNumber: r.order_number,
      customerName: r.customer_name,
      totalAmount: parseFloat(r.total_amount),
      orderStatus: r.order_status,
      createdAt: r.created_at
    }));

    res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      totalCustomers,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Customer Users List
app.get('/api/admin/customers', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const users = await query(`SELECT id, name, username, password, role, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC`);
    const orders = await query(`SELECT user_id, total_amount FROM orders`);

    const mapped = users.map(u => {
      const userOrds = orders.filter(o => o.user_id === u.id);
      const totalOrders = userOrds.length;
      const totalSpent = userOrds.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0);
      return {
        id: u.id,
        name: u.name,
        email: u.username,
        role: u.role,
        createdAt: new Date(u.created_at).toISOString().split('T')[0],
        totalOrders,
        totalSpent
      };
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Products CRUD
app.post('/api/admin/products', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { name, price, categoryId, image } = req.body || {};
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Product name title is required' });
    }
    if (price === undefined || isNaN(parseFloat(price))) {
      return res.status(400).json({ error: 'Valid selling price is required' });
    }

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
    const prodId = `prod-${Date.now()}`;

    await query(
      `INSERT INTO products (id, name, slug, category_id, price, original_price, stock, description, image, is_customizable, is_frame, frame_material, rating, reviews_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0)`,
      [
        prodId, cleanName, slug, categoryId || 'photo-frames',
        parseFloat(price), parseFloat(req.body.originalPrice || price),
        parseInt(req.body.stock || 20, 10), req.body.description || '',
        image || '', Boolean(req.body.isCustomizable), Boolean(req.body.isFrame),
        req.body.frameMaterial || 'Walnut Wood'
      ]
    );

    const newProd = {
      id: prodId,
      name: cleanName,
      slug,
      categoryId: categoryId || 'photo-frames',
      price: parseFloat(price),
      originalPrice: parseFloat(req.body.originalPrice || price),
      stock: parseInt(req.body.stock || 20, 10),
      description: req.body.description || '',
      image: image || '',
      isCustomizable: Boolean(req.body.isCustomizable),
      isFrame: Boolean(req.body.isFrame),
      frameMaterial: req.body.frameMaterial || 'Walnut Wood',
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString()
    };

    res.status(201).json(newProd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query(`SELECT * FROM products WHERE id = ?`, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const cur = existing[0];
    const updatedName = req.body.name ? req.body.name.trim() : cur.name;
    const slug = updatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || cur.slug;

    await query(
      `UPDATE products SET name = ?, slug = ?, category_id = ?, price = ?, original_price = ?, stock = ?, description = ?, image = ?, is_customizable = ?, is_frame = ?, frame_material = ? WHERE id = ?`,
      [
        updatedName, slug, req.body.categoryId || cur.category_id,
        req.body.price !== undefined ? parseFloat(req.body.price) : parseFloat(cur.price),
        req.body.originalPrice !== undefined ? parseFloat(req.body.originalPrice) : parseFloat(cur.original_price),
        req.body.stock !== undefined ? parseInt(req.body.stock, 10) : parseInt(cur.stock, 10),
        req.body.description !== undefined ? req.body.description : cur.description,
        req.body.image !== undefined ? req.body.image : cur.image,
        req.body.isCustomizable !== undefined ? Boolean(req.body.isCustomizable) : Boolean(cur.is_customizable),
        req.body.isFrame !== undefined ? Boolean(req.body.isFrame) : Boolean(cur.is_frame),
        req.body.frameMaterial !== undefined ? req.body.frameMaterial : cur.frame_material,
        id
      ]
    );

    const updated = await query(`SELECT * FROM products WHERE id = ?`, [id]);
    const r = updated[0];
    res.json({
      id: r.id,
      name: r.name,
      slug: r.slug,
      categoryId: r.category_id,
      price: parseFloat(r.price),
      originalPrice: parseFloat(r.original_price),
      stock: parseInt(r.stock, 10),
      description: r.description,
      image: r.image,
      isCustomizable: Boolean(r.is_customizable),
      isFrame: Boolean(r.is_frame),
      frameMaterial: r.frame_material
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    await query(`DELETE FROM products WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/reorder', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { productIds } = req.body || {};
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: 'productIds array is required' });
    }

    for (let index = 0; index < productIds.length; index++) {
      await query(`UPDATE products SET display_order = ? WHERE id = ?`, [index + 1, productIds[index]]);
    }

    const rows = await query(`SELECT * FROM products ORDER BY display_order ASC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Categories CRUD
app.get('/api/admin/categories', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM categories ORDER BY display_order ASC, created_at ASC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/categories', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { name, description, image, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = slug;

    await query(
      `INSERT INTO categories (id, name, slug, description, image, icon) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, slug, description || '', image || '', icon || 'category']
    );

    res.status(201).json({ id, name, slug, description, image, icon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { name, description, image, icon } = req.body;
    const { id } = req.params;

    await query(
      `UPDATE categories SET name = ?, description = ?, image = ?, icon = ? WHERE id = ?`,
      [name, description, image, icon, id]
    );

    res.json({ id, name, description, image, icon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    await query(`DELETE FROM categories WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/reorder', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { categoryIds } = req.body || {};
    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ error: 'categoryIds array is required' });
    }

    for (let index = 0; index < categoryIds.length; index++) {
      await query(`UPDATE categories SET display_order = ? WHERE id = ?`, [index + 1, categoryIds[index]]);
    }

    const rows = await query(`SELECT * FROM categories ORDER BY display_order ASC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Orders
app.get('/api/admin/orders', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM orders ORDER BY created_at DESC`);
    const mapped = rows.map(r => ({
      id: r.id,
      orderNumber: r.order_number,
      userId: r.user_id,
      username: r.username,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      shippingAddress: r.shipping_address,
      totalAmount: parseFloat(r.total_amount),
      discountAmount: parseFloat(r.discount_amount || 0),
      shippingFee: parseFloat(r.shipping_fee || 0),
      taxAmount: parseFloat(r.tax_amount || 0),
      paymentMethod: r.payment_method,
      utrNumber: r.utr_number,
      paymentScreenshot: r.payment_screenshot,
      paymentStatus: r.payment_status,
      paymentApprovalStatus: r.payment_approval_status,
      orderStatus: r.order_status,
      trackingNumber: r.tracking_number,
      adminNotes: r.admin_notes,
      items: parseJsonField(r.items, []),
      createdAt: r.created_at
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const { id } = req.params;

    if (orderStatus && trackingNumber) {
      await query(`UPDATE orders SET order_status = ?, tracking_number = ? WHERE id = ?`, [orderStatus, trackingNumber, id]);
    } else if (orderStatus) {
      await query(`UPDATE orders SET order_status = ? WHERE id = ?`, [orderStatus, id]);
    } else if (trackingNumber) {
      await query(`UPDATE orders SET tracking_number = ? WHERE id = ?`, [trackingNumber, id]);
    }

    const rows = await query(`SELECT * FROM orders WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/approve-payment', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { action, adminNotes } = req.body;
    const { id } = req.params;

    let pApprove = 'Pending Approval';
    let pStatus = 'Pending Verification';
    let oStatus = 'Processing';

    if (action === 'approve') {
      pApprove = 'Approved';
      pStatus = 'Paid';
      oStatus = 'Processing';
    } else if (action === 'reject') {
      pApprove = 'Rejected';
      pStatus = 'Payment Failed';
      oStatus = 'Payment Rejected';
    }

    await query(
      `UPDATE orders SET payment_approval_status = ?, payment_status = ?, order_status = ?, admin_notes = ? WHERE id = ?`,
      [pApprove, pStatus, oStatus, adminNotes || '', id]
    );

    const rows = await query(`SELECT * FROM orders WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Coupons CRUD
app.get('/api/admin/coupons', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const rows = await query(`SELECT id, code, discount_type as "discountType", discount_value as "discountValue", min_spend as "minSpend", expiry_date as "expiryDate", usage_count as "usageCount", is_active as "isActive" FROM coupons ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/coupons', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { code, discountType, discountValue, minSpend, expiryDate } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    const id = `coup-${Date.now()}`;
    await query(
      `INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, expiry_date, usage_count, is_active) VALUES (?, ?, ?, ?, ?, ?, 0, true)`,
      [id, code.toUpperCase(), discountType || 'percentage', parseFloat(discountValue || 0), parseFloat(minSpend || 0), expiryDate || '2027-12-31']
    );

    res.status(201).json({ id, code, discountType, discountValue, minSpend, expiryDate, usageCount: 0, isActive: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/coupons/:id', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    await query(`DELETE FROM coupons WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Main Page Manager
app.get('/api/admin/main-page', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const rows = await query(`SELECT hero_config, promo_config, announcement_bar, section_headlines, features FROM site_settings WHERE id = 1`);
    const r = rows[0] || {};
    res.json({
      hero: parseJsonField(r.hero_config),
      promo: parseJsonField(r.promo_config),
      announcementBar: parseJsonField(r.announcement_bar),
      sectionHeadlines: parseJsonField(r.section_headlines),
      features: parseJsonField(r.features, [])
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/main-page', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { hero, promo, announcementBar, sectionHeadlines, features } = req.body;

    await query(
      `UPDATE site_settings SET hero_config = ?, promo_config = ?, announcement_bar = ?, section_headlines = ?, features = ? WHERE id = 1`,
      [
        JSON.stringify(hero || {}),
        JSON.stringify(promo || {}),
        JSON.stringify(announcementBar || {}),
        JSON.stringify(sectionHeadlines || {}),
        JSON.stringify(features || [])
      ]
    );

    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Banners CRUD
app.get('/api/admin/banners', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const rows = await query(`SELECT id, title, subtitle, image_url as "imageUrl", cta_text as "ctaText", cta_link as "ctaLink", display_order as "displayOrder", is_active as "isActive" FROM banners ORDER BY display_order ASC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/banners', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { title, subtitle, imageUrl, ctaText, ctaLink } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ error: 'Title and image URL are required' });

    const id = `banner-${Date.now()}`;
    await query(
      `INSERT INTO banners (id, title, subtitle, image_url, cta_text, cta_link, is_active) VALUES (?, ?, ?, ?, ?, ?, true)`,
      [id, title, subtitle || '', imageUrl, ctaText || 'Shop Now', ctaLink || '/collection']
    );

    res.status(201).json({ id, title, subtitle, imageUrl, ctaText, ctaLink, isActive: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/banners/:id', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    await query(`DELETE FROM banners WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Payment Gateway Settings
app.get('/api/admin/payment-config', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM payment_settings WHERE id = 1`);
    const p = rows[0] || {};
    res.json({
      qrCode: {
        enabled: Boolean(p.qr_code_enabled),
        upiId: p.upi_id,
        accountHolder: p.account_holder,
        qrImageUrl: p.qr_image_url,
        instructions: p.qr_instructions
      },
      bankTransfer: {
        enabled: Boolean(p.bank_transfer_enabled),
        accountHolder: p.account_holder,
        bankName: p.bank_name,
        accountNumber: p.account_number,
        ifscCode: p.ifsc_code,
        branch: p.branch,
        instructions: p.bank_instructions
      },
      cod: {
        enabled: Boolean(p.cod_enabled)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/payment-config', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { qrCode, bankTransfer, cod } = req.body || {};

    await query(
      `UPDATE payment_settings SET
        qr_code_enabled = ?, upi_id = ?, account_holder = ?, qr_image_url = ?, qr_instructions = ?,
        bank_transfer_enabled = ?, bank_name = ?, account_number = ?, ifsc_code = ?, branch = ?, bank_instructions = ?,
        cod_enabled = ?
       WHERE id = 1`,
      [
        Boolean(qrCode?.enabled), qrCode?.upiId || '', qrCode?.accountHolder || '', qrCode?.qrImageUrl || '', qrCode?.instructions || '',
        Boolean(bankTransfer?.enabled), bankTransfer?.bankName || '', bankTransfer?.accountNumber || '', bankTransfer?.ifscCode || '', bankTransfer?.branch || '', bankTransfer?.instructions || '',
        Boolean(cod?.enabled)
      ]
    );

    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Unified Settings (Branding, SEO, Shipping, Tax)
app.get('/api/admin/settings', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const siteRows = await query(`SELECT * FROM site_settings WHERE id = 1`);
    const shipRows = await query(`SELECT * FROM shipping_settings WHERE id = 1`);
    const taxRows = await query(`SELECT * FROM tax_settings WHERE id = 1`);

    const s = siteRows[0] || {};
    const ship = shipRows[0] || {};
    const tax = taxRows[0] || {};

    res.json({
      storeName: s.store_name,
      tagline: s.tagline,
      email: s.email,
      phone: s.phone,
      address: s.address,
      logo: s.logo,
      metaTitle: s.meta_title,
      metaDescription: s.meta_description,
      metaKeywords: s.meta_keywords,
      flatShippingRate: parseFloat(ship.flat_shipping_rate || 79),
      freeShippingThreshold: parseFloat(ship.free_shipping_threshold || 999),
      taxRatePercentage: parseFloat(tax.tax_rate_percentage || 18)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/settings', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const {
      storeName, tagline, email, phone, address, logo,
      metaTitle, metaDescription, metaKeywords,
      flatShippingRate, freeShippingThreshold, taxRatePercentage
    } = req.body;

    if (storeName || tagline || email || phone || address || logo || metaTitle || metaDescription || metaKeywords) {
      await query(
        `UPDATE site_settings SET
          store_name = COALESCE(?, store_name),
          tagline = COALESCE(?, tagline),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          logo = COALESCE(?, logo),
          meta_title = COALESCE(?, meta_title),
          meta_description = COALESCE(?, meta_description),
          meta_keywords = COALESCE(?, meta_keywords)
         WHERE id = 1`,
        [storeName, tagline, email, phone, address, logo, metaTitle, metaDescription, metaKeywords]
      );
    }

    if (flatShippingRate !== undefined || freeShippingThreshold !== undefined) {
      await query(
        `UPDATE shipping_settings SET
          flat_shipping_rate = COALESCE(?, flat_shipping_rate),
          free_shipping_threshold = COALESCE(?, free_shipping_threshold)
         WHERE id = 1`,
        [flatShippingRate !== undefined ? parseFloat(flatShippingRate) : null, freeShippingThreshold !== undefined ? parseFloat(freeShippingThreshold) : null]
      );
    }

    if (taxRatePercentage !== undefined) {
      await query(
        `UPDATE tax_settings SET tax_rate_percentage = ? WHERE id = 1`,
        [parseFloat(taxRatePercentage)]
      );
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Reviews Management
app.get('/api/admin/reviews', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const rows = await query(`SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id ORDER BY r.created_at DESC`);
    const mapped = rows.map(r => ({
      id: r.id,
      productId: r.product_id,
      productName: r.product_name || 'Product',
      customerName: r.customer_name,
      rating: parseInt(r.rating, 10),
      comment: r.comment,
      date: new Date(r.created_at).toISOString().split('T')[0],
      isApproved: Boolean(r.is_approved)
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/reviews/:id/approve', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { isApproved } = req.body;
    await query(`UPDATE reviews SET is_approved = ? WHERE id = ?`, [Boolean(isApproved), req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/reviews/:id', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    await query(`DELETE FROM reviews WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend files in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Quality Glass Emporium REST API Server running on port ${PORT}`);
  });
}

export default app;
