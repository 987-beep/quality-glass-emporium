'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { SiteSettings } from '@/lib/types/database';
import { Percent, Truck, Save, CheckCircle2 } from 'lucide-react';

export default function AdminShippingTaxesPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await StoreService.getSiteSettings();
    setSettings(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    await StoreService.updateSiteSettings(settings);
    setMsg('Shipping fees and tax rates updated!');
    setTimeout(() => setMsg(null), 3000);
  };

  if (!settings) return null;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Shipping & Taxes Configuration</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">Configure flat delivery shipping fees, free delivery order thresholds, and GST tax percentages.</p>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        <form onSubmit={handleSave} className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-6 max-w-xl">
          <div className="space-y-4 text-xs font-body-md">
            <div>
              <label className="block text-on-surface font-bold mb-1">Standard Shipping Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={settings.shipping_fee}
                onChange={(e) => setSettings({ ...settings, shipping_fee: Number(e.target.value) })}
                className="w-full p-2.5 border rounded-lg bg-surface font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Free Shipping Threshold ($)</label>
              <input
                type="number"
                step="0.01"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full p-2.5 border rounded-lg bg-surface font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Tax Rate Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.tax_rate_percent}
                onChange={(e) => setSettings({ ...settings, tax_rate_percent: Number(e.target.value) })}
                className="w-full p-2.5 border rounded-lg bg-surface font-bold text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-secondary text-white px-6 py-3 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Shipping & Tax Rates
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
