import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function ShippingManager({ token }) {
  const [flatRate, setFlatRate] = useState(79);
  const [freeThreshold, setFreeThreshold] = useState(999);
  const [taxRate, setTaxRate] = useState(18);
  const [savedMsg, setSavedMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiFetch('/api/settings')
      .then(res => res.json())
      .then(s => {
        if (s.flatShippingRate !== undefined) setFlatRate(s.flatShippingRate);
        if (s.freeShippingThreshold !== undefined) setFreeThreshold(s.freeShippingThreshold);
        if (s.taxRatePercentage !== undefined) setTaxRate(s.taxRatePercentage);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMsg('');
    setErrorMsg('');

    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          flatShippingRate: parseFloat(flatRate),
          freeShippingThreshold: parseFloat(freeThreshold),
          taxRatePercentage: parseFloat(taxRate)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSavedMsg('Shipping & tax parameters saved permanently to database!');
        setTimeout(() => setSavedMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to update shipping & tax settings');
      }
    } catch (err) {
      setErrorMsg('Network error saving settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Pricing Rules</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Shipping & GST Tax Rates</h1>
      </div>

      {savedMsg && (
        <div className="bg-primary/10 border border-primary text-primary text-xs p-3 rounded font-bold flex items-center space-x-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{savedMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-error/10 border border-error text-error text-xs p-3 rounded font-bold flex items-center space-x-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-4 text-xs">
        <div>
          <label className="block text-on-surface font-semibold mb-1">Flat Rate Shipping Fee (₹)</label>
          <input
            type="number"
            value={flatRate}
            onChange={(e) => setFlatRate(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-on-surface font-semibold mb-1">Free Shipping Threshold (₹ Subtotal)</label>
          <input
            type="number"
            value={freeThreshold}
            onChange={(e) => setFreeThreshold(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-on-surface font-semibold mb-1">GST Tax Percentage (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary text-on-primary font-bold uppercase px-6 py-2.5 rounded hover:bg-primary-fixed transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          {isSaving && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
          <span>{isSaving ? 'Saving...' : 'Save Shipping & Tax Settings'}</span>
        </button>
      </form>

    </div>
  );
}
