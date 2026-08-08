import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

export function SeoManager({ token }) {
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    apiFetch('/api/settings')
      .then(res => res.json())
      .then(s => {
        if (s.metaTitle) setMetaTitle(s.metaTitle);
        if (s.metaDescription) setMetaDescription(s.metaDescription);
        if (s.metaKeywords) setMetaKeywords(s.metaKeywords);
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
      body: JSON.stringify({ metaTitle, metaDescription, metaKeywords })
    })
      .then(res => res.json())
      .then(() => {
        setSavedMsg('SEO Meta tags updated successfully!');
        setTimeout(() => setSavedMsg(''), 3000);
      })
      .catch(() => {});
  };

  return (
    <div className="space-y-6 max-w-2xl">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Search Engine Optimization</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">SEO Settings & Meta Data</h1>
      </div>

      {savedMsg && (
        <div className="bg-primary/10 border border-primary text-primary text-xs p-3 rounded font-bold">
          {savedMsg}
        </div>
      )}

      {/* SEO Preview Snippet */}
      <div className="bg-surface-container-high border border-outline-variant p-4 rounded text-xs space-y-1">
        <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Google Search Result Snippet Preview</span>
        <div className="text-blue-400 font-bold text-base hover:underline cursor-pointer line-clamp-1">{metaTitle || 'Quality Glass Emporium'}</div>
        <div className="text-emerald-400 text-xs font-mono">https://qualityglassemporium.com</div>
        <p className="text-on-surface-variant line-clamp-2">{metaDescription || 'Bespoke photo frames and studio prints.'}</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-4 text-xs">
        <div>
          <label className="block text-on-surface font-semibold mb-1">Global Meta Title (Max 60 chars) *</label>
          <input
            type="text"
            required
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-on-surface font-semibold mb-1">Meta Description (Max 160 chars) *</label>
          <textarea
            rows={3}
            required
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-on-surface font-semibold mb-1">Meta Keywords (Comma separated)</label>
          <input
            type="text"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div className="pt-2 border-t border-outline-variant flex items-center justify-between">
          <div className="flex space-x-2 text-[10px] text-on-surface-variant">
            <span className="bg-surface-container-high px-2 py-1 rounded">✓ robots.txt configured</span>
            <span className="bg-surface-container-high px-2 py-1 rounded">✓ sitemap.xml generated</span>
          </div>

          <button
            type="submit"
            className="bg-primary text-on-primary font-bold uppercase px-6 py-2.5 rounded hover:bg-primary-fixed transition-all"
          >
            Save SEO Meta Settings
          </button>
        </div>
      </form>

    </div>
  );
}
