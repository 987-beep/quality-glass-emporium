'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Coupon } from '@/lib/types/database';
import { Plus, Tag, CheckCircle2, Edit2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    const list = await StoreService.getCoupons();
    setCoupons(list);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.code) return;

    await StoreService.saveCoupon(editingCoupon);
    setMsg(`Coupon "${editingCoupon.code}" saved!`);
    setIsModalOpen(false);
    loadCoupons();
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Coupons & Discounts</h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">Manage promotional discount codes and percentage offers.</p>
          </div>
          <button
            onClick={() => {
              setEditingCoupon({
                code: 'NEWCODE10',
                discount_type: 'percent',
                discount_value: 10,
                min_order_amount: 50,
                is_active: true
              });
              setIsModalOpen(true);
            }}
            className="bg-secondary text-white px-4 py-2 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.id} className="glass-card p-5 rounded-xl border border-outline-variant/30 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-lg text-primary dark:text-primary-fixed">{c.code}</span>
                  <p className="text-xs text-secondary font-bold mt-0.5">
                    {c.discount_type === 'percent' ? `${c.discount_value}% OFF` : `$${c.discount_value} OFF`}
                  </p>
                </div>
                <button
                  onClick={() => { setEditingCoupon(c); setIsModalOpen(true); }}
                  className="p-1.5 text-secondary hover:bg-secondary/10 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-on-surface-variant space-y-1">
                <p>Min Order Amount: ${c.min_order_amount.toFixed(2)}</p>
                <p>Status: <strong className={c.is_active ? 'text-success-green' : 'text-subtle-gray'}>{c.is_active ? 'Active' : 'Disabled'}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-surface border border-outline-variant max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-headline-md text-base font-bold text-primary">Coupon Form</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 border rounded-lg bg-surface uppercase font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Discount Type</label>
                <select
                  value={editingCoupon.discount_type || 'percent'}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_type: e.target.value as any })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={editingCoupon.discount_value || 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_value: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-lg bg-surface font-bold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Min Order Requirement ($)</label>
                <input
                  type="number"
                  value={editingCoupon.min_order_amount || 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, min_order_amount: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold">Save Coupon</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
