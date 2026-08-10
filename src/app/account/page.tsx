'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/store/auth-context';
import { StoreService } from '@/lib/services/store-service';
import { Order } from '@/lib/types/database';
import { Package, Clock, CheckCircle2, Truck, User, Settings, ArrowRight } from 'lucide-react';

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadUserOrders() {
      if (user) {
        const userOrders = await StoreService.getOrders(user.id);
        setOrders(userOrders);
      } else {
        const allOrders = await StoreService.getOrders();
        setOrders(allOrders.slice(0, 3));
      }
    }
    loadUserOrders();
  }, [user]);

  const activeOrders = orders.filter(
    (o) => o.status === 'pending_payment' || o.status === 'payment_approved' || o.status === 'processing' || o.status === 'shipped'
  );

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
            Welcome Back, {user?.displayName || 'Valued Customer'}
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Manage your photo framing orders, view payment proof statuses, and update your delivery profile.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/account/orders"
            className="bg-secondary text-white px-4 py-2 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 shadow-sm flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Order History
          </Link>
          <Link
            href="/account/settings"
            className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-xs font-bold hover:bg-surface-container flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Account Settings
          </Link>
        </div>
      </div>

      {/* Account Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-label-md text-xs font-bold">Active Orders</span>
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          <span className="font-display-lg text-3xl font-bold text-primary dark:text-primary-fixed">
            {activeOrders.length}
          </span>
          <p className="text-xs text-on-surface-variant">Currently in processing or delivery</p>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-label-md text-xs font-bold">Completed Orders</span>
            <CheckCircle2 className="w-5 h-5 text-success-green" />
          </div>
          <span className="font-display-lg text-3xl font-bold text-primary dark:text-primary-fixed">
            {orders.filter((o) => o.status === 'delivered').length}
          </span>
          <p className="text-xs text-on-surface-variant">Delivered safely</p>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-label-md text-xs font-bold">Default Delivery Address</span>
            <User className="w-5 h-5 text-secondary" />
          </div>
          <p className="font-bold text-sm text-on-surface line-clamp-1">{user?.displayName || 'Customer'}</p>
          <p className="text-xs text-on-surface-variant line-clamp-2">Belliganj Malik Mau Road, Raebareli, 229001</p>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-md text-lg font-bold text-primary">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-md">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-md">
                {orders.slice(0, 4).map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-3 px-4 font-bold text-primary">{ord.order_number}</td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {ord.status === 'pending_payment' && (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          Payment Pending Approval
                        </span>
                      )}
                      {ord.status === 'payment_approved' && (
                        <span className="bg-success-green/20 text-success-green font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          Approved & In Fulfillment
                        </span>
                      )}
                      {ord.status === 'shipped' && (
                        <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          Shipped ({ord.carrier_name || 'Express'})
                        </span>
                      )}
                      {ord.status === 'delivered' && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          Delivered
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold">${ord.total_amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/account/orders/${ord.id}`}
                        className="text-secondary font-bold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant py-4">No order history available yet.</p>
        )}
      </div>
    </div>
  );
}
