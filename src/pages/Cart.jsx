import React, { useState } from 'react';
import { apiFetch, getAssetUrl } from '../api';

export function Cart({ cartItems, onUpdateQuantity, onRemoveItem, setActivePage, appliedCoupon, onApplyCoupon }) {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const freeShippingThreshold = 999;
  const shippingFee = subtotal > freeShippingThreshold || subtotal === 0 ? 0 : 79;
  const taxAmount = Math.round((subtotal - discount) * 0.18);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + taxAmount);

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCodeInput.trim()) return;

    apiFetch('/api/coupons/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: couponCodeInput,
        cartSubtotal: subtotal
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setCouponError(data.error);
        } else {
          onApplyCoupon(data);
          setCouponSuccess(data.message);
        }
      })
      .catch(() => setCouponError('Failed to verify coupon code'));
  };

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      {/* Header */}
      <div className="mb-8 border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Shopping Cart</span>
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">Your Bespoke Selection ({cartItems.length})</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center bg-surface-container-low border border-outline-variant rounded p-8">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">shopping_bag</span>
          <h2 className="font-headline font-bold text-lg text-on-surface">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-on-surface-variant mt-1">Explore our catalog or launch the Frame Studio to customize your artwork.</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setActivePage('collection')}
              className="bg-primary text-on-primary font-label-bold text-xs uppercase px-6 py-3 rounded font-bold"
            >
              Browse Catalog
            </button>
            <button
              onClick={() => setActivePage('frame-studio')}
              className="bg-surface-container-high border border-outline-variant text-primary font-label-bold text-xs uppercase px-6 py-3 rounded font-bold hover:bg-primary/20"
            >
              🎨 Custom Frame Studio
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-low border border-outline-variant p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  {/* Custom Photo Thumbnail */}
                  <div className="w-20 h-20 bg-surface-container-high rounded overflow-hidden border border-outline-variant shrink-0">
                    <img
                      src={getAssetUrl(item.customImage || item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-headline font-semibold text-sm text-on-surface">{item.name}</h3>
                    <div className="text-xs text-primary font-semibold mt-0.5">₹{item.price} each</div>

                    {/* Custom Frame Specifications Badge */}
                    {item.customConfig && (
                      <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
                        {Object.entries(item.customConfig).map(([key, val]) => (
                          <span key={key} className="bg-surface-container-high text-on-surface-variant border border-outline-variant px-1.5 py-0.5 rounded">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Removal */}
                <div className="flex items-center space-x-6 self-end sm:self-center">
                  <div className="flex items-center border border-outline-variant bg-surface-container-high rounded text-xs">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2.5 py-1 text-on-surface hover:text-primary"
                    >
                      -
                    </button>
                    <span className="px-3 font-semibold text-on-surface">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-on-surface hover:text-primary"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-headline font-bold text-sm text-primary">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-on-surface-variant hover:text-error transition-colors"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Right: Order Summary & Coupon Code */}
          <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant p-6 rounded space-y-6 h-fit">
            <h2 className="font-headline font-bold text-base text-on-surface border-b border-outline-variant pb-3">
              Order Summary
            </h2>

            {/* Subtotal Breakdowns */}
            <div className="space-y-2.5 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-on-surface">
                  {shippingFee === 0 ? <span className="text-emerald-400 uppercase">Free</span> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>GST Tax (18%)</span>
                <span className="font-semibold text-on-surface">₹{taxAmount}</span>
              </div>
            </div>

            {/* Promo Coupon Form */}
            <form onSubmit={handleCouponSubmit} className="space-y-2 pt-3 border-t border-outline-variant">
              <label className="text-[10px] uppercase font-label-bold text-on-surface-variant block">Apply Promo Coupon Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface text-xs rounded py-1.5 px-3 focus:outline-none focus:border-primary uppercase"
                />
                <button
                  type="submit"
                  className="bg-surface-container-high border border-outline-variant hover:border-primary text-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] text-error mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-400 mt-1">{couponSuccess}</p>}
            </form>

            {/* Grand Total & Checkout Action */}
            <div className="pt-4 border-t border-outline-variant flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase font-label-bold text-on-surface-variant block">Grand Total</span>
                <span className="font-headline font-bold text-2xl text-primary">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setActivePage('checkout')}
              className="w-full bg-primary text-on-primary font-headline font-bold text-xs uppercase py-3.5 rounded hover:bg-primary-fixed transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span>Proceed to Checkout</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
