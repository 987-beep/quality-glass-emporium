'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingCart, User, Shield } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useAuth } from '@/lib/store/auth-context';

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();

  // Hide mobile nav on admin pages to allow full sidebar access
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home, active: pathname === '/' },
    { label: 'Collections', href: '/products', icon: Grid, active: !!pathname && pathname.startsWith('/products') },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, active: pathname === '/cart', badge: itemCount },
    { label: 'Profile', href: user ? '/account' : '/login', icon: User, active: !!pathname && (pathname.startsWith('/account') || pathname === '/login') },
  ];

  if (isAdmin) {
    items.push({
      label: 'Admin',
      href: '/admin',
      icon: Shield,
      active: !!pathname && pathname.startsWith('/admin')
    });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-surface/90 dark:bg-charcoal-bg/90 backdrop-blur-xl border-t border-outline-variant/30 dark:border-outline/20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 rounded-t-full">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 relative px-3 rounded-full transition-transform active:scale-90 ${
              item.active
                ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold scale-95'
                : 'text-on-surface-variant dark:text-surface-variant hover:text-secondary'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-error text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-caption text-[11px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
