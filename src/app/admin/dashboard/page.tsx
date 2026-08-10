'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { DollarSign, ShoppingBag, Users, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    async function loadMetrics() {
      const data = await StoreService.getDashboardMetrics();
      setMetrics(data);
    }
    loadMetrics();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Store Overview</h1>
          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
            Welcome back. Here is a live summary of Quality Glass Emporium store performance.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-xs">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-headline-lg text-2xl font-bold text-on-surface mt-2">
              ${metrics ? metrics.totalRevenue.toFixed(2) : '24,592.00'}
            </span>
            <span className="text-[11px] text-success-green font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +12% from last month
            </span>
          </div>

          <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-xs">Gross Sales</span>
              <ShoppingBag className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-headline-lg text-2xl font-bold text-on-surface mt-2">
              {metrics ? metrics.grossSales : '342'}
            </span>
            <span className="text-[11px] text-success-green font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +8% from last month
            </span>
          </div>

          <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-xs">Active Sessions</span>
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-headline-lg text-2xl font-bold text-on-surface mt-2">
              {metrics ? metrics.activeSessions : '1,204'}
            </span>
            <span className="text-[11px] text-on-surface-variant font-medium mt-2">
              Real-time visitors
            </span>
          </div>

          <div className="glass-card p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-xs">Avg. Order Value</span>
              <DollarSign className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-headline-lg text-2xl font-bold text-on-surface mt-2">
              ${metrics ? metrics.avgOrderValue.toFixed(2) : '71.90'}
            </span>
            <span className="text-[11px] text-success-green font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +4% from last month
            </span>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 glass-card rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-md">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  {metrics?.recentOrders?.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="py-3 px-3 font-bold text-primary dark:text-primary-fixed">{ord.order_number}</td>
                      <td className="py-3 px-3">{ord.customer_name}</td>
                      <td className="py-3 px-3">
                        {ord.status === 'pending_payment' && (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            Pending Proof
                          </span>
                        )}
                        {ord.status === 'payment_approved' && (
                          <span className="bg-success-green/20 text-success-green font-bold px-2 py-0.5 rounded-full text-[10px]">
                            Approved
                          </span>
                        )}
                        {ord.status === 'shipped' && (
                          <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            Shipped
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold">${ord.total_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Inventory Alerts */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-error">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-headline-md text-base font-bold text-on-surface">Low Stock Alerts</h3>
            </div>

            <div className="space-y-3">
              {metrics?.lowStockProducts?.map((prod: any) => (
                <div key={prod.id} className="p-3 bg-surface-container-highest rounded-lg border border-outline-variant/30 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-on-surface">{prod.name}</p>
                    <p className="text-[11px] text-subtle-gray">SKU: {prod.sku}</p>
                  </div>
                  <span className="bg-error-container text-error font-bold px-2 py-0.5 rounded-full text-[11px]">
                    {prod.stock} units
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="w-full mt-4 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs py-2.5 rounded-lg border border-primary/20 transition-colors block text-center font-bold"
            >
              Manage Inventory Stock
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
