import React, { useState, useEffect } from 'react';
import { apiFetch, getLocalSettings, syncSettingsWithLocal } from '../api';

export function Footer({ setActivePage }) {
  const [settings, setSettings] = useState(getLocalSettings());

  useEffect(() => {
    apiFetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(syncSettingsWithLocal(data)))
      .catch(() => setSettings(syncSettingsWithLocal(null)));
  }, []);

  const storeName = settings?.storeName || "Quality Glass Emporium";
  const tagline = settings?.tagline || "Bespoke Framing, Photo Studio & Customized Gifts";
  const address = settings?.address || "Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh";
  const phone = settings?.phone || "+91 94150 12345";

  return (
    <footer className="bg-surface-container-highest dark:bg-surface-container-high w-full pt-16 border-t border-outline-variant mt-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter pb-12">
        
        {/* Brand & Address Information */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <button 
            onClick={() => setActivePage && setActivePage('home')}
            className="font-headline font-bold text-2xl text-primary uppercase text-left tracking-wide"
          >
            {storeName}
          </button>
          <p className="font-body-md text-sm text-on-surface-variant max-w-md leading-relaxed">
            {tagline}
          </p>
          <div className="text-xs text-on-surface-variant/80 space-y-1">
            <p className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm text-primary">location_on</span>
              <span>{address}</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm text-primary">call</span>
              <span>{phone}</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm text-primary">schedule</span>
              <span>Open Monday – Sunday: 10:00 AM – 9:00 PM</span>
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1 flex flex-col space-y-3">
          <h4 className="font-label-bold text-xs uppercase text-primary font-semibold tracking-wider">Quick Navigation</h4>
          <button onClick={() => setActivePage && setActivePage('collection')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">
            Frame Collections
          </button>
          <button onClick={() => setActivePage && setActivePage('frame-studio')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">
            Custom Frame Studio
          </button>
          <button onClick={() => setActivePage && setActivePage('passport-studio')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">
            Passport Photo Print
          </button>
          <button onClick={() => setActivePage && setActivePage('order-tracking')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">
            Track Order Status
          </button>
        </div>

        {/* Support & Legal */}
        <div className="col-span-1 flex flex-col space-y-3">
          <h4 className="font-label-bold text-xs uppercase text-primary font-semibold tracking-wider">Customer Care</h4>
          <span className="text-sm text-on-surface-variant">Bespoke Framing Guide</span>
          <span className="text-sm text-on-surface-variant">Shipping & Returns</span>
          <span className="text-sm text-on-surface-variant">GST Invoice Request</span>
          <span className="text-sm text-on-surface-variant">Privacy Policy & Terms</span>
        </div>

      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 border-t border-outline-variant/40 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant/60">
        <p>© 2026 Quality Glass Emporium. All Rights Reserved. Mastercrafted bespoke framing & digital photo studio.</p>
        <p className="mt-2 md:mt-0">Production-Ready Full-Stack E-Commerce Platform</p>
      </div>

      {/* Developer Attribution Bar */}
      <div className="bg-surface-container border-t border-outline-variant/60 py-3.5 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="material-symbols-outlined text-primary text-base">terminal</span>
            <span>Website Developer: <strong className="text-on-surface font-bold">Kaatya Developer</strong></span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span>Agency Owner: <strong className="text-primary font-bold">Vishisth Gaur</strong> <span className="text-on-surface-variant/80 font-mono text-[11px]">(Nickname: Little)</span></span>
          </div>

          <a
            href="https://www.instagram.com/_kaatya_og_?igsh=Y251ZDc2eWx1Y3hy"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary/10 border border-primary/40 hover:bg-primary hover:text-on-primary text-primary px-3 py-1 rounded-full font-bold transition-all flex items-center space-x-1.5 shadow-sm text-[11px]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram: @_kaatya_og_</span>
          </a>

        </div>
      </div>

    </footer>
  );
}
