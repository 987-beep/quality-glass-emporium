import React, { useState, useEffect } from 'react';
import { apiFetch, getLocalMainPage, saveLocalMainPage } from '../api';
import { FileUploadInput } from '../components/FileUploadInput';

export function MainPageManager({ token }) {
  const [mainPageData, setMainPageData] = useState({
    announcementBar: {
      enabled: true,
      text: "⚡ Special Offer: Free Express Shipping on Custom Frame & Glass Orders above ₹999 in Raebareli!",
      link: "/collection",
      bgStyle: "primary"
    },
    hero: {
      badge: "Quality Glass Emporium • Raebareli",
      title: "Curate Your Space with Bespoke Framing.",
      subtitle: "Museum-quality bespoke wood, metal & floating acrylic frames designed to elevate your memories. Handcrafted precision meets digital photo studio.",
      bgImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
      primaryCtaText: "🎨 Launch Frame Studio",
      primaryCtaLink: "frame-studio",
      secondaryCtaText: "📸 Passport Photo Studio",
      secondaryCtaLink: "passport-studio"
    },
    promo: {
      badge: "Specialized Gift Shop",
      title: "Personalized 3D Photo Lamps, Custom Mugs & Keychains",
      description: "Create unforgettable keepsakes! Print your loved ones' photos on warm glowing 3D acrylic lamps, heat-sensitive magic mugs, customized T-shirts, mobile cases, and keychains with lifetime print guarantee.",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80",
      ctaText: "Shop Custom Gifts",
      ctaLink: "custom-gifts"
    },
    features: [
      {
        icon: "workspace_premium",
        title: "Museum-Grade Quality",
        description: "Organic solid wood moulding & 99.9% optical clear glass."
      },
      {
        icon: "center_focus_strong",
        title: "Instant AI Passport Studio",
        description: "Compliant biometric photos with background replacement."
      },
      {
        icon: "palette",
        title: "Custom 3D Gift Printing",
        description: "Personalized photo lamps, mugs, keychains & acrylic cutouts."
      },
      {
        icon: "local_shipping",
        title: "Raebareli Express Delivery",
        description: "Same-day doorstep delivery & local store pickup available."
      }
    ],
    sectionHeadlines: {
      categoriesTitle: "Framing & Gift Collections",
      categoriesSubtitle: "Store Taxonomy",
      productsTitle: "Trending Framing & Custom Gifts",
      productsSubtitle: "Handcrafted Products"
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const fetchMainPageData = () => {
    setIsLoading(true);
    const local = getLocalMainPage();

    apiFetch('/api/main-page')
      .then(res => res.json())
      .then(data => {
        const merged = { ...(local || {}), ...(data || {}) };
        if (merged && Object.keys(merged).length > 0) {
          setMainPageData(prev => ({
            ...prev,
            ...merged,
            announcementBar: { ...prev.announcementBar, ...merged.announcementBar },
            hero: { ...prev.hero, ...merged.hero },
            promo: { ...prev.promo, ...merged.promo },
            sectionHeadlines: { ...prev.sectionHeadlines, ...merged.sectionHeadlines },
            features: merged.features || prev.features
          }));
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (local) {
          setMainPageData(prev => ({ ...prev, ...local }));
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMainPageData();
  }, []);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    saveLocalMainPage(mainPageData);

    apiFetch('/api/admin/main-page', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(mainPageData)
    })
      .then(res => res.json())
      .then(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      })
      .catch(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      });
  };

  const handleFeatureChange = (index, field, val) => {
    const updated = [...mainPageData.features];
    updated[index] = { ...updated[index], [field]: val };
    setMainPageData({ ...mainPageData, features: updated });
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-on-surface-variant text-sm flex flex-col items-center justify-center space-y-2">
        <span className="material-symbols-outlined text-3xl animate-spin text-primary">sync</span>
        <span>Loading Homepage Platform Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-4">
        <div>
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Storefront Customizer</span>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Edit Main Page Layout & Content</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Configure Hero section, Announcement bar, Promo gift banners, and section headlines displayed on live customer homepage.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Homepage Saved!</span>
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-6 py-2.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">save</span>
                <span>Save Main Page Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-outline-variant pb-2 text-xs">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'hero'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">view_carousel</span>
          <span>1. Hero Header & Background</span>
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`px-4 py-2 rounded font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'announcement'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">campaign</span>
          <span>2. Top Announcement Bar</span>
        </button>

        <button
          onClick={() => setActiveTab('promo')}
          className={`px-4 py-2 rounded font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'promo'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">featured_seasonal</span>
          <span>3. Promo & Gift Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 rounded font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'features'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">verified</span>
          <span>4. Trust Badges & Highlights</span>
        </button>

        <button
          onClick={() => setActiveTab('headlines')}
          className={`px-4 py-2 rounded font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'headlines'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">title</span>
          <span>5. Section Headings</span>
        </button>
      </div>

      {/* Editor Content Area */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* TAB 1: HERO HEADER */}
        {activeTab === 'hero' && (
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-6">
            <div className="border-b border-outline-variant/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-headline font-bold text-lg text-on-surface flex items-center space-x-2">
                  <span className="material-symbols-outlined text-primary">view_carousel</span>
                  <span>Main Hero Banner (Image or Video Ad)</span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Customize the main banner presented right under the top navigation bar when visitors open your website.
                </p>
              </div>

              {/* Media Type Selector Toggle */}
              <div className="bg-surface-container-high border border-outline-variant rounded p-1 flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setMainPageData({
                    ...mainPageData,
                    hero: { ...mainPageData.hero, mediaType: 'image' }
                  })}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center space-x-1 ${
                    (mainPageData.hero.mediaType || 'image') === 'image'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">image</span>
                  <span>Static Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMainPageData({
                    ...mainPageData,
                    hero: { ...mainPageData.hero, mediaType: 'video' }
                  })}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center space-x-1 ${
                    mainPageData.hero.mediaType === 'video'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">movie</span>
                  <span>🎬 Video Ad</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Top Badge / Tagline *</label>
                  <input
                    type="text"
                    required
                    value={mainPageData.hero.badge}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      hero: { ...mainPageData.hero, badge: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                    placeholder="Quality Glass Emporium • Raebareli"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Main Hero Headline Title *</label>
                  <textarea
                    rows={2}
                    required
                    value={mainPageData.hero.title}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      hero: { ...mainPageData.hero, title: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary font-headline font-bold"
                    placeholder="Curate Your Space with Bespoke Framing."
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Subheadline Description Paragraph *</label>
                  <textarea
                    rows={3}
                    required
                    value={mainPageData.hero.subtitle}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      hero: { ...mainPageData.hero, subtitle: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                    placeholder="Museum-quality bespoke wood, metal & floating acrylic frames..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                {mainPageData.hero.mediaType === 'video' ? (
                  <div className="space-y-3 bg-surface-container-high/50 p-3.5 rounded border border-outline-variant/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-xs flex items-center space-x-1">
                        <span className="material-symbols-outlined text-base">movie</span>
                        <span>Hero Video Ad Configurator</span>
                      </span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">
                        Autoplay & Loop Enabled
                      </span>
                    </div>

                    <FileUploadInput
                      label="Upload Video Ad File (.mp4, .webm, .mov) *"
                      value={mainPageData.hero.videoUrl || ''}
                      token={token}
                      fileType="video"
                      onChange={(url) => setMainPageData({
                        ...mainPageData,
                        hero: { ...mainPageData.hero, videoUrl: url, mediaType: 'video' }
                      })}
                      aspectHint="Upload MP4 or WebM video file (Recommended length: 5-30s)"
                    />

                    <div>
                      <label className="block text-on-surface font-semibold mb-1">Or Direct Video Ad URL</label>
                      <input
                        type="text"
                        value={mainPageData.hero.videoUrl || ''}
                        onChange={(e) => setMainPageData({
                          ...mainPageData,
                          hero: { ...mainPageData.hero, videoUrl: e.target.value, mediaType: 'video' }
                        })}
                        placeholder="https://example.com/promo-video-ad.mp4"
                        className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <FileUploadInput
                    label="Upload Hero Background Image File *"
                    value={mainPageData.hero.bgImage}
                    token={token}
                    fileType="image"
                    onChange={(url) => setMainPageData({
                      ...mainPageData,
                      hero: { ...mainPageData.hero, bgImage: url, mediaType: 'image' }
                    })}
                    aspectHint="Recommended high resolution 1920x1080 horizontal image file"
                  />
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={mainPageData.hero.primaryCtaText}
                      onChange={(e) => setMainPageData({
                        ...mainPageData,
                        hero: { ...mainPageData.hero, primaryCtaText: e.target.value }
                      })}
                      className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Primary Button Link</label>
                    <select
                      value={mainPageData.hero.primaryCtaLink}
                      onChange={(e) => setMainPageData({
                        ...mainPageData,
                        hero: { ...mainPageData.hero, primaryCtaLink: e.target.value }
                      })}
                      className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                    >
                      <option value="frame-studio">Frame Studio (/frame-studio)</option>
                      <option value="passport-studio">Passport Studio (/passport-studio)</option>
                      <option value="collection">Product Catalog (/collection)</option>
                      <option value="custom-gifts">Custom Gifts (/custom-gifts)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Secondary CTA Button Text</label>
                    <input
                      type="text"
                      value={mainPageData.hero.secondaryCtaText}
                      onChange={(e) => setMainPageData({
                        ...mainPageData,
                        hero: { ...mainPageData.hero, secondaryCtaText: e.target.value }
                      })}
                      className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Secondary Button Link</label>
                    <select
                      value={mainPageData.hero.secondaryCtaLink}
                      onChange={(e) => setMainPageData({
                        ...mainPageData,
                        hero: { ...mainPageData.hero, secondaryCtaLink: e.target.value }
                      })}
                      className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                    >
                      <option value="passport-studio">Passport Studio (/passport-studio)</option>
                      <option value="frame-studio">Frame Studio (/frame-studio)</option>
                      <option value="collection">Product Catalog (/collection)</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Live Hero Banner Card Preview */}
            <div className="pt-4 border-t border-outline-variant/60">
              <span className="text-[10px] uppercase font-label-bold text-primary tracking-widest block mb-2">Live Hero Preview</span>
              <div className="relative h-48 rounded overflow-hidden border border-outline-variant flex items-center justify-center text-center p-4">
                <img src={mainPageData.hero.bgImage} alt="Hero Preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px]" />
                <div className="relative z-10 max-w-xl">
                  <span className="text-[9px] uppercase font-bold text-primary bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant">
                    {mainPageData.hero.badge}
                  </span>
                  <h3 className="font-headline font-bold text-base text-on-surface mt-1">{mainPageData.hero.title}</h3>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{mainPageData.hero.subtitle}</p>
                  <div className="flex justify-center space-x-2 mt-3">
                    <span className="bg-primary text-on-primary px-3 py-1 rounded text-[10px] font-bold uppercase">{mainPageData.hero.primaryCtaText}</span>
                    <span className="bg-surface-container-high text-on-surface border border-outline-variant px-3 py-1 rounded text-[10px] font-bold uppercase">{mainPageData.hero.secondaryCtaText}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ANNOUNCEMENT BAR */}
        {activeTab === 'announcement' && (
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-6">
            <div className="border-b border-outline-variant/60 pb-3">
              <h2 className="font-headline font-bold text-lg text-on-surface flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary">campaign</span>
                <span>Top Store Announcement Bar</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Display promo alerts, coupon codes, free shipping announcements, or store operational notices at the top of every page.
              </p>
            </div>

            <div className="space-y-4 text-xs max-w-2xl">
              <label className="flex items-center space-x-3 cursor-pointer bg-surface-container-high p-3 rounded border border-outline-variant">
                <input
                  type="checkbox"
                  checked={mainPageData.announcementBar.enabled}
                  onChange={(e) => setMainPageData({
                    ...mainPageData,
                    announcementBar: { ...mainPageData.announcementBar, enabled: e.target.checked }
                  })}
                  className="accent-primary w-4 h-4 rounded"
                />
                <div>
                  <span className="font-bold text-on-surface block">Enable Top Announcement Bar</span>
                  <span className="text-[10px] text-on-surface-variant">When checked, an announcement ribbon will appear above the main navigation bar.</span>
                </div>
              </label>

              <div>
                <label className="block text-on-surface font-semibold mb-1">Announcement Message Text *</label>
                <input
                  type="text"
                  required
                  value={mainPageData.announcementBar.text}
                  onChange={(e) => setMainPageData({
                    ...mainPageData,
                    announcementBar: { ...mainPageData.announcementBar, text: e.target.value }
                  })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary font-medium"
                  placeholder="⚡ Special Offer: Free Shipping on Orders above ₹999!"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Target Link (Optional)</label>
                  <input
                    type="text"
                    value={mainPageData.announcementBar.link}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      announcementBar: { ...mainPageData.announcementBar, link: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                    placeholder="/collection or /frame-studio"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Background Style</label>
                  <select
                    value={mainPageData.announcementBar.bgStyle}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      announcementBar: { ...mainPageData.announcementBar, bgStyle: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                  >
                    <option value="primary">Luxury Gold (Primary)</option>
                    <option value="dark">Sleek Dark Charcoal</option>
                    <option value="accent">Festive Red Accent</option>
                  </select>
                </div>
              </div>

              {/* Announcement Bar Live Preview */}
              <div className="pt-4 border-t border-outline-variant/60">
                <span className="text-[10px] uppercase font-label-bold text-primary tracking-widest block mb-2">Live Announcement Bar Preview</span>
                {mainPageData.announcementBar.enabled ? (
                  <div className={`p-2.5 text-center text-xs font-bold rounded shadow-md ${
                    mainPageData.announcementBar.bgStyle === 'accent'
                      ? 'bg-amber-600 text-white'
                      : mainPageData.announcementBar.bgStyle === 'dark'
                      ? 'bg-surface-container-highest text-on-surface border border-outline-variant'
                      : 'bg-primary text-on-primary'
                  }`}>
                    {mainPageData.announcementBar.text}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-on-surface-variant bg-surface-container-high rounded italic">
                    Announcement Bar is currently disabled and hidden.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: PROMO & GIFT BANNER */}
        {activeTab === 'promo' && (
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-6">
            <div className="border-b border-outline-variant/60 pb-3">
              <h2 className="font-headline font-bold text-lg text-on-surface flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary">featured_seasonal</span>
                <span>Promotional Gift Shop Section & Image File</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Customize the featured promotional section highlighting custom gifts, photo lamps, mugs, and keychains on the main page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Section Badge Tagline *</label>
                  <input
                    type="text"
                    required
                    value={mainPageData.promo.badge}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      promo: { ...mainPageData.promo, badge: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                    placeholder="Specialized Gift Shop"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Promotional Headline Title *</label>
                  <input
                    type="text"
                    required
                    value={mainPageData.promo.title}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      promo: { ...mainPageData.promo, title: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary font-headline font-bold"
                    placeholder="Personalized 3D Photo Lamps, Custom Mugs & Keychains"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Description Paragraph *</label>
                  <textarea
                    rows={4}
                    required
                    value={mainPageData.promo.description}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      promo: { ...mainPageData.promo, description: e.target.value }
                    })}
                    className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2.5 rounded focus:outline-none focus:border-primary"
                    placeholder="Create unforgettable keepsakes! Print your loved ones' photos on warm glowing 3D acrylic lamps..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-on-surface font-semibold mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={mainPageData.promo.ctaText}
                      onChange={(e) => setMainPageData({
                        ...mainPageData,
                        promo: { ...mainPageData.promo, ctaText: e.target.value }
                      })}
                      className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Target Link Category</label>
                    <select
                      value={mainPageData.promo.ctaLink}
                      onChange={(e) => setMainPageData({
                        ...mainPageData,
                        promo: { ...mainPageData.promo, ctaLink: e.target.value }
                      })}
                      className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                    >
                      <option value="custom-gifts">Customized Gifts (/custom-gifts)</option>
                      <option value="photo-frames">Photo Frames (/photo-frames)</option>
                      <option value="acrylic-frames">Acrylic Frames (/acrylic-frames)</option>
                      <option value="collection">All Catalog (/collection)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                {/* Upload Promo Image File */}
                <FileUploadInput
                  label="Upload Promo Feature Image File *"
                  value={mainPageData.promo.image}
                  token={token}
                  onChange={(url) => setMainPageData({
                    ...mainPageData,
                    promo: { ...mainPageData.promo, image: url }
                  })}
                  aspectHint="High resolution photo showcasing gift lamps or custom photo products"
                />

                {/* Live Promo Card Preview */}
                <div className="mt-4 p-4 bg-surface-container-high border border-outline-variant rounded space-y-2">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-widest">{mainPageData.promo.badge}</span>
                  <h4 className="font-headline font-bold text-sm text-on-surface">{mainPageData.promo.title}</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">{mainPageData.promo.description}</p>
                  <span className="inline-block bg-primary text-on-primary font-bold text-[10px] uppercase px-3 py-1 rounded mt-2">
                    {mainPageData.promo.ctaText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRUST BADGES & HIGHLIGHTS */}
        {activeTab === 'features' && (
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-6">
            <div className="border-b border-outline-variant/60 pb-3">
              <h2 className="font-headline font-bold text-lg text-on-surface flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span>Storefront Value Propositions & Trust Badges</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Customize the 4 core feature highlights and quality guarantees displayed on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {mainPageData.features.map((feat, idx) => (
                <div key={idx} className="bg-surface-container-high border border-outline-variant p-4 rounded space-y-3">
                  <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
                    <span className="font-bold text-primary uppercase text-[10px]">Highlight #{idx + 1}</span>
                    <span className="material-symbols-outlined text-primary">{feat.icon}</span>
                  </div>

                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Material Symbol Icon Name</label>
                    <input
                      type="text"
                      value={feat.icon}
                      onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                      className="w-full bg-background border border-outline-variant text-on-surface p-1.5 rounded focus:outline-none focus:border-primary font-mono text-[11px]"
                      placeholder="e.g. workspace_premium, local_shipping, palette"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={feat.title}
                      onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                      className="w-full bg-background border border-outline-variant text-on-surface p-1.5 rounded focus:outline-none focus:border-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Description *</label>
                    <input
                      type="text"
                      required
                      value={feat.description}
                      onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                      className="w-full bg-background border border-outline-variant text-on-surface p-1.5 rounded focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECTION HEADINGS */}
        {activeTab === 'headlines' && (
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded space-y-6">
            <div className="border-b border-outline-variant/60 pb-3">
              <h2 className="font-headline font-bold text-lg text-on-surface flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary">title</span>
                <span>Homepage Section Titles & Headings</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Customize section headers for Collections bento grid and Trending products showcase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-surface-container-high border border-outline-variant p-4 rounded space-y-3">
                <h3 className="font-bold text-primary uppercase text-[11px]">Collections Section Headings</h3>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Top Tagline Badge</label>
                  <input
                    type="text"
                    value={mainPageData.sectionHeadlines.categoriesSubtitle}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      sectionHeadlines: { ...mainPageData.sectionHeadlines, categoriesSubtitle: e.target.value }
                    })}
                    className="w-full bg-background border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Main Section Title</label>
                  <input
                    type="text"
                    value={mainPageData.sectionHeadlines.categoriesTitle}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      sectionHeadlines: { ...mainPageData.sectionHeadlines, categoriesTitle: e.target.value }
                    })}
                    className="w-full bg-background border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              </div>

              <div className="bg-surface-container-high border border-outline-variant p-4 rounded space-y-3">
                <h3 className="font-bold text-primary uppercase text-[11px]">Products Showcase Headings</h3>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Top Tagline Badge</label>
                  <input
                    type="text"
                    value={mainPageData.sectionHeadlines.productsSubtitle}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      sectionHeadlines: { ...mainPageData.sectionHeadlines, productsSubtitle: e.target.value }
                    })}
                    className="w-full bg-background border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Main Section Title</label>
                  <input
                    type="text"
                    value={mainPageData.sectionHeadlines.productsTitle}
                    onChange={(e) => setMainPageData({
                      ...mainPageData,
                      sectionHeadlines: { ...mainPageData.sectionHeadlines, productsTitle: e.target.value }
                    })}
                    className="w-full bg-background border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar at Bottom */}
        <div className="flex justify-between items-center bg-surface-container-low border border-outline-variant p-4 rounded">
          <span className="text-xs text-on-surface-variant">
            All edits update live on your customer-facing homepage upon saving.
          </span>
          
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-8 py-3 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            <span>Publish Main Page Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
}
