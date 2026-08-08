import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function BrandingManager({ token }) {
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    apiFetch('/api/settings')
      .then(res => res.json())
      .then(s => {
        if (s.storeName) setStoreName(s.storeName);
        if (s.tagline) setTagline(s.tagline);
        if (s.email) setEmail(s.email);
        if (s.phone) setPhone(s.phone);
        if (s.address) setAddress(s.address);
        if (s.logo) setLogo(s.logo);
      })
      .catch(() => {});
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    apiFetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ storeName, tagline, email, phone, address, logo })
    })
      .then(res => res.json())
      .then(() => {
        setSavedMsg('Store branding and contact information updated!');
        setTimeout(() => setSavedMsg(''), 3000);
      })
      .catch(() => {});
  };

  return (
    <div className="space-y-6 max-w-2xl">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Store Profile</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Store Branding & Contact Information</h1>
      </div>

      {savedMsg && (
        <div className="bg-primary/10 border border-primary text-primary text-xs p-3 rounded font-bold">
          {savedMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-4 text-xs">
        <div>
          <label className="block text-on-surface font-semibold mb-1">Store Name *</label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-on-surface font-semibold mb-1">Tagline / Subtitle</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-on-surface font-semibold mb-1">Support Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-on-surface font-semibold mb-1">Support Phone Numbers *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-on-surface font-semibold mb-1">Physical Store Address *</label>
          <textarea
            rows={2}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-on-surface font-semibold mb-1">Store Logo Image URL</label>
          <input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary font-bold uppercase px-6 py-2.5 rounded hover:bg-primary-fixed transition-all"
        >
          Save Store Branding
        </button>
      </form>

    </div>
  );
}
