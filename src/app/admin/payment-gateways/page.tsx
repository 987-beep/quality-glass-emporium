'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { SiteSettings } from '@/lib/types/database';
import { CreditCard, Save, CheckCircle2, QrCode } from 'lucide-react';

export default function AdminPaymentGatewaysPage() {
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
    setMsg('Bank transfer and UPI payment gateway details updated!');
    setTimeout(() => setMsg(null), 3000);
  };

  if (!settings) return null;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Payment Gateways & Proof Setup</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">Configure bank transfer account details and UPI IDs presented to customers at checkout for payment proof upload.</p>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        <form onSubmit={handleSave} className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-6 max-w-xl">
          <div className="space-y-4 text-xs font-body-md">
            <div>
              <label className="block text-on-surface font-bold mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Account Holder Name</label>
              <input
                type="text"
                value={settings.account_holder}
                onChange={(e) => setSettings({ ...settings, account_holder: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Account Number</label>
              <input
                type="text"
                value={settings.account_number}
                onChange={(e) => setSettings({ ...settings, account_number: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">IFSC Branch Code</label>
              <input
                type="text"
                value={settings.ifsc_code}
                onChange={(e) => setSettings({ ...settings, ifsc_code: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">UPI ID (GPay / PhonePe / Paytm)</label>
              <input
                type="text"
                value={settings.upi_id}
                onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface font-mono font-bold text-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-secondary text-white px-6 py-3 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Payment Gateway Details
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
