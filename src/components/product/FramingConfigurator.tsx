'use client';

import React, { useState } from 'react';
import { Upload, Check, Sliders } from 'lucide-react';
import { Product } from '@/lib/types/database';
import { useCart } from '@/lib/store/cart-context';

interface FramingConfiguratorProps {
  product: Product;
}

export function FramingConfigurator({ product }: FramingConfiguratorProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('11" x 14"');
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState('11');
  const [customHeight, setCustomHeight] = useState('14');
  const [selectedFinish, setSelectedFinish] = useState('Dark Espresso');
  const [selectedMat, setSelectedMat] = useState('White 1.5"');
  const [quantity, setQuantity] = useState(1);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const finishes = [
    { name: 'Dark Espresso', color: '#3b2f2f' },
    { name: 'Natural Oak', color: '#d2b48c' },
    { name: 'Matte White', color: '#ffffff' },
    { name: 'Matte Black', color: '#1a1a1a' },
  ];

  const matStyles = ['White 1.5"', 'Off-White 2"', 'No Mat'];
  const standardSizes = ['8" x 10"', '11" x 14"', '16" x 20"'];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleAddToCart = () => {
    const config = {
      width: isCustomSize ? Number(customWidth) : 11,
      height: isCustomSize ? Number(customHeight) : 14,
      finish: selectedFinish,
      matting: selectedMat,
      photoUrl: photoUrl || undefined
    };

    addItem(product, quantity, config);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Size Selection & Custom Dimensions Toggle */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="font-label-md text-sm text-on-surface font-bold">Size</span>
          <span className="font-caption text-xs text-secondary cursor-pointer hover:underline">
            Custom Sizing Available
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {standardSizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                setIsCustomSize(false);
              }}
              className={`py-2 px-3 border rounded-lg font-label-md text-sm transition-all text-center relative ${
                !isCustomSize && selectedSize === size
                  ? 'border-2 border-secondary bg-surface-container-low font-bold text-primary'
                  : 'border-outline-variant text-on-surface hover:border-secondary'
              }`}
            >
              {size}
              {!isCustomSize && selectedSize === size && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-secondary flex items-center justify-center rounded-bl-lg">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Sizing Panel */}
        <div className="mt-4 p-4 bg-glass-tint dark:bg-charcoal-bg rounded-lg border border-outline-variant/30">
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={isCustomSize}
              onChange={(e) => setIsCustomSize(e.target.checked)}
              className="rounded text-secondary focus:ring-secondary h-4 w-4"
            />
            <span className="font-label-md text-sm text-on-surface font-medium flex items-center gap-1">
              <Sliders className="w-4 h-4 text-secondary" /> Need custom dimensions?
            </span>
          </label>

          {isCustomSize && (
            <div className="flex gap-4 items-center pt-2">
              <div className="flex-1">
                <label className="font-caption text-xs text-on-surface-variant block mb-1">Width (in)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="w-full border border-subtle-gray rounded px-3 py-2 text-sm bg-surface outline-none focus:border-secondary"
                  min="4"
                  max="60"
                />
              </div>
              <span className="text-subtle-gray pt-5">×</span>
              <div className="flex-1">
                <label className="font-caption text-xs text-on-surface-variant block mb-1">Height (in)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="w-full border border-subtle-gray rounded px-3 py-2 text-sm bg-surface outline-none focus:border-secondary"
                  min="4"
                  max="60"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frame Finish Selector */}
      <div>
        <span className="font-label-md text-sm text-on-surface font-bold block mb-3">
          Finish: <span className="font-normal text-on-surface-variant">{selectedFinish}</span>
        </span>
        <div className="flex gap-3">
          {finishes.map((finish) => (
            <button
              key={finish.name}
              onClick={() => setSelectedFinish(finish.name)}
              style={{ backgroundColor: finish.color }}
              className={`w-10 h-10 rounded-full border-2 transition-all relative shadow-sm ${
                selectedFinish === finish.name
                  ? 'border-secondary ring-2 ring-secondary/30 scale-105'
                  : 'border-outline-variant hover:scale-105'
              }`}
              title={finish.name}
            >
              {selectedFinish === finish.name && (
                <Check className={`w-4 h-4 absolute inset-0 m-auto ${finish.name === 'Matte White' ? 'text-black' : 'text-white'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Matting Options */}
      <div>
        <span className="font-label-md text-sm text-on-surface font-bold block mb-3">Matting Style</span>
        <div className="flex flex-wrap gap-2">
          {matStyles.map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMat(mat)}
              className={`px-4 py-1.5 rounded-full font-caption text-xs cursor-pointer transition-all border ${
                selectedMat === mat
                  ? 'bg-primary text-white border-primary font-bold shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant border-outline-variant/30'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Upload Action */}
      <div className="space-y-3 pt-2">
        <label className="w-full py-3.5 border-2 border-dashed border-secondary/50 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/5 cursor-pointer transition-colors text-secondary font-label-md text-sm">
          <Upload className="w-4 h-4" />
          {photoUrl ? 'Photo Uploaded ✓ (Click to change)' : 'Upload Your Photo for Framing Preview'}
          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </label>
        {photoUrl && (
          <p className="text-xs text-success-green flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" /> High resolution photo attached for printing and framing.
          </p>
        )}
      </div>

      {/* Add to Cart Actions */}
      <div className="flex gap-3 pt-4 border-t border-outline-variant/30">
        <div className="flex border border-outline-variant rounded-lg w-1/3 overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-1/3 flex justify-center items-center text-on-surface-variant hover:bg-surface-container"
          >
            -
          </button>
          <span className="w-1/3 flex items-center justify-center font-bold text-sm bg-transparent">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-1/3 flex justify-center items-center text-on-surface-variant hover:bg-surface-container"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex-grow py-3.5 rounded-lg font-label-md text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-success-green text-white'
              : 'bg-secondary text-white hover:bg-secondary/90 shadow-secondary/20'
          }`}
        >
          {isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
