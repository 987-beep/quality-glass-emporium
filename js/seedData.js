/* ============================================================
   QUALITY GLASS EMPORIUM - INITIAL SEED DATA
   ============================================================ */

window.SEED_DATA = {
  siteSettings: {
    storeName: "Quality Glass Emporium And Photo Framing Center",
    shortName: "Quality Glass Emporium",
    phone: "+91-9999535535",
    email: "contact@qualityglassemporium.com",
    address: "Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh",
    hours: "Mon - Sun: 9:00 AM - 9:00 PM",
    rating: "4.9",
    ratingCount: "8 Ratings",
    taxRate: 5.0,
    shippingFee: 50.0,
    freeShippingMin: 1000.0,
    metaTitle: "Quality Glass Emporium & Photo Framing Center - Raebareli",
    metaDescription: "High-grade photo framing, custom glass cut-to-size, acrylic floating frames, and decorative mirrors in Raebareli."
  },

  categories: [
    {
      id: "cat-1",
      name: "Photo Frames",
      slug: "photo-frames",
      description: "Handcrafted wooden, acrylic, and metallic photo frames for preserving your memories.",
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-2",
      name: "Acrylic & Float Glass",
      slug: "acrylic-float-glass",
      description: "Frameless acrylic wall mounts, floating photo glass panels, and museum clarity panels.",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-3",
      name: "Custom Mirrors",
      slug: "custom-mirrors",
      description: "Gilded wall mirrors, LED vanity mirrors, and custom cut beveled glass mirrors.",
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-4",
      name: "Architectural Glass",
      slug: "architectural-glass",
      description: "Toughened glass tabletops, window glazing, partitions, and custom cut glass sheets.",
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80"
    }
  ],

  products: [
    {
      id: "prod-1",
      name: "Gallery Standard Black",
      slug: "gallery-standard-black",
      categoryId: "cat-1",
      categoryName: "Photo Frames",
      description: "Solid wood frame with museum-grade glass and acid-free white archival matting. Engineered for maximum photo preservation and crystal-clear presentation.",
      price: 45.00,
      salePrice: 39.99,
      sku: "FRM-BLK-001",
      inventoryCount: 45,
      status: "published",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
      galleryUrls: [
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
      ],
      rating: 4.9,
      reviewsCount: 14,
      attributes: { material: "Solid Wood", glassType: "UV Museum Glass", sizes: ["8x10 in", "11x14 in", "16x20 in"] }
    },
    {
      id: "prod-2",
      name: "Modern Acrylic Float",
      slug: "modern-acrylic-float",
      categoryId: "cat-2",
      categoryName: "Acrylic & Float Glass",
      description: "Frameless edge-to-edge optical grade acrylic floating frame with brushed stainless steel mounting standoffs.",
      price: 65.00,
      salePrice: 59.00,
      sku: "ACR-FLT-002",
      inventoryCount: 30,
      status: "published",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      galleryUrls: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
      ],
      rating: 5.0,
      reviewsCount: 9,
      attributes: { material: "High Optical Acrylic", mounting: "Stainless Standoffs", sizes: ["12x18 in", "16x24 in", "24x36 in"] }
    },
    {
      id: "prod-3",
      name: "Heritage Gold Leaf Gilded Mirror",
      slug: "heritage-gold-leaf-gilded-mirror",
      categoryId: "cat-3",
      categoryName: "Custom Mirrors",
      description: "Artisanal hand-gilded antique gold leaf frame paired with a 5mm high-reflectivity bevel-edged glass mirror.",
      price: 120.00,
      salePrice: 105.00,
      sku: "MIR-GLD-003",
      inventoryCount: 15,
      status: "published",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
      galleryUrls: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
      ],
      rating: 4.8,
      reviewsCount: 22,
      attributes: { finish: "Gold Leaf", glassThickness: "5mm Beveled", dimensions: "24x36 in" }
    },
    {
      id: "prod-4",
      name: "Clear Toughened Table Top Glass",
      slug: "clear-toughened-table-top-glass",
      categoryId: "cat-4",
      categoryName: "Architectural Glass",
      description: "8mm custom cut toughened safety glass top for dining tables, desk protection, and coffee tables with polished flat bevel edges.",
      price: 95.00,
      salePrice: null,
      sku: "GLS-TBL-004",
      inventoryCount: 25,
      status: "published",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80",
      galleryUrls: [],
      rating: 4.9,
      reviewsCount: 7,
      attributes: { glassType: "Tempered Safety Glass", thickness: "8mm", edge: "Flat Polished" }
    },
    {
      id: "prod-5",
      name: "Smart LED Touch Vanity Mirror",
      slug: "smart-led-touch-vanity-mirror",
      categoryId: "cat-3",
      categoryName: "Custom Mirrors",
      description: "Smart wall vanity mirror featuring dimmable LED backlight halo, integrated anti-fog heating element, and capacitive touch power control.",
      price: 150.00,
      salePrice: 135.00,
      sku: "MIR-LED-005",
      inventoryCount: 12,
      status: "published",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      galleryUrls: [],
      rating: 5.0,
      reviewsCount: 18,
      attributes: { lighting: "Dimmable LED 6000K", features: "Anti-fog Touch Sensor", size: "30x40 in" }
    }
  ],

  banners: [
    {
      id: "ban-1",
      title: "Frame Your Memories in Perfect Clarity",
      subtitle: "Discover our curated collection of premium glass & acrylic frames handcrafted at Quality Glass Emporium, Raebareli.",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
      linkUrl: "catalog",
      buttonText: "Shop Collections",
      sortOrder: 1,
      isActive: true
    },
    {
      id: "ban-2",
      title: "Custom Glass Cutting & Framing Services",
      subtitle: "Precision cut architectural glass sheets, vanity LED mirrors, and museum preservation photo framing.",
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      linkUrl: "configurator",
      buttonText: "Custom Framing Configurator",
      sortOrder: 2,
      isActive: true
    }
  ],

  coupons: [
    { code: "GLASS10", type: "percentage", value: 10, minSpend: 50, description: "10% off on all glass orders above $50" },
    { code: "WELCOME20", type: "fixed", value: 20, minSpend: 80, description: "Flat $20 off on your order above $80" },
    { code: "FREESHIP", type: "fixed", value: 50, minSpend: 100, description: "Free shipping on orders above $100" }
  ],

  reviews: [
    { id: "rev-1", productId: "prod-1", customerName: "Rajesh Sharma", rating: 5, comment: "Exceptional craftwork! The museum glass completely eliminates reflections in my living room.", status: "approved", createdAt: "2026-08-01" },
    { id: "rev-2", productId: "prod-2", customerName: "Ananya Gupta", rating: 5, comment: "The acrylic floating frame looks super premium and modern. Fast delivery to PNT colony!", status: "approved", createdAt: "2026-08-05" },
    { id: "rev-3", productId: "prod-3", customerName: "Vikram Singh", rating: 5, comment: "Beautiful gold leaf work. Best glass and framing shop in Raebareli!", status: "approved", createdAt: "2026-08-08" }
  ],

  paymentGateways: {
    bankDetails: {
      bankName: "State Bank of India",
      accountName: "Quality Glass Emporium",
      accountNumber: "38920192831",
      ifscCode: "SBIN0001234",
      branch: "Raebareli Main Branch"
    },
    upiDetails: {
      upiId: "qualityglass@sbi",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=qualityglass@sbi&pn=Quality%20Glass%20Emporium"
    }
  },

  cmsPages: {
    hero: {
      heading: "Frame Your Memories in Perfect Clarity",
      subheading: "Quality glass cutting, custom photo framing, and artisanal mirrors in Raebareli."
    },
    about: {
      title: "About Quality Glass Emporium",
      content: "Located on Belliganj Malik Mau Road near Hotel Ganesh in PNT Colony, Raebareli, Quality Glass Emporium and Photo Framing Center is Raebareli's premier glass and framing center. We specialize in custom glass cutting, acrylic float frames, architectural tabletops, and gold leaf wall mirrors."
    }
  },

  adminUsers: [
    { loginId: "@kaatya6547", email: "kaatya6547@qualityglass.internal", name: "Developer", role: "admin" },
    { loginId: "@Ajmal6547", email: "ajmal6547@qualityglass.internal", name: "Owner", role: "admin" }
  ]
};
