import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { getDb, saveDb } from './db.js';
import { generateToken, verifyToken, authMiddleware, adminOnlyMiddleware } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer Storage setup for Frame Studio & Passport uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'user-photo-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// --- PUBLIC ROUTES ---

// Store Settings & SEO Configuration
app.get('/api/settings', (req, res) => {
  const db = getDb();
  res.json(db.settings);
});

// Categories List
app.get('/api/categories', (req, res) => {
  const db = getDb();
  res.json(db.categories);
});

// Products List (With Filter, Search, Sorting)
app.get('/api/products', (req, res) => {
  const db = getDb();
  let { category, search, sort, isCustomizable, limit } = req.query;
  let products = [...db.products];

  if (category && category !== 'all') {
    products = products.filter(p => p.categoryId === category || p.slug === category);
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (isCustomizable === 'true') {
    products = products.filter(p => p.isCustomizable);
  }

  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else {
    // Newest default
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (limit) {
    products = products.slice(0, parseInt(limit, 10));
  }

  res.json(products);
});

// Single Product Details
app.get('/api/products/:idOrSlug', (req, res) => {
  const db = getDb();
  const { idOrSlug } = req.params;
  const product = db.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Main Page Layout & Content Config (Public)
app.get('/api/main-page', (req, res) => {
  const db = getDb();
  res.json(db.mainPage || {});
});

// Banners List
app.get('/api/banners', (req, res) => {
  const db = getDb();
  res.json(db.banners.filter(b => b.isActive));
});

// Upload Image File (Product, Main Page, Frame Studio, Passport Studio)
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
app.post('/api/coupons/apply', (req, res) => {
  const { code, cartSubtotal } = req.body;
  const db = getDb();
  const coupon = db.coupons.find(c => c.code.toUpperCase() === (code || '').toUpperCase() && c.isActive);

  if (!coupon) {
    return res.status(400).json({ error: 'Invalid or expired coupon code' });
  }

  if (cartSubtotal < coupon.minSpend) {
    return res.status(400).json({ error: `Minimum subtotal of ₹${coupon.minSpend} required for this coupon` });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    code: coupon.code,
    discountAmount,
    message: `Coupon '${coupon.code}' applied successfully!`
  });
});

// Store Payment Options Configuration (Public for Checkout)
app.get('/api/payment-config', (req, res) => {
  const db = getDb();
  res.json(db.paymentConfig || {});
});

// Create Order (Customer)
app.post('/api/orders', (req, res) => {
  const { 
    customerName, customerEmail, customerPhone, shippingAddress, 
    items, totalAmount, discountAmount, paymentMethod, couponCode,
    utrNumber, paymentScreenshot, userId: bodyUserId, username: bodyUsername 
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Extract logged in user token if present
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

  const db = getDb();
  const orderId = `ord-${Date.now()}`;
  const orderNumber = `QGE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const isManualPayment = (paymentMethod || '').includes('UPI') || (paymentMethod || '').includes('Bank');

  const newOrder = {
    id: orderId,
    orderNumber,
    userId,
    username,
    customerName: customerName || 'Valued Customer',
    customerEmail: customerEmail || '',
    customerPhone: customerPhone || '',
    shippingAddress: shippingAddress || 'Store Pickup',
    totalAmount: totalAmount || 0,
    discountAmount: discountAmount || 0,
    shippingFee: totalAmount > db.settings.freeShippingThreshold ? 0 : db.settings.flatShippingRate,
    taxAmount: Math.round(totalAmount * 0.18),
    paymentMethod: paymentMethod || 'UPI QR Code Payment',
    utrNumber: utrNumber || '',
    paymentScreenshot: paymentScreenshot || '',
    paymentStatus: isManualPayment ? 'Pending Verification' : 'Paid',
    paymentApprovalStatus: isManualPayment ? 'Pending Approval' : 'Approved',
    orderStatus: isManualPayment ? 'Payment Verification Pending' : 'Processing',
    trackingNumber: `AWB-QGE-${Math.floor(1000000 + Math.random() * 9000000)}`,
    createdAt: new Date().toISOString(),
    items: items.map(item => ({
      productId: item.productId || item.id,
      productName: item.name || item.productName,
      price: item.price,
      quantity: item.quantity,
      customImage: item.customImage || null,
      customConfig: item.customConfig || null
    }))
  };

  db.orders.unshift(newOrder);

  // If coupon used, increment usage
  if (couponCode) {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      coupon.usageCount = (coupon.usageCount || 0) + 1;
    }
  }

  saveDb(db);
  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order: newOrder
  });
});

// Customer Personal Order History Endpoint (Private to Logged In User)
app.get('/api/user/orders', authMiddleware, (req, res) => {
  const db = getDb();
  const userOrders = db.orders.filter(o => 
    (o.userId && o.userId === req.user.id) ||
    (o.username && req.user.username && o.username.toLowerCase() === req.user.username.toLowerCase())
  );
  res.json(userOrders);
});

// Track Order Status
app.get('/api/orders/track/:query', (req, res) => {
  const db = getDb();
  const q = req.params.query.trim().toLowerCase();
  const order = db.orders.find(o =>
    o.orderNumber.toLowerCase() === q ||
    o.trackingNumber.toLowerCase() === q ||
    o.customerPhone.includes(q)
  );

  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please verify tracking ID or phone number.' });
  }

  res.json(order);
});

// Reviews API
app.get('/api/reviews/:productId', (req, res) => {
  const db = getDb();
  const reviews = db.reviews.filter(r => r.productId === req.params.productId && r.status === 'approved');
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { productId, customerName, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }
  const db = getDb();
  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    customerName: customerName || 'Verified Buyer',
    rating: parseInt(rating, 10),
    comment,
    date: new Date().toISOString().split('T')[0],
    status: 'approved' // Auto approve for instant delight
  };
  db.reviews.unshift(newReview);
  
  // Recalculate product rating
  const product = db.products.find(p => p.id === productId);
  if (product) {
    const prodReviews = db.reviews.filter(r => r.productId === productId && r.status === 'approved');
    const total = prodReviews.reduce((acc, curr) => acc + curr.rating, 0);
    product.reviewsCount = prodReviews.length;
    product.rating = parseFloat((total / prodReviews.length).toFixed(1));
  }

  saveDb(db);
  res.status(201).json(newReview);
});

// Public Payment Methods for Checkout
app.get('/api/payment-methods', (req, res) => {
  const db = getDb();
  const publicMethods = (db.paymentMethods || []).filter(pm => pm.enabled).map(pm => ({
    id: pm.id,
    name: pm.name,
    description: pm.description,
    upiId: pm.upiId,
    qrImageUrl: pm.qrImageUrl,
    mode: pm.mode
  }));
  res.json(publicMethods);
});

// AUTHENTICATION ROUTES (Pure Username + Password Authentication)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username ID and password are required' });
  }

  const rawInput = username.trim().toLowerCase();
  const normInput = rawInput.replace(/^@/, '');
  const db = getDb();
  
  const user = db.users.find(u => {
    if (!u.username) return false;
    const normUser = u.username.trim().toLowerCase().replace(/^@/, '');
    return normUser === normInput || u.username.trim().toLowerCase() === rawInput;
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid Username ID or Password credentials' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, username: user.username, role: user.role }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'All fields (Name, Username ID, Password) are required' });
  }

  const cleanUsername = username.trim();
  if (cleanUsername.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  const db = getDb();
  if (db.users.some(u => u.username && u.username.toLowerCase() === cleanUsername.toLowerCase())) {
    return res.status(400).json({ error: 'This Username ID is already taken. Please choose another.' });
  }

  const formattedUsername = cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}`;

  const newUser = {
    id: Date.now(),
    name,
    username: formattedUsername,
    password,
    role: 'customer',
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDb(db);

  const token = generateToken(newUser);
  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, username: newUser.username, role: newUser.role }
  });
});

// --- ADMIN SECURE ROUTES ---

// Admin Stats Overview
app.get('/api/admin/stats', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  const totalRevenue = db.orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Pending').length;
  const lowStockProducts = db.products.filter(p => p.stock < 10).length;
  const totalCustomers = db.users.filter(u => u.role === 'customer').length;

  res.json({
    totalRevenue,
    totalOrders,
    pendingOrders,
    lowStockProducts,
    totalCustomers,
    recentOrders: db.orders.slice(0, 5)
  });
});

// Admin Product CRUD
app.post('/api/admin/products', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const { name, price, categoryId, image } = req.body || {};
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Product name title is required' });
  }
  if (price === undefined || isNaN(parseFloat(price))) {
    return res.status(400).json({ error: 'Valid selling price is required' });
  }

  const db = getDb();
  if (!Array.isArray(db.products)) {
    db.products = [];
  }

  const cleanName = name.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

  const newProd = {
    id: `prod-${Date.now()}`,
    name: cleanName,
    categoryId: categoryId || 'photo-frames',
    price: parseFloat(price),
    originalPrice: parseFloat(req.body.originalPrice || price),
    stock: parseInt(req.body.stock || 20, 10),
    description: req.body.description || '',
    image: image || '',
    isCustomizable: Boolean(req.body.isCustomizable),
    isFrame: Boolean(req.body.isFrame),
    frameMaterial: req.body.frameMaterial || 'Walnut Wood',
    slug,
    rating: 5.0,
    reviewsCount: 0,
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProd);
  saveDb(db);
  res.status(201).json(newProd);
});

