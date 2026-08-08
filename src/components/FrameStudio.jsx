import React, { useState, useRef } from 'react';
import { apiFetch } from '../api';

const FRAME_MATERIALS = [
  { id: 'walnut', name: 'Solid Natural Walnut', color: '#4a2c11', borderStyle: 'solid', borderWidth: 24, pricePerSqInch: 1.2, bgPattern: 'linear-gradient(45deg, #3d230d, #5a3819)' },
  { id: 'black-metal', name: 'Matte Black Aluminum', color: '#1a1a1a', borderStyle: 'solid', borderWidth: 16, pricePerSqInch: 0.9, bgPattern: 'linear-gradient(135deg, #111, #2a2a2a)' },
  { id: 'acrylic', name: 'Luminous Acrylic Block', color: 'rgba(255, 255, 255, 0.15)', borderStyle: 'solid', borderWidth: 20, pricePerSqInch: 1.5, bgPattern: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))' },
  { id: 'gold-leaf', name: 'Royal Gold Leaf', color: '#d4af37', borderStyle: 'solid', borderWidth: 24, pricePerSqInch: 1.6, bgPattern: 'linear-gradient(45deg, #b8860b, #ffd700, #daa520)' },
  { id: 'canvas', name: 'Gallery Wrapped Canvas', color: '#e2d7c5', borderStyle: 'solid', borderWidth: 12, pricePerSqInch: 1.1, bgPattern: 'linear-gradient(135deg, #d4c5b0, #eae2d6)' }
];

const MAT_COLORS = [
  { id: 'cream', name: 'Off-White Cream', hex: '#f7f5f0' },
  { id: 'white', name: 'Pure Snow White', hex: '#ffffff' },
  { id: 'black', name: 'Midnight Black', hex: '#181818' },
  { id: 'none', name: 'No Mat Board', hex: 'transparent' }
];

const PRESET_SIZES = [
  { name: '8 x 10 inch', w: 8, h: 10, basePrice: 899 },
  { name: '12 x 16 inch', w: 12, h: 16, basePrice: 1299 },
  { name: '16 x 20 inch', w: 16, h: 20, basePrice: 1799 },
  { name: '24 x 36 inch', w: 24, h: 36, basePrice: 2899 }
];

