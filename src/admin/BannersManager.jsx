import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { FileUploadInput } from '../components/FileUploadInput';

export function BannersManager({ token }) {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Explore Framing');
  const [ctaLink, setCtaLink] = useState('/frame-studio');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const fetchBanners = () => {
    apiFetch('/api/admin/banners', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBanners(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    setIsSaving(true);
    setSavedMsg('');

    try {
      const res = await apiFetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          subtitle,
          imageUrl,
          ctaText,
          ctaLink
        })
      });

      if (res.ok) {
        setTitle('');
        setSubtitle('');
        setImageUrl('');
        setSavedMsg('New hero banner saved to database!');
        setTimeout(() => setSavedMsg(''), 3000);
        fetchBanners();
      }
    } catch (err) {
      alert('Error publishing banner: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner from database?')) return;
    try {
      const res = await apiFetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchBanners();
    } catch (err) {
      alert('Error deleting banner: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-outline-variant pb-4">
        <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Storefront Editor</span>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Homepage Hero Banners</h1>
      </div>

      {savedMsg && (
        <div className="bg-primary/10 border border-primary text-primary text-xs p-3 rounded font-bold flex items-center space-x-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Banners List */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant rounded p-4 space-y-4">
          {banners.length === 0 ? (
            <p className="text-xs text-on-surface-variant p-4 text-center">No active banners in database.</p>
          ) : (
            banners.map((b) => (
              <div key={b.id} className="relative aspect-16/7 rounded overflow-hidden border border-outline-variant group">
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/70 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-sm text-primary">{b.title}</h3>
                    <p className="text-[10px] text-on-surface-variant line-clamp-1">{b.subtitle}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded font-bold uppercase">{b.ctaText}</span>
                    <button onClick={() => handleDelete(b.id)} className="text-error font-bold hover:underline text-xs">
                      Delete Banner
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Form */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded text-xs space-y-4 h-fit">
          <h2 className="font-headline font-bold text-sm text-primary uppercase">Add New Hero Banner</h2>

          <form onSubmit={handleAddBanner} className="space-y-3">
            <div>
              <label className="block text-on-surface font-semibold mb-1">Headline Title *</label>
              <input
                type="text"
                required
                placeholder="Curate Your Wall Space"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-on-surface font-semibold mb-1">Subheadline Description</label>
              <input
                type="text"
                placeholder="Museum-quality bespoke framing designed to elevate..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <FileUploadInput
              label="Upload Banner Image File *"
              value={imageUrl}
              token={token}
              onChange={(url) => setImageUrl(url)}
              aspectHint="High resolution banner image file (1600x600 px)"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-on-surface font-semibold mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">CTA Target Link</label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary text-on-primary font-bold uppercase py-2.5 rounded hover:bg-primary-fixed transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSaving && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
              <span>{isSaving ? 'Publishing...' : 'Publish Hero Banner'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
