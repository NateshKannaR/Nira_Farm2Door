'use client';

import React, { useState } from 'react';
import {
  Award,
  MapPin,
  CheckCircle2,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  X,
  Leaf,
  Apple,
  Wheat,
  Layers,
  Sprout,
  QrCode,
  TrendingDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedCategory, getLocalizedCropName, getLocalizedGrade, getLocalizedLocation, getLocalizedFarmer } from '@/lib/i18n';
import VerifiedBadge from '@/components/VerifiedBadge';
import { getProduceVerification, ProduceVerificationRecord } from '@/lib/verifiedStore';
import { getCropLogoUrl, getCropPhotosByName } from '@/lib/cropImageMatcher';
import TraceabilityModal from './TraceabilityModal';
import MiddlemanEliminationCalculator from './MiddlemanEliminationCalculator';

export interface BulmaProductCardProps {
  id: string | number;
  crop_name: string;
  crop_name_hi?: string;
  category: string;
  variety?: string;
  quantity_kg?: number;
  price_paise_per_kg: number;
  quality_grade?: string;
  cv_trust_score?: number;
  harvest_date?: string;
  is_organic?: number;
  farmer_name?: string;
  location?: string;
  hub_location?: string;
  image_url?: string;
  images?: string[]; // 2 to 6 photos
  side_logo?: string;
  logo_url?: string;
  unit?: string;
  description?: string;
  onAddToCart?: (item: any) => void;
  onDirectBuy?: (item: any) => void;
  badge?: string;
}

