'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { StoreService } from '@/lib/services/store-service';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const shippingFee = subtotal >= 2000 || subtotal === 0 ? 0 : 150;
  const taxAmount = (subtotal - discountAmount) * 0.18;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = await StoreService.validateCoupon(couponCode.trim(), subtotal);
    if (res.valid) {
      setDiscountAmount(res.discountAmount);
      setCouponMessage({ text: `Coupon applied! You saved ₹${res.discountAmount.toFixed(2)}`, isError: false });
    } else {
      setDiscountAmount(0);
      setCouponMessage({ text: res.message || 'Invalid coupon code', isError: true });
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
          Your Shopping Cart is Empty
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant max-w-md mx-auto">
          Explore our collections of handcrafted picture frames, optical acrylic sheets, and custom framing options.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-label-md text-sm hover:bg-secondary/90 shadow-md"
        >
          Explore Collections <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      <div>
        <h1 className="font-display-lg text-3xl font-bold text-primary dark:text-primary-fixed">
          Shopping Cart ({items.length})
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant mt-1">Review your selected items and custom framing configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const product = item.product;
            const price = product?.sale_price || product?.price || 0;
            const displayImg = product?.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg';

            return (
              <div
                key={item.id}
                className="glass-panel p-4 md:p-6 rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 relative border">
                    <Image src={displayImg} alt={product?.name || 'Product'} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-label-md font-bold text-base text-primary dark:text-primary-fixed">
                      {product?.name || 'Picture Frame'}
                    </h3>
                    {item.custom_config && (
                      <div className="text-xs text-on-surface-variant space-y-0.5 font-caption">
                        {item.custom_config.width && item.custom_config.height && (
                          <p>Custom Size: {item.custom_config.width}&quot; × {item.custom_config.height}&quot;</p>
                        )}
                        {item.custom_config.finish && <p>Finish: {item.custom_config.finish}</p>}
                        {item.custom_config.matting && <p>Mat: {item.custom_config.matting}</p>}
                      </div>
                    )}
                    <span className="font-bold text-sm text-secondary block sm:hidden">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-outline-variant/20">
                  {/* Quantity Controller */}
                  <div className="flex border border-outline-variant rounded-lg overflow-hidden text-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-on-surface-variant hover:bg-surface-container"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold bg-transparent">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-on-surface-variant hover:bg-surface-container"
                    >
                      +
                    </button>
                  </div>

                  <span className="hidden sm:block font-bold text-base text-primary dark:text-primary-fixed min-w-[80px] text-right">
                    ${(price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-error hover:bg-error-container/30 p-2 rounded-full transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary & Coupon Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Form */}
          <div className="glass-card p-6 rounded-xl space-y-3">
            <h3 className="font-label-md font-bold text-sm text-on-surface flex items-center gap-2">
              <Tag className="w-4 h-4 text-secondary" /> Coupon & Discount Code
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. WELCOME10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg bg-surface uppercase outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold font-label-md hover:bg-primary/90 shrink-0"
              >
                Apply
              </button>
            </form>
            {couponMessage && (
              <p className={`text-xs font-medium ${couponMessage.isError ? 'text-error' : 'text-success-green'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4 sticky top-24">
            <h2 className="font-headline-md text-lg font-bold text-primary">Order Summary</h2>

            <div className="space-y-2 text-sm text-on-surface-variant border-b border-outline-variant/30 pb-4 font-body-md">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-success-green font-bold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingFee === 0 ? 'Free Shipping' : 'Standard Delivery'})</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (18%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold text-primary dark:text-primary-fixed">
              <span>Total</span>
              <span className="text-2xl">${totalAmount.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-secondary text-on-secondary py-3.5 rounded-full font-label-md text-sm font-bold hover:bg-secondary/90 transition-all shadow-md text-center block"
            >
              Proceed to Checkout →
            </Link>

            <div className="flex items-center justify-center gap-1 text-xs text-on-surface-variant pt-2">
              <ShieldCheck className="w-4 h-4 text-success-green" /> Bank Transfer & Payment Proof Verification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
