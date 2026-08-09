import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { apiFetch, syncProductsWithLocal } from '../api';

export function Collection({ initialCategory, initialSearch, onAddToCart, onSelectProduct, onOpenFrameStudio }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortOption, setSortOption] = useState('newest');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let url = `/api/products?category=${selectedCategory}&sort=${sortOption}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (onlyCustomizable) url += `&isCustomizable=true`;

    apiFetch(url)
      .then(res => res.json())
      .then(data => {
        const merged = syncProductsWithLocal(data);
        let filtered = merged;
        if (selectedCategory && selectedCategory !== 'all') {
          const cat = selectedCategory.toLowerCase();
          filtered = filtered.filter(p => 
            (p.categoryId && p.categoryId.toLowerCase() === cat) || 
            (p.category_id && p.category_id.toLowerCase() === cat) ||
            (p.slug && p.slug.toLowerCase() === cat)
          );
        }
        setProducts(filtered);
      })
      .catch(() => {
        const merged = syncProductsWithLocal([]);
        let filtered = merged;
        if (selectedCategory && selectedCategory !== 'all') {
          const cat = selectedCategory.toLowerCase();
          filtered = filtered.filter(p => 
            (p.categoryId && p.categoryId.toLowerCase() === cat) || 
            (p.category_id && p.category_id.toLowerCase() === cat) ||
            (p.slug && p.slug.toLowerCase() === cat)
          );
        }
        setProducts(filtered);
      })
      .finally(() => setIsLoading(false));
  }, [selectedCategory, searchQuery, sortOption, onlyCustomizable]);

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      {/* Category Pills Header */}
      <div className="mb-8 space-y-4 border-b border-outline-variant pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Store Collections</span>
            <h1 className="font-headline font-bold text-3xl text-on-surface">Bespoke Framing & Art</h1>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search frames, canvas & gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface text-xs pl-8 pr-3 py-2 rounded focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined text-sm text-on-surface-variant absolute left-2.5 top-2.5">
                search
              </span>
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-surface-container-high border border-outline-variant text-on-surface text-xs p-2 rounded focus:outline-none focus:border-primary font-semibold"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                : 'bg-surface-container-high border border-outline-variant text-on-surface hover:border-primary'
            }`}
          >
            All Collections
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-container-high border border-outline-variant text-on-surface hover:border-primary'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-on-surface-variant flex flex-col items-center justify-center space-y-2">
          <span className="material-symbols-outlined text-2xl text-primary animate-spin">sync</span>
          <span>Loading catalog directly from database...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-on-surface-variant space-y-3">
          <span className="material-symbols-outlined text-4xl text-primary/40">inventory_2</span>
          <p className="font-bold text-on-surface text-base">No items matching current filter</p>
          <p className="text-xs max-w-sm mx-auto">Try selecting another collection category or clearing search terms.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="bg-primary text-on-primary font-bold text-xs uppercase px-4 py-2 rounded"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
              onOpenFrameStudio={onOpenFrameStudio}
            />
          ))}
        </div>
      )}

    </div>
  );
}
