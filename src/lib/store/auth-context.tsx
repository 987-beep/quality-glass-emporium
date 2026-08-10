'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types/database';
import { SEED_ADMINS } from '../seed-data';

export interface UserSession {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('qge_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    }
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase().replace(/^@/, '');

    // Check seed administrator credentials
    const adminAccount = SEED_ADMINS.find(
      (a) =>
        (a.username.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId) &&
        a.password === password
    );

    if (adminAccount) {
      const adminSession: UserSession = {
        id: `admin-${cleanId}`,
        email: adminAccount.email,
        displayName: adminAccount.displayName,
        role: 'admin'
      };
      setUser(adminSession);
      localStorage.setItem('qge_auth_user', JSON.stringify(adminSession));
      return { success: true };
    }

    // Customer login check
    try {
      const savedUsersRaw = localStorage.getItem('qge_customer_users');
      const savedUsers: any[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const match = savedUsers.find(
        (u) => u.email.toLowerCase() === cleanId && u.password === password
      );

      if (match) {
        const customerSession: UserSession = {
          id: match.id,
          email: match.email,
          displayName: match.displayName,
          role: 'customer',
          phone: match.phone
        };
        setUser(customerSession);
        localStorage.setItem('qge_auth_user', JSON.stringify(customerSession));
        return { success: true };
      }
    } catch (e) {
      console.error('Error during login check:', e);
    }

    return { success: false, error: 'Invalid credentials. Please check your username/email and password.' };
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    // Prevent registering with admin identifiers
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.includes('kaatya6547') || cleanEmail.includes('ajmal6547')) {
      return { success: false, error: 'Registration not allowed with administrative identifiers.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      displayName: name,
      password,
      phone: phone || '',
      role: 'customer' as const
    };

    try {
      const savedUsersRaw = localStorage.getItem('qge_customer_users');
      const savedUsers: any[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      if (savedUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email address already exists.' };
      }

      savedUsers.push(newUser);
      localStorage.setItem('qge_customer_users', JSON.stringify(savedUsers));

      const customerSession: UserSession = {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        role: 'customer',
        phone: newUser.phone
      };

      setUser(customerSession);
      localStorage.setItem('qge_auth_user', JSON.stringify(customerSession));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qge_auth_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
