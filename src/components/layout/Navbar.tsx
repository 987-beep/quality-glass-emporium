'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Moon, Sun, Search, Shield, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useAuth } from '@/lib/store/auth-context';
import { useTheme } from '@/lib/store/theme-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-surface/95 dark:bg-inverse-surface/95 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 shadow-sm">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto h-16 gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed tracking-tight group-hover:text-secondary transition-colors">
              Quality Glass Emporium
            </span>
          </Link>
        </div>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 absolute left-3 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            placeholder="Search frames, sizes, materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-outline-variant bg-surface-container-low dark:bg-charcoal-bg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-on-surface"
          />
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-label-md">
          <Link
            href="/"
            className={`transition-colors py-1 ${
              pathname === '/'
                ? 'text-secondary dark:text-secondary-fixed font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant dark:text-surface-variant hover:text-secondary'
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`transition-colors py-1 ${
              pathname.startsWith('/products')
                ? 'text-secondary dark:text-secondary-fixed font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant dark:text-surface-variant hover:text-secondary'
            }`}
          >
            Collections
          </Link>
          <Link
            href="/custom-framing"
            className={`transition-colors py-1 ${
              pathname === '/custom-framing'
                ? 'text-secondary dark:text-secondary-fixed font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant dark:text-surface-variant hover:text-secondary'
            }`}
          >
            Custom Framing
          </Link>
          <Link
            href="/about"
            className={`transition-colors py-1 ${
              pathname === '/about'
                ? 'text-secondary dark:text-secondary-fixed font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant dark:text-surface-variant hover:text-secondary'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Action Controls (Cart, User, Theme) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high rounded-full transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link
            href="/cart"
            className="relative p-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={isAdmin ? '/admin' : '/account'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-sm font-label-md text-primary dark:text-primary-fixed"
              >
                {isAdmin ? <Shield className="w-4 h-4 text-secondary" /> : <User className="w-4 h-4" />}
                <span className="max-w-[100px] truncate">{user.displayName}</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-md text-sm hover:bg-secondary/90 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface dark:bg-inverse-surface px-6 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              placeholder="Search frames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface outline-none"
            />
          </form>

          <div className="flex flex-col gap-2 font-label-md text-sm">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-surface-container-high text-on-surface"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-surface-container-high text-on-surface"
            >
              Collections
            </Link>
            <Link
              href="/custom-framing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-surface-container-high text-on-surface"
            >
              Custom Framing
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-surface-container-high text-on-surface"
            >
              About & Contact
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg bg-secondary-container text-on-secondary-container font-bold flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin Workspace
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
