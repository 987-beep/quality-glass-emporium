import React from 'react';
import { getAssetUrl } from '../api';

const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';

export function ProductCard({ product, onAddToCart, onSelectProduct, onOpenFrameStudio }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded overflow-hidden group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-surface-container-high cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={getAssetUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PRODUCT_FALLBACK;
          }}
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-bold text-[10px] uppercase font-bold px-2 py-0.5 rounded">
            Save ₹{product.originalPrice - product.price}
          </span>
        )}
        {product.isCustomizable && (
          <span className="absolute top-3 right-3 bg-surface-container-highest/90 text-primary border border-primary/40 font-label-bold text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
            Customizable
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
            <span className="uppercase tracking-wider font-semibold text-primary/80">{product.categoryId ? product.categoryId.replace('-', ' ') : 'Catalog'}</span>
            <div className="flex items-center space-x-1 text-amber-400">
              <span className="material-symbols-outlined text-sm font-fill">star</span>
              <span className="font-semibold text-on-surface text-xs">{product.rating || 5.0}</span>
              <span className="text-on-surface-variant text-[10px]">({product.reviewsCount || 0})</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-headline font-semibold text-sm text-on-surface group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-headline font-bold text-base text-primary">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-on-surface-variant/60 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {product.isFrame ? (
              <button
                onClick={() => onOpenFrameStudio(product)}
                className="bg-primary/10 border border-primary text-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded hover:bg-primary hover:text-on-primary transition-all flex items-center space-x-1"
              >
                <span>Customize</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="bg-primary text-on-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-1 font-bold"
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
