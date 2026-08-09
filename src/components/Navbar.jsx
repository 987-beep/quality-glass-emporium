import React, { useState, useEffect } from 'react';
import { apiFetch, getLocalSettings, syncSettingsWithLocal } from '../api';

const STORE_COLLECTIONS_NAV = [
  { id: 'all', name: 'All Collections', icon: 'auto_awesome' },
  { id: 'photo-frames', name: 'Photo Frames', icon: 'filter' },
  { id: 'anime', name: 'Anime Art', icon: 'smart_toy' },
  { id: 'religious', name: 'Religious Icons', icon: 'temple_hindu' },
  { id: 'manwha', name: 'Manwha Prints', icon: 'auto_stories' },
  { id: 'gifts', name: 'Custom Gifts', icon: 'redeem' },
  { id: 'acrylic-frames', name: 'Acrylic Frames', icon: 'aspect_ratio' }
];

export function Navbar({ activePage, setActivePage, cartCount, user, onOpenAuth, onLogout, themeMode, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [settings, setSettings] = useState(getLocalSettings());

  useEffect(() => {
    apiFetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(syncSettingsWithLocal(data)))
      .catch(() => setSettings(syncSettingsWithLocal(null)));
  }, []);

  const storeName = settings?.storeName || "Quality Glass Emporium";
  const tagline = settings?.tagline || "Photo Studio & Bespoke Framing";

  return (
    <header className="w-full bg-background border-b border-outline-variant transition-colors duration-300 relative z-50">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-col items-center justify-center space-y-3">
        
        {/* ROW 1: Brand Name in Attractive Single Line Font & Subtitle Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1.5 sm:space-y-0 sm:space-x-3 text-center">
          <button 
            onClick={() => setActivePage('home')}
            className="font-headline font-extrabold text-xl sm:text-2xl md:text-3xl text-primary tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap drop-shadow-md font-display-lg"
          >
            {storeName}
          </button>
          <span className="text-[10px] uppercase bg-surface-container-high text-primary px-3 py-1 rounded border border-outline-variant font-bold tracking-widest whitespace-nowrap shadow-sm">
            {tagline}
          </span>
        </div>

        {/* ROW 2: All Navigation Options & Actions Centered Under Brand Name */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/50">
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mx-auto">
            <button
              onClick={() => setActivePage('home')}
              className={`font-label-bold text-xs uppercase tracking-widest px-2.5 py-1 transition-all whitespace-nowrap ${
                activePage === 'home' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Home
            </button>

            {/* Collections Dropdown Link */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsDropdownOpen(true)}
              onMouseLeave={() => setCollectionsDropdownOpen(false)}
            >
              <button
                onClick={() => setActivePage('collection')}
                className={`font-label-bold text-xs uppercase tracking-widest px-2.5 py-1 transition-all whitespace-nowrap flex items-center space-x-1 ${
                  activePage === 'collection' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>Collections</span>
                <span className="material-symbols-outlined text-sm transition-transform duration-200">
                  {collectionsDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {collectionsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-surface-container-low border border-outline-variant rounded-md shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-primary tracking-widest border-b border-outline-variant/40 mb-1">
                    Store Collections
                  </div>
                  {STORE_COLLECTIONS_NAV.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActivePage('collection', { category: c.id });
                        setCollectionsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors flex items-center space-x-2.5 font-semibold"
                    >
                      <span className="material-symbols-outlined text-base text-primary/80">{c.icon}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setActivePage('frame-studio')}
              className={`font-label-bold text-xs uppercase tracking-widest px-3 py-1 rounded transition-all whitespace-nowrap ${
                activePage === 'frame-studio' ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20' : 'bg-surface-container-high text-primary border border-outline-variant hover:bg-primary/20 font-semibold'
              }`}
            >
              🎨 Frame Studio
            </button>

            <button
              onClick={() => setActivePage('passport-studio')}
              className={`font-label-bold text-xs uppercase tracking-widest px-2.5 py-1 transition-all whitespace-nowrap ${
                activePage === 'passport-studio' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              📸 Passport Studio
            </button>

            <button
              onClick={() => setActivePage('order-tracking')}
              className={`font-label-bold text-xs uppercase tracking-widest px-2.5 py-1 transition-all whitespace-nowrap ${
                activePage === 'order-tracking' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Track Order
            </button>
          </div>

          {/* Right Action Controls: Theme Switcher, Cart, Auth / Admin */}
          <div className="flex items-center space-x-3 shrink-0 ml-auto md:ml-0">
            
            {/* Theme Color Switcher Button (Green/Black vs Green/White) */}
            <button
              onClick={toggleTheme}
              className="bg-surface-container-high border border-outline-variant hover:border-primary text-primary px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm shrink-0"
              title={themeMode === 'light' ? "Switch to Dark Theme (Green & Black)" : "Switch to Light Theme (Green & White)"}
            >
              <span className="material-symbols-outlined text-base">
                {themeMode === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="hidden sm:inline uppercase text-[10px] tracking-wider whitespace-nowrap font-bold">
                {themeMode === 'light' ? 'Green & Black' : 'Green & White'}
              </span>
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => setActivePage('cart')} 
              className="relative p-2 text-on-surface hover:text-primary transition-colors shrink-0"
              title="Shopping Cart"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-on-primary font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Switch */}
            {user ? (
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setActivePage('my-orders')}
                  className="bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded transition-all flex items-center space-x-1 font-bold whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-base">package_2</span>
                  <span className="hidden sm:inline">My Orders</span>
                </button>

                {['admin', 'owner', 'developer'].includes(user.role) && (
                  <button
                    onClick={() => setActivePage('admin-dashboard')}
                    className="bg-primary/10 border border-primary text-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded hover:bg-primary hover:text-on-primary transition-all font-bold whitespace-nowrap shadow-sm"
                  >
                    ⚙️ Admin Control
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="text-on-surface-variant hover:text-error text-xs font-label-bold p-1 shrink-0"
                  title="Log Out"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary hover:border-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded transition-all flex items-center space-x-1 shrink-0 whitespace-nowrap font-bold"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-on-surface hover:text-primary shrink-0"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-low border-t border-outline-variant px-margin-mobile py-4 space-y-3">
          <button
            onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-on-surface hover:text-primary py-2 font-bold"
          >
            Home
          </button>

          <div className="space-y-1 py-1 border-y border-outline-variant/40">
            <span className="block font-label-bold text-[10px] uppercase text-primary font-bold tracking-widest pt-1">
              Store Collections:
            </span>
            {STORE_COLLECTIONS_NAV.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActivePage('collection', { category: c.id });
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-xs text-on-surface hover:text-primary py-1.5 pl-2 font-medium flex items-center space-x-2"
              >
                <span className="material-symbols-outlined text-sm text-primary">{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => { setActivePage('frame-studio'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-primary font-bold py-2"
          >
            🎨 Custom Frame Studio
          </button>
          <button
            onClick={() => { setActivePage('passport-studio'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-on-surface hover:text-primary py-2 font-bold"
          >
            📸 Passport Photo Studio
          </button>
          <button
            onClick={() => { setActivePage('order-tracking'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-on-surface hover:text-primary py-2 font-bold"
          >
            Track Order
          </button>
          
          <div className="pt-2 border-t border-outline-variant flex items-center justify-between">
            <span className="text-xs text-on-surface font-semibold">Theme Palette:</span>
            <button
              onClick={toggleTheme}
              className="bg-primary/10 border border-primary text-primary px-3 py-1 rounded text-xs font-bold flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-sm">
                {themeMode === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
              <span>{themeMode === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