export function FrameStudio({ onAddToCart, initialProduct, onClose }) {
  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80');
  const [frameMaterial, setFrameMaterial] = useState(FRAME_MATERIALS[0]);
  const [matColor, setMatColor] = useState(MAT_COLORS[0]);
  const [matWidth, setMatWidth] = useState(1.5); // inches
  const [selectedSize, setSelectedSize] = useState(PRESET_SIZES[1]);
  
  // Image Transformations
  const [zoom, setZoom] = useState(100); // percentage
  const [rotation, setRotation] = useState(0); // degrees
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Dynamic Price Calculation
  const calculatePrice = () => {
    const area = selectedSize.w * selectedSize.h;
    const materialCost = area * frameMaterial.pricePerSqInch;
    const matCost = matColor.id !== 'none' ? Math.round(matWidth * 100) : 0;
    return Math.round(selectedSize.basePrice + materialCost + matCost);
  };

  const calculatedPrice = calculatePrice();

  // Handle Photo Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    apiFetch('/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setIsUploading(false);
        if (data.url) {
          setSelectedImage(data.url);
          setZoom(100);
          setPan({ x: 0, y: 0 });
        }
      })
      .catch(err => {
        setIsUploading(false);
        // Fallback local data URL if backend server is starting
        const reader = new FileReader();
        reader.onload = (event) => setSelectedImage(event.target.result);
        reader.readAsDataURL(file);
      });
  };

  // Add Customized Frame to Cart
  const handleAddToCart = () => {
    const customFrameItem = {
      id: `custom-frame-${Date.now()}`,
      productId: initialProduct ? initialProduct.id : 'custom-bespoke-frame',
      name: `${frameMaterial.name} Frame (${selectedSize.name})`,
      price: calculatedPrice,
      quantity: 1,
      image: selectedImage,
      customImage: selectedImage,
      customConfig: {
        material: frameMaterial.name,
        size: selectedSize.name,
        matBoard: matColor.name,
        matWidth: `${matWidth} inch`,
        zoom: `${zoom}%`,
        rotation: `${rotation}°`
      }
    };
    onAddToCart(customFrameItem);
  };

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-outline-variant">
        <div>
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Interactive Studio</span>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">Bespoke Frame Preview Studio</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Upload your artwork or photograph, customize crop & dimensions, pick frame materials, and preview live.
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="mt-4 md:mt-0 text-on-surface-variant hover:text-primary flex items-center space-x-1 text-xs">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Catalog</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT / CENTER: Interactive Canvas Preview Area */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded p-6 flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
          
          {/* Virtual Wall Background & Frame Display Container */}
          <div className="relative flex items-center justify-center p-8 w-full max-w-lg transition-all duration-300">
            
            {/* Outer Frame Border (Simulating Real Material Grain) */}
            <div
              className="shadow-2xl transition-all duration-300 relative flex items-center justify-center overflow-hidden"
              style={{
                background: frameMaterial.bgPattern,
                padding: `${frameMaterial.borderWidth}px`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.5)'
              }}
            >
              {/* Inner Mat Board */}
              <div
                className="w-full h-full transition-all duration-300 flex items-center justify-center overflow-hidden relative"
                style={{
                  backgroundColor: matColor.hex,
                  padding: matColor.id !== 'none' ? `${matWidth * 16}px` : '0px',
                  boxShadow: matColor.id !== 'none' ? 'inset 0 0 8px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                {/* Uploaded User Photo Canvas with Zoom & Rotation */}
                <div className="relative w-64 h-80 overflow-hidden bg-black/40 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Custom Upload Preview"
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg) translate(${pan.x}px, ${pan.y}px)`
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Photo Adjustment Toolbar (Zoom, Rotate, Re-upload) */}
          <div className="mt-6 w-full max-w-md bg-surface-container-high p-4 rounded border border-outline-variant/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-on-surface-variant font-label-bold">Zoom:</span>
              <input
                type="range"
                min="50"
                max="250"
                value={zoom}
                onChange={(e) => setZoom(parseInt(e.target.value, 10))}
                className="accent-primary cursor-pointer w-24"
              />
              <span className="text-primary font-semibold w-8">{zoom}%</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="bg-surface-container-low border border-outline-variant hover:border-primary text-on-surface p-1.5 rounded"
                title="Rotate 90 degrees"
              >
                <span className="material-symbols-outlined text-sm">rotate_right</span>
              </button>
              <button
                onClick={() => { setZoom(100); setRotation(0); setPan({ x: 0, y: 0 }); }}
                className="bg-surface-container-low border border-outline-variant hover:border-primary text-on-surface p-1.5 rounded"
                title="Reset adjustments"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={isUploading}
              className="bg-primary text-on-primary font-label-bold text-xs uppercase px-3 py-1.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-1 font-bold"
            >
              <span className="material-symbols-outlined text-sm">cloud_upload</span>
              <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
            </button>
          </div>

        </div>

        {/* RIGHT: Frame & Mat Customization Control Options */}
        <div className="lg:col-span-5 space-y-6 bg-surface-container-low border border-outline-variant p-6 rounded">
          
          {/* 1. Frame Material Selector */}
          <div>
            <h3 className="font-headline font-semibold text-sm text-primary uppercase mb-3 tracking-wider">
              1. Choose Frame Material & Finish
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {FRAME_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setFrameMaterial(mat)}
                  className={`flex items-center justify-between p-3 rounded border transition-all text-left text-xs ${
                    frameMaterial.id === mat.id
                      ? 'border-primary bg-primary/10 text-on-surface font-semibold'
                      : 'border-outline-variant/60 bg-surface-container-high text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-5 h-5 rounded border border-white/20 shadow-sm"
                      style={{ background: mat.bgPattern }}
                    />
                    <span>{mat.name}</span>
                  </div>
                  {frameMaterial.id === mat.id && (
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Mat Board Color & Width */}
          <div>
            <h3 className="font-headline font-semibold text-sm text-primary uppercase mb-3 tracking-wider">
              2. Mat Board Customization
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {MAT_COLORS.map((mc) => (
                <button
                  key={mc.id}
                  onClick={() => setMatColor(mc)}
                  className={`flex items-center space-x-2 p-2 rounded border text-xs transition-all ${
                    matColor.id === mc.id
                      ? 'border-primary bg-primary/10 text-on-surface font-semibold'
                      : 'border-outline-variant/60 bg-surface-container-high text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-gray-500"
                    style={{ backgroundColor: mc.hex }}
                  />
                  <span>{mc.name}</span>
                </button>
              ))}
            </div>

            {matColor.id !== 'none' && (
              <div className="flex items-center justify-between text-xs bg-surface-container-high p-3 rounded border border-outline-variant">
                <span className="text-on-surface-variant font-label-bold">Mat Border Width:</span>
                <div className="flex items-center space-x-2">
                  {[1, 1.5, 2, 3].map((w) => (
                    <button
                      key={w}
                      onClick={() => setMatWidth(w)}
                      className={`px-2 py-1 rounded text-xs ${
                        matWidth === w ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface border border-outline-variant'
                      }`}
                    >
                      {w}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Frame Size & Dimensions */}
          <div>
            <h3 className="font-headline font-semibold text-sm text-primary uppercase mb-3 tracking-wider">
              3. Frame Print Dimensions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_SIZES.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded border text-xs text-left transition-all ${
                    selectedSize.name === size.name
                      ? 'border-primary bg-primary/10 text-on-surface font-semibold'
                      : 'border-outline-variant/60 bg-surface-container-high text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold">{size.name}</div>
                  <div className="text-[10px] text-on-surface-variant/80">Base ₹{size.basePrice}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Add to Cart Action */}
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant uppercase font-label-bold block">Custom Frame Total</span>
              <span className="font-headline font-bold text-2xl text-primary">₹{calculatedPrice}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-6 py-3.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              <span>Add Custom Frame</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
