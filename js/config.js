/* ============================================================
   QUALITY GLASS EMPORIUM - CONFIGURATION & CONSTANTS
   ============================================================ */

window.APP_CONFIG = {
  STORE_NAME: 'Quality Glass Emporium',
  STORE_FULL_NAME: 'Quality Glass Emporium And Photo Framing Center',
  LOCATION: 'PNT Colony, Raebareli, Uttar Pradesh',
  ADDRESS: 'Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh',
  PHONE: '+91-9999535535',
  EMAIL: 'contact@qualityglassemporium.com',
  HOURS: 'Mon - Sun: 9:00 AM - 9:00 PM',
  RATING: '4.9 ★ (8 Ratings)',

  // Supabase Configuration
  SUPABASE_URL: window.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co',
  SUPABASE_ANON_KEY: window.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey',

  // Currency & Tax Settings
  CURRENCY_SYMBOL: '$',
  TAX_RATE: 0.05, // 5% tax
  SHIPPING_FLAT_FEE: 50.00,
  FREE_SHIPPING_MIN: 1000.00,

  // Admin Initial Accounts Seed Reference
  DEFAULT_ADMINS: [
    { email: 'kaatya6547@qualityglass.internal', loginId: '@kaatya6547', name: 'Developer', role: 'admin' },
    { email: 'ajmal6547@qualityglass.internal', loginId: '@Ajmal6547', name: 'Owner', role: 'admin' }
  ]
};
