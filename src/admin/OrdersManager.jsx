import React, { useState, useEffect } from 'react';
import { apiFetch, getAssetUrl } from '../api';

export function OrdersManager({ token }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previewScreenshot, setPreviewScreenshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
    setIsLoading(true);
    const authToken = token || localStorage.getItem('qge_token') || '';
    apiFetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprovePayment = (orderId, action) => {
    const authToken = token || localStorage.getItem('qge_token') || '';
    apiFetch(`/api/admin/orders/${orderId}/approve-payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ action })
    })
      .then(res => res.json())
      .then(() => fetchOrders())
      .catch((err) => alert('Error approving order payment: ' + err.message));
  };

  const handleUpdateStatus = (orderId, status, trackingNo) => {
    const authToken = token || localStorage.getItem('qge_token') || '';
    apiFetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ orderStatus: status, trackingNumber: trackingNo })
    })
      .then(res => res.json())
      .then(() => fetchOrders())
      .catch((err) => alert('Error updating order status: ' + err.message));
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
          {isLoading ? (
            <div className="p-8 text-center text-xs text-on-surface-variant flex items-center justify-center space-x-2">
              <span className="material-symbols-outlined text-base animate-spin">sync</span>
              <span>Loading database customer orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <p className="p-6 text-xs text-on-surface-variant text-center">No customer orders placed yet.</p>
          ) : (
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
                      <div className="text-[10px] text-on-surface-variant">{ord.createdAt ? ord.createdAt.split('T')[0] : ''}</div>
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
                            onClick={() => setPreviewScreenshot(getAssetUrl(ord.paymentScreenshot))}
                            className="bg-surface-container-high border border-outline-variant text-primary text-[10px] font-bold px-2 py-1 rounded hover:border-primary flex items-center space-x-1"
                          >
                            <span className="material-symbols-outlined text-xs">image</span>
                            <span>View Screenshot Proof</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-on-surface-variant italic">No image uploaded</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-emerald-400 text-sm">₹{ord.totalAmount}</div>
                      <div className="text-[10px] text-on-surface-variant">{ord.paymentMethod}</div>
                    </td>

                    <td className="p-3 space-y-1">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          ord.paymentApprovalStatus === 'Approved' ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/40' :
                          ord.paymentApprovalStatus === 'Rejected' ? 'bg-error/20 text-error border-error/40' :
                          'bg-amber-400/20 text-amber-400 border-amber-400/40'
                        }`}>
                          {ord.paymentApprovalStatus}
                        </span>
                      </div>
                      <div>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value, ord.trackingNumber)}
                          className="bg-surface-container-high border border-outline-variant text-on-surface text-[10px] p-1 rounded font-bold"
                        >
                          <option value="Payment Verification Pending">Payment Pending</option>
                          <option value="Processing">Processing / Framing</option>
                          <option value="Framed">Framed & Ready</option>
                          <option value="Dispatched">Dispatched / Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Payment Rejected">Payment Rejected</option>
                        </select>
                      </div>
                    </td>

                    <td className="p-3 text-right space-x-2">
                      {ord.paymentApprovalStatus === 'Pending Approval' && (
                        <>
                          <button
                            onClick={() => handleApprovePayment(ord.id, 'approve')}
                            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-1 rounded text-[10px] font-bold hover:bg-emerald-500/30"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprovePayment(ord.id, 'reject')}
                            className="bg-error/20 text-error border border-error/40 px-2 py-1 rounded text-[10px] font-bold hover:bg-error/30"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="text-primary font-bold hover:underline text-xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Screenshot Preview Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded p-4 max-w-lg w-full space-y-3">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <span className="font-bold text-xs text-on-surface">Payment Verification Screenshot Proof</span>
              <button onClick={() => setPreviewScreenshot(null)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <img src={previewScreenshot} alt="Payment Proof" className="w-full max-h-[70vh] object-contain rounded border border-outline-variant" />
            <div className="text-right">
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Items Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <span className="font-mono font-bold text-sm text-primary">Order {selectedOrder.orderNumber}</span>
              <button onClick={() => setSelectedOrder(null)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-surface-container-high p-3 rounded">
                <div>
                  <span className="text-on-surface-variant block text-[10px]">Customer:</span>
                  <span className="font-bold text-on-surface">{selectedOrder.customerName}</span>
                  <span className="block text-[10px] text-on-surface-variant">{selectedOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px]">Shipping Address:</span>
                  <span className="text-on-surface">{selectedOrder.shippingAddress}</span>
                </div>
              </div>

              <h4 className="font-bold text-on-surface uppercase text-[11px]">Ordered Items</h4>
              <div className="space-y-2">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="p-3 bg-surface-container-high rounded border border-outline-variant flex items-center space-x-3">
                    {item.customImage && (
                      <img src={getAssetUrl(item.customImage)} alt="Custom Upload" className="w-12 h-12 object-cover rounded border border-outline-variant" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-on-surface">{item.productName || item.name}</div>
                      <div className="text-[10px] text-on-surface-variant">Qty: {item.quantity} × ₹{item.price}</div>
                      {item.customConfig && (
                        <div className="text-[10px] text-primary mt-0.5">
                          Frame: {item.customConfig.frameStyle || 'Custom'} | Glass: {item.customConfig.glassType || 'Standard'}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-emerald-400">₹{(item.price || 0) * (item.quantity || 1)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right pt-2 border-t border-outline-variant">
              <button onClick={() => setSelectedOrder(null)} className="bg-surface-container-high text-on-surface font-bold text-xs px-4 py-2 rounded">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
