'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { Order } from '@/lib/types/database';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';

export default function AdminCustomerAccountsPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await StoreService.getOrders();
      setOrders(data);
    }
    loadData();
  }, []);

  // Group orders by customer
  const customersMap: Record<string, { name: string; email: string; phone: string; totalSpent: number; orderCount: number }> = {};

  orders.forEach((ord) => {
    const key = ord.customer_email.toLowerCase();
    if (!customersMap[key]) {
      customersMap[key] = {
        name: ord.customer_name,
        email: ord.customer_email,
        phone: ord.customer_phone,
        totalSpent: 0,
        orderCount: 0
      };
    }
    customersMap[key].totalSpent += ord.total_amount;
    customersMap[key].orderCount += 1;
  });

  const customerList = Object.values(customersMap);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Customer Accounts</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">View registered customer profiles, purchase history totals, and contact details.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Total Orders</th>
                  <th className="py-3.5 px-6 text-right">Lifetime Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface font-body-md">
                {customerList.map((cust) => (
                  <tr key={cust.email} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-4 px-6 font-bold text-primary dark:text-primary-fixed">{cust.name}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{cust.email}</td>
                    <td className="py-4 px-6 font-mono text-[11px]">{cust.phone}</td>
                    <td className="py-4 px-6 font-bold">{cust.orderCount} orders</td>
                    <td className="py-4 px-6 text-right font-bold text-secondary text-sm">${cust.totalSpent.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
