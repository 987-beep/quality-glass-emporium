'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { SiteSettings } from '@/lib/types/database';
import { Store, MapPin, Phone, Mail, Clock, CheckCircle2, Save } from 'lucide-react';

export default function AdminBrandingPage() {
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
    setMsg('Store branding and business information updated successfully!');
    setTimeout(() => setMsg(null), 3000);
  };

  if (!settings) return null;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Store Branding & Business Info</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Update store name, Raebareli showroom address, phone, email, operating hours, and social channels.
          </p>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        <form onSubmit={handleSave} className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body-md">
            <div className="md:col-span-2">
              <label className="block text-on-surface font-bold mb-1">Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface font-bold text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-on-surface font-bold mb-1">Brand Tagline / Subtitle</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-on-surface font-bold mb-1">Showroom Address (Raebareli)</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-on-surface font-bold mb-1">Operating Business Hours</label>
              <input
                type="text"
                value={settings.operating_hours}
                onChange={(e) => setSettings({ ...settings, operating_hours: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-on-surface font-bold mb-1">WhatsApp Channel Link</label>
              <input
                type="text"
                value={settings.social_links?.whatsapp || ''}
                onChange={(e) => setSettings({ ...settings, social_links: { ...settings.social_links, whatsapp: e.target.value } })}
                className="w-full p-2.5 border rounded-lg bg-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-secondary text-white px-6 py-3 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Branding Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
