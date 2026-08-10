'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types/database';
import { useCart } from '@/lib/store/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const displayImage = product.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden group cursor-pointer hover:shadow-md transition-all flex flex-col h-full">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-surface-container-lowest overflow-hidden">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105 duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.sale_price && (
          <span className="absolute top-3 left-3 bg-tertiary text-on-tertiary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            SALE
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-error-container text-error text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Low Stock ({product.stock})
          </span>
        )}
      </Link>

      <div className="p-4 space-y-2 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-headline-md text-lg font-bold text-on-surface hover:text-secondary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="font-body-md text-sm text-on-surface-variant line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
          <div>
            <span className="font-label-md text-lg font-bold text-primary dark:text-primary-fixed">
              ${(product.sale_price || product.price).toFixed(2)}
            </span>
            {product.sale_price && (
              <span className="font-body-md text-xs text-subtle-gray line-through ml-2">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 bg-secondary text-on-secondary hover:bg-secondary/90 rounded-lg transition-colors shadow-sm flex items-center justify-center"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
