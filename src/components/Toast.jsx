import React, { useEffect } from 'react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-surface-container-high border border-primary/50 text-on-surface px-5 py-3.5 rounded shadow-2xl animate-bounce-short">
      <span className="material-symbols-outlined text-primary text-xl">
        {type === 'error' ? 'error' : 'check_circle'}
      </span>
      <span className="text-xs font-semibold">{message}</span>
      <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}
