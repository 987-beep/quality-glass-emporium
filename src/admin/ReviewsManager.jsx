import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function ReviewsManager({ token }) {
  const [products, setProducts] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    apiFetch('/api/products')
      .then(res => res.json())
      .then(prods => {
        setProducts(prods);
        // Fetch reviews for each product
        Promise.all(prods.map(p => apiFetch(`/api/reviews/${p.id}`).then(r => r.json())))
          .then(results => {
            const flattened = results.flat();
            setAllReviews(flattened);
          });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Customer Moderation</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Product Reviews & Ratings</h1>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded p-4">
        {allReviews.length === 0 ? (
          <p className="text-xs text-on-surface-variant p-4">No reviews submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {allReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-surface-container-high rounded border border-outline-variant text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-on-surface">{rev.customerName}</span>
                  <span className="text-[10px] text-on-surface-variant">{rev.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-xs font-fill">star</span>
                  ))}
                </div>
                <p className="text-on-surface-variant">{rev.comment}</p>
                <div className="pt-2 flex justify-end">
                  <span className="bg-emerald-400/20 text-emerald-400 border border-emerald-400/40 px-2 py-0.5 rounded text-[9px] uppercase font-bold">
                    Approved & Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
