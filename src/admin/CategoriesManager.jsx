import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function CategoriesManager({ token }) {
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');

  const fetchCategories = () => {
    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        name: newCatName,
        slug: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newCatDesc || 'Bespoke Collection',
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
      .catch(() => {});
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category taxonomy?')) return;
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
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Taxonomy Management</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Store Product Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Categories List */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant rounded p-4">
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-surface-container-high rounded border border-outline-variant text-xs">
                <div className="flex items-center space-x-3">
                  <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded border border-outline-variant" />
                  <div>
                    <div className="font-bold text-on-surface">{cat.name}</div>
                    <div className="text-[10px] text-on-surface-variant line-clamp-1">{cat.description}</div>
                  </div>
                </div>

                <button onClick={() => handleDelete(cat.id)} className="text-error hover:underline font-bold">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Add Category Form */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded text-xs space-y-4 h-fit">
          <h2 className="font-headline font-bold text-sm text-primary uppercase">Create New Category</h2>

          <form onSubmit={handleAddCategory} className="space-y-3">
            <div>
              <label className="block text-on-surface font-semibold mb-1">Category Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Leatherette Photo Albums"
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

            <div>
              <label className="block text-on-surface font-semibold mb-1">Thumbnail Cover Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={newCatImg}
                onChange={(e) => setNewCatImg(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-bold uppercase py-2.5 rounded hover:bg-primary-fixed transition-all"
            >
              Add Category Taxonomy
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
