import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { FileUploadInput } from '../components/FileUploadInput';

export function BrandingManager({ token }) {
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
        body: JSON.stringify({ storeName, tagline, email, phone, address, logo })
      });

      const data = await res.json();
      if (res.ok) {
        setSavedMsg('Store branding and contact information saved permanently to database!');
        setTimeout(() => setSavedMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save store branding');
      }
    } catch (err) {
      setErrorMsg('Network error saving branding: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Store Profile</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Store Branding & Contact Information</h1>
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

        <FileUploadInput
          label="Store Logo Image *"
          value={logo}
          token={token}
          onChange={(url) => setLogo(url)}
          aspectHint="Upload store logo image (80 KB to 1.5 MB)"
        />

        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary text-on-primary font-bold uppercase px-6 py-2.5 rounded hover:bg-primary-fixed transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          {isSaving && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
          <span>{isSaving ? 'Saving...' : 'Save Store Branding'}</span>
        </button>
      </form>

    </div>
  );
}
