import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function Dashboard({ token, setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return <div className="text-xs text-on-surface-variant">Loading Admin Dashboard Analytics...</div>;
  }

  if (!stats) return <div className="text-xs text-error">Failed to load admin statistics</div>;

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Admin Workspace</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Store Overview Analytics</h1>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-surface-container-low border border-outline-variant p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Total Revenue</span>
            <span className="material-symbols-outlined text-primary text-xl">payments</span>
          </div>
          <div className="font-headline font-bold text-2xl text-primary">₹{stats.totalRevenue}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">↑ Gross sales earnings</span>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Total Orders</span>
            <span className="material-symbols-outlined text-primary text-xl">shopping_cart</span>
          </div>
          <div className="font-headline font-bold text-2xl text-on-surface">{stats.totalOrders}</div>
          <span className="text-[10px] text-on-surface-variant font-semibold">{stats.pendingOrders} Processing</span>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Low Stock Alerts</span>
            <span className="material-symbols-outlined text-amber-400 text-xl">warning</span>
          </div>
          <div className="font-headline font-bold text-2xl text-amber-400">{stats.lowStockProducts}</div>
          <button onClick={() => setActiveTab('products')} className="text-[10px] text-primary hover:underline font-semibold block">
            Manage Inventory →
          </button>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Total Customers</span>
            <span className="material-symbols-outlined text-primary text-xl">group</span>
          </div>
          <div className="font-headline font-bold text-2xl text-on-surface">{stats.totalCustomers}</div>
          <span className="text-[10px] text-on-surface-variant font-semibold">Registered Accounts</span>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-headline font-bold text-base text-on-surface">Recent Customer Orders</h2>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs text-primary font-bold hover:underline uppercase"
          >
            View All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high text-on-surface uppercase border-b border-outline-variant font-label-bold">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {stats.recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-surface-container-high/50">
                  <td className="p-3 font-mono font-bold text-primary">{ord.orderNumber}</td>
                  <td className="p-3 text-on-surface">{ord.customerName}</td>
                  <td className="p-3 font-semibold text-on-surface">₹{ord.totalAmount}</td>
                  <td className="p-3">
                    <span className="bg-primary/10 text-primary border border-primary/40 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-on-surface-variant/80">{ord.createdAt.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
