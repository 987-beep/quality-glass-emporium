'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  CheckCircle2,
  Package,
  FolderTree,
  Tag,
  Image as ImageIcon,
  Store,
  FileText,
  MessageSquare,
  Percent,
  CreditCard,
  Globe,
  Users,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/lib/store/auth-context';
import { useTheme } from '@/lib/store/theme-context';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminNav = [
    { label: 'Store Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Payment Approvals', href: '/admin/payments', icon: CheckCircle2 },
    { label: 'Orders & Logistics', href: '/admin/orders', icon: Truck },
    { label: 'Inventory & Products', href: '/admin/products', icon: Package },
    { label: 'Categories Taxonomy', href: '/admin/categories', icon: FolderTree },
    { label: 'Banners & Carousels', href: '/admin/banners', icon: ImageIcon },
    { label: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag },
    { label: 'Store Branding', href: '/admin/branding', icon: Store },
    { label: 'Website Content CMS', href: '/admin/content', icon: FileText },
    { label: 'Reviews Moderation', href: '/admin/reviews', icon: MessageSquare },
    { label: 'Shipping & Taxes', href: '/admin/shipping', icon: Percent },
    { label: 'Payment Gateways', href: '/admin/payment-gateways', icon: CreditCard },
    { label: 'SEO & Meta Settings', href: '/admin/seo', icon: Globe },
    { label: 'Customer Accounts', href: '/admin/customers', icon: Users },
    { label: 'Admin Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-background text-on-background">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low dark:bg-charcoal-bg border-r border-outline-variant/30 z-40 flex flex-col transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-base font-bold text-primary dark:text-primary-fixed">
              Quality Glass Emporium
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">Admin Management System</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager Badge */}
        <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-sm shadow-sm">
            {user?.displayName?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div>
            <p className="font-label-md text-sm font-bold text-on-surface">{user?.displayName || 'Store Manager'}</p>
            <p className="text-[11px] text-success-green flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Verified Admin
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = !!pathname && (pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full font-label-md text-xs transition-all ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-outline-variant/20 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-full font-label-md text-xs text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-full font-label-md text-xs text-error hover:bg-error-container/30 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant/30 h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-headline-md text-base font-bold text-primary dark:text-primary-fixed">
              Admin Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-secondary-fixed" /> : <Moon className="w-5 h-5 text-secondary" />}
            </button>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-label-md border border-outline-variant px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors"
            >
              Storefront ↗
            </Link>
          </div>
        </header>

        {/* Workspace Canvas */}
        <main className="flex-1 p-6 max-w-container-max mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