app.put('/api/admin/products/:id', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  if (!Array.isArray(db.products)) {
    db.products = [];
  }

  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const existing = db.products[index];
  const updatedName = req.body.name ? req.body.name.trim() : existing.name;
  const slug = updatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || existing.slug;

  db.products[index] = {
    ...existing,
    ...req.body,
    name: updatedName,
    slug,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== undefined ? parseFloat(req.body.originalPrice) : existing.originalPrice,
    stock: req.body.stock !== undefined ? parseInt(req.body.stock, 10) : existing.stock
  };

  saveDb(db);
  res.json(db.products[index]);
});

app.delete('/api/admin/products/:id', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  if (!Array.isArray(db.products)) {
    db.products = [];
  }
  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Admin Categories CRUD
app.post('/api/admin/categories', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  const newCat = {
    id: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...req.body
  };
  db.categories.push(newCat);
  saveDb(db);
  res.status(201).json(newCat);
});

app.delete('/api/admin/categories/:id', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Admin Orders Management
app.get('/api/admin/orders', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.orders);
});

app.put('/api/admin/orders/:id/status', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const { orderStatus, trackingNumber } = req.body;
  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (orderStatus) order.orderStatus = orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  saveDb(db);
  res.json(order);
});

// Admin Coupons CRUD
app.get('/api/admin/coupons', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.coupons);
});

