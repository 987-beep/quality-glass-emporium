import React, { useState, useEffect } from 'react';
import { apiFetch, getLocalOrders } from '../api';

export function OrderTracking({ initialQuery, setActivePage }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTrackStatus = (q) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setErrorMsg('');

    const targetQuery = q.trim().toLowerCase();
    const localOrders = getLocalOrders();
    const foundLocal = localOrders.find(o => 
      (o.orderNumber && o.orderNumber.toLowerCase() === targetQuery) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === targetQuery) ||
      (o.customerPhone && o.customerPhone.toLowerCase() === targetQuery) ||
      (o.utrNumber && o.utrNumber.toLowerCase() === targetQuery)
    );

    apiFetch(`/api/orders/track/${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data && !data.error) {
          setTrackedOrder(data);
        } else if (foundLocal) {
          setTrackedOrder(foundLocal);
        } else {
          setErrorMsg(data.error || 'No matching order found');
          setTrackedOrder(null);
        }
      })
      .catch(() => {
        setIsLoading(false);
        if (foundLocal) {
          setTrackedOrder(foundLocal);
        } else {
          setErrorMsg('No matching order found');
        }
      });
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTrackStatus(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTrackStatus(searchQuery);
  };

  // Timeline Step Status Index
  const statusSteps = ['Pending', 'Processing', 'Framing & Quality Check', 'Shipped', 'Delivered'];
  const getCurrentStepIndex = () => {
    if (!trackedOrder) return 0;
    const st = trackedOrder.orderStatus;
    if (st === 'Processing') return 1;
    if (st === 'Framing & Quality Check') return 2;
    if (st === 'Shipped') return 3;
    if (st === 'Delivered') return 4;
    return 0;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      <div className="mb-8 border-b border-outline-variant pb-4 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Real-time Order Tracker</span>
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface mt-1">Track Your Order Status</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Enter your Order Number (e.g. QGE-2026-1001), AWB Tracking Code, or registered phone number.
        </p>

        {/* Tracking Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex space-x-2">
          <input
            type="text"
            required
            placeholder="Enter Order # or Tracking Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface text-xs rounded py-3 px-4 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-6 py-3 rounded hover:bg-primary-fixed transition-all"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </form>
        {errorMsg && <p className="text-xs text-error mt-3">{errorMsg}</p>}
      </div>

      {trackedOrder && (
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Order Details Header Card */}
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-on-surface-variant block">Order Reference</span>
              <span className="font-headline font-bold text-primary text-sm">{trackedOrder.orderNumber}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block">AWB Tracking Number</span>
              <span className="font-mono text-on-surface text-sm">{trackedOrder.trackingNumber}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block">Current Status</span>
              <span className="bg-primary/10 text-primary border border-primary/40 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                {trackedOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Interactive Progress Bar Timeline */}
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-6">
            <h2 className="font-headline font-bold text-sm text-primary uppercase">Fulfillment Progress Timeline</h2>

            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface-container-high -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />

              {statusSteps.map((stepName, idx) => (
                <div key={stepName} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      idx <= currentStep
                        ? 'bg-primary text-on-primary border-2 border-primary shadow-lg shadow-primary/30'
                        : 'bg-surface-container-high text-on-surface-variant border-2 border-outline-variant'
                    }`}
                  >
                    {idx <= currentStep ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-label-bold mt-2 text-center max-w-[80px] ${
                      idx <= currentStep ? 'text-primary font-bold' : 'text-on-surface-variant/60'
                    }`}
                  >
                    {stepName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-3 text-xs">
            <h3 className="font-headline font-semibold text-on-surface text-sm border-b border-outline-variant pb-2">
              Order Items Summary
            </h3>
            {trackedOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-on-surface">{item.quantity}x {item.productName}</span>
                <span className="font-semibold text-primary">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-outline-variant flex justify-between font-bold text-sm text-primary">
              <span>Total Paid:</span>
              <span>₹{trackedOrder.totalAmount}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
