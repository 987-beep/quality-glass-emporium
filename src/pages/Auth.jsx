import React, { useState } from 'react';
import { apiFetch } from '../api';

export function Auth({ onLoginSuccess, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name, username, password } 
      : { username, password };

    apiFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const text = await res.text().catch(() => '');
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }

        if (!data) {
          throw new Error('Authentication server unavailable or updating. Please try again in a few seconds.');
        }
        return { ok: res.ok, data };
      })
      .then(({ ok, data }) => {
        setIsLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else if (!ok) {
          setErrorMsg(data.message || 'Authentication failed. Please check credentials.');
        } else {
          onLoginSuccess(data);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMsg(err.message || 'Authentication server unavailable. Please try again.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-center justify-center p-margin-mobile">
      <div className="bg-surface-container-low border border-outline-variant rounded p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}

        {/* Header Title */}
        <div className="text-center">
          <span className="text-xs uppercase font-label-bold text-primary tracking-widest block">Quality Glass Emporium</span>
          <h2 className="font-headline font-bold text-2xl text-on-surface mt-1">
            {isRegister ? 'Create New Account' : 'User & Staff Portal Sign In'}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            {isRegister 
              ? 'Choose a unique Username ID to register your customer account.'
              : 'Enter your registered Username ID and Password to sign in.'
            }
          </p>
        </div>

        {errorMsg && (
          <div className="bg-error/10 border border-error text-error text-xs p-3 rounded font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Full Name for Registration */}
          {isRegister && (
            <div>
              <label className="block text-on-surface mb-1 font-semibold">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Priyesh Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded focus:outline-none focus:border-primary font-medium"
              />
            </div>
          )}

          {/* Username Input Field */}
          <div>
            <label className="block text-on-surface mb-1 font-semibold">
              {isRegister ? 'Choose Username ID *' : 'User ID / Username *'}
            </label>
            <input
              type="text"
              required
              placeholder={isRegister ? 'e.g. @priyesh_sharma' : 'Enter User ID or Username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded focus:outline-none focus:border-primary font-mono"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-on-surface mb-1 font-semibold">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded focus:outline-none focus:border-primary font-mono"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary font-headline font-bold text-xs uppercase py-3.5 rounded hover:bg-primary-fixed transition-all font-bold shadow-lg shadow-primary/20"
          >
            {isLoading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center text-xs text-on-surface-variant pt-3 border-t border-outline-variant">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => { setIsRegister(false); setErrorMsg(''); }} 
                className="text-primary font-bold hover:underline"
              >
                Sign In Now
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button 
                onClick={() => { setIsRegister(true); setErrorMsg(''); }} 
                className="text-primary font-bold hover:underline"
              >
                Register New User Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
