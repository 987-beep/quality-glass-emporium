import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function CouponsManager({ token }) {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minSpend, setMinSpend] = useState(499);

  const fetchCoupons = () => {
    apiFetch('/api/admin/coupons', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCoupons(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    apiFetch('/api/admin/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        minSpend: parseFloat(minSpend),
        expiryDate: '2027-12-31'
      })
    })
      .then(res => res.json())
      .then(() => {
        setCode('');
        fetchCoupons();
      })
      .catch(() => {});
  };

  const handleDelete = (id) => {
    apiFetch(`/api/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => fetchCoupons())
      .catch(() => {});
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Promotional Marketing</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Coupon & Discount Codes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant rounded p-4">
          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-surface-container-high rounded border border-outline-variant text-xs">
                <div>
                  <span className="font-mono font-bold text-primary text-sm">{c.code}</span>
                  <div className="text-[10px] text-on-surface-variant">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`} • Min Spend ₹{c.minSpend}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/40 px-2 py-0.5 rounded font-bold">
                    Used {c.usageCount} times
                  </span>
                  <button onClick={() => handleDelete(c.id)} className="text-error font-bold hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded text-xs space-y-4 h-fit">
          <h2 className="font-headline font-bold text-sm text-primary uppercase">Create New Promo Coupon</h2>

          <form onSubmit={handleCreateCoupon} className="space-y-3">
            <div>
              <label className="block text-on-surface font-semibold mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. FESTIVE20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-on-surface font-semibold mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Value</label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-on-surface font-semibold mb-1">Minimum Subtotal Required (₹)</label>
              <input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-bold uppercase py-2.5 rounded hover:bg-primary-fixed transition-all"
            >
              Generate Coupon Code
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
