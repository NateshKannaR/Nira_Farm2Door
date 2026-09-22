'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  ShoppingBag,
  UserPlus,
  PhoneCall,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Radio
} from 'lucide-react';

interface HeroCarouselProps {
  onExploreClick?: () => void;
  tickerSlot?: React.ReactNode;
}

export default function HeroCarousel({ onExploreClick, tickerSlot }: HeroCarouselProps) {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 5 high-quality local static images stored in public/images
  const slides = [
    {
      id: 1,
      image: '/images/bhor_village_mandi.jpg',
      badgeHi: '🌅 भोर विशेष • 5:00 AM Direct Pre-Dawn Mandi Trade',
      badgeEn: '🌅 Pre-Dawn Mandi • 5:00 AM Direct Farm-to-Buyer Trade',
      titleHi: 'Dew-Fresh Morning Harvest. Direct from Village Mandi.',
      titleEn: 'Dew-Fresh Morning Harvest. Direct from Village Mandi.',
      descHi: 'Experience the pre-dawn mandi atmosphere: freshly harvested produce with glistening morning dew, direct farmer auctions before the city wakes up.',
      descEn: 'Experience the pre-dawn mandi atmosphere: freshly harvested produce with glistening morning dew, direct farmer auctions before the city wakes up.',
      ctaPrimaryEn: 'Explore Products',
      ctaPrimaryHi: 'Explore Products',
      ctaSecondaryEn: 'Register as Farmer',
      ctaSecondaryHi: 'Register as Farmer',
    },
    {
      id: 2,
      image: '/images/farmer2.jpg',
      badgeHi: 'SIH 2026 PS 26033 • Nira Farmer-First Direct Agri Platform',
      badgeEn: 'SIH 2026 PS 26033 • Nira Farmer-First Direct Agri Platform',
      titleHi: 'Nira: Direct, Transparent & Digital Agri Trade',
      titleEn: 'Nira: Direct, Transparent & Digital Agri Trade',
      descHi: 'Connecting 1.4 Lakh+ verified Indian farmers directly with institutional buyers, FPOs, and consumers with 0% middlemen commission.',
      descEn: 'Connecting 1.4 Lakh+ verified Indian farmers directly with institutional buyers, FPOs, and consumers with 0% middlemen commission.',
      ctaPrimaryEn: 'Explore Products',
      ctaPrimaryHi: 'Explore Products',
      ctaSecondaryEn: 'Register as Farmer',
      ctaSecondaryHi: 'Register as Farmer',
    },
    {
      id: 2,
      image: '/images/fresh_farm_produce.jpg',
      badgeHi: '100% Farm-Fresh • Direct Harvest from Fields',
      badgeEn: '100% Farm-Fresh • Direct Harvest from Fields',
      titleHi: 'Fresh Farm Fruits, Vegetables & Organic Harvest Direct to You',
      titleEn: 'Fresh Farm Fruits, Vegetables & Organic Harvest Direct to You',
      descHi: 'AI computer vision grade-certified fresh produce harvested today with zero middlemen, escrow protection, and rapid farm-gate dispatch.',
      descEn: 'AI computer vision grade-certified fresh produce harvested today with zero middlemen, escrow protection, and rapid farm-gate dispatch.',
      ctaPrimaryEn: 'Explore Products',
      ctaPrimaryHi: 'Explore Products',
      ctaSecondaryEn: 'Register as Farmer',
      ctaSecondaryHi: 'Register as Farmer',
    },
    {
      id: 3,
      image: '/images/farmer1.jpg',
      badgeHi: 'Mandi Agro-Hub • Quality Grains, Pulses & Agro Commodities',
      badgeEn: 'Mandi Agro-Hub • Quality Grains, Pulses & Agro Commodities',
      titleHi: 'Premium Quality Grains, Pulses & Modern Agro-Hub Aggregation',
      titleEn: 'Premium Quality Grains, Pulses & Modern Agro-Hub Aggregation',
      descHi: 'Transparent bulk procurement across 42 certified agro-hubs with automated quality inspection, fair pricing, and direct bank transfers.',
      descEn: 'Transparent bulk procurement across 42 certified agro-hubs with automated quality inspection, fair pricing, and direct bank transfers.',
      ctaPrimaryEn: 'Explore Products',
      ctaPrimaryHi: 'Explore Products',
      ctaSecondaryEn: 'Register as Farmer',
      ctaSecondaryHi: 'Register as Farmer',
    },
    {
      id: 4,
      image: '/images/farmer4.jpg',
      badgeHi: 'Fair Price Assured • Direct Farmer-to-Buyer Contracts',
      badgeEn: 'Fair Price Assured • Direct Farmer-to-Buyer Contracts',
      titleHi: 'Zero Intermediaries. Maximum Earnings.',
      titleEn: 'Zero Intermediaries. Maximum Earnings.',
      descHi: 'Real-time Agmarknet mandi rates, multilingual toll-free voice registration, and end-to-end multi-modal logistics straight to your doorstep.',
      descEn: 'Real-time Agmarknet mandi rates, multilingual toll-free voice registration, and end-to-end multi-modal logistics straight to your doorstep.',
      ctaPrimaryEn: 'Explore Products',
      ctaPrimaryHi: 'Explore Products',
      ctaSecondaryEn: 'Register as Farmer',
      ctaSecondaryHi: 'Register as Farmer',
    },
  ];

  const totalSlides = slides.length;
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-play interval: slides automatically every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  // Touch handlers for mobile swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="-mx-3 sm:-mx-8 lg:-mx-12 -mt-4 sm:-mt-6 relative z-0 overflow-hidden text-amber-50 group mb-6 sm:mb-8 border-b border-emerald-900/15 dark:border-emerald-500/20 w-[calc(100%+1.5rem)] sm:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)] max-w-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-Bleed Hero Section with Photo in Background */}
      <div
        className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[540px] flex items-center w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Nira Agriculture Hero Carousel"
      >
        {/* Floating Live Mandi Ticker positioned at top over background image */}
        {tickerSlot && (
          <div className="absolute top-2 sm:top-4 left-0 right-0 z-30 max-w-7xl mx-auto px-3 sm:px-8 lg:px-12 pointer-events-auto w-full">
            {tickerSlot}
          </div>
        )}

        {/* Slides with Photo in Background */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out w-full ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* Photo directly in background spanning full width and full height */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <img
                  src={slide.image}
                  alt={slide.titleEn}
                  className={`w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    minWidth: '100%',
                    minHeight: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>

              {/* Clean, clear overlay with natural contrast - zero light flair, zero white flare */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/60" />

              {/* Content Overlay */}
              <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center pt-20 sm:pt-24 pb-10 sm:pb-16 w-full">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                  {/* Left Column: Heading, Description & CTA */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                    {/* Tag / Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-sm max-w-full">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{slide.badgeEn}</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-50 leading-tight drop-shadow-md">
                      {slide.titleEn}
                    </h1>

                    {/* Description */}
                    <p className="text-xs sm:text-sm lg:text-base text-amber-100/90 leading-relaxed max-w-2xl drop-shadow-sm font-normal">
                      {slide.descEn}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                      {/* CTA 1: Explore Products */}
                      <a
                        href="#marketplace"
                        onClick={onExploreClick}
                        className="px-5 sm:px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2 text-xs sm:text-sm active:scale-95"
                        id="hero-carousel-explore-cta"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{slide.ctaPrimaryEn}</span>
                      </a>

                      {/* CTA 2: Register as Farmer */}
                      <Link
                        href="/farmer"
                        className="px-5 sm:px-6 py-3 bg-emerald-800/80 hover:bg-emerald-700 text-amber-100 border border-amber-400/40 font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm active:scale-95 backdrop-blur-sm"
                        id="hero-carousel-register-cta"
                      >
                        <Sprout className="w-4 h-4 text-amber-400" />
                        <span>{slide.ctaSecondaryEn}</span>
                      </Link>

                      {/* Toll-free IVR Voice badge */}
                      <div className="w-full sm:w-auto px-3.5 py-2.5 bg-emerald-950/90 border border-amber-500/30 rounded-xl text-[11px] sm:text-xs text-amber-200 flex items-center gap-2 shadow-inner">
                        <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          <strong className="text-amber-300">1800-KISAN-AI</strong> (Toll-Free IVR Helpline)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Platform Proof & Live Trust Metrics with True Realistic Glassmorphism */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Card 1: 0% Middlemen */}
                    <div className="group/card relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-black/40 dark:bg-black/50 backdrop-blur-md border border-white/25 border-b-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:bg-black/50 hover:border-amber-400/50 transition-all duration-300 text-center space-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                      <div className="relative z-10 text-2xl sm:text-4xl font-extrabold text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">0%</div>
                      <div className="relative z-10 text-[11px] sm:text-xs text-white font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statMiddlemen || 'Middlemen Commission'}</div>
                      <p className="relative z-10 text-[9px] sm:text-[10px] text-amber-200/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statMiddlemenDesc || 'Direct Bank Transfers'}</p>
                    </div>

                    {/* Card 2: 99.4% CV Grading */}
                    <div className="group/card relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-black/40 dark:bg-black/50 backdrop-blur-md border border-white/25 border-b-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:bg-black/50 hover:border-emerald-400/50 transition-all duration-300 text-center space-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                      <div className="relative z-10 text-2xl sm:text-4xl font-extrabold text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">99.4%</div>
                      <div className="relative z-10 text-[11px] sm:text-xs text-white font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statCVGrading || 'AI Grading Accuracy'}</div>
                      <p className="relative z-10 text-[9px] sm:text-[10px] text-emerald-200/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statCVGradingDesc || 'Computer Vision Lab'}</p>
                    </div>

                    {/* Card 3: 6 AI Engines */}
                    <div className="group/card relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-black/40 dark:bg-black/50 backdrop-blur-md border border-white/25 border-b-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:bg-black/50 hover:border-amber-400/50 transition-all duration-300 text-center space-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                      <div className="relative z-10 text-2xl sm:text-4xl font-extrabold text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">6 AI</div>
                      <div className="relative z-10 text-[11px] sm:text-xs text-white font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statAIEngines || 'Engines Integrated'}</div>
                      <p className="relative z-10 text-[9px] sm:text-[10px] text-amber-200/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statAIEnginesDesc || 'Pricing, Routes & Quality'}</p>
                    </div>

                    {/* Card 4: IVR/SMS Offline */}
                    <div className="group/card relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-black/40 dark:bg-black/50 backdrop-blur-md border border-white/25 border-b-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:bg-black/50 hover:border-emerald-400/50 transition-all duration-300 text-center space-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                      <div className="relative z-10 text-xl sm:text-3xl font-extrabold text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">IVR/SMS</div>
                      <div className="relative z-10 text-[11px] sm:text-xs text-white font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statNoInternet || 'Offline Support'}</div>
                      <p className="relative z-10 text-[9px] sm:text-[10px] text-emerald-200/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.statNoInternetDesc || 'Keypad Phone Support'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}


        {/* Manual Navigation Dots at Bottom */}
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
          role="tablist"
          aria-label="Hero carousel pagination"
        >
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Slide ${index + 1} of ${totalSlides}`}
                title={slide.titleEn}
                onClick={() => goToSlide(index)}
                className="p-1 cursor-pointer focus:outline-none group"
              >
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-7 h-2 bg-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : 'w-2 h-2 bg-white/40 group-hover:bg-white/80 group-hover:scale-125'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