export default function BulmaProductCard({
  id,
  crop_name,
  crop_name_hi,
  category,
  variety,
  quantity_kg = 500,
  price_paise_per_kg,
  quality_grade = 'Premium Grade A+',
  cv_trust_score = 96,
  harvest_date = '2026-09-08',
  is_organic = 0,
  farmer_name = 'Farmer',
  location = 'Nashik Mandi Collection Hub',
  hub_location,
  image_url,
  images,
  side_logo,
  logo_url,
  unit = 'kg',
  description,
  onAddToCart,
  onDirectBuy,
  badge
}: BulmaProductCardProps) {
  const { language, t } = useLanguage();

  // Extract and normalize 2 to 6 photos
  const photoList: string[] = React.useMemo(() => {
    let result: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      result = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
    } else if (image_url && image_url.trim().length > 0) {
      if (image_url.startsWith('[') && image_url.endsWith(']')) {
        try {
          const parsed = JSON.parse(image_url);
          if (Array.isArray(parsed)) {
            result = parsed.filter((img) => typeof img === 'string' && img.trim().length > 0);
          }
        } catch (e) {
          result = [image_url];
        }
      } else {
        result = [image_url];
      }
    }
    return result.slice(0, 6);
  }, [images, image_url]);

  // Fallback to match verified crop photos and logo presets
  const fallbackLogo = React.useMemo(() => getCropLogoUrl(crop_name), [crop_name]);
  const effectiveLogo = (logo_url && logo_url.trim().length > 0)
    ? logo_url
    : ((side_logo && side_logo.trim().length > 0) ? side_logo : (photoList[0] || fallbackLogo));

  const effectivePhotos = React.useMemo(() => {
    if (photoList.length > 0) return photoList;
    return getCropPhotosByName(crop_name);
  }, [photoList, crop_name]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [orderQty, setOrderQty] = useState(Math.min(100, quantity_kg || 100));

  // Official Mandi & Lab Verification Registry sync
  const [verification, setVerification] = useState<ProduceVerificationRecord>(() =>
    getProduceVerification(id)
  );

  React.useEffect(() => {
    setVerification(getProduceVerification(id));
    const handleUpdate = (e: any) => {
      if (e.detail && String(e.detail.id) === String(id)) {
        setVerification(e.detail);
      }
    };
    window.addEventListener('kb:produce-verified-change', handleUpdate);
    return () => window.removeEventListener('kb:produce-verified-change', handleUpdate);
  }, [id]);

  const isOfficiallyVerified = Boolean(verification.isVerified || (is_organic === 1 && cv_trust_score >= 90));
  const isOfficiallyOrganic = Boolean(verification.isVerified ? verification.isOrganic : (is_organic === 1));
  const effectiveGrade = verification.isVerified ? verification.grade : (quality_grade || 'A+');

  const safePaise = Number(price_paise_per_kg) || 0;
  const priceRupees = (safePaise / 100).toFixed(2);
  const activePhoto = effectivePhotos[activePhotoIdx] || effectivePhotos[0] || effectiveLogo || '';

  const renderCategoryBadgeIcon = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('veg')) return <Leaf className="w-6 h-6 text-emerald-300" />;
    if (c.includes('fruit')) return <Apple className="w-6 h-6 text-amber-300" />;
    if (c.includes('grain')) return <Wheat className="w-6 h-6 text-yellow-300" />;
    if (c.includes('pulse') || c.includes('dal')) return <Layers className="w-6 h-6 text-amber-200" />;
    return <Sprout className="w-6 h-6 text-emerald-300" />;
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        listingId: id,
        cropName: crop_name,
        pricePaisePerKg: price_paise_per_kg,
        quantityKg: orderQty,
        grade: quality_grade,
        farmerName: farmer_name,
        location: location,
        imageUrl: activePhoto,
        photos: effectivePhotos,
        unit,
      });
    }
  };

  const displayCropName = (language === 'hi' && crop_name_hi)
    ? crop_name_hi
    : getLocalizedCropName(crop_name, language);

  return (
    <>
      <div className="bulma-card group" id={`produce-card-${id}`}>
        {/* ===================================================
            UPPER SECTION: Product Name & Category Emblem
            =================================================== */}
        <div className="card-header-custom">
          <div className="bulma-media">
            {/* Category / Crop Emblem */}
            <div className="bulma-media-left">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-md bg-gradient-to-br from-[#0F3826] to-[#072115] shrink-0 flex items-center justify-center">
                {effectiveLogo ? (
                  <img
                    src={effectiveLogo}
                    alt={crop_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    {renderCategoryBadgeIcon(category)}
                  </div>
                )}
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
              </div>
            </div>

            {/* Product Name & Subtitles */}
            <div className="bulma-media-content">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bulma-tag is-success-light">
                  {getLocalizedCategory(category, language)}
                </span>
                {variety && (
                  <span className="text-[10px] text-emerald-900 dark:text-amber-200 font-medium bg-amber-100/80 dark:bg-emerald-950/80 border border-amber-300/60 dark:border-emerald-700/50 px-2 py-0.5 rounded-full shadow-xs">
                    {variety}
                  </span>
                )}
                {isOfficiallyOrganic && (
                  <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/50 flex items-center gap-1 shadow-xs">
                    <Leaf className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'hi' ? '100% जैविक' : '100% Organic'}</span>
                  </span>
                )}
                {badge && (
                  <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-emerald-950 dark:text-amber-100 leading-snug truncate">
                  {displayCropName}
                </h3>
                {isOfficiallyVerified && (
                  <VerifiedBadge
                    size="sm"
                    variant="whatsapp"
                    showText={false}
                    tooltip="Officially Verified & Audited by Mandi Board"
                  />
                )}
              </div>
            </div>

            {/* Upper Right Badges */}
            <div className="bulma-media-right flex flex-col items-end gap-1">
              <span className="bulma-tag is-warning-dark shadow-sm">
                <Award className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{getLocalizedGrade(effectiveGrade, language)}</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>CV {cv_trust_score}%</span>
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            REAL PRODUCT IMAGE SHOWCASE (Farmer Verified Photos)
            =================================================== */}
        {activePhoto && (
          <div
            className="relative w-full h-44 sm:h-48 overflow-hidden bg-black/5 dark:bg-black/40 border-y border-emerald-900/10 dark:border-emerald-500/20 group/img cursor-pointer"
            onClick={() => setShowDetailsModal(true)}
            title={language === 'hi' ? 'विस्तृत विवरण देखें' : 'Click to view full specifications'}
          >
            <img
              src={activePhoto}
              alt={crop_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-amber-300 font-extrabold text-[10px] rounded-full border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>CV {cv_trust_score}% Verified</span>
              </span>
            </div>

            {effectivePhotos.length > 1 && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
                <span>📷 {effectivePhotos.length} Photos</span>
              </div>
            )}

            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="font-extrabold text-amber-300 drop-shadow">
                ₹{priceRupees} / {unit}
              </span>
              <span className="text-[11px] text-emerald-200 font-semibold bg-[#0F3826]/80 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                {language === 'hi' ? 'सीधा खेत से' : 'Direct from Farm'}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================
            NICHE SECTION (Bottom): Detailed Product Specifications
            =================================================== */}
        <div className="card-content space-y-3">
          {/* Price & Quantity Available Highlight */}
          <div className="flex items-center justify-between bg-amber-50/70 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-500/20">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900/80 dark:text-amber-300 block">
                {language === 'hi' ? 'उचित मूल्य AI दर' : (t.fairPriceAiTag || 'Fair Price AI Rate')}
              </span>
              <div className="text-xl font-extrabold text-amber-900 dark:text-amber-300 flex items-baseline gap-1">
                <span>₹{priceRupees}</span>
                <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">/ {unit}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300/80 block">
                ({safePaise} {language === 'hi' ? 'पैसे' : 'paise'})
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-900/80 dark:text-emerald-200 block">
                {language === 'hi' ? 'उपलब्ध स्टॉक' : (t.availableQty || 'Stock Ready')}
              </span>
              <div className="text-base font-extrabold text-emerald-950 dark:text-emerald-100">
                {quantity_kg.toLocaleString()} {unit}
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/80 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                {language === 'hi' ? 'सत्यापित लॉट' : 'Verified Lot'}
              </span>
            </div>
          </div>

          {/* Farmer & Location Niche Info */}
          <div className="text-xs space-y-1.5 text-emerald-900/90 dark:text-emerald-200 bg-[#FAF5EB] dark:bg-[#07170f] p-2.5 rounded-xl border border-emerald-900/10 dark:border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold truncate">
                  {getLocalizedFarmer(farmer_name, language)}
                </span>
                {isOfficiallyVerified && (
                  <VerifiedBadge
                    size="xs"
                    variant="whatsapp"
                    showText={false}
                    tooltip="Verified Kisan Producer"
                  />
                )}
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 uppercase bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                {language === 'hi' ? 'किसान' : (t.farmerLabel || 'Farmer')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-800/80 dark:text-emerald-300/80 text-[11px] truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">{getLocalizedLocation(location, language)}</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-emerald-700/80 dark:text-emerald-300/80 pt-1 border-t border-emerald-900/10 dark:border-emerald-500/20">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{language === 'hi' ? 'फसल कटाई' : 'Harvest'}: {harvest_date}</span>
              </span>
              <button
                onClick={() => setShowDetailsModal(true)}
                className="text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold underline flex items-center gap-0.5"
              >
                <Info className="w-3 h-3" />
                <span>{language === 'hi' ? 'पूर्ण विवरण' : 'Full Specs'}</span>
              </button>
            </div>
          </div>

          {/* SIH Innovation Buttons: Middleman Eliminated & Traceability QR */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCalculatorModal(true)}
              className="px-2 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center justify-center gap-1 transition cursor-pointer"
              title="View how 4 brokers were eliminated for this price"
            >
              <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">{language === 'hi' ? 'दलाल मुक्त (-14%)' : '0% Brokers (-14%)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTraceModal(true)}
              className="px-2 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center justify-center gap-1 transition cursor-pointer"
              title="View Farm-to-Fork Traceability Passport"
            >
              <QrCode className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{language === 'hi' ? 'खेत उत्पत्ति (QR)' : 'Trace Origin (QR)'}</span>
            </button>
          </div>
        </div>

        {/* ===================================================
            CARD FOOTER: Quantity Selector & Action Buttons
            =================================================== */}
        <div className="card-footer flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Quick Quantity Counter */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white dark:bg-[#07170f] px-2.5 py-1.5 rounded-xl border border-emerald-900/15 dark:border-emerald-500/25">
            <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
              {language === 'hi' ? 'मात्रा:' : 'Qty:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOrderQty((q) => Math.max(10, q - 10))}
                className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/80 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-950 dark:text-emerald-100 font-bold text-xs flex items-center justify-center transition"
              >
                -
              </button>
              <input
                type="number"
                value={orderQty}
                onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center text-xs font-bold text-emerald-950 dark:text-emerald-100 bg-transparent focus:outline-none border-b border-emerald-900/30 dark:border-emerald-500/30"
              />
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">{unit}</span>
              <button
                type="button"
                onClick={() => setOrderQty((q) => Math.min(quantity_kg, q + 10))}
                className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/80 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-950 dark:text-emerald-100 font-bold text-xs flex items-center justify-center transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Button: Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 px-4 py-2.5 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'कार्ट में जोड़ें' : (t.addToCart || 'Add to Cart')}</span>
          </button>
        </div>
      </div>

      {/* ===================================================
          PRODUCT DETAILS MODAL (Full Specifications)
          =================================================== */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FAF5EB] dark:bg-[#0c2217] rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-emerald-900/20 dark:border-emerald-500/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-[#0F3826] border border-amber-500 text-amber-300 shrink-0">
                  {effectiveLogo ? (
                    <img src={effectiveLogo} alt={crop_name} className="w-full h-full object-cover" />
                  ) : (
                    renderCategoryBadgeIcon(category)
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-emerald-950 dark:text-amber-100">
                    {displayCropName}
                  </h3>
                  <span className="bulma-tag is-success-light text-[10px]">
                    {getLocalizedCategory(category, language)} {variety ? `• ${getLocalizedCropName(variety, language)}` : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-full text-emerald-800 dark:text-emerald-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photos Strip in Modal */}
            {effectivePhotos.length > 0 && (
              <div className="space-y-2">
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-emerald-900/15 shadow-inner">
                  <img
                    src={activePhoto}
                    alt={crop_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {effectivePhotos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {effectivePhotos.map((ph, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activePhotoIdx === idx
                            ? 'border-emerald-700 ring-2 ring-emerald-500/30 shadow-sm scale-105'
                            : 'border-emerald-900/20 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={ph} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Details Table */}
            <div className="bg-white dark:bg-[#07170f] p-4 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-emerald-900/5 dark:border-emerald-500/10">
                <span className="text-emerald-800/80 dark:text-emerald-300/80">{language === 'hi' ? 'मूल्य दर:' : 'Rate:'}</span>
                <span className="font-bold text-amber-900 dark:text-amber-300">₹{priceRupees} / {unit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/5 dark:border-emerald-500/10">
                <span className="text-emerald-800/80 dark:text-emerald-300/80">{language === 'hi' ? 'उपलब्ध स्टॉक:' : 'Available Stock:'}</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-100">{quantity_kg} {unit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/5 dark:border-emerald-500/10">
                <span className="text-emerald-800/80 dark:text-emerald-300/80">{language === 'hi' ? 'गुणवत्ता ग्रेड:' : 'Grade:'}</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-100">{getLocalizedGrade(effectiveGrade, language)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/5 dark:border-emerald-500/10">
                <span className="text-emerald-800/80 dark:text-emerald-300/80">{language === 'hi' ? 'CV विश्वास स्कोर:' : 'CV Confidence:'}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{cv_trust_score}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/5 dark:border-emerald-500/10">
                <span className="text-emerald-800/80 dark:text-emerald-300/80">{language === 'hi' ? 'किसान:' : 'Farmer:'}</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-100">{getLocalizedFarmer(farmer_name, language)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/5 dark:border-emerald-500/10">
                <span className="text-emerald-800/80 dark:text-emerald-300/80">{language === 'hi' ? 'हब स्थान:' : 'Hub Location:'}</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-100">{getLocalizedLocation(location, language)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-emerald-800/80 dark:text-emerald-300/80">{language === 'hi' ? 'फसल कटाई तिथि:' : 'Harvest Date:'}</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-100">{harvest_date}</span>
              </div>
            </div>

            {description && (
              <p className="text-xs text-emerald-800/90 italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-900/5">
                {description}
              </p>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  setShowDetailsModal(false);
                }}
                className="flex-1 py-3 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'कार्ट में जोड़ें' : (t.addToCart || 'Add to Cart')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIH Innovation Modals */}
      {showCalculatorModal && (
        <MiddlemanEliminationCalculator
          initialCrop={crop_name}
          initialPrice={parseFloat(priceRupees) || 30}
          initialQuantity={quantity_kg}
          isModal={true}
          onClose={() => setShowCalculatorModal(false)}
        />
      )}

      {showTraceModal && (
        <TraceabilityModal
          cropName={crop_name}
          farmerName={farmer_name}
          location={location}
          harvestDate={harvest_date}
          grade={effectiveGrade}
          cvScore={cv_trust_score}
          isOrganic={is_organic}
          lotId={id}
          onClose={() => setShowTraceModal(false)}
        />
      )}
    </>
  );
}
