# Quality Glass Emporium And Photo Framing Center

A multi-user e-commerce web platform engineered for **Quality Glass Emporium And Photo Framing Center**, located in Raebareli, UP. Powered by Vercel Local Persistent Storage and the *Artisan Clarity* design system.

---

## 1. Business & Store Overview

- **Store Name:** Quality Glass Emporium And Photo Framing Center
- **Address:** Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh
- **Rating:** 4.9 Stars (8 Ratings on JustDial)
- **Hours:** Open daily until 9:00 PM
- **Key Offerings:** Custom Burmese teak wood photo framing, museum-grade non-reflective UV glass, toughened architectural glass panels, modern acrylic float panels, and designer wall mirrors.

---

## 2. Administrator Credentials Policy

> [!IMPORTANT]
> **Seed Admin Credentials (Initialized in Vercel Space):**
> 1. **Developer Account:**
>    - Handle/Login ID: `@kaatya6547`
>    - Password: `Vis6547@`
> 2. **Owner Account:**
>    - Handle/Login ID: `@Ajmal6547`
>    - Password: `Vis6547@`
>
> **Security Rules:**
> - Public website registration ONLY creates `customer` accounts.
> - Admin access is enforced server-side/role-side.
> - Client bundles contain NO hardcoded passwords.

---

## 3. Project Architecture

```
quality_emporium/
├── index.html                           # Root Application & Responsive Layout
├── vercel.json                          # Vercel Deployment Configuration
├── .env.example                         # Vercel Environment Template
├── README.md                            # Comprehensive Setup Documentation
├── css/
│   └── main.css                         # Artisan Clarity Design System (Colors & Tokens)
└── js/
    ├── config.js                        # Vercel Local Storage Configuration & Admin Credentials
    ├── store.js                         # Vercel Persistent State Manager (Cart, Orders, Products)
    ├── auth.js                          # Auth Handler & Role-Based Access Control (RBAC)
    ├── app.js                           # App Router & View Orchestrator
    └── views/                           # Storefront & 16 Admin Workspace Views
```

---

## 4. Vercel Deployment Guide

1. Push this repository to GitHub/GitLab.
2. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import the `quality_emporium` directory.
4. Click **Deploy**. Vercel will host the website instantly with zero external database configuration required.
