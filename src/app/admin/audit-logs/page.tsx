'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreService } from '@/lib/services/store-service';
import { AdminAuditLog } from '@/lib/types/database';
import { ShieldAlert, Clock, UserCheck } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);

  useEffect(() => {
    async function loadLogs() {
      const data = await StoreService.getAuditLogs();
      setLogs(data);
    }
    loadLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Admin Audit Logs</h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">Audit trail tracking administrator actions, price edits, order approvals, and settings changes.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">Admin User</th>
                  <th className="py-3.5 px-6">Action</th>
                  <th className="py-3.5 px-6">Entity</th>
                  <th className="py-3.5 px-6">Change Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface font-body-md">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-4 px-6 text-on-surface-variant font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-primary dark:text-primary-fixed">{log.admin_name}</td>
                    <td className="py-4 px-6 font-mono font-bold text-secondary text-[11px]">{log.action}</td>
                    <td className="py-4 px-6 font-bold">{log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}</td>
                    <td className="py-4 px-6 text-[11px] font-mono text-on-surface-variant">
                      {JSON.stringify(log.details)}
                    </td>
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
