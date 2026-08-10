'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { FileText, Save, CheckCircle2 } from 'lucide-react';

export default function AdminEditWebsiteContentPage() {
  const [activeTab, setActiveTab] = useState<'about_us' | 'shipping_policy' | 'privacy_policy' | 'contact_info'>('about_us');
  const [contents, setContents] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const data = await StoreService.getWebsiteContent();
    setContents(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const current = contents[activeTab] || '';
    await StoreService.updateWebsiteContent(activeTab, current);
    setMsg(`Content for ${activeTab.replace('_', ' ').toUpperCase()} updated successfully!`);
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Website Content CMS</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">Edit website pages content, policy terms, and about us text.</p>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-3">
          {[
            { id: 'about_us', label: 'About Us Page' },
            { id: 'shipping_policy', label: 'Shipping & Delivery Policy' },
            { id: 'privacy_policy', label: 'Privacy & Data Policy' },
            { id: 'contact_info', label: 'Contact Details Section' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-label-md text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Form */}
        <form onSubmit={handleSave} className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-4 max-w-3xl">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2 capitalize">
              {activeTab.replace('_', ' ')} Markdown / Text Content
            </label>
            <textarea
              rows={12}
              value={contents[activeTab] || ''}
              onChange={(e) => setContents({ ...contents, [activeTab]: e.target.value })}
              className="w-full p-3 text-xs border border-outline-variant rounded-lg bg-surface font-body-md leading-relaxed outline-none focus:border-secondary"
            />
          </div>

          <button
            type="submit"
            className="bg-secondary text-white px-6 py-2.5 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Content Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
