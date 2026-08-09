import React, { useState } from 'react';

export function Navbar({ activePage, setActivePage, cartCount, user, onOpenAuth, onLogout, themeMode, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('collection', { search: searchQuery });
    }
  };

  return (
    <nav className="sticky top-0 left-0 right-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-outline-variant transition-colors duration-300 shadow-lg">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20">
        
        {/* Store Logo & Title */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActivePage('home')}
            className="text-left font-headline font-bold text-lg md:text-2xl text-primary tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Quality Glass Emporium
          </button>
          <span className="hidden lg:inline-block text-xs uppercase bg-surface-container-high text-primary px-2.5 py-1 rounded border border-outline-variant font-medium">
            Photo Studio & Bespoke Framing
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setActivePage('home')}
            className={`font-label-bold text-xs uppercase tracking-widest px-2 py-1 transition-colors ${
              activePage === 'home' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActivePage('collection')}
            className={`font-label-bold text-xs uppercase tracking-widest px-2 py-1 transition-colors ${
              activePage === 'collection' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Catalog
          </button>

          <button
            onClick={() => setActivePage('frame-studio')}
            className={`font-label-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded transition-colors ${
              activePage === 'frame-studio' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high text-primary border border-outline-variant hover:bg-primary/20'
            }`}
          >
            🎨 Frame Studio
          </button>

          <button
            onClick={() => setActivePage('passport-studio')}
            className={`font-label-bold text-xs uppercase tracking-widest px-2 py-1 transition-colors ${
              activePage === 'passport-studio' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            📸 Passport Studio
          </button>

          <button
            onClick={() => setActivePage('order-tracking')}
            className={`font-label-bold text-xs uppercase tracking-widest px-2 py-1 transition-colors ${
              activePage === 'order-tracking' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Track Order
          </button>
        </div>

        {/* Action Controls: Search, Theme Toggle, Cart, Auth / Admin */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
            <input
              type="text"
              placeholder="Search frames, gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:border-primary w-40 focus:w-56 transition-all"
            />
            <button type="submit" className="absolute right-2 text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-sm">search</span>
            </button>
          </form>

          {/* Theme Color Switcher Button (Green/Black vs Green/White) */}
          <button
            onClick={toggleTheme}
            className="bg-surface-container-high border border-outline-variant hover:border-primary text-primary px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            title={themeMode === 'light' ? "Switch to Dark Theme (Green & Black)" : "Switch to Light Theme (Green & White)"}
          >
            <span className="material-symbols-outlined text-base">
              {themeMode === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider">
              {themeMode === 'light' ? 'Green & Black' : 'Green & White'}
            </span>
          </button>

          {/* Cart Icon */}
          <button 
            onClick={() => setActivePage('cart')} 
            className="relative p-2 text-on-surface hover:text-primary transition-colors"
            title="Shopping Cart"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-on-primary font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Admin Switch */}
          {user ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActivePage('my-orders')}
                className="bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded transition-all flex items-center space-x-1 font-bold"
              >
                <span className="material-symbols-outlined text-base">package_2</span>
                <span className="hidden sm:inline">My Orders</span>
              </button>

              {['admin', 'owner', 'developer'].includes(user.role) && (
                <button
                  onClick={() => setActivePage('admin-dashboard')}
                  className="bg-primary/10 border border-primary text-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded hover:bg-primary hover:text-on-primary transition-all font-bold"
                >
                  ⚙️ Admin Control
                </button>
              )}

              <button
                onClick={onLogout}
                className="text-on-surface-variant hover:text-error text-xs font-label-bold p-1"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary hover:border-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded transition-all flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-base">account_circle</span>
              <span>Login</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:text-primary"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-low border-b border-outline-variant px-margin-mobile py-4 space-y-3">
          <button
            onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-on-surface hover:text-primary py-2"
          >
            Home
          </button>
          <button
            onClick={() => { setActivePage('collection'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-on-surface hover:text-primary py-2"
          >
            Catalog
          </button>
          <button
            onClick={() => { setActivePage('frame-studio'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-primary font-bold py-2"
          >
            🎨 Custom Frame Studio
          </button>
          <button
            onClick={() => { setActivePage('passport-studio'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-on-surface hover:text-primary py-2"
          >
            📸 Passport Photo Studio
          </button>
          <button
            onClick={() => { setActivePage('order-tracking'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-label-bold text-xs uppercase text-on-surface hover:text-primary py-2"
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
    </nav>
  );
}
