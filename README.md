# Quality Glass Emporium & Photo Framing Center E-Commerce Platform

A production-ready, fully functional e-commerce web application converted from the Stitch-generated design project for **Quality Glass Emporium And Photo Framing Center** in Raebareli, Uttar Pradesh.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS (Artisan Clarity Design Tokens)**, **Supabase (PostgreSQL, Auth, Storage, RLS)**, and optimized for **Vercel deployment**.

---

## Key Features

1. **Artisan Modern Storefront (`/`)**:
   - Dynamic Hero Banner Carousel & Featured Categories.
   - Glassmorphism UI layout anchored in Deep Navy (`#00162c`), Action Blue (`#005faf`), and Gold accents.
   - Light & Dark mode support (`Artisan Clarity Charcoal Dark Mode`).
   - Mobile-responsive bottom navbar matching Stitch design screens.

2. **Custom Framing Studio & Catalog (`/products`, `/custom-framing`)**:
   - Multi-image zoom gallery with thumbnail switching.
   - Dynamic Framing Configurator: Custom Width × Height dimension input, wood finish swatch selection (`Dark Espresso`, `Natural Oak`, `Matte White`, `Matte Black`), matting options, and live photo upload.

3. **Shopping Cart & Checkout with Payment Proof Workflow (`/cart`, `/checkout`)**:
   - Cart subtotal, free shipping threshold (₹2,000 / $150), and 18% tax calculation.
   - Server-side coupon code validation (e.g. `WELCOME10`).
   - Bank Transfer / UPI payment gateway instructions (State Bank of India, UPI ID: `qualityglass@sbi`).
   - Interactive drag-and-drop payment proof screenshot uploader.
   - Order created in **`Payment Pending Approval`** state.

4. **Customer Account Portal (`/account`)**:
   - Account Dashboard, Order History, Payment verification statuses, carrier tracking links.
   - Account settings & saved shipping address management.

5. **Comprehensive 16-Module Admin Workspace (`/admin`)**:
   - **Store Overview Dashboard (`/admin/dashboard`)**: Total revenue, gross sales, active sessions, average order value, recent orders, low stock alerts.
   - **Payment Approvals Queue (`/admin/payments`)**: Review customer uploaded payment receipts, full-size receipt viewer, one-click Approve / Reject with admin verification notes.
   - **Orders & Logistics (`/admin/orders`)**: Order status management (`Payment Pending` -> `Approved` -> `Processing` -> `Shipped` -> `Delivered`), tracking number & courier carrier input.
   - **Products & Pricing (`/admin/products`)**: Full product CRUD, SKU, regular & sale pricing, stock count.
   - **Category Taxonomy (`/admin/categories`)**: Category management & slugs.
   - **Banners & Carousels (`/admin/banners`)**: Homepage banner manager.
   - **Store Branding & Info (`/admin/branding`)**: Store name, Raebareli showroom address, phone, email, operating hours.
   - **Website Content CMS (`/admin/content`)**: Manage About Us, Shipping policy, Privacy terms.
   - **Reviews Moderation (`/admin/reviews`)**: Moderate & approve customer product reviews.
   - **Coupons & Discounts (`/admin/coupons`)**: Discount code creator & minimum order rules.
   - **Shipping & Taxes (`/admin/shipping`)**: Shipping rates & tax percentage configuration.
   - **Payment Gateways (`/admin/payment-gateways`)**: Edit bank details & UPI ID.
   - **SEO & Meta Settings (`/admin/seo`)**: Site meta titles, descriptions, keywords.
   - **Customer Accounts (`/admin/customers`)**: Lifetime customer spend & order totals.
   - **Admin Audit Logs (`/admin/audit-logs`)**: Audit trail tracking admin edits.

---

## Seed Administrator Credentials

Public administrator registration is **strictly disabled**. Two default initial administrator accounts are seeded server-side:

| Role | Display Name | Username Handle | Email Address | Password |
|---|---|---|---|---|
| Admin 1 | Developer | `@kaatya6547` | `kaatya6547@qualityglass.com` | `Vis6547@` |
| Admin 2 | Owner | `@Ajmal6547` | `ajmal6547@qualityglass.com` | `Vis6547@` |

*Note: You can log into `/login` or `/admin/login` using either the handle (e.g., `@kaatya6547`) or the email address.*

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons, Custom Glassmorphism Utilities
- **Database & Backend**: Supabase PostgreSQL
- **Storage**: Supabase Storage Buckets (`products`, `banners`, `payment-proofs`)
- **Authentication**: Supabase Auth with SSR (`@supabase/ssr`)
- **Deployment**: Vercel Serverless

---

## Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   node npm_pkg/bin/npm-cli.js install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Database Schema & Migrations**:
   Execute the migration SQL file in your Supabase SQL Editor:
   - `supabase/migrations/20260810_initial_schema.sql`

4. **Seed Database**:
   Run the seed script to import categories, products, banners, and default admins:
   ```bash
   node npm_pkg/bin/npm-cli.js run seed
   ```

5. **Start Local Development Server**:
   ```bash
   node npm_pkg/bin/npm-cli.js run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Vercel Production Deployment

1. Push code repository to GitHub / GitLab / Bitbucket.
2. Import project into Vercel Dashboard.
3. Configure Environment Variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js serverless application.
