'use client';

import React from 'react';

// Preset curated HSL gradient color palettes for unique user avatars
const AVATAR_PALETTES = [
  { bg: 'from-[#0F3826] to-emerald-700', text: 'text-amber-300', border: 'border-emerald-500/40' },
  { bg: 'from-blue-700 to-indigo-900', text: 'text-blue-200', border: 'border-blue-400/40' },
  { bg: 'from-amber-600 to-orange-800', text: 'text-amber-100', border: 'border-amber-400/40' },
  { bg: 'from-purple-700 to-violet-950', text: 'text-purple-200', border: 'border-purple-400/40' },
  { bg: 'from-rose-700 to-pink-900', text: 'text-rose-200', border: 'border-rose-400/40' },
  { bg: 'from-teal-700 to-cyan-900', text: 'text-cyan-200', border: 'border-cyan-400/40' },
  { bg: 'from-emerald-800 to-teal-950', text: 'text-emerald-200', border: 'border-emerald-400/40' },
  { bg: 'from-orange-700 to-red-900', text: 'text-amber-200', border: 'border-orange-400/40' },
];

/**
 * Generate deterministic palette index from string hash
 */
function getDeterministicPalette(name: string) {
  if (!name) return AVATAR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
  const cleanName = (name || 'Kisan').trim();

  // Get first letter and capitalize it
  const firstChar = cleanName.charAt(0).toUpperCase();

  const palette = getDeterministicPalette(cleanName);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs shadow-sm',
    md: 'w-9 h-9 text-sm shadow',
    lg: 'w-12 h-12 text-lg shadow-md',
    xl: 'w-16 h-16 text-2xl shadow-xl',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center font-extrabold rounded-full bg-gradient-to-br ${palette.bg} ${palette.text} border ${palette.border} ${sizeClasses} select-none transition-transform hover:scale-105 ${className}`}
      title={cleanName}
    >
      <span>{firstChar}</span>
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F3826] rounded-full" />
    </div>
  );
}
