'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Banner } from '@/lib/types/database';
import { Plus, Edit2, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    const list = await StoreService.getAllBanners();
    setBanners(list);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title || !editingBanner?.image_url) return;

    await StoreService.saveBanner(editingBanner);
    setMsg('Homepage banner updated successfully!');
    setIsModalOpen(false);
    loadBanners();
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Banners & Carousels</h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">Manage hero carousels and storefront promotional banners.</p>
          </div>
          <button
            onClick={() => {
              setEditingBanner({
                title: 'New Banner Title',
                subtitle: 'Banner promotional subtitle description',
                image_url: 'https://lh3.googleusercontent.com/aida/AP1WRLvs8glZE8N7jK5D808-t789KgAwZl0I210VBmbNiBcM2KkBQO9iZ62hhgIhiWH4m9J2ctimt8Ts3dwNbTCOFWRPEYO3m79DI_O0DBULkzgk6Ci5yiGoM2SSZI3kBPgrGcXiuVyZhdYTC_ZN_YcNIl89i_ZsQQDBcvhLKYr57roQbstG8fojV7GLmuLhrnEovfFBcDdIOS-HP48DLpdJvXyKmrbdhMGSTNNyy8d1fQOmti14Zje1HgUGDXNs',
                link_url: '/products',
                button_text: 'Shop Now',
                is_active: true
              });
              setIsModalOpen(true);
            }}
            className="bg-secondary text-white px-4 py-2 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Banner
          </button>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="glass-card rounded-xl overflow-hidden border border-outline-variant/30 space-y-3">
              <div className="relative aspect-video bg-surface-container-highest">
                <Image src={b.image_url} alt={b.title} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-primary dark:text-primary-fixed">{b.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{b.subtitle}</p>
                  </div>
                  <button
                    onClick={() => { setEditingBanner(b); setIsModalOpen(true); }}
                    className="p-1.5 text-secondary hover:bg-secondary/10 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs font-label-md">
                  <span className="text-secondary font-bold">Button: {b.button_text} ({b.link_url})</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${b.is_active ? 'bg-success-green/20 text-success-green' : 'bg-surface-container text-subtle-gray'}`}>
                    {b.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-surface border border-outline-variant max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-headline-md text-base font-bold text-primary">Banner Form</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={editingBanner.image_url || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-surface text-xs"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Target Link URL</label>
                <input
                  type="text"
                  value={editingBanner.link_url || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={editingBanner.button_text || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, button_text: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold">Save Banner</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
