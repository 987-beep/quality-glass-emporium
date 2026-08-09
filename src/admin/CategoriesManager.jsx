import React, { useState, useEffect } from 'react';
import { apiFetch, getAssetUrl } from '../api';
import { FileUploadInput } from '../components/FileUploadInput';

export function CategoriesManager({ token }) {
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderSavedMsg, setOrderSavedMsg] = useState(false);

  // Edit Category Modal state
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = () => {
    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...categories];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setCategories(updated);
  };

  const handleMoveDown = (index) => {
    if (index === categories.length - 1) return;
    const updated = [...categories];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setCategories(updated);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    setOrderSavedMsg(false);
    try {
      const categoryIds = categories.map(c => c.id);
      const res = await apiFetch('/api/admin/categories/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ categoryIds })
      });
      if (res.ok) {
        setOrderSavedMsg(true);
        setTimeout(() => setOrderSavedMsg(false), 3000);
      }
    } catch (err) {
      alert('Failed to save category order: ' + err.message);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    apiFetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newCatName.trim(),
        slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newCatDesc.trim() || 'Bespoke Collection',
        image: newCatImg || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
      })
    })
      .then(res => res.json())
      .then(() => {
        setNewCatName('');
        setNewCatDesc('');
        setNewCatImg('');
        fetchCategories();
      })
      .catch((err) => alert('Error adding category: ' + err.message));
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const res = await apiFetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCategory)
      });
      if (res.ok) {
        setEditingCategory(null);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update category');
      }
    } catch (err) {
      alert('Network error updating category: ' + err.message);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category collection?')) return;
    apiFetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => fetchCategories())
      .catch(() => {});
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-4">
        <div>
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Taxonomy Management</span>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Store Collections & Category Logos</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Arrange and reorder collection options in any order. The arranged order will automatically update on live website.
          </p>
        </div>

        <button
          onClick={handleSaveOrder}
          disabled={isSavingOrder}
          className="bg-primary text-on-primary font-bold text-xs uppercase px-5 py-2.5 rounded shadow-lg shadow-primary/20 hover:bg-primary-fixed transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
        >
          {isSavingOrder ? (
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
          ) : (
            <span className="material-symbols-outlined text-sm">save</span>
          )}
          <span>{isSavingOrder ? 'Saving Order...' : 'Save Collection Order'}</span>
        </button>
      </div>

      {orderSavedMsg && (
        <div className="bg-primary/10 border border-primary text-primary px-4 py-2 rounded text-xs font-bold flex items-center space-x-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>Collection arrangement order saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Re-orderable Categories List */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant rounded p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-outline-variant text-xs text-on-surface-variant font-bold uppercase">
            <span>Arrange Display Order</span>
            <span>{categories.length} Collections</span>
          </div>

          <div className="space-y-3">
            {categories.map((cat, index) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-surface-container-high rounded border border-outline-variant text-xs group hover:border-primary/40 transition-colors">
                <div className="flex items-center space-x-3">
                  {/* Order controls */}
                  <div className="flex flex-col space-y-1 text-on-surface-variant">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="hover:text-primary disabled:opacity-30"
                      title="Move Up"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      disabled={index === categories.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="hover:text-primary disabled:opacity-30"
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_downward</span>
                    </button>
                  </div>

                  <img src={getAssetUrl(cat.image)} alt={cat.name} className="w-12 h-12 object-cover rounded border border-outline-variant" />
                  <div>
                    <div className="font-bold text-on-surface flex items-center space-x-2">
                      <span>{cat.name}</span>
                      <span className="text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant font-mono">#{index + 1}</span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant line-clamp-1">{cat.description}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory({ ...cat })}
                    className="text-primary hover:underline font-bold px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="text-error hover:underline font-bold px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Add New Category Form */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded text-xs space-y-4 h-fit">
          <h2 className="font-headline font-bold text-sm text-primary uppercase border-b border-outline-variant pb-2">Create New Collection</h2>

          <form onSubmit={handleAddCategory} className="space-y-3">
            <div>
              <label className="block text-on-surface font-semibold mb-1">Collection Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Canvas Art Prints"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-on-surface font-semibold mb-1">Short Description</label>
              <textarea
                rows={2}
                placeholder="Description of products in this collection"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <FileUploadInput
              label="Collection Logo / Cover Image"
              value={newCatImg}
              token={token}
              onChange={(url) => setNewCatImg(url)}
              aspectHint="Optimized logo photo: 80 KB to 1.5 MB"
            />

            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-bold uppercase py-2.5 rounded hover:bg-primary-fixed transition-all shadow-md"
            >
              + Add New Collection
            </button>
          </form>
        </div>

      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="font-headline font-bold text-lg text-on-surface border-b border-outline-variant pb-2">
              Edit Collection Logo & Details
            </h2>

            <form onSubmit={handleUpdateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface font-semibold mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <FileUploadInput
                label="Upload Collection Logo Image *"
                value={editingCategory.image}
                token={token}
                onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                aspectHint="Collection logo photo (80 KB to 1.5 MB)"
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="bg-surface-container-high text-on-surface px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary font-bold uppercase px-6 py-2 rounded"
                >
                  Save Collection Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
