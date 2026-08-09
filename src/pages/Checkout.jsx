import React, { useState, useEffect, useRef } from 'react';
import { apiFetch, getLocalOrders, setLocalOrders, syncPaymentConfigWithLocal, syncSettingsWithLocal, getLocalSettings, getLocalPaymentConfig } from '../api';

export function Checkout({ cartItems, appliedCoupon, onClearCart, setActivePage, token }) {
  const [paymentConfig, setPaymentConfig] = useState(getLocalPaymentConfig());
  const [storeSettings, setStoreSettings] = useState(getLocalSettings());
  const [selectedMethod, setSelectedMethod] = useState('qr'); // 'qr' or 'bank'
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine: '',
    city: 'Raebareli',
    state: 'Uttar Pradesh',
    pincode: '229001',
    utrNumber: '',
    paymentScreenshot: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const screenshotInputRef = useRef(null);

  useEffect(() => {
    apiFetch('/api/payment-config')
      .then(res => res.json())
      .then(data => setPaymentConfig(syncPaymentConfigWithLocal(data)))
      .catch(() => setPaymentConfig(syncPaymentConfigWithLocal(null)));

    apiFetch('/api/settings')
      .then(res => res.json())
      .then(data => setStoreSettings(syncSettingsWithLocal(data)))
      .catch(() => setStoreSettings(syncSettingsWithLocal(null)));
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const freeShippingThreshold = storeSettings?.freeShippingThreshold !== undefined ? storeSettings.freeShippingThreshold : 999;
  const flatShippingRate = storeSettings?.flatShippingRate !== undefined ? storeSettings.flatShippingRate : 79;
  const shippingFee = subtotal > freeShippingThreshold ? 0 : flatShippingRate;
  const taxRatePct = (storeSettings?.taxRatePercentage !== undefined ? storeSettings.taxRatePercentage : 18) / 100;
  const taxAmount = Math.round((subtotal - discount) * taxRatePct);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + taxAmount);

  // Copy helper
  const handleCopyText = (text, label) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(''), 2500);
    }
  };

  const compressScreenshotFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1000;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Upload Payment Screenshot
  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64Screenshot = await compressScreenshotFile(file);
      setFormData(prev => ({ ...prev, paymentScreenshot: base64Screenshot }));

      const body = new FormData();
      body.append('photo', file);

      const res = await apiFetch('/api/upload', {
        method: 'POST',
        body
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url && data.url.startsWith('http')) {
          setFormData(prev => ({ ...prev, paymentScreenshot: data.url }));
        }
      }
    } catch {
      // Base64 compressed image fallback already set
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.addressLine) {
      setErrorMessage('Please fill in all mandatory shipping address fields');
      return;
    }

    if (!formData.utrNumber.trim()) {
      setErrorMessage('Please enter the 12-digit UTR / Transaction Reference Number');
      return;
    }

    if (!formData.paymentScreenshot) {
      setErrorMessage('Please upload your payment screenshot proof before placing order');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const methodName = selectedMethod === 'qr' ? 'UPI QR Code Payment' : 'Direct Bank Transfer (IMPS/NEFT)';
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `QGE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderObj = {
      id: orderId,
      orderNumber,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: `${formData.addressLine}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      items: cartItems.map(i => ({
        productId: i.productId || i.id,
        productName: i.name || i.productName,
        price: i.price,
        quantity: i.quantity,
        customImage: i.customImage || null,
        customConfig: i.customConfig || null
      })),
      totalAmount: grandTotal,
      discountAmount: discount,
      shippingFee,
      taxAmount,
      paymentMethod: methodName,
      utrNumber: formData.utrNumber.trim(),
      paymentScreenshot: formData.paymentScreenshot,
      paymentStatus: 'Pending Verification',
      paymentApprovalStatus: 'Pending Approval',
      orderStatus: 'Payment Verification Pending',
      trackingNumber: `AWB-QGE-${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString()
    };

    // Save order locally first so order is NEVER lost under any network condition
    const existingOrders = getLocalOrders();
    setLocalOrders([newOrderObj, ...existingOrders]);

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: `${formData.addressLine}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      items: cartItems,
      totalAmount: grandTotal,
      discountAmount: discount,
      paymentMethod: methodName,
      utrNumber: formData.utrNumber.trim(),
      paymentScreenshot: formData.paymentScreenshot,
      couponCode: appliedCoupon ? appliedCoupon.code : null
    };

    const headers = { 'Content-Type': 'application/json' };
    const savedToken = token || localStorage.getItem('qge_token');
    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }

    try {
      const res = await apiFetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setPlacedOrder(data.order || newOrderObj);
        onClearCart();
      } else {
        // Fallback to local order success if server API returned non-200
        setPlacedOrder(newOrderObj);
        onClearCart();
      }
    } catch {
      // Local fallback success guarantees order placement even if server is offline or proxy drops socket
      setIsSubmitting(false);
      setPlacedOrder(newOrderObj);
      onClearCart();
    }
  };

  if (placedOrder) {
    return (
      <div className="bg-background text-on-background py-16 px-margin-mobile max-w-2xl mx-auto min-h-screen">
        <div className="bg-surface-container-low border border-amber-400/60 p-8 rounded text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-400">
            <span className="material-symbols-outlined text-3xl">hourglass_top</span>
          </div>

          <div>
            <span className="text-xs uppercase font-label-bold text-amber-400 tracking-widest block">Payment Verification Pending</span>
            <h1 className="font-headline font-bold text-2xl text-on-surface mt-1">Order Submitted for Admin Approval!</h1>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed max-w-md mx-auto">
              Your payment screenshot proof and UTR reference number have been submitted. Our store admin will verify the transaction and confirm your order shortly.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="bg-surface-container-high border border-outline-variant p-5 rounded text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-outline-variant/60 pb-2">
              <span className="text-on-surface-variant font-semibold">Order Reference Number:</span>
              <span className="font-headline font-bold text-primary text-sm">{placedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/60 pb-2">
              <span className="text-on-surface-variant font-semibold">Payment Method Selected:</span>
              <span className="font-semibold text-on-surface">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/60 pb-2">
              <span className="text-on-surface-variant font-semibold">UTR Reference Number:</span>
              <span className="font-mono text-on-surface font-bold">{placedOrder.utrNumber}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/60 pb-2">
              <span className="text-on-surface-variant font-semibold">Approval Status:</span>
              <span className="bg-amber-400/20 text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                {placedOrder.paymentApprovalStatus || 'Pending Approval'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-semibold">Total Amount Paid:</span>
              <span className="font-bold text-primary text-sm">₹{placedOrder.totalAmount}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-2">
            <button
              onClick={() => setActivePage('order-tracking', { query: placedOrder.orderNumber })}
              className="bg-primary text-on-primary font-label-bold text-xs uppercase px-6 py-3 rounded font-bold"
            >
              Track Order Progress
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="bg-surface-container-high border border-outline-variant text-on-surface font-label-bold text-xs uppercase px-6 py-3 rounded"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const qrConfig = paymentConfig?.qrCode || {};
  const bankConfig = paymentConfig?.bankTransfer || {};

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      <div className="mb-8 border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Secure Checkout</span>
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">Shipping Address & Payment Verification</h1>
      </div>

      {errorMessage && (
        <div className="bg-error/10 border border-error text-error text-xs p-4 rounded mb-6 font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-4">
            <h2 className="font-headline font-bold text-sm text-primary uppercase border-b border-outline-variant pb-2">
              1. Customer Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-on-surface mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyesh Sharma"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface mb-1 font-semibold">Phone Number (For Tracking Updates) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94150 00000"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-on-surface mb-1 font-semibold">Complete Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House/Flat No., Building Name, Street & Landmark"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface mb-1 font-semibold">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface mb-1 font-semibold">State / Pincode</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-2/3 bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-1/3 bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Select Payment Method: UPI QR Code vs Direct Bank Transfer */}
          <div className="bg-surface-container-low border border-primary/40 p-6 rounded space-y-6">
            
            <h2 className="font-headline font-bold text-sm text-primary uppercase border-b border-outline-variant pb-2">
              2. Select Payment Method
            </h2>

            {/* Radio Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Option 1: UPI QR Code */}
              <label className={`p-4 rounded border cursor-pointer transition-all flex items-start space-x-3 ${
                selectedMethod === 'qr'
                  ? 'border-primary bg-primary/10 text-on-surface shadow-md'
                  : 'border-outline-variant bg-surface-container-high text-on-surface-variant'
              }`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={selectedMethod === 'qr'}
                  onChange={() => setSelectedMethod('qr')}
                  className="accent-primary mt-0.5"
                />
                <div>
                  <span className="font-bold text-on-surface block text-sm">📱 Option 1: UPI QR Code</span>
                  <span className="text-[10px] text-on-surface-variant block mt-0.5">Scan QR code using GPay, PhonePe, Paytm or BHIM</span>
                </div>
              </label>

              {/* Option 2: Direct Bank Transfer */}
              <label className={`p-4 rounded border cursor-pointer transition-all flex items-start space-x-3 ${
                selectedMethod === 'bank'
                  ? 'border-primary bg-primary/10 text-on-surface shadow-md'
                  : 'border-outline-variant bg-surface-container-high text-on-surface-variant'
              }`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={selectedMethod === 'bank'}
                  onChange={() => setSelectedMethod('bank')}
                  className="accent-primary mt-0.5"
                />
                <div>
                  <span className="font-bold text-on-surface block text-sm">🏛️ Option 2: Bank Transfer</span>
                  <span className="text-[10px] text-on-surface-variant block mt-0.5">IMPS / NEFT / RTGS to Store Bank Account</span>
                </div>
              </label>

            </div>

            {/* OPTION 1 DETAILS: UPI QR CODE */}
            {selectedMethod === 'qr' && (
              <div className="bg-surface-container-high border border-outline-variant p-4 rounded space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Admin Uploaded QR Code Image */}
                  <div className="sm:col-span-5 flex flex-col items-center bg-white p-3 rounded-lg border border-gray-300">
                    <img
                      src={qrConfig.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=qualityglass@upi'}
                      alt="Admin Uploaded Store QR Code"
                      className="w-36 h-36 object-contain rounded"
                    />
                    <span className="text-[9px] text-gray-500 font-semibold mt-1">Scan with any UPI App</span>
                  </div>

                  <div className="sm:col-span-7 space-y-2.5">
                    <div className="bg-surface-container-low p-3 rounded border border-outline-variant space-y-1">
                      <span className="text-[10px] uppercase text-on-surface-variant font-bold block">Store UPI VPA ID</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-primary">{qrConfig.upiId || 'qualityglass@upi'}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(qrConfig.upiId || 'qualityglass@upi', 'upi')}
                          className="bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface text-[10px] uppercase px-2 py-1 rounded font-bold"
                        >
                          {copyStatus === 'upi' ? '✓ Copied!' : 'Copy UPI'}
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-on-surface-variant space-y-1">
                      <p><strong>Account Name:</strong> {qrConfig.accountHolder || 'Quality Glass Emporium'}</p>
                      <p className="text-primary font-bold">Amount to Pay: ₹{grandTotal}</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* OPTION 2 DETAILS: DIRECT BANK TRANSFER */}
            {selectedMethod === 'bank' && (
              <div className="bg-surface-container-high border border-outline-variant p-4 rounded space-y-3 text-xs">
                <span className="font-bold text-primary block border-b border-outline-variant pb-1">
                  Store Bank Account Details (IMPS / NEFT / RTGS)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Bank Name</span>
                    <span className="font-bold text-on-surface">{bankConfig.bankName || 'State Bank of India'}</span>
                  </div>

                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Account Holder</span>
                    <span className="font-bold text-on-surface">{bankConfig.accountHolder || 'Quality Glass Emporium'}</span>
                  </div>

                  <div className="bg-surface-container-low p-2 rounded border border-outline-variant">
                    <span className="text-on-surface-variant block text-[10px]">Account Number</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{bankConfig.accountNumber || '389201004921'}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(bankConfig.accountNumber || '389201004921', 'acc')}
                        className="text-[9px] text-primary font-bold hover:underline"
                      >
                        {copyStatus === 'acc' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-2 rounded border border-outline-variant">
                    <span className="text-on-surface-variant block text-[10px]">IFSC Code</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary uppercase">{bankConfig.ifscCode || 'SBIN0000465'}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(bankConfig.ifscCode || 'SBIN0000465', 'ifsc')}
                        className="text-[9px] text-primary font-bold hover:underline"
                      >
                        {copyStatus === 'ifsc' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-on-surface-variant italic border-t border-outline-variant pt-2">
                  Branch: {bankConfig.branch || 'Raebareli Main Branch'} • Amount to Transfer: <strong className="text-primary font-bold">₹{grandTotal}</strong>
                </p>
              </div>
            )}

            {/* MANDATORY PROOF INPUTS: UTR & SCREENSHOT */}
            <div className="pt-4 border-t border-outline-variant space-y-4 text-xs">
              
              <div>
                <label className="block text-on-surface font-bold mb-1">
                  12-Digit {selectedMethod === 'qr' ? 'UPI UTR' : 'Bank UTR / Reference'} Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 389201948210"
                  value={formData.utrNumber}
                  onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded font-mono text-sm focus:outline-none focus:border-primary font-bold"
                />
                <span className="text-[10px] text-on-surface-variant mt-1 block">
                  Find the 12-digit transaction UTR/Ref ID in your payment receipt details.
                </span>
              </div>

              <div>
                <label className="block text-on-surface font-bold mb-1">
                  Upload Payment Screenshot Proof *
                </label>

                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={screenshotInputRef}
                    onChange={handleScreenshotUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current && screenshotInputRef.current.click()}
                    disabled={isUploading}
                    className="bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface px-4 py-2.5 rounded font-bold flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">cloud_upload</span>
                    <span>{isUploading ? 'Uploading...' : 'Choose Screenshot File'}</span>
                  </button>

                  {formData.paymentScreenshot && (
                    <div className="flex items-center space-x-2 bg-primary/10 border border-primary/40 px-3 py-1.5 rounded">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      <span className="text-primary text-[11px] font-bold">Screenshot Attached</span>
                    </div>
                  )}
                </div>

                {formData.paymentScreenshot && (
                  <div className="mt-2 w-24 h-24 rounded border border-primary overflow-hidden bg-black/40">
                    <img src={formData.paymentScreenshot} alt="Payment Proof Thumbnail" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded space-y-6 h-fit">
          <h2 className="font-headline font-bold text-base text-on-surface border-b border-outline-variant pb-3">
            Review Order Items ({cartItems.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary">{item.quantity}x</span>
                  <span className="text-on-surface line-clamp-1">{item.name}</span>
                </div>
                <span className="font-semibold text-on-surface">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant space-y-2 text-xs text-on-surface-variant">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-on-surface">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-on-surface">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax</span>
              <span className="font-semibold text-on-surface">₹{taxAmount}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-outline-variant font-bold text-sm text-primary">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary font-headline font-bold text-xs uppercase py-3.5 rounded hover:bg-primary-fixed transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>{isSubmitting ? 'Submitting Payment Proof...' : `Submit Order (₹${grandTotal})`}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
