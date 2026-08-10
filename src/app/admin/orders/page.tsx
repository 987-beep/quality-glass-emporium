'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Order } from '@/lib/types/database';
import { Truck, Search, CheckCircle2, Clock, Filter, PackageCheck } from 'lucide-react';

export default function AdminOrdersLogisticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [carrierName, setCarrierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [newStatus, setNewStatus] = useState<Order['status']>('shipped');
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const list = await StoreService.getOrders();
    setOrders(list);
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    await StoreService.updateOrderStatus(selectedOrder.id, newStatus, {
      carrier_name: carrierName,
      tracking_number: trackingNumber || `TRK-${Date.now().toString().substring(6)}`
    });

    setUpdateMsg(`Order ${selectedOrder.order_number} status updated to ${newStatus}!`);
    setSelectedOrder(null);
    loadOrders();
    setTimeout(() => setUpdateMsg(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Orders & Logistics Management</h1>
          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
            Dispatch glass frames, update courier shipping tracking numbers, and manage delivery status.
          </p>
        </div>

        {updateMsg && (
          <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {updateMsg}
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search orders by number, customer, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-outline-variant bg-surface outline-none focus:border-secondary"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-label-md">
            <Filter className="w-4 h-4 text-on-surface-variant" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-secondary"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="payment_approved">Approved & Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer & Address</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Carrier / Tracking</th>
                  <th className="py-3.5 px-6 text-right font-bold">Total</th>
                  <th className="py-3.5 px-6 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface font-body-md">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-4 px-6 font-bold text-primary dark:text-primary-fixed">{ord.order_number}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold">{ord.customer_name}</p>
                      <p className="text-[11px] text-on-surface-variant">{ord.shipping_address.street}, {ord.shipping_address.city}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize font-bold px-2.5 py-1 rounded-full text-[11px] bg-surface-container-high">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {ord.carrier_name ? (
                        <div>
                          <p className="font-bold text-xs">{ord.carrier_name}</p>
                          <p className="text-[11px] text-secondary font-mono">{ord.tracking_number}</p>
                        </div>
                      ) : (
                        <span className="text-subtle-gray italic">Not Dispatched</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-sm">${ord.total_amount.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setCarrierName(ord.carrier_name || 'BlueDart Express');
                          setTrackingNumber(ord.tracking_number || '');
                          setNewStatus(ord.status);
                        }}
                        className="border border-primary text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-auto"
                      >
                        Fulfillment Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateFulfillment} className="bg-surface border border-outline-variant max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
              <h3 className="font-headline-md text-base font-bold text-primary">
                Update Fulfillment ({selectedOrder.order_number})
              </h3>
              <button type="button" onClick={() => setSelectedOrder(null)} className="text-on-surface-variant">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Order Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary font-bold"
              >
                <option value="pending_payment">Pending Payment</option>
                <option value="payment_approved">Payment Approved</option>
                <option value="processing">Processing & Framing</option>
                <option value="shipped">Shipped / Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Courier Carrier Name</label>
              <input
                type="text"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder="e.g. BlueDart, DTDC, Delhivery"
                className="w-full p-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Tracking Airway Bill (AWB) Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BD-901824190"
                className="w-full p-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border rounded-lg text-xs font-bold text-on-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-secondary text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-secondary/90 shadow-sm"
              >
                Save Fulfillment Update
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
