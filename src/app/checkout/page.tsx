'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Truck, Upload, CheckCircle, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useAuth } from '@/lib/store/auth-context';
import { StoreService } from '@/lib/services/store-service';
import { SEED_SITE_SETTINGS } from '@/lib/seed-data';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: 'Belliganj Malik Mau Road, PNT Colony',
    city: 'Raebareli',
    state: 'Uttar Pradesh',
    postalCode: '229001',
    country: 'India'
  });

  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const shippingFee = subtotal >= 2000 ? 0 : 150;
  const taxAmount = subtotal * 0.18;
  const totalAmount = subtotal + shippingFee + taxAmount;

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPaymentProofFile(null);
      setProofPreviewUrl(null);
      return;
    }
    setPaymentProofFile(file);
    const url = URL.createObjectURL(file);
    setProofPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.street) {
      setErrorMsg('Please complete all required customer & shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // In production, paymentProofFile is uploaded to Supabase Storage bucket 'payment-proofs'
      const proofUrl = proofPreviewUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn9jcbQoercOVYC4cIh6sCAq0SxYrV3HTIG5W3auYxzruTW8aRjwyY9luCnMxd28yoZnXhUFBPMldk8q3706QN7G0Pk6NvVMUpejdxd5-v2PjYZdCm-7smpDuUE90xvPQImJ7H7u3U_0YX_aw-hZP4I6EZDhGbzlnJE19BBuNwFt3rv5ke7ncQMQzxZ_krIUmzg6ygnPxUuERNB0jKtFfWfRUhXRr7YMl63PGTGeyW8WI_sPF-D0Ok0w';

      const orderPayload = {
        user_id: user?.id || null,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: {
          full_name: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        subtotal,
        shipping_cost: shippingFee,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        status: 'pending_payment' as const,
        payment_method: 'bank_transfer',
        payment_proof_url: proofUrl,
        payment_notes: paymentNotes || 'Payment proof submitted for admin verification.',
        items: items.map((item) => ({
          id: `item-${Date.now()}-${Math.random()}`,
          order_id: '',
          product_id: item.product_id,
          product_name: item.product?.name || 'Custom Frame',
          product_price: item.product?.sale_price || item.product?.price || 0,
          quantity: item.quantity,
          custom_config: item.custom_config,
          subtotal: (item.product?.sale_price || item.product?.price || 0) * item.quantity
        }))
      };

      const createdOrder = await StoreService.createOrder(orderPayload);
      clearCart();
      router.push(`/account/orders/${createdOrder.id}?success=true`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      <div>
        <h1 className="font-display-lg text-3xl font-bold text-primary dark:text-primary-fixed">Checkout</h1>
        <p className="font-body-md text-sm text-on-surface-variant">Review your order details and upload bank payment proof.</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-error-container text-error rounded-xl text-sm flex items-center gap-2 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
        {/* Left Column: Order Review, Address & Payment Proof Upload */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Review Panel */}
          <section className="glass-panel rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-headline-md text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <ShoppingCart className="w-5 h-5" /> Order Review ({items.length} Items)
            </h2>
            <div className="space-y-3">
              {items.map((item) => {
                const product = item.product;
                const price = product?.sale_price || product?.price || 0;
                return (
                  <div key={item.id} className="flex gap-4 items-center bg-surface-container-lowest p-3 rounded-lg border border-surface-container-highest">
                    <div className="w-16 h-16 bg-surface-container-highest rounded-md overflow-hidden shrink-0 relative">
                      <Image
                        src={product?.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg'}
                        alt={product?.name || 'Item'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow text-xs space-y-0.5">
                      <h3 className="font-bold text-sm text-primary">{product?.name}</h3>
                      {item.custom_config?.finish && <p className="text-on-surface-variant">Finish: {item.custom_config.finish}</p>}
                      {item.custom_config?.width && <p className="text-on-surface-variant">Size: {item.custom_config.width}&quot; × {item.custom_config.height}&quot;</p>}
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-bold text-sm text-primary">${(price * item.quantity).toFixed(2)}</p>
                      <p className="text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Shipping Address Section */}
          <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="font-headline-md text-lg font-bold text-primary flex items-center gap-2">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body-md">
              <div>
                <label className="block text-on-surface font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-on-surface font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-on-surface font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-on-surface font-bold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-on-surface font-bold mb-1">City / District</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-on-surface font-bold mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
            </div>
          </section>

          {/* Payment Gateway Instructions */}
          <section className="bg-secondary/5 rounded-xl p-6 border border-secondary/30 space-y-3">
            <h2 className="font-headline-md text-base font-bold text-secondary flex items-center gap-2">
              Bank Transfer / UPI Payment Instructions
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Please transfer the total order amount to Quality Glass Emporium using the details below, then upload your transaction screenshot or deposit slip:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-surface p-4 rounded-lg border border-outline-variant/30">
              <p><strong>Bank:</strong> {SEED_SITE_SETTINGS.bank_name}</p>
              <p><strong>Account Name:</strong> {SEED_SITE_SETTINGS.account_holder}</p>
              <p><strong>Account No:</strong> {SEED_SITE_SETTINGS.account_number}</p>
              <p><strong>IFSC Code:</strong> {SEED_SITE_SETTINGS.ifsc_code}</p>
              <p className="col-span-1 md:col-span-2 text-secondary font-bold">
                UPI ID: {SEED_SITE_SETTINGS.upi_id}
              </p>
            </div>
          </section>

          {/* Payment Proof Upload Dropzone */}
          <section className="bg-surface-container-lowest rounded-xl p-6 border-l-4 border-l-secondary border border-outline-variant/30 shadow-sm space-y-4">
            <div>
              <h2 className="font-headline-md text-lg font-bold text-primary flex items-center gap-2">
                Upload Payment Proof Receipt
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Upload your bank payment screenshot or transaction PDF for admin verification.
              </p>
            </div>

            {!proofPreviewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-outline-variant hover:border-secondary rounded-xl p-8 text-center cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex flex-col items-center justify-center min-h-[180px]"
              >
                <Upload className="w-10 h-10 text-outline mb-2" />
                <p className="font-label-md text-sm text-primary mb-1">Drag & drop payment receipt here</p>
                <p className="text-xs text-on-surface-variant mb-4">Supports JPG, PNG, PDF up to 5MB</p>
                <label className="bg-secondary text-on-secondary px-5 py-2 rounded-full font-label-md text-xs cursor-pointer hover:bg-secondary/90">
                  Select File
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between border border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative rounded bg-surface border overflow-hidden shrink-0">
                    <Image src={proofPreviewUrl} alt="Payment Proof" fill className="object-cover" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-on-surface">{paymentProofFile?.name || 'Payment_Proof_Receipt.jpg'}</p>
                    <p className="text-success-green font-medium">Receipt ready for verification</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChange(null)}
                  className="text-error hover:bg-error-container/40 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Additional Payment Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Transferred via GPay / UTR Ref No 920194019"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full p-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Submit Button */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm sticky top-24 space-y-4">
            <h2 className="font-headline-md text-lg font-bold text-primary">Total Summary</h2>

            <div className="space-y-2 text-xs text-on-surface-variant border-b border-outline-variant/30 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold text-primary dark:text-primary-fixed">
              <span>Total</span>
              <span className="text-2xl">${totalAmount.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary text-on-secondary font-label-md text-sm font-bold py-4 rounded-full hover:bg-secondary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Submitting Order...'
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Submit Order for Approval
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-on-surface-variant leading-tight">
              Order status will be initialized to <strong>Payment Pending Approval</strong>. An admin will verify your proof and approve fulfillment.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
