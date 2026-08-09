import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { apiFetch, getAssetUrl, getLocalProducts, syncProductsWithLocal, getLocalMainPage, syncMainPageWithLocal, syncBannersWithLocal, syncCategoriesWithLocal } from '../api';

const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80";
const DEFAULT_CAT_IMG = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80";
const DEFAULT_PROMO_IMG = "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80";

export function Home({ setActivePage, onAddToCart, onSelectProduct, onOpenFrameStudio }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [mainPageConfig, setMainPageConfig] = useState(getLocalMainPage());

  useEffect(() => {
    apiFetch('/api/main-page')
      .then(res => res.json())
      .then(data => {
        setMainPageConfig(syncMainPageWithLocal(data));
      })
      .catch(() => {
        setMainPageConfig(syncMainPageWithLocal(null));
      });

    apiFetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        setBanners(syncBannersWithLocal(data));
      })
      .catch(() => {
        setBanners(syncBannersWithLocal([]));
      });

    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(syncCategoriesWithLocal(data));
      })
      .catch(() => {
        setCategories(syncCategoriesWithLocal([]));
      });

    apiFetch('/api/products?limit=6')
      .then(res => res.json())
      .then(data => {
        const merged = syncProductsWithLocal(data);
        setFeaturedProducts(merged.slice(0, 6));
      })
      .catch(() => {
        const local = getLocalProducts();
        if (local && Array.isArray(local)) {
          setFeaturedProducts(local.slice(0, 6));
        }
      });
  }, []);

  const defaultHero = {
    badge: "Quality Glass Emporium • Raebareli",
    title: "Curate Your Space with Bespoke Framing.",
    subtitle: "Museum-quality bespoke wood, metal & floating acrylic frames designed to elevate your memories. Handcrafted precision meets digital photo studio.",
    bgImage: banners[0]?.imageUrl || DEFAULT_HERO_BG,
    primaryCtaText: "🎨 Launch Frame Studio",
    primaryCtaLink: "frame-studio",
    secondaryCtaText: "📸 Passport Photo Studio",
    secondaryCtaLink: "passport-studio"
  };
  const hero = { ...defaultHero, ...(mainPageConfig?.hero || {}) };

  const defaultPromo = {
    badge: "Specialized Gift Shop",
    title: "Personalized 3D Photo Lamps, Custom Mugs & Keychains",
    description: "Create unforgettable keepsakes! Print your loved ones' photos on warm glowing 3D acrylic lamps, heat-sensitive magic mugs, customized T-shirts, mobile cases, and keychains with lifetime print guarantee.",
    image: DEFAULT_PROMO_IMG,
    ctaText: "Shop Custom Gifts",
    ctaLink: "custom-gifts"
  };
  const promo = { ...defaultPromo, ...(mainPageConfig?.promo || {}) };

  const defaultHeadlines = {
    categoriesTitle: "Framing & Gift Collections",
    categoriesSubtitle: "Store Taxonomy",
    productsTitle: "Trending Framing & Custom Gifts",
    productsSubtitle: "Handcrafted Products"
  };
  const headlines = { ...defaultHeadlines, ...(mainPageConfig?.sectionHeadlines || {}) };

  const defaultFeatures = [
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
  ];
  const features = (mainPageConfig?.features && mainPageConfig.features.length > 0)
    ? mainPageConfig.features
    : defaultFeatures;

  const announcement = mainPageConfig?.announcementBar;

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Announcement Bar */}
      {announcement && announcement.enabled && (
        <div className={`py-2 px-4 text-center text-xs font-bold transition-all shadow-sm ${
          announcement.bgStyle === 'accent'
            ? 'bg-amber-600 text-white'
            : announcement.bgStyle === 'dark'
            ? 'bg-surface-container-highest text-on-surface border-b border-outline-variant'
            : 'bg-primary text-on-primary'
        }`}>
          <div className="max-w-container-max mx-auto flex items-center justify-center space-x-2">
            <span>{announcement.text}</span>
            {announcement.link && (
              <button
                onClick={() => setActivePage('collection')}
                className="underline hover:opacity-80 text-[11px] uppercase font-bold ml-2"
              >
                Shop Now →
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. Dynamic Hero Banner Section (Image or Video Ad) */}
      <section className="relative w-full h-[640px] md:h-[720px] flex items-center justify-center overflow-hidden border-b border-outline-variant">
        <div className="absolute inset-0 z-0">
          {(hero.mediaType === 'video' || (hero.videoUrl && hero.mediaType !== 'image')) ? (
            <video
              src={getAssetUrl(hero.videoUrl)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={getAssetUrl(hero.bgImage || hero.image || banners[0]?.imageUrl)}
              alt="Luxury Storefront Hero"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_HERO_BG;
              }}
            />
          )}
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl px-margin-mobile">
          <span className="inline-block text-xs uppercase tracking-widest font-label-bold text-primary mb-3 bg-surface-container-high/80 px-3 py-1 rounded border border-outline-variant">
            {hero.badge}
          </span>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface mb-6 tracking-tight leading-tight">
            {hero.title}
          </h1>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant mb-8 max-w-xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActivePage(hero.primaryCtaLink || 'frame-studio')}
              className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-8 py-4 rounded hover:bg-primary-fixed transition-all tracking-widest shadow-xl shadow-primary/20 flex items-center space-x-2"
            >
              <span>{hero.primaryCtaText || '🎨 Launch Frame Studio'}</span>
            </button>
            
            <button
              onClick={() => setActivePage(hero.secondaryCtaLink || 'passport-studio')}
              className="bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary hover:border-primary font-headline font-bold text-xs uppercase px-6 py-4 rounded transition-all tracking-widest flex items-center space-x-2"
            >
              <span>{hero.secondaryCtaText || '📸 Passport Photo Studio'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Store Features & Trust Badges */}
      <section className="bg-surface-container-low border-b border-outline-variant/60 py-8 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-4 rounded bg-surface-container-high/60 border border-outline-variant/40">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-xs text-on-surface">{feat.title}</h4>
                <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Collections Bento Grid Section */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs uppercase font-label-bold text-primary tracking-widest">{headlines.categoriesSubtitle}</span>
            <h2 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">{headlines.categoriesTitle}</h2>
          </div>
          <button
            onClick={() => setActivePage('collection')}
            className="font-label-bold text-xs text-on-surface-variant hover:text-primary uppercase border-b border-transparent hover:border-primary pb-1"
          >
            Explore All Catalog →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActivePage('collection', { category: cat.slug })}
              className="group relative h-64 rounded overflow-hidden cursor-pointer border border-outline-variant/60 hover:border-primary transition-all duration-300 shadow-md"
            >
              <img
                src={getAssetUrl(cat.image)}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_CAT_IMG;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] uppercase font-label-bold text-primary tracking-widest">Collection</span>
                <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-on-surface-variant/80 line-clamp-1 mt-1">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Products Section */}
      <section className="py-16 bg-surface-container-lowest border-y border-outline-variant/60">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs uppercase font-label-bold text-primary tracking-widest">{headlines.productsSubtitle}</span>
              <h2 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">{headlines.productsTitle}</h2>
            </div>
            {featuredProducts.length > 0 && (
              <button
                onClick={() => setActivePage('collection')}
                className="font-label-bold text-xs text-on-surface-variant hover:text-primary uppercase"
              >
                View All Products ({featuredProducts.length})
              </button>
            )}
          </div>

          {featuredProducts.length === 0 ? (
            <div className="py-16 text-center bg-surface-container-low border border-outline-variant rounded p-8 max-w-2xl mx-auto space-y-3">
              <span className="material-symbols-outlined text-4xl text-primary">inventory_2</span>
              <h3 className="font-headline font-bold text-lg text-on-surface">Store Catalog Ready for Admin Products</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Preloaded sample products have been cleared. Store admins can add real products with custom uploaded image files from the Admin Control Panel.
              </p>
              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={() => setActivePage('admin-login')}
                  className="bg-primary text-on-primary font-bold text-xs uppercase px-5 py-2.5 rounded shadow-lg shadow-primary/20"
                >
                  Go to Admin Panel
                </button>
                <button
                  onClick={() => setActivePage('frame-studio')}
                  className="bg-surface-container-high text-on-surface border border-outline-variant font-bold text-xs uppercase px-5 py-2.5 rounded"
                >
                  Custom Frame Studio
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                  onOpenFrameStudio={onOpenFrameStudio}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Custom Gifts Promo Section */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-surface-container-high border border-outline-variant rounded p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-label-bold text-primary tracking-widest">{promo.badge}</span>
            <h2 className="font-headline font-bold text-2xl md:text-4xl text-on-surface">
              {promo.title}
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {promo.description}
            </p>
            <div className="pt-2 flex space-x-4">
              <button
                onClick={() => setActivePage('collection', { category: promo.ctaLink || 'custom-gifts' })}
                className="bg-primary text-on-primary font-label-bold text-xs uppercase px-6 py-3 rounded hover:bg-primary-fixed transition-all font-bold"
              >
                {promo.ctaText || 'Shop Custom Gifts'}
              </button>
            </div>
          </div>

          <div className="relative aspect-16/10 rounded overflow-hidden border border-outline-variant/60 shadow-2xl">
            <img
              src={getAssetUrl(promo.image)}
              alt="Custom Gifts Promo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_PROMO_IMG;
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
