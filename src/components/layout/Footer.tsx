import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { SEED_SITE_SETTINGS } from '@/lib/seed-data';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline/10 pt-12 pb-24 md:pb-12 text-on-surface-variant dark:text-surface-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter-desktop">
        {/* Company Identity */}
        <div className="space-y-4">
          <h2 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed font-bold">
            Quality Glass Emporium
          </h2>
          <p className="font-caption text-caption leading-relaxed">
            {SEED_SITE_SETTINGS.tagline}
          </p>
          <div className="flex items-center gap-2 text-xs text-success-green font-medium">
            <ShieldCheck className="w-4 h-4" /> Rated 4.9/5 by 8 Verified Customers in Raebareli
          </div>
        </div>

        {/* Contact & Showroom Location */}
        <div className="space-y-3">
          <h3 className="font-label-md text-label-md font-bold text-on-surface dark:text-on-surface-variant">
            Showroom & Contact
          </h3>
          <div className="space-y-2 text-caption font-caption">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>{SEED_SITE_SETTINGS.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-secondary shrink-0" />
              <a href={`tel:${SEED_SITE_SETTINGS.phone}`} className="hover:text-secondary hover:underline">
                {SEED_SITE_SETTINGS.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary shrink-0" />
              <a href={`mailto:${SEED_SITE_SETTINGS.email}`} className="hover:text-secondary hover:underline">
                {SEED_SITE_SETTINGS.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary shrink-0" />
              <span>{SEED_SITE_SETTINGS.operating_hours}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          <h3 className="font-label-md text-label-md font-bold text-on-surface dark:text-on-surface-variant">
            Quick Collections
          </h3>
          <ul className="space-y-2 text-caption font-caption">
            <li>
              <Link href="/products?category=picture-frames" className="hover:text-secondary hover:underline">
                Picture Frames
              </Link>
            </li>
            <li>
              <Link href="/products?category=glass-products" className="hover:text-secondary hover:underline">
                Museum Glass & Acrylic
              </Link>
            </li>
            <li>
              <Link href="/custom-framing" className="hover:text-secondary hover:underline">
                Custom Framing Configurator
              </Link>
            </li>
            <li>
              <Link href="/products?category=wall-decor" className="hover:text-secondary hover:underline">
                Wall Decor & Mounting Kits
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies & Legal */}
        <div className="space-y-3">
          <h3 className="font-label-md text-label-md font-bold text-on-surface dark:text-on-surface-variant">
            Customer Support
          </h3>
          <ul className="space-y-2 text-caption font-caption">
            <li>
              <Link href="/about" className="hover:text-secondary hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping" className="hover:text-secondary hover:underline">
                Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:text-secondary hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-secondary hover:underline text-xs text-outline">
                Admin Portal Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-8 pt-6 border-t border-outline-variant/30 text-center md:flex md:justify-between text-caption font-caption">
        <p>© 2026 Quality Glass Emporium And Photo Framing Center. All rights reserved.</p>
        <p className="mt-2 md:mt-0 text-xs">Crafted with precision in Raebareli, Uttar Pradesh</p>
      </div>
    </footer>
  );
}
