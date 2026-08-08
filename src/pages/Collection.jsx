import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { apiFetch } from '../api';

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
      .then(data => setCategories(data))
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
        setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedCategory, searchQuery, sortOption, onlyCustomizable]);

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      {/* Header */}
      <div className="mb-8 border-b border-outline-variant pb-6">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Master Catalog</span>
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">Explore Framing & Custom Gifts</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Browse bespoke picture frames, high-gloss acrylic sheets, photo print packages, 3D photo lamps & personalized merchandise.
        </p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-surface-container-low border border-outline-variant p-4 rounded mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search frames, gifts, prints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface text-xs rounded py-2 pl-3 pr-8 focus:outline-none focus:border-primary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2 text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center space-x-4 w-full md:w-auto justify-between md:justify-end text-xs">
          
          <label className="flex items-center space-x-2 cursor-pointer text-on-surface-variant hover:text-on-surface">
            <input
              type="checkbox"
              checked={onlyCustomizable}
              onChange={(e) => setOnlyCustomizable(e.target.checked)}
              className="accent-primary rounded"
            />
            <span>Customizable Only</span>
          </label>

          <div className="flex items-center space-x-2">
            <span className="text-on-surface-variant font-label-bold">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-surface-container-high border border-outline-variant text-on-surface text-xs rounded py-1.5 px-3 focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Catalog Grid & Category Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Category Navigation */}
        <div className="lg:col-span-1 space-y-2 bg-surface-container-low border border-outline-variant p-4 rounded h-fit">
          <h3 className="font-headline font-semibold text-xs text-primary uppercase mb-3 tracking-wider">
            Categories taxonomy
          </h3>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span>All Products</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-on-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Right: Product Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="py-20 text-center text-on-surface-variant text-sm flex flex-col items-center justify-center space-y-2">
              <span className="material-symbols-outlined text-3xl animate-spin text-primary">sync</span>
              <span>Loading Products Catalog...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-surface-container-low border border-outline-variant rounded p-8">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">search_off</span>
              <h3 className="font-headline font-bold text-base text-on-surface">No Products Match Your Filter</h3>
              <p className="text-xs text-on-surface-variant mt-1">Try clearing your search query or switching categories.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setOnlyCustomizable(false); }}
                className="mt-4 bg-primary text-on-primary font-label-bold text-xs uppercase px-4 py-2 rounded font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                  onOpenFrameStudio={onOpenFrameStudio}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
