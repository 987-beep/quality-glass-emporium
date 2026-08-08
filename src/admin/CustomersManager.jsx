import React, { useState, useEffect } from 'react';

export function CustomersManager({ token }) {
  const [customers, setCustomers] = useState([
    { id: 2, name: 'Rahul Sharma', email: 'customer@example.com', role: 'customer', createdAt: '2026-08-01', totalOrders: 3, totalSpent: 3897 },
    { id: 3, name: 'Ananya Gupta', email: 'ananya@example.com', role: 'customer', createdAt: '2026-08-03', totalOrders: 1, totalSpent: 1299 }
  ]);

  return (
    <div className="space-y-6">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">User Accounts</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Registered Customer Accounts</h1>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container-high text-on-surface uppercase border-b border-outline-variant font-label-bold">
            <tr>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3">Total Orders</th>
              <th className="p-3">Lifetime Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-surface-container-high/50">
                <td className="p-3 font-semibold text-on-surface">{c.name}</td>
                <td className="p-3 text-on-surface-variant font-mono">{c.email}</td>
                <td className="p-3 text-on-surface-variant">{c.createdAt}</td>
                <td className="p-3 font-bold text-primary">{c.totalOrders} Orders</td>
                <td className="p-3 font-bold text-emerald-400">₹{c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
