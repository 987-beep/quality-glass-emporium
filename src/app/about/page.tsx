import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Award } from 'lucide-react';
import { SEED_SITE_SETTINGS } from '@/lib/seed-data';

export default function AboutPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-primary dark:text-primary-fixed">
          Quality Glass Emporium And Photo Framing Center
        </h1>
        <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
          Raebareli&apos;s leading framing studio and specialized glass dealer. Crafting bespoke picture frames, optical non-glare acrylic fronts, and architectural glass solutions.
        </p>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop items-center">
        <div className="md:col-span-6 relative aspect-video md:aspect-square rounded-2xl overflow-hidden border border-outline-variant/30 shadow-lg">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxI5nL560akGJLj1bZ8BT5QtT9-1SHyrPCj5g0yGz9hJtijzWg9ucLvR8YbdTJwYxR0IHLFD6ZQseqCm-GEjZbkAwdOSCoFq5NBt9x9sJcGCqctkKRQKkM6yhuSscsrdU6zQE_B14e_qfgc2prXj37HdSFIy7Jbqpg2uUha4uk9zv5Zwmw5P2rn8bErxrktctGyexa7yJ5Z8zddz7VCUTDWe_w7s3NkvkLKQ7X1ZVd2FkTmJ02Mxq7Mw"
            alt="Artisan Framing Workshop in Raebareli"
            fill
            className="object-cover"
          />
        </div>

        <div className="md:col-span-6 space-y-6">
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
            Artisan Precision & Archival Longevity
          </h2>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
            Situated at Belliganj Malik Mau Road, Near Hotel Ganesh in PNT Colony, Raebareli, Quality Glass Emporium combines traditional hand-assembled wooden frames with modern optical glass technology.
          </p>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
            Whether framing family portraits, diplomas, fine art canvases, or custom cut glass sheets for interior architecture, our master artisans deliver flawless clarity and 99% UV protection.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <Award className="w-6 h-6 text-secondary mb-2" />
              <h3 className="font-bold text-sm text-on-surface">4.9/5 Rating</h3>
              <p className="text-xs text-on-surface-variant">Top-rated glass dealer in Raebareli</p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <ShieldCheck className="w-6 h-6 text-success-green mb-2" />
              <h3 className="font-bold text-sm text-on-surface">100% Archival</h3>
              <p className="text-xs text-on-surface-variant">Acid-free matting & UV glass</p>
            </div>
          </div>
        </div>
      </div>

      {/* Showroom Contact Card */}
      <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-secondary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-base text-primary">Showroom Address</h3>
            <p className="text-on-surface-variant mt-1">{SEED_SITE_SETTINGS.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-6 h-6 text-secondary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-base text-primary">Phone & WhatsApp</h3>
            <p className="text-on-surface-variant mt-1">{SEED_SITE_SETTINGS.phone}</p>
            <p className="text-xs text-secondary mt-0.5">{SEED_SITE_SETTINGS.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-secondary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-base text-primary">Showroom Hours</h3>
            <p className="text-on-surface-variant mt-1">{SEED_SITE_SETTINGS.operating_hours}</p>
            <p className="text-xs text-success-green font-bold mt-0.5">Open 7 Days a Week</p>
          </div>
        </div>
      </section>
    </div>
  );
}