app.post('/api/admin/coupons', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  const newCoupon = {
    id: `coup-${Date.now()}`,
    usageCount: 0,
    isActive: true,
    ...req.body
  };
  db.coupons.unshift(newCoupon);
  saveDb(db);
  res.status(201).json(newCoupon);
});

app.delete('/api/admin/coupons/:id', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  db.coupons = db.coupons.filter(c => c.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Admin Main Page Manager (Edit Hero, Announcement Bar, Promo Banners & Headlines)
app.get('/api/admin/main-page', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.mainPage || {});
});

app.put('/api/admin/main-page', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  db.mainPage = {
    ...db.mainPage,
    ...req.body
  };
  saveDb(db);
  res.json(db.mainPage);
});

// Admin Banners Manager
app.get('/api/admin/banners', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.banners);
});

app.post('/api/admin/banners', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  const newBanner = {
    id: `banner-${Date.now()}`,
    isActive: true,
    displayOrder: db.banners.length + 1,
    ...req.body
  };
  db.banners.push(newBanner);
  saveDb(db);
  res.status(201).json(newBanner);
});

app.delete('/api/admin/banners/:id', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  db.banners = db.banners.filter(b => b.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Admin Order Payment Approval (Approve / Reject Customer UTR & Screenshot Proof)
app.put('/api/admin/orders/:id/approve-payment', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const { action, adminNotes } = req.body;
  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (action === 'approve') {
    order.paymentApprovalStatus = 'Approved';
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Processing';
  } else if (action === 'reject') {
    order.paymentApprovalStatus = 'Rejected';
    order.paymentStatus = 'Payment Failed';
    order.orderStatus = 'Payment Rejected';
  }

  if (adminNotes) order.adminNotes = adminNotes;

  saveDb(db);
  res.json(order);
});

// Admin Payment Config Manager (QR Code Upload + Bank Account Transfer)
app.get('/api/admin/payment-config', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.paymentConfig || {});
});

app.put('/api/admin/payment-config', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  db.paymentConfig = {
    ...db.paymentConfig,
    ...req.body
  };
  saveDb(db);
  res.json(db.paymentConfig);
});

// Admin Payment Gateway & Options Manager
app.get('/api/admin/payment-methods', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.paymentMethods || []);
});

app.put('/api/admin/payment-methods/:id', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const db = getDb();
  const index = (db.paymentMethods || []).findIndex(pm => pm.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Payment method configuration not found' });
  }

  db.paymentMethods[index] = {
    ...db.paymentMethods[index],
    ...req.body
  };
  saveDb(db);
  res.json(db.paymentMethods[index]);
});

// Serve frontend SPA static files in production
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
