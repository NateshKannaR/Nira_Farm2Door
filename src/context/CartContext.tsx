'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const addToCart = (newItem: CartItem) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.listingId === newItem.listingId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantityKg += newItem.quantityKg;
        return updated;
      }
      return [...prevCart, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (listingId: number | string) => {
    setCart((prevCart) => prevCart.filter((i) => i.listingId !== listingId));
  };

  const updateQuantity = (listingId: number | string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(listingId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.listingId === listingId ? { ...i, quantityKg: qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const subtotalPaise = cart.reduce(
    (sum, item) => sum + Math.round(item.pricePaisePerKg * item.quantityKg),
    0
  );
  const logisticsFeePaise = Math.round(subtotalPaise * 0.04); // 4% Direct Logistics Pool Fee
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
