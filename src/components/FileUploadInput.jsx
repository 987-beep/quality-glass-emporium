import React, { useState, useRef } from 'react';
import { apiFetch, getAssetUrl } from '../api';

export function FileUploadInput({
  label = "Upload Image File",
  value = "",
  onChange,
  token,
  aspectHint = "PNG, JPG, WEBP format (Optimal size: 80 KB to 1.5 MB)",
  multiple = false,
  onMultipleChange
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      const MAX_BYTES = 1.5 * 1024 * 1024; // 1.5 MB
      const TARGET_DIM = 1600;

      // If file is already under 1.5MB and above 80KB, keep it
      if (file.size <= MAX_BYTES && file.size >= 80 * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > TARGET_DIM || height > TARGET_DIM) {
            if (width > height) {
              height = Math.round((height * TARGET_DIM) / width);
              width = TARGET_DIM;
            } else {
              width = Math.round((width * TARGET_DIM) / height);
              height = TARGET_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Standardize image quality to keep output between 80KB and 1.5MB
          const quality = file.size > MAX_BYTES ? 0.80 : 0.90;
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const compressedFile = new File(
                [blob],
                (file.name || 'product-photo').replace(/\.[^/.]+$/, '') + '.jpg',
                { type: 'image/jpeg', lastModified: Date.now() }
              );
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMsg('');

    try {
      if (multiple && onMultipleChange) {
        const uploadedUrls = [];
        for (let i = 0; i < files.length; i++) {
          const rawFile = files[i];
          const fileToUpload = await compressImageFile(rawFile);
          const formData = new FormData();
          formData.append('photo', fileToUpload);

          try {
            const res = await apiFetch('/api/upload', {
              method: 'POST',
              body: formData,
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (res.ok) {
              const data = await res.json();
              uploadedUrls.push(data.url);
            } else {
              const base64 = await readFileAsBase64(fileToUpload);
              if (base64) uploadedUrls.push(base64);
            }
          } catch {
            const base64 = await readFileAsBase64(fileToUpload);
            if (base64) uploadedUrls.push(base64);
          }
        }
        onMultipleChange(uploadedUrls);
      } else {
        const rawFile = files[0];
        const fileToUpload = await compressImageFile(rawFile);
        const base64 = await readFileAsBase64(fileToUpload);

        // Try posting to backend upload endpoint to persist on server disk as well
        try {
          const formData = new FormData();
          formData.append('photo', fileToUpload);
          const res = await apiFetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          if (res.ok) {
            const data = await res.json();
            // Pass server upload URL if HTTP, or robust base64 Data URL if relative
            if (data.url && data.url.startsWith('http')) {
              onChange(data.url);
            } else {
              onChange(base64 || data.url);
            }
          } else {
            onChange(base64);
          }
        } catch {
          onChange(base64);
        }
      }
    } catch (err) {
      console.error('File upload error:', err);
      setErrorMsg('Failed to process or upload image file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-on-surface font-semibold text-xs mb-1">{label}</label>}

      {value ? (
        <div className="relative group border border-outline-variant rounded overflow-hidden bg-surface-container-high p-2.5 flex items-center space-x-3 shadow-inner">
          <img
            src={getAssetUrl(value)}
            alt="Uploaded Preview"
            className="w-16 h-16 object-cover rounded border border-outline-variant shrink-0 bg-background"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest block flex items-center space-x-1">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              <span>Image File Uploaded</span>
            </span>
            <span className="text-[11px] text-on-surface-variant font-mono truncate block mt-0.5" title={value}>
              {value}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="bg-error/10 hover:bg-error/20 text-error p-2 rounded text-xs flex items-center space-x-1 font-bold shrink-0 transition-colors"
            title="Remove Image"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-outline-variant/80 hover:border-primary hover:bg-surface-container-high/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleUploadFiles(e.target.files)}
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-1.5 text-primary py-2">
              <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
              <span className="text-xs font-bold uppercase tracking-wider">Uploading Image File...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5 text-on-surface-variant py-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
              </div>
              <div className="text-xs font-semibold text-on-surface">
                <span className="text-primary underline font-bold">Choose Image File from Device</span> or Drag & Drop
              </div>
              <p className="text-[10px] text-on-surface-variant/80">{aspectHint}</p>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="text-[10px] text-error font-semibold flex items-center space-x-1">
          <span className="material-symbols-outlined text-xs">error</span>
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
