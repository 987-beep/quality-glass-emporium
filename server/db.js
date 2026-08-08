import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

// Default Database State with Dedicated QR Code & Bank Transfer Payment Setup
const initialData = {
  users: [
    {
      id: 1,
      name: "Ajmal (Owner)",
      username: "@OWNERAJMAL69",
      password: "AJMA6958@",
      role: "owner",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Kaatya (Developer)",
      username: "@KAATYA_OG_",
      password: "KAATYA6547",
      role: "developer",
      createdAt: new Date().toISOString()
    }
  ],
  paymentConfig: {
    qrCode: {
      enabled: true,
      upiId: "qualityglass@upi",
      accountHolder: "Quality Glass Emporium",
      qrImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium",
      instructions: "Scan the Admin uploaded QR code using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR transaction reference number and upload the screenshot proof."
    },
    bankTransfer: {
      enabled: true,
      accountHolder: "Quality Glass Emporium",
      bankName: "State Bank of India",
      accountNumber: "389201004921",
      ifscCode: "SBIN0000465",
      branch: "Raebareli Main Branch",
      instructions: "Transfer total order amount via IMPS / NEFT / RTGS to the store bank account. Enter your 12-digit Bank UTR reference number and upload the payment screenshot proof."
    }
  },
  settings: {
    storeName: "Quality Glass Emporium",
    tagline: "Bespoke Framing, Photo Studio & Customized Gifts",
    email: "contact@qualityglassemporium.com",
    phone: "+91 94150 12345",
    address: "Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh",
    currency: "₹",
    logo: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
    metaTitle: "Quality Glass Emporium | Custom Frames, Passport Studio & Gifts",
    metaDescription: "Bespoke photo frames, acrylic sheets, canvas prints, passport photos, photo lamps, custom mugs & gifts in Raebareli.",
    metaKeywords: "photo frames, acrylic frames, canvas prints, passport photos, photo studio, custom gifts, photo lamps, mugs, keychains, Raebareli",
    freeShippingThreshold: 999,
    flatShippingRate: 79,
    taxRatePercentage: 18
  },
  categories: [
    { id: "photo-frames", name: "Photo Frames", slug: "photo-frames", description: "Bespoke Wood, Metal & Glass Frames", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" },
    { id: "acrylic-frames", name: "Acrylic Frames & Sheets", slug: "acrylic-frames", description: "Luminous Frameless Acrylic Blocks & Custom Cut Sheets", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80" },
    { id: "canvas-prints", name: "Canvas Prints", slug: "canvas-prints", description: "Gallery Wrapped Cotton Canvas Art Prints", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80" },
    { id: "photo-studio", name: "Photo Studio & Passport", slug: "photo-studio", description: "Digital Photo Printing, Passport/Visa Photos & Lamination", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" },
    { id: "custom-gifts", name: "Customized Gifts", slug: "custom-gifts", description: "Photo Lamps, Custom Mugs, T-Shirts, Keychains & Covers", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80" },
    { id: "photo-albums", name: "Photo Albums & Memory Books", slug: "photo-albums", description: "Leatherette & Hardcover Wedding & Event Albums", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" }
  ],
  products: [],
  mainPage: {
    announcementBar: {
      enabled: true,
      text: "⚡ Special Offer: Free Express Shipping on Custom Frame & Glass Orders above ₹999 in Raebareli!",
      link: "/collection",
      bgStyle: "primary"
    },
    hero: {
      badge: "Quality Glass Emporium • Raebareli",
      title: "Curate Your Space with Bespoke Framing.",
      subtitle: "Museum-quality bespoke wood, metal & floating acrylic frames designed to elevate your memories. Handcrafted precision meets digital photo studio.",
      bgImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
      primaryCtaText: "🎨 Launch Frame Studio",
      primaryCtaLink: "frame-studio",
      secondaryCtaText: "📸 Passport Photo Studio",
      secondaryCtaLink: "passport-studio"
    },
    promo: {
      badge: "Specialized Gift Shop",
      title: "Personalized 3D Photo Lamps, Custom Mugs & Keychains",
      description: "Create unforgettable keepsakes! Print your loved ones' photos on warm glowing 3D acrylic lamps, heat-sensitive magic mugs, customized T-shirts, mobile cases, and keychains with lifetime print guarantee.",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80",
      ctaText: "Shop Custom Gifts",
      ctaLink: "custom-gifts"
    },
    features: [
      {
        icon: "workspace_premium",
        title: "Museum-Grade Quality",
        description: "Organic solid wood moulding & 99.9% optical clear glass."
      },
      {
        icon: "center_focus_strong",
        title: "Instant AI Passport Studio",
        description: "Compliant biometric photos with background replacement."
      },
      {
        icon: "palette",
        title: "Custom 3D Gift Printing",
        description: "Personalized photo lamps, mugs, keychains & acrylic cutouts."
      },
      {
        icon: "local_shipping",
        title: "Raebareli Express Delivery",
        description: "Same-day doorstep delivery & local store pickup available."
      }
    ],
    sectionHeadlines: {
      categoriesTitle: "Framing & Gift Collections",
      categoriesSubtitle: "Store Taxonomy",
      productsTitle: "Trending Framing & Custom Gifts",
      productsSubtitle: "Handcrafted Products"
    }
  },
  banners: [
    {
      id: "banner-1",
      title: "Curate Your Space with Bespoke Framing",
      subtitle: "Museum-quality wooden & acrylic frames handcrafted with precision and glass clarity.",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Launch Frame Studio",
      ctaLink: "/frame-studio",
      displayOrder: 1,
      isActive: true
    },
    {
      id: "banner-2",
      title: "Instant Passport & Visa Photo Studio",
      subtitle: "Compliant high-resolution biometric prints with instant white/blue background styling.",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Order Passport Prints",
      ctaLink: "/passport-studio",
      displayOrder: 2,
      isActive: true
    }
  ],
  coupons: [
    {
      id: "coup-1",
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minSpend: 499,
      expiryDate: "2027-12-31",
      usageCount: 14,
      isActive: true
    },
    {
      id: "coup-2",
      code: "LUXE200",
      discountType: "flat",
      discountValue: 200,
      minSpend: 1499,
      expiryDate: "2027-12-31",
      usageCount: 8,
      isActive: true
    }
  ],
  orders: [],
  reviews: []
};

let memoryDb = null;

// Data Helper Functions
export function getDb() {
  if (memoryDb) return memoryDb;

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        memoryDb = {
          ...initialData,
          ...parsed,
          products: Array.isArray(parsed.products) ? parsed.products : []
        };
        return memoryDb;
      }
    } catch (err) {
      console.error('DB File read/parse error:', err);
    }
  }

  memoryDb = JSON.parse(JSON.stringify(initialData));
  saveDb(memoryDb);
  return memoryDb;
}

export function saveDb(data) {
  memoryDb = data;
  try {
    const tempFile = `${DB_FILE}.tmp`;
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempFile, content, 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (writeErr) {
      console.warn('DB File Write failed:', writeErr);
    }
  }
}
