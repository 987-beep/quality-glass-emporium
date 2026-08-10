'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Product, Category } from '@/lib/types/database';
import { Plus, Edit2, Trash2, Search, CheckCircle2, Package, Tag } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [pList, cList] = await Promise.all([
      StoreService.getProducts(),
      StoreService.getCategories()
    ]);
    setProducts(pList);
    setCategories(cList);
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    await StoreService.saveProduct(editingProduct);
    setSuccessMsg(`Product "${editingProduct.name}" saved successfully!`);
    setIsModalOpen(false);
    setEditingProduct(null);
    loadData();
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await StoreService.deleteProduct(id);
      setSuccessMsg('Product deleted successfully.');
      loadData();
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Products & Pricing Management</h1>
            <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
              Create, edit, price, and update inventory stock for picture frames and museum glass products.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduct({
                name: '',
                slug: '',
                description: '',
                price: 50,
                sale_price: null,
                sku: `SKU-${Date.now().toString().substring(7)}`,
                stock: 20,
                status: 'published',
                category_id: categories[0]?.id || '',
                images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg']
              });
              setIsModalOpen(true);
            }}
            className="bg-secondary text-white px-5 py-2.5 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </div>
        )}

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-outline-variant bg-surface outline-none focus:border-secondary"
          />
        </div>

        {/* Products Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">SKU</th>
                  <th className="py-3.5 px-6">Regular Price</th>
                  <th className="py-3.5 px-6">Sale Price</th>
                  <th className="py-3.5 px-6">Stock</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface font-body-md">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-surface-container-highest overflow-hidden relative shrink-0">
                          <Image src={prod.images?.[0] || ''} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-primary dark:text-primary-fixed">{prod.name}</p>
                          <p className="text-[11px] text-on-surface-variant line-clamp-1">{prod.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] font-bold">{prod.sku}</td>
                    <td className="py-4 px-6 font-bold">${prod.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      {prod.sale_price ? (
                        <span className="text-secondary font-bold">${prod.sale_price.toFixed(2)}</span>
                      ) : (
                        <span className="text-subtle-gray">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${prod.stock <= 5 ? 'bg-error-container text-error' : 'bg-surface-container-high'}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-[11px] font-bold text-success-green">
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-secondary hover:bg-secondary/10 rounded"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-error hover:bg-error-container/30 rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-surface border border-outline-variant max-w-2xl w-full rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
              <h3 className="font-headline-md text-base font-bold text-primary">
                {editingProduct.id ? 'Edit Product Details' : 'Create New Product'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-on-surface-variant">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body-md">
              <div className="md:col-span-2">
                <label className="block text-on-surface font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-on-surface font-bold mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingProduct.slug || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="block text-on-surface font-bold mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  value={editingProduct.sku || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="block text-on-surface font-bold mb-1">Regular Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary font-bold"
                />
              </div>

              <div>
                <label className="block text-on-surface font-bold mb-1">Sale Discount Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.sale_price || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value ? Number(e.target.value) : null })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-on-surface font-bold mb-1">Inventory Stock Count</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stock || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-on-surface font-bold mb-1">Category</label>
                <select
                  value={editingProduct.category_id || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-on-surface font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-on-surface font-bold mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-xs font-bold text-on-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-secondary text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-secondary/90 shadow-sm"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
