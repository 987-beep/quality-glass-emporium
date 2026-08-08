import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function MyOrders({ user, token, setActivePage }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const savedToken = token || localStorage.getItem('qge_token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    apiFetch('/api/user/orders', {
      headers: { Authorization: `Bearer ${savedToken}` }
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [token]);

  // Timeline Step Status Mapping
  const getStepProgress = (order) => {
    const approval = order.paymentApprovalStatus || 'Pending Approval';
    const st = order.orderStatus || 'Processing';

    let step = 1;
    if (approval === 'Approved' && (st === 'Processing' || st === 'Framing & Quality Check')) {
      step = 2;
    } else if (st === 'Shipped') {
      step = 3;
    } else if (st === 'Delivered') {
      step = 4;
    }
    return step;
  };

  if (!user) {
    return (
      <div className="bg-background text-on-background py-16 px-margin-mobile max-w-md mx-auto text-center space-y-4 min-h-screen">
        <span className="material-symbols-outlined text-4xl text-primary">account_circle</span>
        <h2 className="font-headline font-bold text-xl text-on-surface">Please Sign In to View Your Orders</h2>
        <p className="text-xs text-on-surface-variant">
          Log in with your Username ID and Password to view your personal order history and live framing status.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen space-y-8">
      
      {/* Header */}
      <div className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest block">Customer Order Dashboard</span>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface mt-1">My Orders & Live Framing History</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Logged in as <strong className="text-primary font-mono">{user.username}</strong> ({user.name})
          </p>
        </div>

        <button
          onClick={() => setActivePage('collection')}
          className="bg-primary/10 border border-primary text-primary font-label-bold text-xs uppercase px-4 py-2 rounded hover:bg-primary hover:text-on-primary transition-all font-bold self-start md:self-auto"
        >
          Explore Catalog & Order More
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-on-surface-variant">
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant p-8 rounded text-center max-w-md mx-auto space-y-4">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">shopping_bag</span>
          <h3 className="font-headline font-bold text-base text-on-surface">No Orders Placed Yet</h3>
          <p className="text-xs text-on-surface-variant">
            You haven't placed any photo framing or studio print orders yet. Customize your first frame in our Frame Preview Studio!
          </p>
          <button
            onClick={() => setActivePage('frame-studio')}
            className="bg-primary text-on-primary font-label-bold text-xs uppercase px-6 py-2.5 rounded font-bold"
          >
            Launch Frame Studio
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => {
            const activeStep = getStepProgress(ord);
            const isApproved = ord.paymentApprovalStatus === 'Approved';
            const isRejected = ord.paymentApprovalStatus === 'Rejected';

            return (
              <div
                key={ord.id}
                className="bg-surface-container-low border border-outline-variant rounded p-6 space-y-6 shadow-sm hover:border-primary/50 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-4 gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-label-bold text-primary tracking-widest">Order Ref</span>
                      <span className="font-headline font-bold text-base text-on-surface font-mono">{ord.orderNumber}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">Placed on: {ord.createdAt.split('T')[0]}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Payment Approval Badge */}
                    <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold border ${
                      isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' :
                      isRejected ? 'bg-error/10 text-error border-error/40' :
                      'bg-amber-400/20 text-amber-400 border-amber-400/40'
                    }`}>
                      {isApproved ? '✓ Payment Approved' : isRejected ? '✕ Payment Rejected' : '⏳ Verification Pending'}
                    </span>

                    <button
                      onClick={() => setSelectedInvoice(ord)}
                      className="bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface text-[11px] font-bold px-3 py-1.5 rounded flex items-center space-x-1"
                    >
                      <span className="material-symbols-outlined text-sm">receipt_long</span>
                      <span>Tax Invoice</span>
                    </button>
                  </div>
                </div>

                {/* 4-Step Live Tracking Progress Timeline */}
                <div className="bg-surface-container-high/60 border border-outline-variant/60 p-4 rounded space-y-3">
                  <span className="text-[10px] uppercase font-label-bold text-primary tracking-widest block">Live Framing & Delivery Progress</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    
                    {/* Step 1 */}
                    <div className={`p-2.5 rounded border transition-all ${
                      activeStep >= 1 ? 'border-primary bg-primary/10 text-on-surface font-bold' : 'border-outline-variant/40 bg-surface-container-high opacity-50'
                    }`}>
                      <span className="material-symbols-outlined text-base block mb-0.5">verified_user</span>
                      <span className="text-[11px] block">1. Payment Verified</span>
                      <span className="text-[9px] text-on-surface-variant font-mono block">
                        {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending Review'}
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-2.5 rounded border transition-all ${
                      activeStep >= 2 ? 'border-primary bg-primary/10 text-on-surface font-bold' : 'border-outline-variant/40 bg-surface-container-high opacity-50'
                    }`}>
                      <span className="material-symbols-outlined text-base block mb-0.5">crop_original</span>
                      <span className="text-[11px] block">2. Framing & Printing</span>
                      <span className="text-[9px] text-on-surface-variant font-mono block">Studio Crafting</span>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-2.5 rounded border transition-all ${
                      activeStep >= 3 ? 'border-primary bg-primary/10 text-on-surface font-bold' : 'border-outline-variant/40 bg-surface-container-high opacity-50'
                    }`}>
                      <span className="material-symbols-outlined text-base block mb-0.5">local_shipping</span>
                      <span className="text-[11px] block">3. Dispatched & Shipped</span>
                      <span className="text-[9px] text-on-surface-variant font-mono block">{ord.trackingNumber}</span>
                    </div>

                    {/* Step 4 */}
                    <div className={`p-2.5 rounded border transition-all ${
                      activeStep >= 4 ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 font-bold' : 'border-outline-variant/40 bg-surface-container-high opacity-50'
                    }`}>
                      <span className="material-symbols-outlined text-base block mb-0.5">markunread_mailbox</span>
                      <span className="text-[11px] block">4. Order Delivered</span>
                      <span className="text-[9px] text-on-surface-variant font-mono block">Completed</span>
                    </div>

                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-on-surface block">Ordered Products ({ord.items.length}):</span>
                  
                  <div className="divide-y divide-outline-variant/40">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-3">
                          {item.customImage ? (
                            <img src={item.customImage} alt={item.productName} className="w-12 h-12 object-cover rounded border border-outline-variant" />
                          ) : (
                            <div className="w-12 h-12 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-base">photo_frame</span>
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-on-surface block">{item.productName}</span>
                            <span className="text-[10px] text-on-surface-variant">Qty: {item.quantity} × ₹{item.price}</span>
                            {item.customConfig && (
                              <div className="text-[9px] text-primary font-mono mt-0.5">
                                Size: {item.customConfig.size || 'Standard'} • Frame: {item.customConfig.frameMaterial || 'Natural Wood'}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="font-bold text-primary text-sm">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Payment Summary */}
                <div className="pt-3 border-t border-outline-variant flex flex-col sm:flex-row justify-between sm:items-center text-xs text-on-surface-variant gap-2">
                  <div>
                    <span>Payment Method: <strong>{ord.paymentMethod}</strong></span>
                    {ord.utrNumber && (
                      <span className="ml-3 font-mono">UTR: <strong className="text-on-surface">{ord.utrNumber}</strong></span>
                    )}
                  </div>
                  <div className="text-right font-bold text-sm text-primary">
                    Grand Total Paid: ₹{ord.totalAmount}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-gray-300 pb-4">
              <div>
                <h2 className="font-bold text-xl uppercase tracking-wider text-emerald-800">Quality Glass Emporium</h2>
                <p className="text-xs text-gray-600">Belliganj Malik Mau Road, Raebareli-229001, UP</p>
                <p className="text-xs text-gray-600">GSTIN: 09ABCDE1234F1Z5 • Phone: +91 94150 12345</p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-bold text-gray-500 block">DIGITAL RECEIPT</span>
                <span className="font-mono font-bold text-sm text-emerald-800">{selectedInvoice.orderNumber}</span>
                <p className="text-xs text-gray-500">{selectedInvoice.createdAt.split('T')[0]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-300 pb-4">
              <div>
                <span className="font-bold block text-gray-700">Customer Details:</span>
                <p className="font-semibold text-gray-900">{selectedInvoice.customerName}</p>
                <p className="text-gray-600">{selectedInvoice.shippingAddress}</p>
                <p className="text-gray-600">Phone: {selectedInvoice.customerPhone}</p>
              </div>

              <div>
                <span className="font-bold block text-gray-700">Payment Verification:</span>
                <p className="text-gray-900 font-semibold font-mono">UTR: {selectedInvoice.utrNumber}</p>
                <p className="text-emerald-700 font-bold uppercase text-[10px]">Status: {selectedInvoice.paymentApprovalStatus || 'Approved'}</p>
                <p className="text-gray-600 font-mono">AWB: {selectedInvoice.trackingNumber}</p>
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
                {selectedInvoice.items.map((it, i) => (
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
              <span className="text-emerald-800 text-lg">₹{selectedInvoice.totalAmount}</span>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-xs"
              >
                Close Receipt
              </button>
              <button
                onClick={() => window.print()}
                className="bg-emerald-700 text-white font-bold px-6 py-2 rounded text-xs"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
