'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedFarmer, getLocalizedLocation, getLocalizedCropName, stripIndicParens } from '@/lib/i18n';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import PortalGuard from '@/components/PortalGuard';
import BulmaProductCard from '@/components/BulmaProductCard';
import { getCropLogoUrl, getCropPhotosByName } from '@/lib/cropImageMatcher';
import {
  ShoppingBag,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  MapPin,
  X,
  Search,
  Filter,
  Tractor,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Truck,
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function BuyerDashboardPage() {
  const { t, language } = useLanguage();
  const { userName, userPhone } = useRole();
  const { addToCart } = useCart();
  const [successSignal, setSuccessSignal] = useState<string | null>(null);

  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [buyerName, setBuyerName] = useState(userName || 'Ramesh Trading Co.');
  const [buyerContact, setBuyerContact] = useState(userPhone || '+91 98230 45678');
  const [cropName, setCropName] = useState('Tomato');
  const [requiredQty, setRequiredQty] = useState('1500');
  const [maxPriceRs, setMaxPriceRs] = useState('29.00');
  const [deliveryLoc, setDeliveryLoc] = useState('Annapurna Pune Collection Hub');

  useEffect(() => {
    if (userName) setBuyerName((prev) => (!prev || prev === 'Ramesh Trading Co.' ? userName : prev));
    if (userPhone) setBuyerContact((prev) => (!prev || prev === '+91 98230 45678' ? userPhone : prev));
  }, [userName, userPhone]);

  // Produce board search state - ONLY farmer inserted crops
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [farmerProduce, setFarmerProduce] = useState<any[]>([]);
  const [loadingProduce, setLoadingProduce] = useState(true);

  const { user } = useAuth();
  const [buyerOrders, setBuyerOrders] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('kb_buyer_active_orders');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return [];
  });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeVerifyOrder, setActiveVerifyOrder] = useState<any | null>(null);
  const [verifyOtpInput, setVerifyOtpInput] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrders = async () => {
    try {
      const activeUserId = user?.id || 'u_buyer_1';
      const res = await fetch(`/api/v1/orders?userId=${activeUserId}&role=BUYER`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setBuyerOrders(data.orders);
        try {
          if (data.orders.length === 0) {
            localStorage.removeItem('kb_buyer_active_orders');
          } else {
            localStorage.setItem('kb_buyer_active_orders', JSON.stringify(data.orders));
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error('Error fetching buyer orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleClearPreviousOrders = async () => {
    if (!window.confirm(language === 'hi' ? 'क्या आप सभी पिछले ऑर्डर्स हटाना चाहते हैं?' : 'Are you sure you want to remove all previous orders?')) return;
    try {
      localStorage.removeItem('kb_buyer_active_orders');
      setBuyerOrders([]);
      await fetch('/api/v1/orders?all=true', { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to clear orders:', e);
    }
  };

  const totalPurchasedPaise = useMemo(() => {
    return buyerOrders.reduce((sum: number, o: any) => sum + (o.total_amount_paise || (o.total_amount ? o.total_amount * 100 : 0)), 0);
  }, [buyerOrders]);

  const activeContractsCount = useMemo(() => {
    return buyerOrders.filter((o: any) => o.status !== 'CANCELLED').length;
  }, [buyerOrders]);

  const [generatingDeliveryOtp, setGeneratingDeliveryOtp] = useState<Record<string, boolean>>({});

  const handleGenerateDeliveryOtp = async (orderId: string) => {
    setGeneratingDeliveryOtp((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch('/api/v1/orders/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, otpType: 'delivery' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate OTP');
      }
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Error generating OTP.');
    } finally {
      setGeneratingDeliveryOtp((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
    const handleOrderUpdate = () => fetchOrders();
    window.addEventListener('kb_order_updated', handleOrderUpdate);
    const interval = setInterval(fetchOrders, 6000);

    if (typeof window !== 'undefined' && window.location.hash.includes('order')) {
      setTimeout(() => {
        const el = document.getElementById('active-orders');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350);
    }

    return () => {
      window.removeEventListener('kb_order_updated', handleOrderUpdate);
      clearInterval(interval);
    };
  }, [user]);

  const handleVerifyOtp = async (orderId: string, otpType: 'pickup' | 'delivery') => {
    if (!verifyOtpInput.trim()) return;
    setVerifyingOtp(true);
    setVerifyMessage(null);

    try {
      const res = await fetch('/api/v1/orders/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          otpType,
          enteredOtp: verifyOtpInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      setVerifyMessage({ type: 'success', text: data.message });
      fetchOrders();
      setTimeout(() => {
        setActiveVerifyOrder(null);
        setVerifyOtpInput('');
        setVerifyMessage(null);
      }, 1500);
    } catch (err: any) {
      setVerifyMessage({ type: 'error', text: err.message });
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Load produce from Farmer Desk (DB + localStorage)
  useEffect(() => {
    async function fetchFarmerProduce() {
      setLoadingProduce(true);
      try {
        let localList: any[] = [];
        try {
          const stored = JSON.parse(localStorage.getItem('kb_custom_crops') || '[]');
          localList = stored.map((item: any) => {
            let photos: string[] = [];
            if (Array.isArray(item.photos)) {
              photos = item.photos;
            } else if (item.imageUrl) {
              photos = [item.imageUrl, item.imageUrl];
            }
            return {
              id: item.id || `local_${Date.now()}`,
              crop_name: item.crop || item.crop_name || 'Fresh Produce',
              crop_name_hi: item.crop_name_hi,
              category: item.category || 'Vegetables',
              variety: item.variety || 'Hybrid High Yield',
              quantity_kg: parseInt(item.qty || item.quantity_available) || 500,
              price_paise_per_kg: item.pricePaise || Math.round((parseFloat(item.priceRupees) || 32) * 100),
              quality_grade: item.grade || 'Grade A+',
              cv_trust_score: 98,
              harvest_date: item.harvestDate || '2026-09-08',
              is_organic: item.isOrganic || 0,
              farmer_name: item.farmer_name || 'Farmer',
              location: item.location || 'Nashik Mandi Collection Hub',
              images: photos,
              unit: item.unit || 'kg',
              isDirectFromFarmer: true,
            };
          });
        } catch (e) { }

        let apiList: any[] = [];
        try {
          const res = await fetch('/api/v1/crops');
          const data = await res.json();
          if (data.success && data.crops && data.crops.length > 0) {
            apiList = data.crops.map((c: any) => {
              let photoList: string[] = [];
              if (c.image_url && typeof c.image_url === 'string' && c.image_url.startsWith('[') && c.image_url.endsWith(']')) {
                try {
                  photoList = JSON.parse(c.image_url);
                } catch (e) {
                  photoList = [c.image_url];
                }
              } else if (c.image_url) {
                photoList = [c.image_url];
              }
              if (photoList.length === 1) {
                photoList.push(photoList[0]);
              }

              const cropNameStr = c.crop_name || 'Fresh Produce';
              const effectivePhotoList = photoList.length > 0 ? photoList : getCropPhotosByName(cropNameStr);
              const effectiveLogoUrl = c.logo_url || photoList[0] || getCropLogoUrl(cropNameStr);

              return {
                id: c.id,
                crop_name: cropNameStr,
                category: c.category || 'Vegetables',
                variety: 'Verified Farmer Lot',
                quantity_kg: c.quantity_available,
                price_paise_per_kg: c.price_paise ?? c.price_paise_per_kg ?? 3000,
                price_paise: c.price_paise ?? c.price_paise_per_kg ?? 3000,
                quality_grade: c.grade || 'Grade A+',
                cv_trust_score: 97,
                harvest_date: c.harvest_date || '2026-09-08',
                is_organic: c.organic_certified || 0,
                farmer_name: c.farmer_name || 'Farmer',
                location: c.location || 'Nashik Mandi Collection Hub',
                images: effectivePhotoList,
                image_url: effectiveLogoUrl || effectivePhotoList[0],
                logo_url: effectiveLogoUrl,
                side_logo: effectiveLogoUrl,
                unit: c.unit || 'kg',
                isDirectFromFarmer: true,
              };
            });
          }
        } catch (e) { }

        const combined = [...localList, ...apiList];
        const seen = new Set();
        const unique = combined.filter((it) => {
          if (seen.has(it.id)) return false;
          seen.add(it.id);
          return true;
        });

        setFarmerProduce(unique);
      } finally {
        setLoadingProduce(false);
      }
    }

    fetchFarmerProduce();
  }, []);

  // Direct buyer board: ONLY crops inserted by farmers!
  const filteredProduce = useMemo(() => {
    let result = farmerProduce;
    if (selectedCategory !== 'All') {
      result = result.filter(
        (it) => it.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (it) =>
          it.crop_name.toLowerCase().includes(q) ||
          (it.variety && it.variety.toLowerCase().includes(q)) ||
          (it.farmer_name && it.farmer_name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [farmerProduce, selectedCategory, searchQuery]);

  const handlePostRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddReqModal(false);
    setSuccessSignal(
      `Bulk Requirement Posted! (${buyerName} • ${buyerContact})`
    );
    setTimeout(() => setSuccessSignal(null), 4000);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      listingId: item.listingId || item.id,
      cropName: item.cropName || item.crop_name,
      pricePaisePerKg: item.pricePaisePerKg || item.price_paise_per_kg,
      quantityKg: item.quantityKg || 100,
      grade: item.grade || item.quality_grade,
      farmerName: item.farmerName || item.farmer_name,
      location: item.location,
      imageUrl: item.imageUrl || (item.photos && item.photos[0]),
    });
    setSuccessSignal(
      `${item.cropName || item.crop_name} added to procurement cart!`
    );
    setTimeout(() => setSuccessSignal(null), 4000);
  };

  return (
    <PortalGuard
      requiredRole="BUYER"
      portalName="Buyer Desk"
      portalDescription="This portal is restricted to verified Bulk and Retail Buyers to procure directly from Farmer Desk listings with 2-6 verified photos."
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0F3826] text-amber-50 p-6 rounded-3xl shadow-xl border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl">
              <ShoppingBag className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-emerald-950 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                {t.buyerHeaderBadge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                {t.buyerWelcome}, {userName}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5">
                Fresh Crops Direct from Farmers with Quality Produce at Better prices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              href="/farmer"
              className="px-4 py-3 bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl border border-amber-400/30 transition flex items-center gap-2 text-xs shadow"
            >
              <Tractor className="w-4 h-4 text-amber-400" />
              <span>Farmer Desk Board</span>
            </Link>

            <button
              onClick={() => setShowAddReqModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-extrabold rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition flex items-center gap-2 text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post Bulk Demand Request</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl space-y-1 border-l-4 border-l-emerald-700 dark:border-l-emerald-400">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{t.buyerStatTotalPurchase}</span>
            <div className="text-2xl font-extrabold text-emerald-950 dark:text-white">
              ₹{(totalPurchasedPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              {totalPurchasedPaise > 0 
                ? `₹${((totalPurchasedPaise * 0.15) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} farm savings`
                : t.buyerStatMandiSavings}
            </span>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-1 border-l-4 border-l-amber-600 dark:border-l-amber-400">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{t.buyerStatActiveOrders}</span>
            <div className="text-2xl font-extrabold text-amber-800 dark:text-amber-300">{buyerOrders.length} Orders</div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">{t.buyerStatGPSLogistics}</span>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-1 border-l-4 border-l-purple-600 dark:border-l-purple-400">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Direct Farmer Lots</span>
            <div className="text-2xl font-extrabold text-purple-900 dark:text-purple-300">{farmerProduce.length} Fresh Lots</div>
            <span className="text-[11px] text-purple-700 dark:text-purple-400 font-medium">Live from Farmer Desk</span>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-1 border-l-4 border-l-blue-600 dark:border-l-blue-400">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{t.buyerStatRecurringContracts}</span>
            <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">
              {activeContractsCount} {activeContractsCount === 1 ? 'Contract' : 'Contracts'}
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{t.buyerStatFPOGuarantee}</span>
          </div>
        </div>

        {/* ===================================================
            DIRECT FARMER PRODUCE PROCUREMENT BOARD (BULMA CARDS)
            =================================================== */}
        <div className="space-y-6" id="buyer-produce-board">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/10 dark:border-emerald-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-900 dark:bg-emerald-800 text-amber-300 font-extrabold text-[11px] rounded-full border border-emerald-700/50">
                  Direct from Farmer Desk
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>2-6 Photos Verified</span>
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 mt-1">
                Live Produce Procurement Board
              </h2>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-300/80">
                Your crop has been added successfully to your crop list and is now available on the platform.
              </p>
            </div>

            {/* Total Results Count & Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Category Dropdown List: Vegetables, Fruits, Pulses, Grains */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer hover:border-emerald-800 transition"
                >
                  <option value="All">🌐 All Categories</option>
                  <option value="Vegetables">🥦 Vegetables</option>
                  <option value="Fruits">🍎 Fruits</option>
                  <option value="Pulses">🫘 Pulses</option>
                  <option value="Grains">🌾 Grains</option>
                </select>
              </div>

              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-[#07170f] px-3 py-2 rounded-xl border border-emerald-900/15 dark:border-emerald-500/30 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                <Tractor className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>
                  {filteredProduce.length} Farmer Crop(s)
                </span>
              </span>

              {/* Real-time Search Box */}
              <div className="relative min-w-[180px] sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-emerald-800/50 dark:text-emerald-400/60" />
                <input
                  type="text"
                  placeholder="Search farmer produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-white placeholder-emerald-800/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2 text-xs text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Produce Cards Grid: ONLY Farmer-Inserted Crops (Bulma Responsive Cards) */}
          {loadingProduce ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-white/70 animate-pulse rounded-3xl border border-emerald-900/10 shadow-sm"
                />
              ))}
            </div>
          ) : filteredProduce.length === 0 ? (
            <div className="py-16 px-4 text-center bg-white/80 rounded-3xl border-2 border-dashed border-emerald-900/15 space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-500/10 text-amber-700 rounded-2xl flex items-center justify-center">
                <Tractor className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-emerald-950">
                  No Farmer Produce Currently Listed
                </h3>
                <p className="text-xs text-emerald-800/70 max-w-md mx-auto mt-1">
                  When registered farmers list their fresh harvest with 2 to 6 photos on the Farmer Desk, it will appear directly here on the Buyer Desk.
                </p>
              </div>
              <Link
                href="/farmer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-xl text-xs shadow-md transition"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Go to Farmer Desk to Insert Crop</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProduce.map((crop) => (
                <BulmaProductCard
                  key={crop.id}
                  id={crop.id}
                  crop_name={crop.crop_name}
                  crop_name_hi={crop.crop_name_hi}
                  category={crop.category}
                  variety={crop.variety}
                  quantity_kg={crop.quantity_kg}
                  price_paise_per_kg={crop.price_paise_per_kg}
                  quality_grade={crop.quality_grade}
                  cv_trust_score={crop.cv_trust_score}
                  harvest_date={crop.harvest_date}
                  is_organic={crop.is_organic}
                  farmer_name={crop.farmer_name}
                  location={crop.location}
                  images={crop.images}
                  unit={crop.unit}
                  description={crop.description}
                  badge={crop.isDirectFromFarmer ? 'Farmer Direct' : undefined}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Active Orders & Recurring Contracts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Active Orders */}
          <div id="active-orders" className="space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>{t.buyerActiveOrdersHeader}</span>
              </h2>
              {buyerOrders.length > 0 && (
                <button
                  onClick={handleClearPreviousOrders}
                  className="text-xs px-3 py-1.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5 font-bold transition"
                  title="Remove all orders"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'ऑर्डर्स हटाएं' : 'Clear Orders'}</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {loadingOrders ? (
                <div className="p-8 text-center text-emerald-800/60 dark:text-emerald-300/70 font-medium text-sm glass-card rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20">
                  Loading live orders...
                </div>
              ) : buyerOrders.length === 0 ? (
                <div className="p-8 text-center glass-card rounded-2xl space-y-2 border border-emerald-900/10 dark:border-emerald-500/20">
                  <ShoppingBag className="w-10 h-10 text-emerald-800/40 dark:text-emerald-400/40 mx-auto" />
                  <p className="font-bold text-sm text-emerald-950 dark:text-emerald-100">No Active Orders Found</p>
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70">Select fresh produce from the market and place a secure escrow order.</p>
                </div>
              ) : (
                buyerOrders.map((ord) => {
                  const isDelivered = ord.status === 'Delivered';
                  const isOutForDelivery = ord.status === 'Out for Delivery' || ord.status === 'Picked Up';
                  return (
                    <div key={ord.id} className="glass-card p-5 rounded-2xl space-y-3.5 border border-emerald-900/10 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                          {ord.id}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 font-bold rounded-full ${
                          isDelivered 
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                            : isOutForDelivery 
                              ? 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-600 animate-pulse'
                              : 'bg-emerald-900 text-amber-200'
                        }`}>
                          {isDelivered 
                            ? '✓ Delivered & Verified' 
                            : isOutForDelivery 
                              ? '🚚 Out for Delivery' 
                              : 'Order Placed'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-emerald-950 dark:text-white">
                        {language === 'hi' ? 'किसान:' : 'Farmer:'} {getLocalizedFarmer(ord.farmer_name || 'Ramesh Patil', language)}
                      </h3>

                      {ord.items && ord.items.length > 0 && (
                        <div className="bg-emerald-50/60 dark:bg-emerald-950/50 p-2.5 rounded-xl text-xs space-y-1 text-emerald-900 dark:text-emerald-200 border border-emerald-900/10 dark:border-emerald-500/20">
                          {ord.items.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between font-medium">
                              <span>{getLocalizedCropName(it.crop_name, language)} ({it.quantity} {it.unit})</span>
                              <span className="font-bold text-amber-800 dark:text-amber-300">₹{((it.quantity * it.unit_price_paise) / 100).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Detailed Delivery Destination */}
                      <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/60 rounded-xl border border-emerald-900/10 dark:border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-100 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1 text-emerald-900 dark:text-emerald-200">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            {language === 'hi' ? 'वितरण पता:' : 'Delivery Address:'} {stripIndicParens(ord.shipping?.fullName || ord.recipient_name || ord.buyer_name || 'Buyer')}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-white dark:bg-[#07170f] rounded-full border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                            {ord.shipping?.addressType === 'WORK' ? '🏢 Office/Shop' : ord.shipping?.addressType === 'MANDI_SHOP' ? '🏪 Mandi Shop' : '🏠 Home'}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 leading-snug">
                          {ord.shipping?.flatBuilding || ord.flat_building ? (
                            <>
                              {ord.shipping?.flatBuilding || ord.flat_building}, {ord.shipping?.areaStreet || ord.area_street}
                              {(ord.shipping?.landmark || ord.landmark) && `, Landmark: ${ord.shipping?.landmark || ord.landmark}`}
                              <br />
                              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                                Post Office: {ord.shipping?.postOffice || ord.post_office || '-'}, {ord.shipping?.district || ord.district || 'Pune'}, {ord.shipping?.state || ord.state || 'Maharashtra'} — {ord.shipping?.pincode || ord.pin_code || '411014'}
                              </span>
                            </>
                          ) : (
                            ord.delivery_address || 'Pune Delivery Collection Hub'
                          )}
                        </p>
                      </div>

                      {/* Driver Status Banner */}
                      <div className="p-2.5 bg-emerald-950/5 dark:bg-emerald-950/40 rounded-xl border border-emerald-900/10 dark:border-emerald-500/20 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                          <span className="font-bold text-emerald-950 dark:text-emerald-100">
                            {language === 'hi' ? 'चालक:' : 'Driver:'} {stripIndicParens(ord.driver_name || 'Vikram Shinde (Tata Ace)')}
                          </span>
                        </div>
                        {ord.driver_phone && (
                          <a
                            href={`tel:${ord.driver_phone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded hover:underline"
                          >
                            <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{ord.driver_phone}</span>
                          </a>
                        )}
                      </div>

                      {/* Zero-Trust Delivery OTP Card */}
                      <div className="p-3 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-600/30 dark:border-amber-500/30 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950 dark:text-amber-300">
                            <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                            <span>Delivery Verification OTP:</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-black px-2.5 py-0.5 bg-white dark:bg-[#07170f] border border-amber-300 dark:border-amber-500/40 rounded-lg text-emerald-950 dark:text-amber-200 tracking-wider shadow-xs">
                              {ord.delivery_otp || '----'}
                            </span>
                            {!isDelivered && (
                              <button
                                onClick={() => handleGenerateDeliveryOtp(ord.id)}
                                disabled={generatingDeliveryOtp[ord.id]}
                                title="Generate New OTP"
                                className="p-1 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-300 rounded-lg transition"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${generatingDeliveryOtp[ord.id] ? 'animate-spin text-amber-700' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-amber-900/90 dark:text-amber-200/80 leading-tight">
                          {isDelivered 
                            ? '✓ This OTP has been successfully verified. Payment has been released to the farmer.'
                            : '⚠️ Security Rule: Share this 4-digit code with the delivery agent only after receiving your produce safely and completing payment (if COD).'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-emerald-900/10 dark:border-emerald-500/20 flex items-center justify-between flex-wrap gap-2">
                        <div className="text-base font-extrabold text-amber-800 dark:text-amber-400">
                          ₹{(ord.total_amount_paise / 100).toFixed(2)}{' '}
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-normal">
                            ({ord.total_amount_paise} {t.paiseSuffix})
                          </span>
                        </div>

                        {!isDelivered ? (
                          <button
                            onClick={() => {
                              setActiveVerifyOrder(ord);
                              setVerifyOtpInput(ord.delivery_otp || '');
                              setVerifyMessage(null);
                            }}
                            className="text-xs font-bold bg-[#0F3826] text-amber-50 px-3.5 py-1.5 rounded-xl hover:bg-emerald-900 shadow-sm transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Verify Handover</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            Escrow Settled ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recurring Contracts */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>{t.buyerRecurringContractsHeader}</span>
            </h2>

            <div className="space-y-4">
              <div className="glass-card p-5 rounded-2xl space-y-3 border border-emerald-900/10 dark:border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-50">
                    Weekly Fresh Tomato Supply Contract
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 dark:border dark:border-emerald-500/30 font-bold rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-200">
                  100 kg Fresh Tomatoes dispatched every Monday & Thursday directly from Nashik FPO Hub.
                </p>
                <button className="w-full py-2 bg-emerald-900/10 dark:bg-emerald-800/40 hover:bg-emerald-900/20 dark:hover:bg-emerald-700/50 text-emerald-950 dark:text-emerald-100 dark:border dark:border-emerald-500/30 font-bold rounded-xl text-xs transition">
                  View Contract Terms (Escrow Protection)
                </button>
              </div>

              <div className="glass-card p-5 rounded-2xl space-y-3 border border-emerald-900/10 dark:border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-50">
                    Monthly Sharbati Wheat Supply Contract
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 dark:border dark:border-amber-500/30 font-bold rounded-full">
                    Ready for Renewal
                  </span>
                </div>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-200">
                  500 kg Sharbati Wheat monthly dispatch directly from Ujjain Silo Hub.
                </p>
                <button className="w-full py-2 bg-[#0F3826] dark:bg-emerald-700 text-amber-50 hover:bg-emerald-900 dark:hover:bg-emerald-600 font-bold rounded-xl text-xs shadow transition">
                  Renew Contract
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Posting Bulk Requirement */}
        {showAddReqModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#FAF5EB] dark:bg-[#0c2217] rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-emerald-900/20 dark:border-emerald-500/30 text-[#1A2E26] dark:text-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-500/20 pb-3">
                <h3 className="font-extrabold text-lg text-emerald-950 dark:text-emerald-50">
                  Post Bulk Demand Requirement
                </h3>
                <button
                  onClick={() => setShowAddReqModal(false)}
                  className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-full text-emerald-800 dark:text-emerald-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePostRequirement} className="space-y-4">
                {/* Buyer Name & Contact Input Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/90 dark:bg-emerald-950/60 p-3 rounded-2xl border border-amber-200/80 dark:border-emerald-500/30 shadow-sm">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Ramesh Traders / Name"
                      className="w-full px-3.5 py-2 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-white placeholder-emerald-800/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>Contact</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerContact}
                      onChange={(e) => setBuyerContact(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-white placeholder-emerald-800/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                      Required Quantity (kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={requiredQty}
                      onChange={(e) => setRequiredQty(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                      Max Price Rate (₹/kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={maxPriceRs}
                      onChange={(e) => setMaxPriceRs(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                    Delivery Location / Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryLoc}
                    onChange={(e) => setDeliveryLoc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddReqModal(false)}
                    className="flex-1 py-3 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 font-bold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl text-xs shadow-md transition"
                  >
                    Submit Requirement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Handover OTP Verification Modal */}
        {activeVerifyOrder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-[#FAF5EB] dark:bg-[#0c2217] max-w-md w-full rounded-3xl p-6 sm:p-7 border border-emerald-900/20 dark:border-emerald-500/30 shadow-2xl space-y-5 text-[#1A2E26] dark:text-[#E2E8F0]">
              <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-500/20 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-950 dark:text-white">
                      Delivery Handover Verification
                    </h3>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider block">
                      Smart Contract Escrow Release
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVerifyOrder(null)}
                  className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-full text-emerald-800 dark:text-emerald-300 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-emerald-900/80 dark:text-emerald-200/90 font-medium">
                  4-digit OTP to provide to the delivery agent for Order <strong className="font-mono text-emerald-950 dark:text-amber-300 font-bold">#{activeVerifyOrder.id}</strong>:
                </p>
                <div className="p-4 bg-amber-500/15 dark:bg-amber-500/10 rounded-2xl border border-amber-300/70 dark:border-amber-500/30 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-900 dark:text-amber-300 font-extrabold block">
                      Code for delivery agent:
                    </span>
                    <span className="text-3xl font-mono font-black tracking-widest text-emerald-950 dark:text-amber-100">
                      {activeVerifyOrder.delivery_otp || '----'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerifyOtpInput(activeVerifyOrder.delivery_otp || '')}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  4-digit OTP entered by delivery agent:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={verifyOtpInput}
                  onChange={(e) => setVerifyOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center text-3xl font-mono tracking-[0.4em] p-3.5 rounded-2xl border-2 border-emerald-900/30 dark:border-emerald-500/40 bg-white dark:bg-[#07170f] font-extrabold text-emerald-950 dark:text-white placeholder-emerald-900/30 dark:placeholder-emerald-500/30 focus:border-amber-500 dark:focus:border-amber-400 outline-none shadow-inner transition"
                />
              </div>

              {verifyMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold text-center ${
                    verifyMessage.type === 'success'
                      ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/70 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600'
                      : 'bg-red-100 text-red-950 dark:bg-red-900/70 dark:text-red-200 border border-red-300 dark:border-red-600'
                  }`}
                >
                  {verifyMessage.text}
                </div>
              )}

              <p className="text-[11px] text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20">
                🔒 <strong>Escrow Security Mechanism:</strong> Only after verifying this OTP will the order be marked as Delivered and payment released to the farmer from escrow.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveVerifyOrder(null)}
                  className="flex-1 py-3 border border-emerald-900/20 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200 font-bold rounded-xl text-xs hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyOtp(activeVerifyOrder.id, 'delivery')}
                  disabled={verifyingOtp || verifyOtpInput.length !== 4}
                  className="flex-1 py-3 bg-[#0F3826] hover:bg-emerald-900 text-amber-300 font-extrabold rounded-xl text-xs disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {verifyingOtp ? 'Verifying...' : 'Verify & Release Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Signal Toast */}
        {successSignal && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F3826] text-amber-50 px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-bounce">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-full animate-pulse">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-300">
                Confirmed Successfully ✓
              </p>
              <p className="text-xs font-medium text-amber-100/90">{successSignal}</p>
            </div>
          </div>
        )}
      </div>
    </PortalGuard>
  );
}
