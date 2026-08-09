import React, { useState, useEffect } from 'react';
import { apiFetch, getAssetUrl, saveLocalProduct, removeLocalProduct, syncProductsWithLocal } from '../api';
import { FileUploadInput } from '../components/FileUploadInput';

const DEFAULT_STORE_COLLECTIONS = [
  { id: "photo-frames", name: "Photo Frames" },
  { id: "anime", name: "Anime" },
  { id: "religious", name: "Religious" },
  { id: "manwha", name: "Manwha" },
  { id: "gifts", name: "Gifts" },
  { id: "acrylic-frames", name: "Acrylic Frames" }
];

export function ProductsManager({ token }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_STORE_COLLECTIONS);
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
      .then(data => {
        const merged = syncProductsWithLocal(data);
        setProducts(merged);
      })
      .catch(() => {
        setProducts(syncProductsWithLocal([]));
      });
  };

  useEffect(() => {
    fetchProducts();
    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
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
      categoryId: prod.categoryId || prod.category_id || 'photo-frames',
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

  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderSavedMsg, setOrderSavedMsg] = useState(false);

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...products];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setProducts(updated);
  };

  const handleMoveDown = (index) => {
    if (index === products.length - 1) return;
    const updated = [...products];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setProducts(updated);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    setOrderSavedMsg(false);
    try {
      const productIds = products.map(p => p.id);
      const res = await apiFetch('/api/admin/products/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productIds })
      });
      if (res.ok) {
        setOrderSavedMsg(true);
        setTimeout(() => setOrderSavedMsg(false), 3000);
      }
    } catch (err) {
      alert('Error saving product order: ' + err.message);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the store database?')) return;
    
    removeLocalProduct(id);
    const authToken = token || localStorage.getItem('qge_token') || '';
    apiFetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(res => res.json())
      .then(() => fetchProducts())
      .catch(() => fetchProducts());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a product image file before saving.');
      return;
    }

    setIsSaving(true);
    const authToken = token || localStorage.getItem('qge_token') || '';
    const endpoint = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice || formData.price),
      stock: parseInt(formData.stock, 10)
    };

    try {
      const res = await apiFetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedData = await res.json().catch(() => null);
        if (savedData && savedData.id) {
          saveLocalProduct(savedData);
        } else {
          saveLocalProduct({ id: editingProduct ? editingProduct.id : `prod-${Date.now()}`, ...payload });
        }
        setIsModalOpen(false);
        fetchProducts();
      } else {
        saveLocalProduct({ id: editingProduct ? editingProduct.id : `prod-${Date.now()}`, ...payload });
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      saveLocalProduct({ id: editingProduct ? editingProduct.id : `prod-${Date.now()}`, ...payload });
      setIsModalOpen(false);
      fetchProducts();
    } finally {
      setIsSaving(false);
    }
  };

  const getCollectionName = (catId) => {
    const found = categories.find(c => c.id === catId || c.slug === catId);
    return found ? found.name : (catId || 'Catalog').replace('-', ' ');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-4">
        <div>
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Inventory & Store Collections</span>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Products & Dynamic Collections</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Assign products to store collections (Photo Frames, Acrylic Sheets, Canvas Prints, Custom Gifts, Passport Studio) and reorder catalog display.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {products.length > 1 && (
            <button
              onClick={handleSaveOrder}
              disabled={isSavingOrder}
              className="bg-surface-container-high border border-outline-variant text-primary font-bold text-xs uppercase px-4 py-2.5 rounded hover:border-primary transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSavingOrder ? (
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-sm">swap_vert</span>
              )}
              <span>{isSavingOrder ? 'Saving Order...' : 'Save Product Order'}</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-4 py-2.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {orderSavedMsg && (
        <div className="bg-primary/10 border border-primary text-primary px-4 py-2 rounded text-xs font-bold flex items-center space-x-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>Product display order saved successfully!</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high text-on-surface uppercase border-b border-outline-variant font-label-bold">
              <tr>
                <th className="p-3 w-16">Order</th>
                <th className="p-3">Product Title</th>
                <th className="p-3">Assigned Collection</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Attributes</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="material-symbols-outlined text-3xl text-primary/60">inventory_2</span>
                      <p className="font-bold text-on-surface text-sm">No Products in Store Catalog</p>
                      <p className="text-xs text-on-surface-variant max-w-sm">
                        Click "Add New Product" to create products and assign them to your store collections.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((prod, index) => (
                  <tr key={prod.id} className="hover:bg-surface-container-high/50">
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30"
                          title="Move Up"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === products.length - 1}
                          className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30"
                          title="Move Down"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getAssetUrl(prod.image)}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded border border-outline-variant shrink-0 bg-background"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div>
                          <div className="font-bold text-on-surface text-xs line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-mono">ID: {prod.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="inline-block bg-primary/10 border border-primary/40 text-primary font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        {getCollectionName(prod.categoryId || prod.category_id)}
                      </span>
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
              {editingProduct ? 'Edit Product & Collection Assignment' : 'Add New Product to Store Collection'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Walnut Wooden Frame"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Assign to Store Collection *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id || c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="899"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1299"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your frame moulding material, glass clarity, or custom printing specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <FileUploadInput
                label="Product Image File *"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                token={token}
                aspectHint="PNG, JPG, WEBP formats (Max 5MB)"
              />

              <div className="pt-2 grid grid-cols-2 gap-4 bg-surface-container-high/40 p-3 rounded border border-outline-variant">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCustomizable}
                    onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-on-surface font-semibold">Enable Custom Photo Upload</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFrame}
                    onChange={(e) => setFormData({ ...formData, isFrame: e.target.checked })}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-on-surface font-semibold">Enable Custom Frame Studio</span>
                </label>
              </div>

              {formData.isFrame && (
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Frame Material Specs</label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Walnut Solid Wood, 99.9% Clear Glass"
                    value={formData.frameMaterial}
                    onChange={(e) => setFormData({ ...formData, frameMaterial: e.target.value })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded hover:bg-surface-container-highest transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-on-primary font-bold rounded hover:bg-primary-fixed transition-colors flex items-center space-x-1 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSaving && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                  <span>{isSaving ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Publish Product')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
