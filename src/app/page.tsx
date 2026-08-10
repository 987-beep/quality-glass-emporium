import Link from 'next/link';
import Image from 'next/image';
import { Search, Frame, ArrowRight, ShieldCheck, Truck, Sparkles, Star } from 'lucide-react';
import { StoreService } from '@/lib/services/store-service';
import { ProductCard } from '@/components/product/ProductCard';

export default async function HomePage() {
  const banners = await StoreService.getBanners();
  const categories = await StoreService.getCategories();
  const featuredProducts = await StoreService.getProducts({ featuredOnly: true });
  const heroBanner = banners[0] || {
    title: 'Frame Your Memories in Perfect Clarity',
    subtitle: 'Discover our curated collection of premium glass and acrylic frames, designed to protect and showcase your most treasured moments.',
    button_text: 'Shop Collections',
    link_url: '/products'
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 shadow-sm">
        <div className="flex-1 space-y-6 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container text-xs font-bold font-label-md">
            <Sparkles className="w-3.5 h-3.5" /> Raebareli's Premier Framing Center
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-primary dark:text-primary-fixed leading-tight">
            {heroBanner.title}
          </h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-lg leading-relaxed">
            {heroBanner.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={heroBanner.link_url || '/products'}
              className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-sm hover:bg-secondary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {heroBanner.button_text} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/custom-framing"
              className="border border-primary text-primary dark:text-primary-fixed dark:border-primary-fixed px-6 py-3 rounded-lg font-label-md text-sm hover:bg-primary/5 transition-all"
            >
              Custom Sizing & Matting
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant/30 shadow-md">
          <Image
            src="https://lh3.googleusercontent.com/aida/AP1WRLvs8glZE8N7jK5D808-t789KgAwZl0I210VBmbNiBcM2KkBQO9iZ62hhgIhiWH4m9J2ctimt8Ts3dwNbTCOFWRPEYO3m79DI_O0DBULkzgk6Ci5yiGoM2SSZI3kBPgrGcXiuVyZhdYTC_ZN_YcNIl89i_ZsQQDBcvhLKYr57roQbstG8fojV7GLmuLhrnEovfFBcDdIOS-HP48DLpdJvXyKmrbdhMGSTNNyy8d1fQOmti14Zje1HgUGDXNs"
            alt="Artisan Glass and Frame Showcase"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="max-w-2xl mx-auto w-full">
        <form action="/products" method="GET" className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            name="search"
            placeholder="Search for frames, glass materials, or custom sizes..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-subtle-gray bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-sm text-on-surface shadow-sm"
          />
        </form>
      </section>

      {/* Feature Value Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg text-secondary shrink-0">
            <Frame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline-md text-base font-bold text-on-surface">Handcrafted Precision</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Custom mitered wood joints, polished glass edges, and archival mounting made in Raebareli.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg text-secondary shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline-md text-base font-bold text-on-surface">Museum UV Protection</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              99% UV filtering glass and non-glare optical acrylic to prevent photo fading over decades.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg text-secondary shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline-md text-base font-bold text-on-surface">Safe Glass Delivery</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Reinforced wooden box packaging guarantees safe transit without breakage.
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
              Explore Collections
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">Browse by product category</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all border border-outline-variant/30 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-highest">
                <Image
                  src={cat.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-label-md font-bold text-base text-on-surface group-hover:text-secondary transition-colors">
                  {cat.name}
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
              Featured Frames & Glass
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">Our best-selling picture frames and museum glass sheets</p>
          </div>
          <Link href="/products" className="text-secondary font-label-md text-sm font-bold hover:underline">
            View All ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Store Location & Showroom Callout */}
      <section className="rounded-2xl bg-primary text-on-primary p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-4 max-w-xl z-10">
          <div className="flex items-center gap-1 text-tertiary-fixed text-xs font-bold uppercase tracking-wider">
            <Star className="w-4 h-4 fill-current text-tertiary-fixed" /> Raebareli Showroom
          </div>
          <h2 className="font-display-lg text-2xl md:text-4xl font-bold">
            Visit Quality Glass Emporium In Person
          </h2>
          <p className="text-on-primary-container text-sm md:text-base leading-relaxed">
            Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, Uttar Pradesh. Bring your art or photos for instant consultation and live framing samples.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="https://wa.me/919415065470"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-success-green text-white px-6 py-3 rounded-lg font-label-md text-sm font-bold hover:opacity-90 transition-opacity"
            >
              WhatsApp Us: +91 94150 65470
            </a>
            <Link
              href="/about"
              className="border border-on-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-sm hover:bg-white/10 transition-colors"
            >
              View Hours & Directions
            </Link>
          </div>
        </div>

        <div className="w-full md:w-80 aspect-square rounded-xl overflow-hidden relative shrink-0 border-2 border-white/20 shadow-2xl">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0deHpOcBxKeTT0PHLaDpu4X7s3ndCflvOyTl9thmDWWmPLCqGVcg-46405FjhAhHSGiWj5UEXd0SzvmyepNjzs2z9l5uCXLPXBUOO7YHKRZLweWqiLI941pj9K7pXjcHQqELzZQBNSxSKV4mmn6rbiVZ2w4lMTpEyo3cFbtkHJB8SfkUdPXZ8m0SYbv9_YMWQQMvz-zTY0F9RYjaCRa80TKkxd_vngPIZiZjkVXrn6y-QLyOHnG0Qsg"
            alt="Quality Glass Emporium Storefront"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </div>
  );
}
