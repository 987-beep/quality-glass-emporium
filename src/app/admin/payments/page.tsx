'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Order } from '@/lib/types/database';
import { CheckCircle2, XCircle, FileText, Eye, Clock, ShieldCheck } from 'lucide-react';

export default function AdminPaymentApprovalsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const list = await StoreService.getOrders();
    setOrders(list);
  }

  const handleApprove = async (orderId: string) => {
    await StoreService.updateOrderStatus(orderId, 'payment_approved', {
      payment_notes: adminNote || 'Payment proof verified and approved by admin.'
    });
    setActionSuccess(`Order ${orderId} payment approved successfully!`);
    setSelectedOrder(null);
    setAdminNote('');
    loadOrders();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleReject = async (orderId: string) => {
    await StoreService.updateOrderStatus(orderId, 'payment_rejected', {
      payment_notes: adminNote || 'Payment proof invalid or deposit not received.'
    });
    setActionSuccess(`Order ${orderId} payment rejected.`);
    setSelectedOrder(null);
    setAdminNote('');
    loadOrders();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const pendingCount = orders.filter(o => o.status === 'pending_payment').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Payment Proof Approvals</h1>
          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
            Review customer bank deposit receipts, verify transaction amounts, and approve orders for fulfillment.
          </p>
        </div>

        {actionSuccess && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {actionSuccess}
          </div>
        )}

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-xl">
            <p className="text-xs font-bold text-on-surface-variant">Pending Approvals</p>
            <p className="font-display-lg text-3xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="glass-card p-5 rounded-xl">
            <p className="text-xs font-bold text-on-surface-variant">Approved Payments</p>
            <p className="font-display-lg text-3xl font-bold text-success-green mt-1">
              {orders.filter(o => o.status === 'payment_approved' || o.status === 'processing' || o.status === 'shipped' || o.status === 'delivered').length}
            </p>
          </div>
          <div className="glass-card p-5 rounded-xl">
            <p className="text-xs font-bold text-on-surface-variant">Rejected Payments</p>
            <p className="font-display-lg text-3xl font-bold text-error mt-1">
              {orders.filter(o => o.status === 'payment_rejected').length}
            </p>
          </div>
        </div>

        {/* Orders Approval Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-headline-md text-lg font-bold text-on-surface">Payment Verification Queue</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Payment Proof Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-4 px-6 font-bold text-primary dark:text-primary-fixed">{ord.order_number}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold">{ord.customer_name}</p>
                      <p className="text-[11px] text-on-surface-variant">{ord.customer_email}</p>
                    </td>
                    <td className="py-4 px-6 font-bold text-sm">${ord.total_amount.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      {ord.status === 'pending_payment' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {ord.status === 'payment_approved' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-green/20 text-success-green font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {ord.status === 'payment_rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error font-bold text-[11px]">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-secondary text-white hover:bg-secondary/90 px-4 py-2 rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review Proof
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Payment Proof Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant max-w-2xl w-full rounded-2xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
              <div>
                <h3 className="font-headline-md text-lg font-bold text-primary">
                  Review Payment Proof ({selectedOrder.order_number})
                </h3>
                <p className="text-xs text-on-surface-variant">Customer: {selectedOrder.customer_name} ({selectedOrder.customer_email})</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>

            {/* Proof Image Display */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-on-surface block">Uploaded Deposit Receipt / Screenshot</span>
              <div className="relative aspect-video rounded-xl overflow-hidden border bg-black/5">
                <Image
                  src={selectedOrder.payment_proof_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn9jcbQoercOVYC4cIh6sCAq0SxYrV3HTIG5W3auYxzruTW8aRjwyY9luCnMxd28yoZnXhUFBPMldk8q3706QN7G0Pk6NvVMUpejdxd5-v2PjYZdCm-7smpDuUE90xvPQImJ7H7u3U_0YX_aw-hZP4I6EZDhGbzlnJE19BBuNwFt3rv5ke7ncQMQzxZ_krIUmzg6ygnPxUuERNB0jKtFfWfRUhXRr7YMl63PGTGeyW8WI_sPF-D0Ok0w'}
                  alt="Payment Receipt"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Order Amount & Customer Note */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-sm text-primary">
                <span>Order Total Amount:</span>
                <span>${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
              {selectedOrder.payment_notes && (
                <p className="text-on-surface-variant"><strong>Customer Note:</strong> {selectedOrder.payment_notes}</p>
              )}
            </div>

            {/* Admin Note Input */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Admin Verification Notes</label>
              <input
                type="text"
                placeholder="e.g. Bank statement matched. Deposit verified on SBI account."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full p-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => handleReject(selectedOrder.id)}
                className="bg-error text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-error/90 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject Payment
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedOrder.id)}
                className="bg-success-green text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
