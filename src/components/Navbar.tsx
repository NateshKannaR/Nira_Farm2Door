'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import UserAvatar from './UserAvatar';
import {
  Leaf,
  ShoppingBag,
  Globe,
  LogIn,
  LogOut,
  Languages,
  ChevronDown,
  Check,
  Sun,
  Moon,
  ShieldCheck,
  Package,
  Sprout,
  Truck,
  Settings,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface NavbarProps {
  onOpenCart?: () => void;
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    t,
    setIsTranslatorOpen,
    supportedLanguages
  } = useLanguage();
  const { role, setRole, userName, isDeveloperMode } = useRole();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname === '/farmer') setRole('FARMER');
    else if (pathname === '/fpo') setRole('FPO');
    else if (pathname === '/buyer') setRole('BUYER');
    else if (pathname === '/hub') setRole('HUB_OPERATOR');
    else if (pathname === '/transporter') setRole('TRANSPORTER');
    else if (pathname === '/admin') setRole('ADMIN');
  }, [pathname, setRole]);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangDropdownOpen(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentLangMeta =
    supportedLanguages.find((l) => l.code === language) ||
    supportedLanguages.find((l) => l.code === 'en') ||
    supportedLanguages[0];

  return (
    <header className="sticky top-0 z-[100] w-full backdrop-blur-2xl backdrop-saturate-200 bg-[#FAF5EB]/90 dark:bg-[#07170f]/90 border-b border-emerald-900/15 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200">
      {/* Background ambient glow container with overflow-hidden so orbs don't bleed outside the navbar boundary */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-12 left-[15%] w-72 h-28 bg-emerald-500/25 dark:bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -top-12 right-[15%] w-72 h-28 bg-amber-500/25 dark:bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-96 h-16 bg-teal-500/20 dark:bg-teal-400/15 rounded-full blur-2xl" />
      </div>

      {/* Top Banner with Frosted Glass */}
      <div className="relative z-10 bg-[#0F3826]/85 dark:bg-[#040e09]/85 text-amber-200 text-[10px] sm:text-xs py-1 px-3 sm:px-8 border-b border-emerald-500/20 backdrop-blur-md flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 font-extrabold rounded-md text-[9px] sm:text-[10px] border border-amber-400/30">
            SIH 2026 PS 26033
          </span>
          <span className="truncate hidden sm:inline text-amber-100">{t.subTitle}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-xs shrink-0">
          {isDeveloperMode && (
            <span className="px-1.5 py-0.5 bg-amber-500/25 text-amber-300 font-extrabold rounded-md text-[9px] sm:text-[10px] border border-amber-400/40 flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              ⚡ DEV GOD MODE
            </span>
          )}
          <span className="truncate max-w-[150px] sm:max-w-none">
            Active Role: <strong className="text-amber-300">{userName ? `${userName} (${role})` : role}</strong>
          </span>
        </div>
      </div>

      {/* Main Navbar Row with Frosted Glass - overflow is visible so dropdowns & profile popups render freely above page content */}
      <div className="relative z-20 w-full px-2.5 sm:px-8 lg:px-12 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-3 bg-white/35 dark:bg-black/20 backdrop-blur-md max-w-full">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-amber-200 shadow-md group-hover:scale-105 transition shrink-0">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-xl text-emerald-950 dark:text-amber-100 leading-none tracking-tight">
              {t.appName}
            </h1>
            <span className="text-[9px] sm:text-[10px] text-amber-800 dark:text-amber-400 font-semibold leading-none hidden xs:block">
              {t.subTitle || 'Kisan Diwas Agri-Tech Platform'}
            </span>
          </div>
        </Link>

        {/* Desktop 6 Role Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-emerald-950/50 p-1 rounded-2xl border border-emerald-900/10 dark:border-white/10 text-xs font-bold backdrop-blur-lg shadow-xs">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
            }`}
          >
            {t.navHome}
          </Link>

          <Link
            href="/farmer"
            onClick={() => setRole('FARMER')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/farmer'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
            }`}
          >
            {t.navFarmer}
          </Link>

          <Link
            href="/fpo"
            onClick={() => setRole('FPO')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/fpo'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
            }`}
          >
            {t.navFPO}
          </Link>

          <Link
            href="/buyer"
            onClick={() => setRole('BUYER')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/buyer'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
            }`}
          >
            {t.navBuyer}
          </Link>

          <Link
            href="/hub"
            onClick={() => setRole('HUB_OPERATOR')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/hub'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
            }`}
          >
            {t.navHub}
          </Link>

          <Link
            href="/transporter"
            onClick={() => setRole('TRANSPORTER')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/transporter'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
            }`}
          >
            {t.navTransporter}
          </Link>

          <Link
            href="/admin"
            onClick={() => setRole('ADMIN')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/admin'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
            }`}
          >
            {t.navAdmin}
          </Link>

          <Link
            href="/forecast"
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              pathname === '/forecast'
                ? 'bg-amber-400 text-emerald-950 font-black shadow-sm'
                : 'text-amber-800 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>AI Forecast</span>
          </Link>
        </nav>

        {/* Right Buttons: Theme Toggle + India Translator + 11-Language Dropdown + Cart + User Profile / Login */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 1. Theme Toggle Button (Sun / Moon) */}
          <button
            type="button"
            onClick={toggleTheme}
            id="theme-toggle-btn"
            aria-label={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-emerald-950 dark:text-amber-300 border border-emerald-900/15 dark:border-white/15 backdrop-blur-lg font-extrabold rounded-xl flex items-center justify-center shadow-xs transition transform active:scale-95 shrink-0"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 dark:text-amber-400" />
            )}
          </button>

          {/* 2. India Translator Launch Button */}
          <button
            type="button"
            onClick={() => setIsTranslatorOpen(true)}
            id="navbar-translator-btn"
            className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 hover:bg-amber-500/30 text-emerald-950 dark:text-amber-200 border border-amber-500/30 dark:border-amber-400/30 backdrop-blur-lg font-extrabold rounded-xl flex items-center justify-center shadow-xs transition active:scale-95 shrink-0"
            title={t.translatorTitle || 'India Multi-Language Translator'}
            aria-label="Translator"
          >
            <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 dark:text-amber-400" />
          </button>

          {/* 3. 11-Indian Language Dropdown Selector */}
          <div className="relative z-50" ref={dropdownRef}>
            <button
              type="button"
              id="navbar-lang-selector-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="h-8 sm:h-10 px-1.5 sm:px-2.5 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-emerald-950 dark:text-emerald-100 border border-emerald-900/15 dark:border-white/15 backdrop-blur-lg font-bold rounded-xl flex items-center gap-1 shadow-xs transition shrink-0 active:scale-95"
              aria-label="Select Indian Language"
              title={`${currentLangMeta.flagEmoji} ${currentLangMeta.nativeName} (${currentLangMeta.name})`}
            >
              <span className="text-sm sm:text-base leading-none">{currentLangMeta.flagEmoji}</span>
              <span className="text-[11px] sm:text-xs font-bold hidden md:inline">{currentLangMeta.nativeName}</span>
              <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-800/70 dark:text-emerald-300/70 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 sm:w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-[#0c2217] rounded-2xl shadow-2xl border border-emerald-900/15 dark:border-emerald-500/30 py-2 z-[100] animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-emerald-900/10 dark:border-emerald-500/20 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-emerald-950 dark:text-emerald-100 uppercase tracking-wider">
                    {t.selectLanguage || 'Select Language'} (11 Languages)
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
                    Pan-India
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto py-1 space-y-0.5">
                  {supportedLanguages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        type="button"
                        key={lang.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-[#0F3826] text-amber-50 font-bold'
                            : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-emerald-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{lang.flagEmoji}</span>
                          <div>
                            <div className="font-bold leading-tight">{lang.nativeName}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-amber-200/80' : 'text-emerald-800/60 dark:text-emerald-300/60'}`}>
                              {lang.name} • {lang.region}
                            </div>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="px-3 pt-2 mt-1 border-t border-emerald-900/10 dark:border-emerald-500/20 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLangDropdownOpen(false);
                      setIsTranslatorOpen(true);
                    }}
                    className="text-[11px] text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 font-bold flex items-center justify-center gap-1 w-full py-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-lg transition"
                  >
                    <Languages className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t.translatorTitle || 'AI Multi-Language Translator'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. User Profile & Action Menu */}
          <div className="relative z-50" ref={profileRef}>
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 sm:w-10 sm:h-10 p-0 flex items-center justify-center bg-white/80 dark:bg-emerald-950/80 hover:bg-white dark:hover:bg-emerald-900 border border-emerald-900/15 dark:border-emerald-500/30 rounded-xl shadow-sm transition shrink-0 active:scale-95"
                title={`${user.name} (${user.role})`}
                aria-label="User Profile"
              >
                <UserAvatar name={user.name} size="sm" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="h-8 sm:h-10 px-2 sm:px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl flex items-center gap-1.5 shadow-md transition shrink-0 active:scale-95 text-[11px] sm:text-xs"
                title="Log In / Sign Up"
                aria-label="Log In"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Log In</span>
              </button>
            )}

            {/* Comprehensive Profile & User Actions Popup */}
            {showProfileMenu && isAuthenticated && user && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-[#FAF5EB] dark:bg-[#0c2217] rounded-3xl shadow-2xl border border-emerald-900/20 dark:border-emerald-500/30 p-3.5 z-[120] animate-fadeIn space-y-3">
                {/* Profile Header */}
                <div className="flex items-center gap-3 p-3 bg-emerald-900/10 dark:bg-emerald-950/80 rounded-2xl border border-emerald-900/15 dark:border-emerald-500/20">
                  <UserAvatar name={user.name} size="md" />
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-black text-emerald-950 dark:text-amber-100 truncate">{user.name}</p>
                    <p className="text-[10px] text-emerald-800/70 dark:text-emerald-300/70 truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-black px-2 py-0.5 bg-amber-500/20 text-amber-950 dark:text-amber-300 rounded-md border border-amber-500/30">
                        {user.role}
                      </span>
                      <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                        {user.id.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-1 text-xs font-bold">
                  {/* My Orders & Live Escrow Tracking */}
                  <Link
                    href="/buyer#active-orders"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-amber-100 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 group-hover:scale-105 transition">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="leading-tight">My Active Orders</div>
                        <div className="text-[10px] font-normal text-emerald-800/70 dark:text-emerald-300/60">
                          Live Escrow & Delivery Tracking
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-800 text-amber-200 px-2 py-0.5 rounded-full font-extrabold shadow-xs">
                      Live
                    </span>
                  </Link>

                  {/* My Crops & Produce Registry */}
                  <Link
                    href="/farmer"
                    onClick={() => {
                      setRole('FARMER');
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-amber-100 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 group-hover:scale-105 transition">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="leading-tight">My Crops & Produce</div>
                        <div className="text-[10px] font-normal text-emerald-800/70 dark:text-emerald-300/60">
                          List & Manage Harvest Produce
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Shopping Cart Drawer Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-amber-100 transition text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 group-hover:scale-105 transition">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="leading-tight">Shopping Cart</div>
                        <div className="text-[10px] font-normal text-emerald-800/70 dark:text-emerald-300/60">
                          Direct Produce Checkout
                        </div>
                      </div>
                    </div>
                    {itemCount > 0 ? (
                      <span className="text-[10px] bg-amber-500 text-emerald-950 px-2 py-0.5 rounded-full font-black shadow-xs">
                        {itemCount}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-800/50 dark:text-emerald-400/50 font-normal">
                        0
                      </span>
                    )}
                  </button>

                  {/* Transporter Fleet & Trips */}
                  <Link
                    href="/transporter"
                    onClick={() => {
                      setRole('TRANSPORTER');
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-amber-100 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-800 dark:text-blue-300 group-hover:scale-105 transition">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="leading-tight">Transporter Fleet</div>
                        <div className="text-[10px] font-normal text-emerald-800/70 dark:text-emerald-300/60">
                          Trips & Handshake OTP
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Role Switcher Section */}
                <div className="pt-2 border-t border-emerald-900/10 dark:border-emerald-500/20">
                  <div className="text-[10px] font-extrabold text-emerald-900/70 dark:text-emerald-300/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Settings className="w-3 h-3 text-amber-600" />
                    <span>Switch Active Role</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-center">
                    <Link
                      href="/farmer"
                      onClick={() => {
                        setRole('FARMER');
                        setShowProfileMenu(false);
                      }}
                      className={`py-1 rounded-lg border transition ${
                        role === 'FARMER'
                          ? 'bg-emerald-800 text-amber-100 border-emerald-700'
                          : 'bg-white dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border-emerald-900/10 hover:bg-emerald-100'
                      }`}
                    >
                      🚜 Farmer
                    </Link>
                    <Link
                      href="/buyer"
                      onClick={() => {
                        setRole('BUYER');
                        setShowProfileMenu(false);
                      }}
                      className={`py-1 rounded-lg border transition ${
                        role === 'BUYER'
                          ? 'bg-emerald-800 text-amber-100 border-emerald-700'
                          : 'bg-white dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border-emerald-900/10 hover:bg-emerald-100'
                      }`}
                    >
                      🛍️ Buyer
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => {
                        setRole('ADMIN');
                        setShowProfileMenu(false);
                      }}
                      className={`py-1 rounded-lg border transition ${
                        role === 'ADMIN'
                          ? 'bg-emerald-800 text-amber-100 border-emerald-700'
                          : 'bg-white dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border-emerald-900/10 hover:bg-emerald-100'
                      }`}
                    >
                      ⚖️ Admin
                    </Link>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-emerald-900/10 dark:border-emerald-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full py-2 px-3 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-900 dark:text-red-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Role Navigation Strip */}
      <div className="lg:hidden border-t border-emerald-900/10 dark:border-emerald-500/20 bg-emerald-900/5 dark:bg-[#07170f] px-3 sm:px-4 py-2 overflow-x-auto no-scrollbar w-full max-w-full">
        <nav className="flex items-center gap-1.5 w-max max-w-none text-xs font-bold">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'bg-white/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-500/20'
            }`}
          >
            {t.navHome}
          </Link>

          <Link
            href="/farmer"
            onClick={() => setRole('FARMER')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/farmer'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'bg-white/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-500/20'
            }`}
          >
            {t.navFarmer}
          </Link>

          <Link
            href="/fpo"
            onClick={() => setRole('FPO')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/fpo'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'bg-white/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-500/20'
            }`}
          >
            {t.navFPO}
          </Link>

          <Link
            href="/buyer"
            onClick={() => setRole('BUYER')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/buyer'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'bg-white/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-500/20'
            }`}
          >
            {t.navBuyer}
          </Link>

          <Link
            href="/hub"
            onClick={() => setRole('HUB_OPERATOR')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/hub'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'bg-white/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-500/20'
            }`}
          >
            {t.navHub}
          </Link>

          <Link
            href="/transporter"
            onClick={() => setRole('TRANSPORTER')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/transporter'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'bg-white/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-500/20'
            }`}
          >
            {t.navTransporter}
          </Link>

          <Link
            href="/admin"
            onClick={() => setRole('ADMIN')}
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === '/admin'
                ? 'bg-[#0F3826] text-amber-50 shadow-sm'
                : 'bg-white/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-500/20'
            }`}
          >
            {t.navAdmin}
          </Link>

          <Link
            href="/forecast"
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              pathname === '/forecast'
                ? 'bg-amber-400 text-emerald-950 font-black shadow-sm'
                : 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-400/40'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>AI Forecast</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
