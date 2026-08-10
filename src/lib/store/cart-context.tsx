'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CartCustomConfig } from '../types/database';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, config?: CartCustomConfig) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('qge_cart_items');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('qge_cart_items', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [items]);

  const addItem = (product: Product, quantity: number = 1, config?: CartCustomConfig) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product_id === product.id && JSON.stringify(i.custom_config) === JSON.stringify(config || {})
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        cart_id: 'default-cart',
        product_id: product.id,
        quantity,
        custom_config: config,
        product
      };

      return [...prev, newItem];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.sale_price || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
