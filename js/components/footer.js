/* ============================================================
   QUALITY GLASS EMPORIUM - FOOTER COMPONENT
   ============================================================ */

window.renderFooter = function() {
  const settings = window.SEED_DATA.siteSettings;
  
  return `
    <footer class="bg-primary text-white pt-16 pb-12 mt-20 border-t border-primary-container">
      <div class="max-w-[1280px] mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <!-- Col 1: Store Branding & Address -->
        <div class="space-y-4 md:col-span-1">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white font-bold">
              QGE
            </div>
            <h3 class="font-headline-md font-bold text-lg text-white">Quality Glass Emporium</h3>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">
            Raebareli's premier glass dealers & photo framing center. Crafted with clarity and precision since 2010.
          </p>
          <div class="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">star</span>
            ${settings.rating} / 5.0 Rating (${settings.ratingCount})
          </div>
        </div>

        <!-- Col 2: Contact Info -->
        <div class="space-y-3">
          <h4 class="font-bold text-white uppercase text-xs tracking-wider">Contact & Location</h4>
          <div class="space-y-2 text-sm text-gray-300">
            <p class="flex items-start gap-2">
              <span class="material-symbols-outlined text-secondary text-base shrink-0">location_on</span>
              <span>${settings.address}</span>
            </p>
            <p class="flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-base shrink-0">call</span>
              <span>${settings.phone}</span>
            </p>
            <p class="flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-base shrink-0">schedule</span>
              <span>${settings.hours}</span>
            </p>
          </div>
        </div>

        <!-- Col 3: Quick Links -->
        <div class="space-y-3">
          <h4 class="font-bold text-white uppercase text-xs tracking-wider">Collections & Custom</h4>
          <ul class="space-y-2 text-sm text-gray-300">
            <li><a href="#" onclick="window.appStore.navigateTo('catalog'); return false;" class="hover:text-secondary-container transition-colors">Photo Frames Collection</a></li>
            <li><a href="#" onclick="window.appStore.navigateTo('catalog'); return false;" class="hover:text-secondary-container transition-colors">Acrylic & Floating Glass</a></li>
            <li><a href="#" onclick="window.appStore.navigateTo('catalog'); return false;" class="hover:text-secondary-container transition-colors">Custom Gilded Mirrors</a></li>
            <li><a href="#" onclick="window.appStore.navigateTo('catalog'); return false;" class="hover:text-secondary-container transition-colors">Architectural Glass Cut-to-Size</a></li>
            <li><a href="#" onclick="window.appStore.navigateTo('configurator'); return false;" class="hover:text-secondary-container transition-colors">Online Frame Configurator</a></li>
          </ul>
        </div>

        <!-- Col 4: Admin & Developer Notice -->
        <div class="space-y-3">
          <h4 class="font-bold text-white uppercase text-xs tracking-wider">Admin Portal</h4>
          <p class="text-xs text-gray-400">
            Authorized administrator access only. Sign in with seed administrator credentials.
          </p>
          <button onclick="window.appStore.navigateTo('login')" class="w-full bg-secondary-container text-primary font-bold py-2 rounded-lg text-xs hover:bg-white transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">lock</span>
            Admin Portal Access
          </button>
        </div>
      </div>

      <div class="max-w-[1280px] mx-auto px-4 md:px-12 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <div>© 2026 Quality Glass Emporium And Photo Framing Center. All Rights Reserved.</div>
        <div class="flex gap-6">
          <span class="hover:text-white cursor-pointer">Privacy Policy</span>
          <span class="hover:text-white cursor-pointer">Terms of Service</span>
          <span class="hover:text-white cursor-pointer">Vercel & Supabase Ready</span>
        </div>
      </div>
    </footer>
  `;
};
