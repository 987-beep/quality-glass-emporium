import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function CustomersManager({ token }) {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiFetch('/api/admin/customers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">User Accounts</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Registered Customer Accounts</h1>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant flex items-center justify-center space-x-2">
            <span className="material-symbols-outlined text-base animate-spin">sync</span>
            <span>Loading database customer accounts...</span>
          </div>
        ) : customers.length === 0 ? (
          <p className="p-6 text-xs text-on-surface-variant text-center">No customer accounts registered yet.</p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high text-on-surface uppercase border-b border-outline-variant font-label-bold">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Username / Email</th>
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
        )}
      </div>

    </div>
  );
}
