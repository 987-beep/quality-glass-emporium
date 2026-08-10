'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, User, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/store/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect
  if (user) {
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/account');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        const res = await register(fullName, identifier, password, phone);
        if (res.success) {
          router.push('/account');
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await login(identifier, password);
        if (res.success) {
          // Redirect based on login handle
          const clean = identifier.toLowerCase();
          if (clean.includes('kaatya6547') || clean.includes('ajmal6547')) {
            router.push('/admin/dashboard');
          } else {
            router.push('/account');
          }
        } else {
          setError(res.error || 'Invalid username/email or password');
        }
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-primary dark:text-primary-fixed">
            {isRegisterMode ? 'Create Customer Account' : 'Welcome Back'}
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            {isRegisterMode
              ? 'Sign up to track custom framing orders and saved shipping addresses.'
              : 'Sign in to access your order history or administrative workspace.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-error-container text-error rounded-xl text-xs font-medium border border-error/20">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-outline-variant/30 shadow-lg space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {isRegisterMode ? 'Email Address' : 'Username or Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type={isRegisterMode ? 'email' : 'text'}
                required
                placeholder={isRegisterMode ? 'name@example.com' : 'e.g. @kaatya6547 or email'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 94150 65470"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-outline-variant rounded-lg bg-surface outline-none focus:border-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-3 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : isRegisterMode ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-on-surface-variant">
            {isRegisterMode ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setError(null); }}
                  className="text-secondary font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(true); setError(null); }}
                  className="text-secondary font-bold hover:underline"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </form>

        {/* Admin Login Info Box */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant space-y-1">
          <p className="font-bold text-primary flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-secondary" /> Administrator Sign In
          </p>
          <p className="text-[11px] leading-tight">
            Store administrators (Developer / Owner) can sign in using their registered handles (e.g. <code>@kaatya6547</code> or <code>@Ajmal6547</code>).
          </p>
        </div>
      </div>
    </div>
  );
}
