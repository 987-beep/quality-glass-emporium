import { StoreService } from '@/lib/services/store-service';
import { FramingConfigurator } from '@/components/product/FramingConfigurator';

export default async function CustomFramingPage() {
  const products = await StoreService.getProducts();
  const baseProduct = products[2] || products[0]; // Dark Oak or first product

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-8">
      <div>
        <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-primary dark:text-primary-fixed">
          Custom Framing & Matting Studio
        </h1>
        <p className="font-body-lg text-sm md:text-base text-on-surface-variant mt-2 max-w-3xl">
          Configure exact custom width x height dimensions, wood finishes, museum glass UV filters, and matting styles. Tailor-made at our Raebareli workshop to match your fine art and treasured photos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6">
          <h2 className="font-headline-md text-xl font-bold text-primary">Interactive Framing Configurator</h2>
          <FramingConfigurator product={baseProduct} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h3 className="font-label-md text-base font-bold text-on-surface">Why Choose Our Custom Framing?</h3>
            <ul className="space-y-3 text-xs text-on-surface-variant list-disc pl-4">
              <li><strong>Precision Cutting:</strong> Custom cut glass and timber frames accurate to within 1/16th of an inch.</li>
              <li><strong>Archival Mounting:</strong> Acid-free backing boards prevent paper yellowing and humidity deterioration.</li>
              <li><strong>Museum UV Protection:</strong> Clear optical glass blocking 99% of harmful ultraviolet solar rays.</li>
              <li><strong>Raebareli Workshop Direct:</strong> No middleman fees—expert artisan craftsmanship directly from near Hotel Ganesh, PNT Colony.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
