import { Category, Product, Banner, Coupon, SiteSettings } from './types/database';

const now = new Date().toISOString();

export const SEED_ADMINS = [
  {
    displayName: 'Developer',
    username: 'kaatya6547',
    email: 'kaatya6547@qualityglass.com',
    password: 'Vis6547@',
    role: 'admin' as const
  },
  {
    displayName: 'Owner',
    username: 'Ajmal6547',
    email: 'ajmal6547@qualityglass.com',
    password: 'Vis6547@',
    role: 'admin' as const
  }
];

export const SEED_SITE_SETTINGS: SiteSettings = {
  store_name: 'Quality Glass Emporium And Photo Framing Center',
  tagline: 'Crafting clarity and preserving cherished memories with premium artisan framing.',
  address: 'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh',
  phone: '+91 94150 65470',
  email: 'contact@qualityglassemporium.com',
  operating_hours: 'Mon - Sun: 9:00 AM - 9:00 PM',
  social_links: {
    whatsapp: 'https://wa.me/919415065470',
    instagram: 'https://instagram.com/qualityglassemporium',
    facebook: 'https://facebook.com/qualityglassemporium'
  },
  shipping_fee: 150.00,
  free_shipping_threshold: 2000.00,
  tax_rate_percent: 18.0,
  bank_name: 'State Bank of India (SBI)',
  account_number: '382910482910',
  ifsc_code: 'SBIN0001234',
  upi_id: 'qualityglass@sbi',
  account_holder: 'Quality Glass Emporium',
  meta_title: 'Quality Glass Emporium & Photo Framing Center | Raebareli',
  meta_description: 'Best glass dealer and custom photo framing center in Raebareli. Premium picture frames, museum glass, acrylic floats, and architectural glass solutions.',
  meta_keywords: 'glass dealers raebareli, photo framing center, picture frames, museum glass, acrylic float frame, quality glass emporium'
};

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Picture Frames',
    slug: 'picture-frames',
    description: 'Custom handcrafted wood, metal, and acrylic frames for fine art and photographs.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg',
    display_order: 1,
    created_at: now
  },
  {
    id: 'cat-2',
    name: 'Glass Products & Sheets',
    slug: 'glass-products',
    description: 'Museum-grade non-glare glass, UV acrylic sheets, tempered and custom-cut architectural glass.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQJZ-vDdZ4d6emf3FnfLItx6LMneQnzyVtF4q-hhxxUPGlpObJPZggTcBTb0RBpIekTZVsBi5Ugl86V9XaINfNIW7PqWyKhe2uAzYlwnaOn0fth6ftXeCzHwAb9fv5mk_-Igp1CV9XmLl5-s8__pnnMhWgimiS5wmP_dqlaoMPCM3SbhdSi94xkJy1PllFMN6eQW8yFLovYcXoh8C8gONf_Puswzl0ziIBs2fDRNtrkavbqMtCJp86Qw',
    display_order: 2,
    created_at: now
  },
  {
    id: 'cat-3',
    name: 'Custom Framing Services',
    slug: 'custom-framing',
    description: 'Tailor-made frame sizes, multi-matting, and professional archival photo mounting.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxI5nL560akGJLj1bZ8BT5QtT9-1SHyrPCj5g0yGz9hJtijzWg9ucLvR8YbdTJwYxR0IHLFD6ZQseqCm-GEjZbkAwdOSCoFq5NBt9x9sJcGCqctkKRQKkM6yhuSscsrdU6zQE_B14e_qfgc2prXj37HdSFIy7Jbqpg2uUha4uk9zv5Zwmw5P2rn8bErxrktctGyexa7yJ5Z8zddz7VCUTDWe_w7s3NkvkLKQ7X1ZVd2FkTmJ02Mxq7Mw',
    display_order: 3,
    created_at: now
  },
  {
    id: 'cat-4',
    name: 'Wall Decor & Mount Kits',
    slug: 'wall-decor',
    description: 'Collage frames, gallery wall displays, hardware, and decorative glass mirrors.',
    image_url: 'https://lh3.googleusercontent.com/aida/AP1WRLvs8glZE8N7jK5D808-t789KgAwZl0I210VBmbNiBcM2KkBQO9iZ62hhgIhiWH4m9J2ctimt8Ts3dwNbTCOFWRPEYO3m79DI_O0DBULkzgk6Ci5yiGoM2SSZI3kBPgrGcXiuVyZhdYTC_ZN_YcNIl89i_ZsQQDBcvhLKYr57roQbstG8fojV7GLmuLhrnEovfFBcDdIOS-HP48DLpdJvXyKmrbdhMGSTNNyy8d1fQOmti14Zje1HgUGDXNs',
    display_order: 4,
    created_at: now
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Gallery Standard Black Frame',
    slug: 'gallery-standard-black-frame',
    description: 'Handcrafted solid wood frame finished in matte black. Features museum-grade glass with 99% UV protection to keep your artwork and photographs vibrant for a lifetime.',
    price: 45.00,
    sale_price: null,
    sku: 'FRM-BLK-001',
    stock: 24,
    status: 'published',
    category_id: 'cat-1',
    images: [
      'https://lh3.googleusercontent.com/aida/AP1WRLvpj_DBm0YS_Ppvo1h7J-YfBfbITEim0H_qba03K0N4W7inBIA-tDzfpmtQv46au_EMH2ftjaq4KoM3Rg0tC18eXw7LFlhFhb2zndlbO-yd1wXuAlHwmyUTv-jB12V0158KK7J75E99ctXxxKJtziAx-sciGjXh3ttHQ--Eo3KhqpHoQEndXkl4noF8itbSHysBOhzLN5rEXx0TjerJG0WA4s-LoJMJ4UKoRYpD8YbK4jCY6zPviIq5vhTi'
    ],
    specifications: {
      material: 'Solid Wood',
      glazing: 'Museum Grade Glass',
      frame_width: '1.25 inches',
      frame_depth: '1.5 inches',
      hardware: 'Heavy duty hanging wire included'
    },
    is_featured: true,
    created_at: now,
    updated_at: now
  },
  {
    id: 'prod-2',
    name: 'Modern Acrylic Float Frame',
    slug: 'modern-acrylic-float-frame',
    description: 'Frameless edge-to-edge optical clarity acrylic float frame. Suspends your photo between two crystal-clear sheets for a modern gallery aesthetic.',
    price: 65.00,
    sale_price: 58.00,
    sku: 'FRM-ACR-002',
    stock: 18,
    status: 'published',
    category_id: 'cat-1',
    images: [
      'https://lh3.googleusercontent.com/aida/AP1WRLs8jKR2nyRO8MEitgNunFVxUxXaf49IM93RjH08aG3jumiYkzVAz9aeiFEFDEp7aoFQhu54fONCjpISdaML3v0f5aEzYgtqjPdaz72DDT_Hyx-DVSXj83hQKJmFYibuNAeMoAhwPjxopwh0UFpsm0l8-hyefplGjGv7kbPsQfey6RnI2ckMMdAuK5MYaacgsU3dcHEfbvq0Yr4JuKjIyJgZho9ClLTXDmEVKe6ewitBXxyMs3-yq849WSgD'
    ],
    specifications: {
      material: 'Optical Acrylic Glass',
      glazing: 'Non-glare UV Acrylic',
      frame_width: 'Frameless Float',
      hardware: 'Brass standoff wall mounts'
    },
    is_featured: true,
    created_at: now,
    updated_at: now
  },
  {
    id: 'prod-3',
    name: 'Artisan Wood Frame (Dark Oak)',
    slug: 'artisan-wood-frame-dark-oak',
    description: 'Premium dark espresso oak frame handcrafted in our workshop. Features deep wood grain, mitered joints, and non-reflective acrylic glass.',
    price: 89.00,
    sale_price: 110.00,
    sku: 'FRM-OAK-003',
    stock: 15,
    status: 'published',
    category_id: 'cat-1',
    images: [
      'https://lh3.googleusercontent.com/aida/AP1WRLvs8glZE8N7jK5D808-t789KgAwZl0I210VBmbNiBcM2KkBQO9iZ62hhgIhiWH4m9J2ctimt8Ts3dwNbTCOFWRPEYO3m79DI_O0DBULkzgk6Ci5yiGoM2SSZI3kBPgrGcXiuVyZhdYTC_ZN_YcNIl89i_ZsQQDBcvhLKYr57roQbstG8fojV7GLmuLhrnEovfFBcDdIOS-HP48DLpdJvXyKmrbdhMGSTNNyy8d1fQOmti14Zje1HgUGDXNs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg'
    ],
    specifications: {
      material: 'Sustainably Sourced Dark Oak Wood',
      glazing: 'UV-Protective Acrylic Glass',
      frame_width: '1.25 inches',
      frame_depth: '1.5 inches'
    },
    is_featured: true,
    created_at: now,
    updated_at: now
  },
  {
    id: 'prod-4',
    name: 'Museum Grade Acrylic Sheet Front (24" x 36")',
    slug: 'museum-grade-acrylic-sheet-24x36',
    description: 'Precision cut anti-reflective, shatterproof museum glass replacement sheet. Ideal for replacing standard glass in large frames.',
    price: 145.00,
    sale_price: null,
    sku: 'GLS-ACR-2436',
    stock: 2,
    status: 'published',
    category_id: 'cat-2',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDn9jcbQoercOVYC4cIh6sCAq0SxYrV3HTIG5W3auYxzruTW8aRjwyY9luCnMxd28yoZnXhUFBPMldk8q3706QN7G0Pk6NvVMUpejdxd5-v2PjYZdCm-7smpDuUE90xvPQImJ7H7u3U_0YX_aw-hZP4I6EZDhGbzlnJE19BBuNwFt3rv5ke7ncQMQzxZ_krIUmzg6ygnPxUuERNB0jKtFfWfRUhXRr7YMl63PGTGeyW8WI_sPF-D0Ok0w'
    ],
    specifications: {
      material: '3mm Archival Acrylic',
      glazing: '99% Anti-Reflective UV Filter',
      origin: 'Custom Cut in Raebareli Workshop'
    },
    is_featured: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'prod-5',
    name: 'Solid Walnut Gallery Frame',
    slug: 'solid-walnut-gallery-frame',
    description: 'Rich American walnut wood frame with natural oil finish. Adds warmth and elegance to family portraits and fine art prints.',
    price: 89.00,
    sale_price: null,
    sku: 'FRM-WAL-005',
    stock: 12,
    status: 'published',
    category_id: 'cat-1',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC06dOELKuBMw9m6GZn5CE55rRfCOvbhcIVX1YX5e1nx_AYd2xRpib42ruUborA1mo_sbCndJhISNYqNc9MX9nmZex141BFB86_vxmdoMbvkX7aDJKd2urysbIq4OzFpO7l4KJm5s7IRBKifzl3FSXyFmyEpGC2lmxHHAsFljo-UgK7y0zrFp7cm4imaCpR7acQEgg6Z53btAgQQWL9hievRDCQIdozoueY3TdmBvjV5Lr-r_o5KXQC-w'
    ],
    specifications: {
      material: 'American Walnut Wood',
      glazing: 'Clear UV Protection Glass',
      frame_width: '1.5 inches'
    },
    is_featured: true,
    created_at: now,
    updated_at: now
  },
  {
    id: 'prod-6',
    name: 'Matte Black Metal Frame (18" x 24")',
    slug: 'matte-black-metal-frame-18x24',
    description: 'Slim modern architectural metal frame in anodized black aluminum. Minimalist border design for photography galleries.',
    price: 55.00,
    sale_price: 49.00,
    sku: 'FRM-MTL-1824',
    stock: 5,
    status: 'published',
    category_id: 'cat-1',
    images: [
      'https://lh3.googleusercontent.com/aida/AP1WRLvpj_DBm0YS_Ppvo1h7J-YfBfbITEim0H_qba03K0N4W7inBIA-tDzfpmtQv46au_EMH2ftjaq4KoM3Rg0tC18eXw7LFlhFhb2zndlbO-yd1wXuAlHwmyUTv-jB12V0158KK7J75E99ctXxxKJtziAx-sciGjXh3ttHQ--Eo3KhqpHoQEndXkl4noF8itbSHysBOhzLN5rEXx0TjerJG0WA4s-LoJMJ4UKoRYpD8YbK4jCY6zPviIq5vhTi'
    ],
    specifications: {
      material: 'Anodized Aluminum Metal',
      glazing: 'Polished Float Glass'
    },
    is_featured: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'prod-7',
    name: 'Non-Glare Museum Glass (11" x 14")',
    slug: 'non-glare-museum-glass-11x14',
    description: 'Ultra-clear etched non-glare picture frame glass replacement sheet. Virtually invisible coating eliminates reflections.',
    price: 40.00,
    sale_price: null,
    sku: 'GLS-NG-1114',
    stock: 8,
    status: 'published',
    category_id: 'cat-2',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQJZ-vDdZ4d6emf3FnfLItx6LMneQnzyVtF4q-hhxxUPGlpObJPZggTcBTb0RBpIekTZVsBi5Ugl86V9XaINfNIW7PqWyKhe2uAzYlwnaOn0fth6ftXeCzHwAb9fv5mk_-Igp1CV9XmLl5-s8__pnnMhWgimiS5wmP_dqlaoMPCM3SbhdSi94xkJy1PllFMN6eQW8yFLovYcXoh8C8gONf_Puswzl0ziIBs2fDRNtrkavbqMtCJp86Qw'
    ],
    specifications: {
      material: '2.5mm Etched Non-Glare Glass',
      glazing: 'UV Anti-Reflective'
    },
    is_featured: false,
    created_at: now,
    updated_at: now
  }
];

