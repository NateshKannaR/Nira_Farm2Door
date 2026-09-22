'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingCart } from 'lucide-react';

export default function FloatingCartButton() {
  const { itemCount, setIsCartOpen } = useCart();
  const { language } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        id="floating-cart-btn"
        className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0F3826] via-[#144932] to-[#072115] text-amber-300 shadow-[0_10px_25px_-5px_rgba(15,56,38,0.5)] border-2 border-amber-400/40 hover:border-amber-300 hover:shadow-[0_15px_30px_-5px_rgba(15,56,38,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center backdrop-blur-xl ring-4 ring-emerald-900/15 dark:ring-emerald-400/15"
        aria-label={`Shopping Cart (${itemCount})`}
        title={`Shopping Cart (${itemCount} items)`}
      >
        {/* Ambient Radial Hover Glow */}
        <span className="absolute inset-0 rounded-full bg-amber-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-md pointer-events-none" />

        {/* Fully visible, centered Supermarket Cart Icon - Never obstructed */}
        <ShoppingCart className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-amber-400 group-hover:scale-105 transition-transform duration-200 drop-shadow-sm shrink-0" />

        {/* Compact, Ultra-Clear Notification Badge positioned on outer perimeter */}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#DC2626] text-white font-extrabold text-[11px] leading-none rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#072115] shadow-md shadow-red-900/40 tracking-tight transform transition-transform duration-150 pointer-events-none">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
}
