'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Category } from '@/lib/types/database';
import { Plus, Edit2, Trash2, FolderTree, CheckCircle2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const list = await StoreService.getCategories();
    setCategories(list);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name) return;

    await StoreService.saveCategory(editingCat);
    setMsg(`Category "${editingCat.name}" saved!`);
    setIsModalOpen(false);
    loadCategories();
    setTimeout(() => setMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete category?')) {
      await StoreService.deleteCategory(id);
      setMsg('Category deleted.');
      loadCategories();
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Category Taxonomy</h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">Organize product categories and storefront taxonomy.</p>
          </div>
          <button
            onClick={() => {
              setEditingCat({ name: '', slug: '', description: '', image_url: '' });
              setIsModalOpen(true);
            }}
            className="bg-secondary text-white px-4 py-2 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {msg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-card p-5 rounded-xl border border-outline-variant/30 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-primary dark:text-primary-fixed">{cat.name}</h3>
                  <span className="text-[11px] font-mono text-secondary">slug: /{cat.slug}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingCat(cat); setIsModalOpen(true); }}
                    className="p-1.5 text-secondary hover:bg-secondary/10 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-error hover:bg-error-container/30 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-surface border border-outline-variant max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-headline-md text-base font-bold text-primary">Category Form</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={editingCat.slug || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-surface font-mono"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCat.description || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-surface"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold">Save Category</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
