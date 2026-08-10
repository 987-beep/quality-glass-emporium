'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Review } from '@/lib/types/database';
import { Star, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const list = await StoreService.getReviews();
    setReviews(list);
  }

  const handleModerate = async (id: string, approve: boolean) => {
    await StoreService.moderateReview(id, approve);
    setMsg(approve ? 'Review approved for public display!' : 'Review hidden.');
    loadReviews();
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Reviews Moderation</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">Approve, reject, or hide customer product reviews.</p>
        </div>

        {msg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> {msg}
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="glass-panel p-5 rounded-xl border border-outline-variant/30 flex justify-between items-start gap-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-primary dark:text-primary-fixed">{rev.user_name}</span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-outline-variant'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-on-surface-variant">{rev.comment}</p>
                <span className="text-[11px] text-subtle-gray block">
                  Status: <strong className={rev.is_approved ? 'text-success-green' : 'text-amber-600'}>{rev.is_approved ? 'Approved' : 'Pending Moderation'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!rev.is_approved ? (
                  <button
                    onClick={() => handleModerate(rev.id, true)}
                    className="bg-success-green text-white px-3 py-1.5 rounded-lg font-label-md text-xs font-bold flex items-center gap-1 hover:opacity-90"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleModerate(rev.id, false)}
                    className="bg-amber-600 text-white px-3 py-1.5 rounded-lg font-label-md text-xs font-bold flex items-center gap-1 hover:opacity-90"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Hide
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
