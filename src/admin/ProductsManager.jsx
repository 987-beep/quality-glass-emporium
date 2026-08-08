import React, { useState, useEffect } from 'react';
import { apiFetch, getAssetUrl } from '../api';
import { FileUploadInput } from '../components/FileUploadInput';

export function ProductsManager({ token }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'photo-frames',
    price: '',
    originalPrice: '',
    stock: 20,
    description: '',
    image: '',
    isCustomizable: true,
    isFrame: false,
    frameMaterial: 'Walnut Wood'
  });

  const fetchProducts = () => {
    apiFetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 'photo-frames',
      price: '',
      originalPrice: '',
      stock: 25,
      description: '',
      image: '',
      isCustomizable: true,
      isFrame: false,
      frameMaterial: 'Walnut Wood'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      categoryId: prod.categoryId,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      description: prod.description,
      image: prod.image || '',
      isCustomizable: prod.isCustomizable || false,
      isFrame: prod.isFrame || false,
      frameMaterial: prod.frameMaterial || 'Natural Wood'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    apiFetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => fetchProducts())
      .catch((err) => alert('Failed to delete product: ' + err.message));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a product image file before saving.');
      return;
    }

    setIsSaving(true);
    const endpoint = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await apiFetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: parseFloat(formData.originalPrice || formData.price),
          stock: parseInt(formData.stock, 10)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error saving product: ${data.error || 'Server error occurred'}`);
        setIsSaving(false);
        return;
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(`Network error while saving product: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-4">
        <div>
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Inventory Management</span>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Products & Dynamic Prices</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-4 py-2.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high text-on-surface uppercase border-b border-outline-variant font-label-bold">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Attributes</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="material-symbols-outlined text-3xl text-primary/60">inventory_2</span>
                      <p className="font-bold text-on-surface text-sm">No Products in Inventory Catalog</p>
                      <p className="text-xs text-on-surface-variant max-w-sm">
                        Preloaded products have been cleared. Click "Add New Product" to upload product image files directly from your computer and set custom prices!
                      </p>
                      <button
                        onClick={handleOpenAdd}
                        className="mt-2 bg-primary text-on-primary font-bold text-xs uppercase px-4 py-2 rounded shadow-md"
                      >
                        + Add First Product
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-surface-container-high/50">
                    <td className="p-3 flex items-center space-x-3">
                      <img src={getAssetUrl(prod.image)} alt={prod.name} className="w-10 h-10 object-cover rounded border border-outline-variant" />
                      <div>
                        <div className="font-semibold text-on-surface">{prod.name}</div>
                        <div className="text-[10px] text-on-surface-variant line-clamp-1">{prod.description}</div>
                      </div>
                    </td>

                    <td className="p-3 text-on-surface-variant font-medium">
                      {prod.categoryId}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-primary">₹{prod.price}</div>
                      {prod.originalPrice > prod.price && (
                        <div className="text-[10px] text-on-surface-variant line-through">₹{prod.originalPrice}</div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        prod.stock < 10 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40' : 'bg-primary/10 text-primary border border-primary/40'
                      }`}>
                        {prod.stock} units
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {prod.isCustomizable && (
                          <span className="bg-surface-container-high text-primary px-1.5 py-0.5 rounded text-[9px] border border-primary/40">Customizable</span>
                        )}
                        {prod.isFrame && (
                          <span className="bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded text-[9px] border border-outline-variant">Frame Studio</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(prod)} className="text-primary hover:underline font-bold">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(prod.id)} className="text-error hover:underline font-bold">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <h2 className="font-headline font-bold text-lg text-on-surface border-b border-outline-variant pb-2">
              {editingProduct ? 'Edit Product Details' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>

              {/* Upload Product Image File */}
              <FileUploadInput
                label="Upload Product Image File *"
                value={formData.image}
                token={token}
                onChange={(url) => setFormData({ ...formData, image: url })}
                aspectHint="PNG, JPG, WEBP format (Optimized image size: 80 KB to 1.5 MB)"
              />

              <div className="flex space-x-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCustomizable}
                    onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span>Allow Custom Photo Upload</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFrame}
                    onChange={(e) => setFormData({ ...formData, isFrame: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span>Enable Frame Studio Preview</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="bg-surface-container-high text-on-surface px-4 py-2 rounded disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-on-primary font-bold uppercase px-6 py-2 rounded disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSaving && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                  <span>{isSaving ? 'Saving Product...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
