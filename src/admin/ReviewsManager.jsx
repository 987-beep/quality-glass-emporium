import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function ReviewsManager({ token }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchReviews = () => {
    setIsLoading(true);
    apiFetch('/api/admin/reviews', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (reviewId, currentStatus) => {
    try {
      const res = await apiFetch(`/api/admin/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      if (res.ok) {
        setActionMsg(`Review ${!currentStatus ? 'approved & published' : 'hidden'} successfully.`);
        setTimeout(() => setActionMsg(''), 3000);
        fetchReviews();
      }
    } catch (err) {
      alert('Error updating review approval: ' + err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this customer review permanently from database?')) return;
    try {
      const res = await apiFetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActionMsg('Review deleted permanently.');
        setTimeout(() => setActionMsg(''), 3000);
        fetchReviews();
      }
    } catch (err) {
      alert('Error deleting review: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Customer Moderation</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Product Reviews & Ratings</h1>
      </div>

      {actionMsg && (
        <div className="bg-primary/10 border border-primary text-primary text-xs p-3 rounded font-bold flex items-center space-x-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{actionMsg}</span>
        </div>
      )}

      <div className="bg-surface-container-low border border-outline-variant rounded p-4">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant flex items-center justify-center space-x-2">
            <span className="material-symbols-outlined text-base animate-spin">sync</span>
            <span>Loading database reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-on-surface-variant p-4">No reviews submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-surface-container-high rounded border border-outline-variant text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-on-surface mr-2">{rev.customerName}</span>
                    <span className="text-[10px] text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded font-mono">
                      Product: {rev.productName}
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">{rev.date}</span>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-xs font-fill">star</span>
                  ))}
                </div>

                <p className="text-on-surface-variant">{rev.comment}</p>

                <div className="pt-2 flex justify-between items-center border-t border-outline-variant/40">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                    rev.isApproved ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/40' : 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                  }`}>
                    {rev.isApproved ? 'Approved & Published' : 'Pending Approval'}
                  </span>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleApprove(rev.id, rev.isApproved)}
                      className="text-primary font-bold hover:underline"
                    >
                      {rev.isApproved ? 'Unpublish' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="text-error font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
