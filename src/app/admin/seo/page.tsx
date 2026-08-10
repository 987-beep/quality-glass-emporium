'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { SiteSettings } from '@/lib/types/database';
import { Globe, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSEOSettingsPage() {
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
    setMsg('SEO & Open Graph meta settings updated!');
    setTimeout(() => setMsg(null), 3000);
  };

  if (!settings) return null;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">SEO & Meta Settings</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">Configure meta title tags, meta descriptions, and keywords for search engine indexing.</p>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        <form onSubmit={handleSave} className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-6 max-w-2xl">
          <div className="space-y-4 text-xs font-body-md">
            <div>
              <label className="block text-on-surface font-bold mb-1">Global Meta Title Tag</label>
              <input
                type="text"
                value={settings.meta_title}
                onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                value={settings.meta_description}
                onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-on-surface font-bold mb-1">Meta Keywords</label>
              <input
                type="text"
                value={settings.meta_keywords}
                onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                className="w-full p-2.5 border rounded-lg bg-surface font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-secondary text-white px-6 py-3 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save SEO Metadata
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
