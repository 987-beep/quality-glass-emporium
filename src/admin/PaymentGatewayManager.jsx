import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../api';

export function PaymentGatewayManager({ token }) {
  const [activeTab, setActiveTab] = useState('qr');
  const [paymentConfig, setPaymentConfig] = useState({
    qrCode: {
      enabled: true,
      upiId: 'qualityglass@upi',
      accountHolder: 'Quality Glass Emporium',
      qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi&pn=QualityGlassEmporium',
      instructions: 'Scan QR code using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR reference number and upload the payment screenshot.'
    },
    bankTransfer: {
      enabled: true,
      accountHolder: 'Quality Glass Emporium',
      bankName: 'State Bank of India',
      accountNumber: '389201004921',
      ifscCode: 'SBIN0000465',
      branch: 'Raebareli Main Branch',
      instructions: 'Transfer total order amount via IMPS / NEFT / RTGS to store bank account. Enter 12-digit Bank UTR reference number and upload screenshot.'
    }
  });

  const [isUploading, setIsUploading] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const qrFileInputRef = useRef(null);

  useEffect(() => {
    apiFetch('/api/admin/payment-config', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.qrCode) setPaymentConfig(data);
      })
      .catch(() => {});
  }, [token]);

  // Upload Custom QR Code Image File
  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append('photo', file);

    apiFetch('/api/upload', {
      method: 'POST',
      body
    })
      .then(res => res.json())
      .then(data => {
        setIsUploading(false);
        if (data.url) {
          setPaymentConfig(prev => ({
            ...prev,
            qrCode: { ...prev.qrCode, qrImageUrl: data.url }
          }));
        }
      })
      .catch(() => {
        setIsUploading(false);
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPaymentConfig(prev => ({
            ...prev,
            qrCode: { ...prev.qrCode, qrImageUrl: ev.target.result }
          }));
        };
        reader.readAsDataURL(file);
      });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    apiFetch('/api/admin/payment-config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paymentConfig)
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        setPaymentConfig(data);
        setSavedMsg('Payment options updated successfully!');
        setTimeout(() => setSavedMsg(''), 4000);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Financial Control Panel</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Payment Options Manager</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Configure two store payment methods: **1. UPI QR Code** (Upload your custom QR code & set UPI ID) and **2. Direct Bank Transfer** (IMPS/NEFT account details).
        </p>
      </div>

      {savedMsg && (
        <div className="bg-primary/10 border border-primary text-primary text-xs p-4 rounded font-bold flex items-center space-x-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-outline-variant space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('qr')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === 'qr'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">qr_code_scanner</span>
          <span>Option 1: UPI QR Code Payment</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === 'bank'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">account_balance</span>
          <span>Option 2: Direct Bank Transfer</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* OPTION 1: UPI QR CODE PAYMENT CONFIGURATION */}
        {activeTab === 'qr' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <div className="md:col-span-7 bg-surface-container-low border border-outline-variant p-6 rounded space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                <span className="font-headline font-bold text-sm text-primary uppercase">UPI QR Code Settings</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentConfig.qrCode.enabled}
                    onChange={(e) => setPaymentConfig({
                      ...paymentConfig,
                      qrCode: { ...paymentConfig.qrCode, enabled: e.target.checked }
                    })}
                    className="accent-primary"
                  />
                  <span className="text-on-surface font-semibold">Enable QR Payment</span>
                </label>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Store UPI VPA ID *</label>
                <input
                  type="text"
                  required
                  placeholder="qualityglass@upi"
                  value={paymentConfig.qrCode.upiId}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    qrCode: { ...paymentConfig.qrCode, upiId: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded font-mono focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Quality Glass Emporium"
                  value={paymentConfig.qrCode.accountHolder}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    qrCode: { ...paymentConfig.qrCode, accountHolder: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded focus:outline-none focus:border-primary"
                />
              </div>

              {/* Upload Custom QR Code Image */}
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Upload Admin Custom QR Code Image *
                </label>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={qrFileInputRef}
                    onChange={handleQrUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => qrFileInputRef.current && qrFileInputRef.current.click()}
                    disabled={isUploading}
                    className="bg-surface-container-high border border-outline-variant text-on-surface hover:border-primary px-4 py-2.5 rounded font-bold flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">upload_file</span>
                    <span>{isUploading ? 'Uploading Image...' : 'Upload Custom QR Image'}</span>
                  </button>
                </div>
                
                <span className="text-[10px] text-on-surface-variant mt-1 block">
                  Upload your actual Paytm, PhonePe, Google Pay, or BHIM QR code image.
                </span>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Payment Instructions for Customers</label>
                <textarea
                  rows={3}
                  value={paymentConfig.qrCode.instructions || ''}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    qrCode: { ...paymentConfig.qrCode, instructions: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* QR Preview Column */}
            <div className="md:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded space-y-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-label-bold text-primary tracking-widest">Admin Uploaded QR Live Preview</span>
              
              <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-300 max-w-[220px]">
                <img
                  src={paymentConfig.qrCode.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=qualityglass@upi'}
                  alt="Admin Uploaded UPI QR Code"
                  className="w-full h-auto object-contain rounded"
                />
                <div className="mt-2 text-center text-gray-900 font-mono text-[11px] font-bold">
                  {paymentConfig.qrCode.upiId}
                </div>
                <div className="text-[9px] text-gray-500 font-semibold">
                  {paymentConfig.qrCode.accountHolder}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* OPTION 2: DIRECT BANK TRANSFER CONFIGURATION */}
        {activeTab === 'bank' && (
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-4 text-xs max-w-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <span className="font-headline font-bold text-sm text-primary uppercase">Direct Bank Transfer Details</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentConfig.bankTransfer.enabled}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    bankTransfer: { ...paymentConfig.bankTransfer, enabled: e.target.checked }
                  })}
                  className="accent-primary"
                />
                <span className="text-on-surface font-semibold">Enable Bank Transfer</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-on-surface font-semibold mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  placeholder="State Bank of India"
                  value={paymentConfig.bankTransfer.bankName}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    bankTransfer: { ...paymentConfig.bankTransfer, bankName: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Quality Glass Emporium"
                  value={paymentConfig.bankTransfer.accountHolder}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    bankTransfer: { ...paymentConfig.bankTransfer, accountHolder: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  placeholder="389201004921"
                  value={paymentConfig.bankTransfer.accountNumber}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    bankTransfer: { ...paymentConfig.bankTransfer, accountNumber: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded font-mono focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">IFSC Code *</label>
                <input
                  type="text"
                  required
                  placeholder="SBIN0000465"
                  value={paymentConfig.bankTransfer.ifscCode}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    bankTransfer: { ...paymentConfig.bankTransfer, ifscCode: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded font-mono uppercase focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-on-surface font-semibold mb-1">Branch Name</label>
                <input
                  type="text"
                  placeholder="Raebareli Main Branch"
                  value={paymentConfig.bankTransfer.branch || ''}
                  onChange={(e) => setPaymentConfig({
                    ...paymentConfig,
                    bankTransfer: { ...paymentConfig.bankTransfer, branch: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-on-surface font-semibold mb-1">Customer Instructions</label>
              <textarea
                rows={3}
                value={paymentConfig.bankTransfer.instructions || ''}
                onChange={(e) => setPaymentConfig({
                  ...paymentConfig,
                  bankTransfer: { ...paymentConfig.bankTransfer, instructions: e.target.value }
                })}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full max-w-xs bg-primary text-on-primary font-headline font-bold uppercase py-3.5 rounded hover:bg-primary-fixed transition-all shadow-lg shadow-primary/20"
        >
          {isLoading ? 'Saving Changes...' : 'Save Payment Options'}
        </button>

      </form>

    </div>
  );
}
