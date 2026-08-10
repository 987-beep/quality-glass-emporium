import { notFound } from 'next/navigation';
import Image from 'next/image';
import { StoreService } from '@/lib/services/store-service';
import { FramingConfigurator } from '@/components/product/FramingConfigurator';
import { Star, Shield, Truck, RotateCcw } from 'lucide-react';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await StoreService.getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const reviews = await StoreService.getReviews(product.id);
  const mainImage = product.images?.[0] || 'https://lh3.googleusercontent.com/aida/AP1WRLvs8glZE8N7jK5D808-t789KgAwZl0I210VBmbNiBcM2KkBQO9iZ62hhgIhiWH4m9J2ctimt8Ts3dwNbTCOFWRPEYO3m79DI_O0DBULkzgk6Ci5yiGoM2SSZI3kBPgrGcXiuVyZhdYTC_ZN_YcNIl89i_ZsQQDBcvhLKYr57roQbstG8fojV7GLmuLhrnEovfFBcDdIOS-HP48DLpdJvXyKmrbdhMGSTNNyy8d1fQOmti14Zje1HgUGDXNs';

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-mobile md:gap-gutter-desktop">
        {/* Image Gallery Column */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-surface-container rounded-xl overflow-hidden shadow-sm relative group cursor-zoom-in border border-outline-variant/30">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`aspect-square bg-surface-container rounded-lg overflow-hidden border-2 relative cursor-pointer ${
                    idx === 0 ? 'border-secondary' : 'border-outline-variant hover:border-secondary/50'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Quality Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/30 text-center text-xs font-caption text-on-surface-variant">
            <div className="flex flex-col items-center gap-1 p-3 bg-surface-container-low rounded-lg">
              <Shield className="w-5 h-5 text-secondary" />
              <span>99% UV Archival Protection</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-surface-container-low rounded-lg">
              <Truck className="w-5 h-5 text-secondary" />
              <span>Free Shipping over ₹2,000</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-surface-container-low rounded-lg">
              <RotateCcw className="w-5 h-5 text-secondary" />
              <span>30-Day Damage Guarantee</span>
            </div>
          </div>
        </div>

        {/* Product Details & Framing Configurator Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              {product.category?.name || 'Handcrafted Frame'}
            </span>
            <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface mt-1">
              {product.name}
            </h1>
            <p className="font-body-lg text-sm text-on-surface-variant mt-2 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-headline-lg text-3xl font-bold text-secondary">
                ${(product.sale_price || product.price).toFixed(2)}
              </span>
              {product.sale_price && (
                <span className="font-body-md text-sm text-subtle-gray line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="ml-auto text-xs font-bold text-success-green bg-success-green/10 px-2.5 py-1 rounded-full">
                  In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="ml-auto text-xs font-bold text-error bg-error-container px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <hr className="border-outline-variant/30" />

          {/* Framing Configurator */}
          <FramingConfigurator product={product} />

          {/* Specifications Accordion */}
          <div className="mt-4 border-t border-outline-variant/30 divide-y divide-outline-variant/30 text-sm">
            <details className="group py-4" open>
              <summary className="flex justify-between items-center font-label-md font-bold text-on-surface cursor-pointer list-none">
                <span>Product Specifications</span>
                <span className="transition-transform group-open:rotate-180 text-on-surface-variant">▼</span>
              </summary>
              <div className="mt-3 font-body-md text-xs text-on-surface-variant leading-relaxed space-y-1">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="capitalize text-on-surface font-medium">{k.replace('_', ' ')}:</span>
                      <span>{String(v)}</span>
                    </div>
                  ))
                ) : (
                  <p>Handcrafted using sustainably sourced timber and optical grade glass in our Raebareli workshop.</p>
                )}
              </div>
            </details>

            <details className="group py-4">
              <summary className="flex justify-between items-center font-label-md font-bold text-on-surface cursor-pointer list-none">
                <span>Packaging & Delivery</span>
                <span className="transition-transform group-open:rotate-180 text-on-surface-variant">▼</span>
              </summary>
              <div className="mt-3 font-body-md text-xs text-on-surface-variant leading-relaxed">
                Ships within 2-4 business days. All glass and frames are packed with double bubble protection and reinforced corner guards to ensure flawless delivery to your doorstep.
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="space-y-6 pt-6 border-t border-outline-variant/30">
        <h2 className="font-headline-lg text-2xl font-bold text-primary dark:text-primary-fixed flex items-center gap-2">
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="glass-card p-5 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-label-md font-bold text-sm text-on-surface">{rev.user_name}</span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-outline-variant'}`} />
                    ))}
                  </div>
                </div>
                <p className="font-body-md text-xs text-on-surface-variant">{rev.comment}</p>
                <span className="font-caption text-[10px] text-subtle-gray block pt-1">
                  Verified Buyer • {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">No reviews submitted yet for this frame model.</p>
        )}
      </section>
    </div>
  );
}
