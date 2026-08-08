import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function OrdersManager({ token }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previewScreenshot, setPreviewScreenshot] = useState(null);

  const fetchOrders = () => {
    apiFetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprovePayment = (orderId, action) => {
    apiFetch(`/api/admin/orders/${orderId}/approve-payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ action })
    })
      .then(res => res.json())
      .then(() => fetchOrders())
      .catch(() => {});
  };

  const handleUpdateStatus = (orderId, status, trackingNo) => {
    apiFetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ orderStatus: status, trackingNumber: trackingNo })
    })
      .then(res => res.json())
      .then(() => fetchOrders())
      .catch(() => {});
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Fulfillment Logistics</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Orders & Payment Verification Manager</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Review customer UPI payment screenshots and 12-digit UTR reference numbers. Approve payments to confirm orders.
        </p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high text-on-surface uppercase border-b border-outline-variant font-label-bold">
              <tr>
                <th className="p-3">Order # / Date</th>
                <th className="p-3">Customer Details</th>
                <th className="p-3">Payment Proof (UTR & Screenshot)</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Approval & Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-surface-container-high/50">
                  <td className="p-3">
                    <div className="font-mono font-bold text-primary">{ord.orderNumber}</div>
                    <div className="text-[10px] text-on-surface-variant">{ord.createdAt.split('T')[0]}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">{ord.trackingNumber}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-on-surface">{ord.customerName}</div>
                    <div className="text-[10px] text-on-surface-variant">{ord.customerPhone}</div>
                    <div className="text-[10px] text-on-surface-variant line-clamp-1 max-w-xs">{ord.shippingAddress}</div>
                  </td>

                  {/* Payment Proof Column: UTR & Screenshot */}
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-mono text-xs font-bold text-on-surface">
                        UTR: <span className="text-primary">{ord.utrNumber || 'N/A'}</span>
                      </div>

                      {ord.paymentScreenshot ? (
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot(ord.paymentScreenshot)}
                          className="flex items-center space-x-1.5 bg-surface-container-high border border-outline-variant px-2 py-1 rounded text-[10px] text-primary hover:underline font-bold"
                        >
                          <span className="material-symbols-outlined text-xs">image</span>
                          <span>View Proof Screenshot</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-on-surface-variant/60 italic">No Screenshot Uploaded</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-primary text-sm">₹{ord.totalAmount}</div>
                    <div className="text-[10px] text-on-surface-variant">{ord.paymentMethod}</div>
                  </td>

                  {/* Approval Action Column */}
                  <td className="p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                        ord.paymentApprovalStatus === 'Approved' ? 'bg-primary/10 text-primary border-primary/40' :
                        ord.paymentApprovalStatus === 'Rejected' ? 'bg-error/10 text-error border-error/40' :
                        'bg-amber-400/20 text-amber-400 border-amber-400/40'
                      }`}>
                        {ord.paymentApprovalStatus || 'Pending Approval'}
                      </span>
                    </div>

                    {ord.paymentApprovalStatus === 'Pending Approval' && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleApprovePayment(ord.id, 'approve')}
                          className="bg-primary text-on-primary font-bold text-[10px] px-2 py-1 rounded hover:bg-primary-fixed transition-all"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleApprovePayment(ord.id, 'reject')}
                          className="bg-error/20 text-error border border-error/40 font-bold text-[10px] px-2 py-1 rounded hover:bg-error hover:text-white transition-all"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value, ord.trackingNumber)}
                      className="bg-surface-container-high border border-outline-variant text-on-surface text-[10px] rounded p-1 focus:outline-none focus:border-primary font-semibold block w-full mt-1"
                    >
                      <option value="Payment Verification Pending">Payment Verification Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Framing & Quality Check">Framing & Quality Check</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="text-primary hover:underline font-bold text-xs"
                    >
                      Print Tax Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded p-6 max-w-lg w-full relative space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <h3 className="font-headline font-bold text-sm text-primary uppercase">Payment Proof Screenshot</h3>
              <button onClick={() => setPreviewScreenshot(null)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto rounded border border-outline-variant bg-black">
              <img src={previewScreenshot} alt="UPI Payment Proof" className="w-full h-auto object-contain" />
            </div>

            <div className="text-right">
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="bg-primary text-on-primary font-bold text-xs uppercase px-4 py-2 rounded"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-gray-300 pb-4">
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider text-emerald-800">Quality Glass Emporium</h2>
                <p className="text-xs text-gray-600">Belliganj Malik Mau Road, Raebareli-229001, UP</p>
                <p className="text-xs text-gray-600">GSTIN: 09ABCDE1234F1Z5 • Phone: +91 94150 12345</p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-bold text-gray-500 block">TAX INVOICE</span>
                <span className="font-mono font-bold text-sm text-emerald-800">{selectedOrder.orderNumber}</span>
                <p className="text-xs text-gray-500">{selectedOrder.createdAt.split('T')[0]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-300 pb-4">
              <div>
                <span className="font-bold block text-gray-700">Customer Billed To:</span>
                <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                <p className="text-gray-600">Phone: {selectedOrder.customerPhone}</p>
              </div>

              <div>
                <span className="font-bold block text-gray-700">UPI Payment Verification:</span>
                <p className="text-gray-900 font-semibold font-mono">UTR: {selectedOrder.utrNumber}</p>
                <p className="text-emerald-700 font-bold uppercase text-[10px]">Status: {selectedOrder.paymentApprovalStatus || 'Approved'}</p>
                <p className="text-gray-600 font-mono">AWB: {selectedOrder.trackingNumber}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 uppercase font-bold border-b border-gray-300">
                <tr>
                  <th className="p-2">Item Description</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Unit Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedOrder.items.map((it, i) => (
                  <tr key={i}>
                    <td className="p-2 font-semibold">{it.productName}</td>
                    <td className="p-2">{it.quantity}</td>
                    <td className="p-2">₹{it.price}</td>
                    <td className="p-2 text-right font-bold">₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-4 border-t border-gray-300 flex justify-between items-center text-sm font-bold">
              <span>Grand Total Amount Paid:</span>
              <span className="text-emerald-800 text-lg">₹{selectedOrder.totalAmount}</span>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-xs"
              >
                Close Invoice
              </button>
              <button
                onClick={() => window.print()}
                className="bg-emerald-700 text-white font-bold px-6 py-2 rounded text-xs"
              >
                Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
