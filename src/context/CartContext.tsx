'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { deliveryFeePaise } from '@/lib/orderPricing';
import { useStoredList } from '@/hooks/useStoredList';
import { useAuth } from './AuthContext';

export interface CartItem {
  listingId: number | string;
  cropName: string;
  pricePaisePerKg: number;
  quantityKg: number;
  grade: string;
  farmerName: string;
  location: string;
  imageUrl?: string;
  unit?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (listingId: number | string) => void;
  updateQuantity: (listingId: number | string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotalPaise: number;
  logisticsFeePaise: number;
  totalPaise: number;
  itemCount: number;
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return (typeof item.listingId === 'string' || typeof item.listingId === 'number')
    && typeof item.cropName === 'string'
    && typeof item.pricePaisePerKg === 'number' && Number.isFinite(item.pricePaisePerKg)
    && item.pricePaisePerKg >= 0
    && typeof item.quantityKg === 'number' && Number.isFinite(item.quantityKg)
    && item.quantityKg > 0;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [cart, setCart] = useStoredList(user ? `nira_cart_${user.id}` : null, isCartItem);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const addToCart = (newItem: CartItem) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!isCartItem(newItem)) return;

    setCart((prevCart) => {
      if (!prevCart.some((item) => String(item.listingId) === String(newItem.listingId))) {
        return [...prevCart, newItem];
      }
      return prevCart.map((item) => String(item.listingId) === String(newItem.listingId)
        ? { ...item, ...newItem, quantityKg: item.quantityKg + newItem.quantityKg }
        : item);
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (listingId: number | string) => {
    setCart((prevCart) => prevCart.filter((i) => String(i.listingId) !== String(listingId)));
  };

  const updateQuantity = (listingId: number | string, qty: number) => {
    if (!Number.isFinite(qty)) return;
    if (qty <= 0) {
      removeFromCart(listingId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (String(i.listingId) === String(listingId) ? { ...i, quantityKg: qty } : i))
    );
  };

  const clearCart = () => setCart(() => []);

  const subtotalPaise = cart.reduce(
    (sum, item) => sum + Math.round(item.pricePaisePerKg * item.quantityKg),
    0
  );
  const logisticsFeePaise = cart.length > 0 ? deliveryFeePaise('EXPRESS') : 0;
  const totalPaise = subtotalPaise + logisticsFeePaise;
  const itemCount = cart.reduce((sum, item) => sum + item.quantityKg, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotalPaise,
        logisticsFeePaise,
        totalPaise,
        itemCount,
      }}
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
