'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StoreService } from '@/lib/services/store-service';
import { useAuth } from '@/lib/store/auth-context';
import { Order } from '@/lib/types/database';
import { Package, ExternalLink, Clock, CheckCircle, Truck, FileText } from 'lucide-react';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await StoreService.getOrders(user?.id);
      setOrders(data);
    }
    loadOrders();
  }, [user]);

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-6">
      <div>
        <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
          My Order History
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant mt-1">
          Track fulfillment status, view uploaded payment proof receipts, and access carrier tracking.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.id} className="glass-panel rounded-xl p-6 border border-outline-variant/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/20 pb-3 text-xs">
              <div>
                <span className="font-bold text-base text-primary dark:text-primary-fixed">{ord.order_number}</span>
                <span className="text-on-surface-variant ml-3">
                  Placed on {new Date(ord.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {ord.status === 'pending_payment' && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs">
                    <Clock className="w-3.5 h-3.5" /> Payment Pending Approval
                  </span>
                )}
                {ord.status === 'payment_approved' && (
                  <span className="inline-flex items-center gap-1 bg-success-green/20 text-success-green font-bold px-3 py-1 rounded-full text-xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Payment Confirmed
                  </span>
                )}
                {ord.status === 'shipped' && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">
                    <Truck className="w-3.5 h-3.5" /> Shipped ({ord.carrier_name})
                  </span>
                )}
                <Link
                  href={`/account/orders/${ord.id}`}
                  className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1 rounded-lg font-bold transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Line Items Preview */}
            <div className="space-y-2">
              {ord.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-on-surface">{item.product_name}</span>
                    <span className="text-on-surface-variant ml-2">× {item.quantity}</span>
                  </div>
                  <span className="font-bold text-primary">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Logistics & Payment Proof Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-outline-variant/20 text-xs text-on-surface-variant gap-2">
              <div>
                <span>Total Amount: <strong className="text-primary text-sm">${ord.total_amount.toFixed(2)}</strong></span>
              </div>
              {ord.payment_proof_url && (
                <a
                  href={ord.payment_proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary font-bold hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> View Uploaded Receipt ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
