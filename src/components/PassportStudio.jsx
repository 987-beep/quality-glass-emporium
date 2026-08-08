import React, { useState, useRef } from 'react';
import { apiFetch } from '../api';

const PASSPORT_PRESETS = [
  { id: 'in-passport', name: 'India Passport (35 x 45 mm)', desc: 'Standard White Background, 80% Face Coverage' },
  { id: 'us-visa', name: 'US Visa / Passport (2 x 2 inch)', desc: 'Square 51x51 mm Format, White Background' },
  { id: 'schengen', name: 'Schengen Europe Visa (35 x 45 mm)', desc: 'European Standard Biometric Compliance' },
  { id: 'custom', name: 'Custom ID Print', desc: 'Custom Dimensions for College/Corporate ID' }
];

const PACK_OPTIONS = [
  { count: 8, name: '8 Photos Pack', price: 199 },
  { count: 16, name: '16 Photos Pack', price: 299 },
  { count: 32, name: '32 Mega Pack', price: 499 }
];

export function PassportStudio({ onAddToCart, onClose }) {
  const [selectedPhoto, setSelectedPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
  const [selectedPreset, setSelectedPreset] = useState(PASSPORT_PRESETS[0]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [selectedPack, setSelectedPack] = useState(PACK_OPTIONS[0]);
  const [paperFinish, setPaperFinish] = useState('Glossy Archival');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
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
        if (data.url) setSelectedPhoto(data.url);
      })
      .catch(err => {
        setIsUploading(false);
        const reader = new FileReader();
        reader.onload = (ev) => setSelectedPhoto(ev.target.result);
        reader.readAsDataURL(file);
      });
  };

  const handleAddToCart = () => {
    const passportItem = {
      id: `passport-set-${Date.now()}`,
      productId: 'prod-6',
      name: `Biometric Passport Photos (${selectedPreset.name})`,
      price: selectedPack.price,
      quantity: 1,
      image: selectedPhoto,
      customImage: selectedPhoto,
      customConfig: {
        spec: selectedPreset.name,
        pack: selectedPack.name,
        finish: paperFinish,
        backgroundColor: bgColor === '#ffffff' ? 'White' : 'Light Blue'
      }
    };
    onAddToCart(passportItem);
  };

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-outline-variant">
        <div>
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest">Digital Photo Studio</span>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">Biometric Passport & Visa Photo Studio</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Upload your portrait, select official international visa compliance specs, and get archival studio prints delivered.
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
        
        {/* Left: Passport Grid Live Sheet Preview */}
        <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/60 rounded p-6 flex flex-col items-center justify-center min-h-[440px]">
          
          <div className="bg-white p-4 shadow-xl border border-gray-300 rounded max-w-md w-full">
            <div className="text-center text-[10px] text-gray-500 font-semibold mb-3 border-b border-gray-200 pb-2">
              Quality Glass Emporium • Biometric Passport Print Sheet ({selectedPack.count} Copies)
            </div>

            {/* Passport Grid Preview */}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: Math.min(selectedPack.count, 12) }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 overflow-hidden border border-gray-400 relative shadow-sm flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <img
                    src={selectedPhoto}
                    alt={`Passport Copy ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {selectedPack.count > 12 && (
              <div className="text-center text-[10px] text-gray-500 mt-2 font-medium">
                + {selectedPack.count - 12} additional prints on 2nd sheet
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="mt-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={isUploading}
              className="bg-primary text-on-primary font-label-bold text-xs uppercase px-6 py-2.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 font-bold"
            >
              <span className="material-symbols-outlined text-sm">photo_camera</span>
              <span>{isUploading ? 'Uploading...' : 'Upload Your Photo'}</span>
            </button>
          </div>

        </div>

        {/* Right: Specifications & Options */}
        <div className="lg:col-span-6 space-y-6 bg-surface-container-low border border-outline-variant p-6 rounded">
          
          {/* Preset Standard Selector */}
          <div>
            <h3 className="font-headline font-semibold text-sm text-primary uppercase mb-3 tracking-wider">
              1. Passport & Visa Preset Specification
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {PASSPORT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-3 rounded border text-left text-xs transition-all ${
                    selectedPreset.id === preset.id
                      ? 'border-primary bg-primary/10 text-on-surface font-semibold'
                      : 'border-outline-variant/60 bg-surface-container-high text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold text-on-surface">{preset.name}</div>
                  <div className="text-[10px] text-on-surface-variant/80 mt-0.5">{preset.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Background Color Option */}
          <div>
            <h3 className="font-headline font-semibold text-sm text-primary uppercase mb-3 tracking-wider">
              2. Background Adjustment
            </h3>
            <div className="flex items-center space-x-3 text-xs">
              <button
                onClick={() => setBgColor('#ffffff')}
                className={`flex items-center space-x-2 px-3 py-2 rounded border ${
                  bgColor === '#ffffff' ? 'border-primary bg-primary/10 font-bold' : 'border-outline-variant bg-surface-container-high'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white border border-gray-400" />
                <span>White Background</span>
              </button>

              <button
                onClick={() => setBgColor('#3b82f6')}
                className={`flex items-center space-x-2 px-3 py-2 rounded border ${
                  bgColor === '#3b82f6' ? 'border-primary bg-primary/10 font-bold' : 'border-outline-variant bg-surface-container-high'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-blue-500 border border-gray-400" />
                <span>Light Blue Background</span>
              </button>
            </div>
          </div>

          {/* Quantity Pack Selector */}
          <div>
            <h3 className="font-headline font-semibold text-sm text-primary uppercase mb-3 tracking-wider">
              3. Select Print Pack Quantity
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {PACK_OPTIONS.map((pack) => (
                <button
                  key={pack.count}
                  onClick={() => setSelectedPack(pack)}
                  className={`p-3 rounded border text-center text-xs transition-all ${
                    selectedPack.count === pack.count
                      ? 'border-primary bg-primary/10 text-on-surface font-bold'
                      : 'border-outline-variant/60 bg-surface-container-high text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <div className="font-bold text-sm text-primary">{pack.name}</div>
                  <div className="text-xs font-semibold mt-1">₹{pack.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Paper Finish */}
          <div>
            <h3 className="font-headline font-semibold text-sm text-primary uppercase mb-2 tracking-wider">
              4. Studio Photo Paper Finish
            </h3>
            <div className="flex space-x-2 text-xs">
              {['Glossy Archival', 'Matte Silk', 'Laminated Shield'].map((finish) => (
                <button
                  key={finish}
                  onClick={() => setPaperFinish(finish)}
                  className={`px-3 py-1.5 rounded border ${
                    paperFinish === finish ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high text-on-surface border-outline-variant'
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>

          {/* Action Total */}
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant uppercase font-label-bold block">Pack Total Price</span>
              <span className="font-headline font-bold text-2xl text-primary">₹{selectedPack.price}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-6 py-3.5 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              <span>Add Passport Pack to Cart</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
