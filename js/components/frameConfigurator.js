/* ============================================================
   QUALITY GLASS EMPORIUM - INTERACTIVE FRAME CONFIGURATOR
   ============================================================ */

window.renderFrameConfigurator = function() {
  // Default Configurator state
  if (!window._configuratorState) {
    window._configuratorState = {
      frameStyle: 'wood', // 'wood' | 'gold' | 'black' | 'acrylic'
      glassType: 'museum', // 'museum' | 'anti_reflective' | 'clear'
      size: '16x24',
      matWidth: 2, // inches
      sampleImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    };
  }

  const s = window._configuratorState;

  // Calculate dynamic price
  let basePrice = 45;
  if (s.frameStyle === 'gold') basePrice = 90;
  if (s.frameStyle === 'acrylic') basePrice = 75;
  if (s.frameStyle === 'black') basePrice = 50;

  let glassMultiplier = 1.0;
  if (s.glassType === 'museum') glassMultiplier = 1.4;
  if (s.glassType === 'anti_reflective') glassMultiplier = 1.25;

  let matExtra = s.matWidth * 5;
  const totalPrice = (basePrice * glassMultiplier) + matExtra;

  window.updateConfiguratorParam = function(key, value) {
    window._configuratorState[key] = value;
    window.appStore.notify();
  };

  window.addCustomConfiguredToCart = function() {
    const customProduct = {
      id: 'custom-' + Date.now(),
      name: `Custom ${s.frameStyle.toUpperCase()} Frame (${s.size} in)`,
      description: `Custom framed artwork with ${s.glassType.replace('_', ' ')} glass & ${s.matWidth}" white archival matting.`,
      price: totalPrice,
      imageUrl: s.sampleImage,
      attributes: { ...s }
    };
    window.appStore.addToCart(customProduct, 1);
  };

  return `
    <div class="bg-white dark:bg-charcoal-bg rounded-2xl border border-outline-variant/30 p-6 md:p-10 shadow-lg">
      <div class="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span class="text-xs text-tertiary-gold font-bold uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Interactive Design Studio
        </span>
        <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-white">
          Custom Framing & Glass Configurator
        </h2>
        <p class="text-subtle-gray text-sm">
          Design your personalized photo frame and select museum-grade glass cut precisely to your dimensions at Quality Glass Emporium.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Interactive Preview Box (7 cols) -->
        <div class="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-surface-container-low dark:bg-gray-900 rounded-xl border border-outline-variant/30 min-h-[380px]">
          <div class="relative max-w-[420px] w-full aspect-[4/3] frame-preview-box frame-${s.frameStyle} transition-all duration-300 flex items-center justify-center bg-white" style="padding: ${s.matWidth * 6}px;">
            <img src="${s.sampleImage}" alt="Art Preview" class="w-full h-full object-cover shadow-inner">
            
            ${s.glassType === 'museum' ? `
              <div class="absolute inset-0 bg-blue-500/5 pointer-events-none border border-white/20 backdrop-brightness-105" title="UV Museum Glass Clarity"></div>
            ` : ''}
          </div>

          <div class="mt-4 text-xs text-subtle-gray flex items-center gap-4">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-success-green"></span> Custom Handcut Glass</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Raebareli Workshop Direct</span>
          </div>
        </div>

        <!-- Controls Sidebar (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- 1. Frame Material -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-primary dark:text-gray-300 mb-2">
              1. Choose Frame Style
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="updateConfiguratorParam('frameStyle', 'wood')" class="p-3 rounded-lg border text-left text-xs font-bold flex items-center gap-2 ${s.frameStyle === 'wood' ? 'border-secondary bg-blue-50 text-secondary' : 'border-gray-200'}">
                <span class="w-4 h-4 rounded-full bg-amber-900 inline-block"></span>
                Solid Wood
              </button>
              <button onclick="updateConfiguratorParam('frameStyle', 'gold')" class="p-3 rounded-lg border text-left text-xs font-bold flex items-center gap-2 ${s.frameStyle === 'gold' ? 'border-secondary bg-blue-50 text-secondary' : 'border-gray-200'}">
                <span class="w-4 h-4 rounded-full bg-amber-400 inline-block"></span>
                Gold Leaf Gilded
              </button>
              <button onclick="updateConfiguratorParam('frameStyle', 'black')" class="p-3 rounded-lg border text-left text-xs font-bold flex items-center gap-2 ${s.frameStyle === 'black' ? 'border-secondary bg-blue-50 text-secondary' : 'border-gray-200'}">
                <span class="w-4 h-4 rounded-full bg-black inline-block"></span>
                Black Aluminum
              </button>
              <button onclick="updateConfiguratorParam('frameStyle', 'acrylic')" class="p-3 rounded-lg border text-left text-xs font-bold flex items-center gap-2 ${s.frameStyle === 'acrylic' ? 'border-secondary bg-blue-50 text-secondary' : 'border-gray-200'}">
                <span class="w-4 h-4 rounded-full bg-sky-200 inline-block"></span>
                Acrylic Float
              </button>
            </div>
          </div>

          <!-- 2. Glass Protection -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-primary dark:text-gray-300 mb-2">
              2. Select Glass Protection
            </label>
            <select onchange="updateConfiguratorParam('glassType', this.value)" class="w-full p-2.5 rounded-lg border border-gray-300 text-sm font-medium">
              <option value="museum" ${s.glassType === 'museum' ? 'selected' : ''}>Museum UV Filtering Clear Glass (+40%)</option>
              <option value="anti_reflective" ${s.glassType === 'anti_reflective' ? 'selected' : ''}>Non-Glare Anti-Reflective Glass (+25%)</option>
              <option value="clear" ${s.glassType === 'clear' ? 'selected' : ''}>Standard Clear Float Glass (Base)</option>
            </select>
          </div>

          <!-- 3. Archival Mat Border -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-primary dark:text-gray-300 mb-2 flex justify-between">
              <span>3. Mat Border Width</span>
              <span class="text-secondary">${s.matWidth} Inches</span>
            </label>
            <input type="range" min="0" max="4" step="1" value="${s.matWidth}" onchange="updateConfiguratorParam('matWidth', parseInt(this.value))" class="w-full">
          </div>

          <!-- Price & Action -->
          <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <div class="text-xs text-subtle-gray">Estimated Custom Price</div>
              <div class="text-2xl font-bold text-primary dark:text-white">$${totalPrice.toFixed(2)}</div>
            </div>
            <button onclick="addCustomConfiguredToCart()" class="bg-secondary text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-secondary/90 shadow-md active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">add_shopping_cart</span>
              Add Custom Frame
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};
