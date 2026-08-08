import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { ProductsManager } from './ProductsManager';
import { MainPageManager } from './MainPageManager';
import { CategoriesManager } from './CategoriesManager';
import { OrdersManager } from './OrdersManager';
import { CouponsManager } from './CouponsManager';
import { BannersManager } from './BannersManager';
import { ReviewsManager } from './ReviewsManager';
import { CustomersManager } from './CustomersManager';
import { ShippingManager } from './ShippingManager';
import { PaymentGatewayManager } from './PaymentGatewayManager';
import { SeoManager } from './SeoManager';
import { BrandingManager } from './BrandingManager';

export function AdminLayout({ user, token, onLogout, setActivePage }) {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: 'dashboard' },
    { id: 'mainpage', label: 'Edit Main Page Website', icon: 'edit_note' },
    { id: 'products', label: 'Products & Pricing', icon: 'inventory_2' },
    { id: 'categories', label: 'Categories Taxonomy', icon: 'category' },
    { id: 'orders', label: 'Orders & Logistics', icon: 'local_shipping' },
    { id: 'coupons', label: 'Coupons & Discounts', icon: 'confirmation_number' },
    { id: 'banners', label: 'Banners & Carousels', icon: 'view_carousel' },
    { id: 'reviews', label: 'Reviews Moderation', icon: 'reviews' },
    { id: 'customers', label: 'Customer Accounts', icon: 'group' },
    { id: 'payment', label: 'Payment Gateways', icon: 'account_balance_wallet' },
    { id: 'shipping', label: 'Shipping & Taxes', icon: 'payments' },
    { id: 'seo', label: 'SEO & Meta Settings', icon: 'search' },
    { id: 'branding', label: 'Branding & Store Info', icon: 'storefront' }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-surface-container-high border-r border-outline-variant p-4 space-y-6 shrink-0">
        
        {/* Admin Header */}
        <div className="pb-4 border-b border-outline-variant">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-label-bold text-primary tracking-widest block">Secure Control Panel</span>
            <span className="bg-primary text-on-primary font-bold text-[9px] uppercase px-2 py-0.5 rounded">
              {user?.role || 'admin'}
            </span>
          </div>
          <h2 className="font-headline font-bold text-lg text-on-surface">{user?.name || 'Admin User'}</h2>
          <span className="text-xs text-on-surface-variant font-mono block mt-0.5">{user?.username || user?.email}</span>
        </div>

        {/* Sidebar Nav Tabs */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded text-xs transition-colors flex items-center space-x-3 ${
                activeTab === item.id
                  ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="pt-4 border-t border-outline-variant space-y-2 text-xs">
          <button
            onClick={() => setActivePage('home')}
            className="w-full text-left px-3 py-2 rounded bg-surface-container-low text-primary border border-outline-variant hover:border-primary flex items-center space-x-2 font-bold"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            <span>View Live Customer Site</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 rounded text-error hover:bg-error/10 flex items-center space-x-2 font-bold"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Log Out Admin</span>
          </button>
        </div>

      </aside>

      {/* Admin Content Workspace */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'overview' && <Dashboard token={token} setActiveTab={setActiveTab} />}
        {activeTab === 'mainpage' && <MainPageManager token={token} />}
        {activeTab === 'products' && <ProductsManager token={token} />}
        {activeTab === 'categories' && <CategoriesManager token={token} />}
        {activeTab === 'orders' && <OrdersManager token={token} />}
        {activeTab === 'coupons' && <CouponsManager token={token} />}
        {activeTab === 'banners' && <BannersManager token={token} />}
        {activeTab === 'reviews' && <ReviewsManager token={token} />}
        {activeTab === 'customers' && <CustomersManager token={token} />}
        {activeTab === 'payment' && <PaymentGatewayManager token={token} />}
        {activeTab === 'shipping' && <ShippingManager token={token} />}
        {activeTab === 'seo' && <SeoManager token={token} />}
        {activeTab === 'branding' && <BrandingManager token={token} />}
      </main>

    </div>
  );
}
