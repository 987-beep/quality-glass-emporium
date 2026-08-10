# Quality Glass Emporium & Photo Framing Center - Production E-Commerce Platform

A production-ready, full-stack e-commerce application built for **Quality Glass Emporium And Photo Framing Center** in Raebareli, UP.

---

## 🌟 Features Overview

- **Storefront & Catalog**:
  - Hero carousel banners, category navigation, real-time search, price filtering, and sorting.
  - Interactive Custom Framing & Glass Cut-to-Size Configurator (wood, acrylic, gold leaf, black aluminum frames + UV museum glass, anti-reflective glass).
  - Detailed product page with image gallery, specs, attributes, and user review submission & moderation.

- **Shopping Cart & Multi-Step Checkout**:
  - Client & Server side price validation.
  - Coupon code support (`GLASS10`, `WELCOME20`, `FREESHIP`).
  - Address validation, subtotal, shipping fee, and 5% tax calculations.

- **Payment Proof Upload & Approval Workflow**:
  - Customer uploads payment proof receipt (screenshot / receipt photo).
  - Files stored securely in Supabase Storage (`payment-proofs`).
  - Admin Payment Approvals Workspace (`/admin/payments`): Admins inspect receipts, view order details, approve/reject payment with admin notes.

- **Customer Accounts & Order Tracking**:
  - Customer Dashboard, Order History with live payment approval badges (`Payment Pending Review`, `Payment Approved`, `Payment Rejected`).
  - Option to re-upload proof if payment is rejected.

- **Comprehensive Admin Management Workspace (16 Sections)**:
  1. **Dashboard**: Live Sales analytics, pending receipts counter, low stock alert feed, recent orders.
  2. **Products & Pricing**: Full product CRUD, SKU, price, sale price, inventory counter, status.
  3. **Categories Taxonomy**: Category tree management.
  4. **Payment Approvals Workspace**: Receipt inspection, approve/reject workflow.
  5. **Orders & Logistics**: Fulfillment status update (`confirmed`, `processing`, `shipped`, `delivered`), tracking ID.
  6. **Customer Accounts**: Registered user list & total order spending.
  7. **Banners & Carousels**: Manage storefront hero carousel slides.
  8. **Store Info & Branding**: Raebareli physical address, phone, email, store hours.
  9. **Website CMS**: Edit home hero header, custom framing text, about section.
  10. **Coupons & Discounts**: Manage promo codes & minimum spend thresholds.
  11. **Shipping & Taxes**: Tax rate %, flat shipping fee, free shipping threshold.
  12. **Payment Gateways**: Configure bank account details, UPI ID, QR code upload.
  13. **Reviews Moderation**: Approve or delete customer product reviews.
  14. **SEO Settings**: Site title, meta description, keywords.
  15. **Workspace Overview**: System overview matrix.
  16. **Audit Logs & Tools**: Audit log tracking all admin actions.

---

## 🔒 Initial Administrator Seed Accounts

Created securely via server-side seeding:

- **Developer Account**:
  - **Login ID**: `@kaatya6547`
  - **Email**: `kaatya6547@qualityglass.internal`
  - **Password**: `Vis6547@`
  - **Role**: `admin`

- **Owner Account**:
  - **Login ID**: `@Ajmal6547`
  - **Email**: `ajmal6547@qualityglass.internal`
  - **Password**: `Vis6547@`
  - **Role**: `admin`

---

## 🚀 Setup & Vercel Deployment Instructions

### 1. Supabase Database Migration
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the SQL Editor and execute `supabase/schema.sql`.
3. Execute `supabase/seed.sql` to populate initial categories, products, store settings, and admin roles.

### 2. Environment Variables (.env.example)
Set up the following environment variables in Vercel:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Deploy to Vercel
- Import repository into Vercel.
- Select root or `quality_glass_emporium` folder.
- Add environment variables and click **Deploy**.