export const SEED_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Frame Your Memories in Perfect Clarity',
    subtitle: 'Discover our curated collection of premium glass and acrylic frames, designed to protect and showcase your most treasured moments.',
    image_url: 'https://lh3.googleusercontent.com/aida/AP1WRLvs8glZE8N7jK5D808-t789KgAwZl0I210VBmbNiBcM2KkBQO9iZ62hhgIhiWH4m9J2ctimt8Ts3dwNbTCOFWRPEYO3m79DI_O0DBULkzgk6Ci5yiGoM2SSZI3kBPgrGcXiuVyZhdYTC_ZN_YcNIl89i_ZsQQDBcvhLKYr57roQbstG8fojV7GLmuLhrnEovfFBcDdIOS-HP48DLpdJvXyKmrbdhMGSTNNyy8d1fQOmti14Zje1HgUGDXNs',
    link_url: '/products',
    button_text: 'Shop Collections',
    display_order: 1,
    is_active: true
  },
  {
    id: 'ban-2',
    title: 'Artisanal Custom Framing & Photo Mounting',
    subtitle: 'Custom width & height framing tailored exactly to your artwork dimensions at our Raebareli workshop.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxI5nL560akGJLj1bZ8BT5QtT9-1SHyrPCj5g0yGz9hJtijzWg9ucLvR8YbdTJwYxR0IHLFD6ZQseqCm-GEjZbkAwdOSCoFq5NBt9x9sJcGCqctkKRQKkM6yhuSscsrdU6zQE_B14e_qfgc2prXj37HdSFIy7Jbqpg2uUha4uk9zv5Zwmw5P2rn8bErxrktctGyexa7yJ5Z8zddz7VCUTDWe_w7s3NkvkLKQ7X1ZVd2FkTmJ02Mxq7Mw',
    link_url: '/products?category=custom-framing',
    button_text: 'Custom Framing',
    display_order: 2,
    is_active: true
  }
];

export const SEED_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discount_type: 'percent',
    discount_value: 10,
    min_order_amount: 50,
    expires_at: '2027-12-31T23:59:59Z',
    is_active: true
  },
  {
    id: 'coup-2',
    code: 'QUALITYGLASS',
    discount_type: 'fixed',
    discount_value: 15,
    min_order_amount: 100,
    expires_at: '2027-12-31T23:59:59Z',
    is_active: true
  }
];
