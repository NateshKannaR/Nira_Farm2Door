'use client';

import React from 'react';

interface VerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
  variant?: 'whatsapp' | 'instagram' | 'golden';
  tooltip?: string;
  className?: string;
}

/**
 * Premium Officially Verified Badge
 * Inspired by Instagram / WhatsApp Official Verified Account Seals
 * Features a 12-point scalloped starburst rosette with a sharp checkmark.
 */
export default function VerifiedBadge({
  size = 'md',
  showText = false,
  text = 'VERIFIED',
  variant = 'whatsapp',
  tooltip = 'Officially Verified & Audited by Mandi Governance & Quality Lab',
  className = '',
}: VerifiedBadgeProps) {
  // Size mappings
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Badge variants
  // WhatsApp: Emerald green #25D366 / #059669
  // Instagram: Vibrant azure #0095F6 / #0284C7
  // Golden: Royal Gold / Amber #F59E0B / #D97706
  const fillColors = {
    whatsapp: 'fill-[#059669] dark:fill-[#10B981]',
    instagram: 'fill-[#0095F6]',
    golden: 'fill-[#D97706]',
  };

  const textStyles = {
    whatsapp: 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white border-emerald-400/30',
    instagram: 'bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white border-blue-300/30',
    golden: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-amber-950 border-amber-300/40',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold shrink-0 select-none ${
        showText
          ? `px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase shadow-sm border ${textStyles[variant]}`
          : ''
      } ${className}`}
      title={tooltip}
    >
      {/* 12-Point Scalloped Rosette Verified Icon (Instagram / WhatsApp Official Style) */}
      <svg
        viewBox="0 0 24 24"
        className={`${iconSizes[size]} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]`}
        aria-hidden="true"
      >
        {/* Scalloped 12-point Rosette Seal */}
        <path
          className={fillColors[variant]}
          d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4z"
        />
        {/* Sharp White Center Checkmark */}
        <path
          fill="#ffffff"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2 16.2l-3.5-3.5 1.41-1.41 2.09 2.09 5.69-5.69 1.41 1.41-7.1 7.1z"
        />
      </svg>
      {showText && <span>{text}</span>}
    </span>
  );
}
