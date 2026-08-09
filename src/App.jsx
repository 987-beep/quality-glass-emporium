import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FrameStudio } from './components/FrameStudio';
import { PassportStudio } from './components/PassportStudio';
import { Toast } from './components/Toast';

import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { MyOrders } from './pages/MyOrders';
import { Auth } from './pages/Auth';

import { AdminLayout } from './admin/AdminLayout';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('qge_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Auth state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qge_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('qge_token') || '');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Selected Product for Details
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [studioProduct, setStudioProduct] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Dynamic Theme Mode State (Green & Black vs Green & White)
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('qge_theme_mode') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', themeMode);
      if (themeMode === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark');
      }
      localStorage.setItem('qge_theme_mode', themeMode);
    } catch (e) {
      console.error(e);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('qge_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const handleNavigate = (page, params = {}) => {
    setActivePage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const getItemId = (x) => (x.productId !== undefined && x.productId !== null) ? x.productId : x.id;
      const targetId = getItemId(item);

      const existingIndex = prev.findIndex(i => {
        // Custom frames or passport studio items have unique customConfig, so do not merge
        if (i.customConfig || item.customConfig) return false;

        const iId = getItemId(i);
        // Only compare if both items have a valid, non-null ID
        if (iId === undefined || iId === null || targetId === undefined || targetId === null) return false;

        const sameProduct = String(iId) === String(targetId);
        const sameSize = (i.selectedSize || i.size || '') === (item.selectedSize || item.size || '');

        return sameProduct && sameSize;
      });

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + (item.quantity || 1)
        };
        return copy;
      }

      // Generate a unique ID for the cart item entry if not uniquely set
      const cartItemId = item.id || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      return [...prev, { ...item, id: cartItemId, quantity: item.quantity || 1 }];
    });
    setToast({ message: `'${item.name}' added to cart!`, type: 'success' });
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    setToast({ message: 'Item removed from cart', type: 'info' });
  };

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('qge_user', JSON.stringify(data.user));
    localStorage.setItem('qge_token', data.token);
    setShowAuthModal(false);
    setToast({ message: `Welcome back, ${data.user.name}!`, type: 'success' });

    if (['admin', 'owner', 'developer'].includes(data.user.role)) {
      setActivePage('admin-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('qge_user');
    localStorage.removeItem('qge_token');
    setActivePage('home');
    setToast({ message: 'Logged out successfully', type: 'info' });
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans selection:bg-surface-container-high selection:text-primary">
      
      {/* Customer Header Navigation (Hidden on Admin Panel for clean layout) */}
      {activePage !== 'admin-dashboard' && (
        <Navbar
          activePage={activePage}
          setActivePage={handleNavigate}
          cartCount={totalCartCount}
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main Page Workspace */}
      <main className="flex-1">
        
        {activePage === 'home' && (
          <Home
            setActivePage={handleNavigate}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => { setSelectedProduct(p); handleNavigate('product-detail'); }}
            onOpenFrameStudio={(p) => { setStudioProduct(p); handleNavigate('frame-studio'); }}
          />
        )}

        {activePage === 'collection' && (
          <Collection
            initialCategory={pageParams.category}
            initialSearch={pageParams.search}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => { setSelectedProduct(p); handleNavigate('product-detail'); }}
            onOpenFrameStudio={(p) => { setStudioProduct(p); handleNavigate('frame-studio'); }}
          />
        )}

        {activePage === 'product-detail' && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onOpenFrameStudio={(p) => { setStudioProduct(p); handleNavigate('frame-studio'); }}
            setActivePage={handleNavigate}
          />
        )}

        {activePage === 'frame-studio' && (
          <FrameStudio
            initialProduct={studioProduct}
            onAddToCart={(item) => { handleAddToCart(item); handleNavigate('cart'); }}
            onClose={() => handleNavigate('collection')}
          />
        )}

        {activePage === 'passport-studio' && (
          <PassportStudio
            onAddToCart={(item) => { handleAddToCart(item); handleNavigate('cart'); }}
            onClose={() => handleNavigate('collection')}
          />
        )}

        {activePage === 'cart' && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            setActivePage={handleNavigate}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
          />
        )}

        {activePage === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            appliedCoupon={appliedCoupon}
            onClearCart={() => { setCartItems([]); setAppliedCoupon(null); }}
            setActivePage={handleNavigate}
          />
        )}

        {activePage === 'my-orders' && (
          <MyOrders
            user={user}
            token={token}
            setActivePage={handleNavigate}
          />
        )}

        {activePage === 'order-tracking' && (
          <OrderTracking
            initialQuery={pageParams.query}
            setActivePage={handleNavigate}
          />
        )}

        {activePage === 'admin-dashboard' && (
          <AdminLayout
            user={user}
            token={token}
            onLogout={handleLogout}
            setActivePage={handleNavigate}
          />
        )}

      </main>

      {/* Customer Footer (Hidden on Admin Panel) */}
      {activePage !== 'admin-dashboard' && (
        <Footer setActivePage={handleNavigate} />
      )}

      {/* Login / Auth Modal Overlay */}
      {showAuthModal && (
        <Auth
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
