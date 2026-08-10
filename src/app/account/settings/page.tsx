'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/store/auth-context';
import { User, Lock, MapPin, CheckCircle } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '+91 94150 65470');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-8">
      <div>
        <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
          Account Settings
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant mt-1">
          Manage your personal details, default shipping address, and password preferences.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 bg-success-green/10 text-success-green rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Account settings updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
        <form onSubmit={handleSaveProfile} className="lg:col-span-8 space-y-6">
          {/* Personal Information */}
          <section className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h2 className="font-headline-md text-base font-bold text-primary flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body-md">
              <div>
                <label className="block text-on-surface font-bold mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-on-surface font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'customer@example.com'}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface-container-high opacity-70 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-on-surface font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
            </div>
          </section>

          {/* Saved Delivery Address */}
          <section className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h2 className="font-headline-md text-base font-bold text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Saved Shipping Address
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
                <p className="font-bold text-sm text-on-surface">{displayName || 'Customer'}</p>
                <p className="text-on-surface-variant mt-1">
                  Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony<br />
                  Raebareli-229001, Uttar Pradesh, India
                </p>
              </div>
            </div>
          </section>

          {/* Change Password */}
          <section className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h2 className="font-headline-md text-base font-bold text-primary flex items-center gap-2">
              <Lock className="w-5 h-5" /> Security & Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-on-surface font-bold mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-on-surface font-bold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="bg-secondary text-white px-6 py-3 rounded-lg font-label-md text-sm font-bold hover:bg-secondary/90 shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
