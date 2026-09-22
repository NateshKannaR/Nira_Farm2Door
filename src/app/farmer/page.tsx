'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedCropName, getLocalizedGrade, getLocalizedLocation } from '@/lib/i18n';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import PortalGuard from '@/components/PortalGuard';
import BulmaProductCard from '@/components/BulmaProductCard';
import { CropCategory, ALL_AGRICULTURAL_CATEGORIES } from '@/lib/cropCategories';
import VoiceListingButton from '@/components/VoiceListingButton';
import TransitGatePassModal from '@/components/TransitGatePassModal';
import MandiArbitrageStudio from '@/components/MandiArbitrageStudio';

import {
  matchCropImagesByName,
  getCropLogoUrl,
  getCropPhotosByName
} from '@/lib/cropImageMatcher';
import {
  Tractor,
  Sprout,
  Plus,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  X,
  Loader2,
  Trash2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  ArrowRight,
  Search,
  Check,
  ShoppingBag,
  ExternalLink,
  Edit3,
  Save,
  RefreshCw,
  User,
  Phone,
  MapPin,
  Truck,
  Key,
  FileText
} from 'lucide-react';

export default function FarmerDashboardPage() {
  const { t, language } = useLanguage();
  const { userName } = useRole();
  const { user, verifyCredentials } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ivrResponse, setIvrResponse] = useState<string | null>(null);
  const [selectedKeypad, setSelectedKeypad] = useState('1');
  const [successSignal, setSuccessSignal] = useState<
    | string
    | {
      cropName: string;
      cropNameHi: string;
      logo: string;
      photos: string[];
      details: string[];
    }
    | null
  >(null);
  const [viewFormat, setViewFormat] = useState<'bulma' | 'table'>('bulma');

  // Security Verification Delete Modal State
  const [cropToDelete, setCropToDelete] = useState<{ id: string; name: string } | null>(null);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showVerifyPass, setShowVerifyPass] = useState(false);
  const [isVerifyingDelete, setIsVerifyingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 3 Main Sections: 'products' (My Products), 'orders' (Received Orders) & 'arbitrage' (Mandi Comparison)
  const [farmerActiveSection, setFarmerActiveSection] = useState<'products' | 'orders' | 'arbitrage'>('products');
  const [showInlineAddForm, setShowInlineAddForm] = useState(false);
  const [showGatePassModal, setShowGatePassModal] = useState(false);
  const [gatePassConsignment, setGatePassConsignment] = useState<any>(null);

  // Form states for adding/updating produce
  const [editingCropId, setEditingCropId] = useState<string | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [cropName, setCropName] = useState('');
  const [cropNameHi, setCropNameHi] = useState('');
  const [category, setCategory] = useState<CropCategory>('Vegetables');
  const [variety, setVariety] = useState('');
  const [quantityKg, setQuantityKg] = useState('500');
  const [unit, setUnit] = useState('kg');
  const [basePriceRupees, setBasePriceRupees] = useState('30');
  const [grade, setGrade] = useState('A+');
  const [location, setLocation] = useState('Nashik Mandi Collection Hub');
  const [isOrganic, setIsOrganic] = useState(false);

  // Photos State
  const [photos, setPhotos] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [photoError, setPhotoError] = useState<string | null>(null);

  // User-isolated active listings
  const [myListings, setMyListings] = useState<any[]>([]);
  const [isSeedingAll, setIsSeedingAll] = useState(false);
  const [seedStatusMessage, setSeedStatusMessage] = useState<string | null>(null);

  // Live Farmer Orders & Pickup OTP State
  const [farmerOrders, setFarmerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activePickupOrder, setActivePickupOrder] = useState<any | null>(null);
  const [pickupOtpInput, setPickupOtpInput] = useState('');
  const [verifyingPickup, setVerifyingPickup] = useState(false);
  const [pickupMessage, setPickupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);



  const loadCrops = async () => {
    const currentFarmerId = user?.id || 'u_farmer_1';

    try {
      const res = await fetch(`/api/v1/crops?farmerId=${encodeURIComponent(currentFarmerId)}`);
      const data = await res.json();
      let apiCrops: any[] = [];
      if (data.success && data.crops && data.crops.length > 0) {
        apiCrops = data.crops.map((c: any) => {
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

          return {
            id: String(c.id),
            crop: c.crop_name,
            qty: c.quantity_available,
            priceRupees: (c.price_paise / 100).toFixed(2),
            pricePaise: c.price_paise,
            grade: c.grade || 'Grade A+',
            location: c.location || 'Nashik Mandi Collection Hub',
            status: 'VERIFIED',
            imageUrl: photoList[0],
            photos: photoList,
            farmerId: c.farmer_id,
            category: c.category || 'Vegetables',
            unit: c.unit || 'kg',
            isOrganic: c.organic_certified || 0,
            harvestDate: c.harvest_date || '2026-09-08',
            cvTrustScore: 97,
          };
        });
      }

      // Get local storage crops specifically belonging to this logged-in farmer
      let localCrops: any[] = [];
      try {
        const stored = JSON.parse(localStorage.getItem('kb_custom_crops') || '[]');
        localCrops = stored.filter((item: any) => item.farmerId === currentFarmerId);
      } catch (e) { }

      const combined = [...localCrops, ...apiCrops];
      // Deduplicate by ID
      const seen = new Set();
      const uniqueCrops = combined.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      setMyListings(uniqueCrops);
    } catch (e) {
      console.error('Error fetching crops from backend:', e);
    }
  };

  const loadFarmerOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`/api/v1/orders?userId=${encodeURIComponent(user?.id || 'u_farmer_1')}&role=FARMER`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setFarmerOrders(data.orders);
      }
    } catch (e) {
      console.error('Error loading farmer orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const [generatingOtp, setGeneratingOtp] = useState<Record<string, boolean>>({});
  const [handshakeModalOrder, setHandshakeModalOrder] = useState<any>(null);

  const handleGeneratePickupOtp = async (orderId: string) => {
    setGeneratingOtp((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch('/api/v1/orders/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, otpType: 'pickup' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || (language === 'hi' ? 'OTP जनरेट करने में विफल' : 'Failed to generate OTP'));
      }
      await loadFarmerOrders();
      const current = farmerOrders.find((o) => o.id === orderId) || {};
      setHandshakeModalOrder({
        ...current,
        id: orderId,
        pickup_otp: data.otp,
      });
    } catch (err: any) {
      alert(err.message || (language === 'hi' ? 'OTP जनरेट करने में समस्या आई।' : 'Error generating OTP.'));
    } finally {
      setGeneratingOtp((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    loadCrops();
    loadFarmerOrders();
    const handleOrderUpdate = () => loadFarmerOrders();
    window.addEventListener('kb_order_updated', handleOrderUpdate);
    const interval = setInterval(loadFarmerOrders, 6000);
    return () => {
      window.removeEventListener('kb_order_updated', handleOrderUpdate);
      clearInterval(interval);
    };
  }, [user?.id]);

  const triggerSuccessSignal = (
    msg:
      | string
      | {
        cropName: string;
        cropNameHi: string;
        logo: string;
        photos: string[];
        details: string[];
      }
  ) => {
    setSuccessSignal(msg);
    setTimeout(() => {
      setSuccessSignal(null);
    }, 4000);
  };

  const handleSimulateIvr = async () => {
    try {
      const res = await fetch('/api/v1/ivr/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dtmfInput: selectedKeypad }),
      });
      const data = await res.json();
      if (data.success) {
        setIvrResponse(data.simulatedAudioResponseHindi);
        triggerSuccessSignal(
          language === 'hi' ? 'IVR वॉयस प्रविष्टि सफलतापूर्वक दर्ज की गई!' : 'IVR Voice Entry Registered Successfully!'
        );
      }
    } catch (e) {
      setIvrResponse(language === 'hi' ? 'IVR वॉयस सेवा: "1 बटन दबाया गया — 500 किग्रा टमाटर सफलतापूर्वक दर्ज हो गए हैं।\"' : 'IVR Voice Service: "Pressed 1 — 500 kg Tomatoes registered successfully."');
    }
  };

  // Simple Crop Name Change without auto-photo generation
  const handleCropNameChange = (val: string) => {
    setCropName(val);
  };

  // Photo handlers (supports multiple file upload from camera/device)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 6 - photos.length;
    if (remainingSlots <= 0) {
      alert(language === 'hi' ? 'अधिकतम 6 तस्वीरें ही जोड़ी जा सकती हैं' : 'Maximum 6 photos allowed');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const validFiles = filesToProcess.filter((f) => f.size <= 5 * 1024 * 1024);

    if (validFiles.length < filesToProcess.length) {
      alert(language === 'hi' ? 'कुछ फोटो 5MB से बड़ी थीं और छोड़ दी गईं' : 'Some photos exceeded 5MB and were skipped');
    }

    const readPromises = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newPhotos) => {
      setPhotos((prev) => [...prev, ...newPhotos]);
    });
    e.target.value = '';
  };

  const handleStartAddProduce = (cat?: CropCategory) => {
    setEditingCropId(null);
    if (cat) setCategory(cat);
    setCropName('');
    setCropNameHi('');
    setVariety('Local Harvest (Desi Variety)');
    setQuantityKg('500');
    setBasePriceRupees('40');
    setGrade('A+');
    setShowInlineAddForm(true);
    setTimeout(() => formContainerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleVoiceExtracted = (data: any) => {
    setEditingCropId(null);
    if (data.category) setCategory(data.category);
    if (data.cropName) setCropName(data.cropName);
    if (data.cropNameHi) setCropNameHi(data.cropNameHi);
    if (data.quantityKg) setQuantityKg(String(data.quantityKg));
    if (data.basePriceRupees) setBasePriceRupees(String(data.basePriceRupees));
    if (data.variety) setVariety(data.variety);
    if (data.grade) setGrade(data.grade);
    setShowInlineAddForm(true);
    triggerSuccessSignal(
      language === 'hi'
        ? `🎙️ वॉयस विवरण दर्ज: ${data.extractedSummary}`
        : `🎙️ Voice details auto-filled: ${data.extractedSummary}`
    );
    setTimeout(() => formContainerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleStartEditCrop = (crop: any) => {
    setEditingCropId(crop.id);
    setCropName(crop.crop || crop.crop_name || '');
    setCropNameHi(crop.crop_name_hi || '');
    setCategory(crop.category || 'Vegetables');
    setVariety(crop.variety || 'Local Harvest (Desi Variety)');
    setQuantityKg(String(crop.qty || crop.quantity_available || '500'));
    setBasePriceRupees(String(crop.priceRupees || (crop.pricePaise ? (crop.pricePaise / 100).toFixed(2) : '34')));
    setGrade(crop.grade || 'A+');
    setLocation(crop.location || 'Nashik Mandi Collection Hub');
    setUnit(crop.unit || 'kg');
    setIsOrganic(
      crop.isOrganic === 1 ||
      String(crop.grade || '').includes('जैविक') ||
      String(crop.grade || '').includes('Organic')
    );

    let cropPhotos: string[] = [];
    if (Array.isArray(crop.photos) && crop.photos.length > 0) {
      cropPhotos = crop.photos;
    } else if (crop.imageUrl) {
      cropPhotos = [crop.imageUrl];
    }
    setPhotos(cropPhotos);
    setPhotoError(null);
    setShowInlineAddForm(true);

    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    triggerSuccessSignal(
      language === 'hi'
        ? `✏️ फसल "${crop.crop || crop.crop_name}" संपादन मोड सक्रिय`
        : `✏️ Editing "${crop.crop || crop.crop_name}"`
    );
  };

  const handleCancelEdit = () => {
    setEditingCropId(null);
    setCropName('');
    setCropNameHi('');
    setVariety('Local Harvest (Desi Variety)');
    setQuantityKg('500');
    setBasePriceRupees('40');
    setGrade('A+');
    setPhotos([]);
    setPhotoError(null);
    triggerSuccessSignal(
      language === 'hi'
        ? 'संपादन रद्द किया गया'
        : 'Edit cancelled'
    );
  };

  const handleAddUrlPhoto = () => {
    if (!urlInput.trim()) return;
    if (photos.length >= 6) {
      alert(language === 'hi' ? 'अधिकतम 6 तस्वीरें ही जोड़ी जा सकती हैं' : 'Maximum 6 photos allowed');
      return;
    }
    setPhotos((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
    setPhotoError(null);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    setPhotoError(null);
  };

  // Produce Submission (Farmer Desk to Buyer) - Handles Both New Registration & Existing Update
  const handleAddProduce = async (e: React.FormEvent) => {
    e.preventDefault();

    // Optional photos check (max 6)
    if (photos.length > 6) {
      setPhotoError(
        language === 'hi'
          ? 'अधिकतम 6 तस्वीरें ही अनुमत हैं!'
          : 'Maximum 6 photos allowed!'
      );
      return;
    }
    setIsSubmitting(true);
    setPhotoError(null);

    // ============================================
    // BRANCH A: UPDATE EXISTING UNLISTED CROP
    // ============================================
    if (editingCropId) {
      const updatedCrop = {
        id: editingCropId,
        crop: cropName || 'Updated Crop',
        crop_name: cropName || 'Updated Crop',
        crop_name_hi: cropNameHi,
        category: category,
        variety: variety,
        qty: parseInt(quantityKg) || 500,
        quantity_available: parseInt(quantityKg) || 500,
        priceRupees: basePriceRupees || '34.00',
        pricePaise: Math.round((parseFloat(basePriceRupees) || 34) * 100),
        grade: grade,
        location: location,
        status: 'VERIFIED',
        imageUrl: photos[0],
        photos: photos,
        unit: unit,
        farmerId: user?.id || 'u_farmer_1',
        farmer_name: user?.name || userName || 'Farmer',
        isOrganic: 0,
        harvestDate: new Date().toISOString().split('T')[0],
        cvTrustScore: 98,
        isCustom: true,
      };

      try {
        await fetch('/api/v1/crops', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCropId,
            cropName: cropName || 'Updated Crop',
            quantityKg: quantityKg || '500',
            priceRupees: basePriceRupees || '34.00',
            grade: grade,
            location: location,
            farmerId: user?.id || 'u_farmer_1',
            category: category,
            unit: unit,
            images: photos,
            isOrganic: 0,
          }),
        });
      } catch (err) {
        console.log('Backend update fallback to local storage:', err);
      } finally {
        setMyListings((prev) => prev.map((item) => (item.id === editingCropId ? updatedCrop : item)));

        try {
          const stored = JSON.parse(localStorage.getItem('kb_custom_crops') || '[]');
          const updatedStored = stored.map((item: any) => (item.id === editingCropId ? updatedCrop : item));
          if (!stored.some((item: any) => item.id === editingCropId)) {
            updatedStored.unshift(updatedCrop);
          }
          localStorage.setItem('kb_custom_crops', JSON.stringify(updatedStored));
        } catch (e) { }

        setIsSubmitting(false);
        setEditingCropId(null);
        setShowInlineAddForm(false);
        triggerSuccessSignal({
          cropName,
          cropNameHi: cropNameHi || cropName,
          logo: photos[0] || getCropLogoUrl(cropName),
          photos: photos.slice(0, 6),
          details: [category, variety, `${quantityKg} ${unit}`, grade, location],
        });
      }
      return;
    }

    // ============================================
    // BRANCH B: ADD NEW PRODUCE
    // ============================================
    const fallbackCrop = {
      id: String(Date.now()),
      crop: cropName || 'New Produce',
      crop_name: cropName || 'New Produce',
      crop_name_hi: cropNameHi,
      category: category,
      variety: variety,
      qty: parseInt(quantityKg) || 500,
      quantity_available: parseInt(quantityKg) || 500,
      priceRupees: basePriceRupees || '34.00',
      pricePaise: Math.round((parseFloat(basePriceRupees) || 34) * 100),
      grade: grade,
      location: location,
      status: 'VERIFIED',
      imageUrl: photos[0] || getCropPhotosByName(cropName)[0],
      photos: photos.length > 0 ? photos : getCropPhotosByName(cropName),
      unit: unit,
      farmerId: user?.id || 'u_farmer_1',
      farmer_name: user?.name || userName || 'Farmer',
      isOrganic: isOrganic ? 1 : 0,
      harvestDate: new Date().toISOString().split('T')[0],
      cvTrustScore: 98,
      isCustom: true,
    };

    let cropToAdd = fallbackCrop;

    try {
      const res = await fetch('/api/v1/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: cropName || 'New Produce',
          quantityKg: quantityKg || '500',
          priceRupees: basePriceRupees || '34.00',
          grade: grade,
          location: location,
          farmerId: user?.id || 'u_farmer_1',
          farmerName: user?.name || userName,
          category: category,
          unit: unit,
          images: photos,
        }),
      });

      const data = await res.json();
      if (data.success && data.crop) {
        cropToAdd = {
          id: String(data.crop.id),
          crop: data.crop.crop,
          crop_name: data.crop.crop,
          crop_name_hi: cropNameHi,
          category: category,
          variety: variety,
          qty: data.crop.qty,
          quantity_available: data.crop.qty,
          priceRupees: data.crop.priceRupees,
          pricePaise: Math.round(parseFloat(data.crop.priceRupees) * 100),
          grade: data.crop.grade || grade,
          location: data.crop.location,
          status: 'VERIFIED',
          imageUrl: photos[0] || getCropPhotosByName(cropName)[0],
          photos: photos.length > 0 ? photos : getCropPhotosByName(cropName),
          unit: unit,
          farmerId: user?.id || 'u_farmer_1',
          farmer_name: user?.name || userName || 'Farmer',
          isOrganic: isOrganic ? 1 : 0,
          harvestDate: new Date().toISOString().split('T')[0],
          cvTrustScore: 98,
          isCustom: true,
        };
      }
    } catch (err) {
      console.log('Backend insert fallback to local storage:', err);
    } finally {
      setMyListings((prev) => [cropToAdd, ...prev]);

      // Save to localStorage as persistent fallback sync
      try {
        const stored = JSON.parse(localStorage.getItem('kb_custom_crops') || '[]');
        localStorage.setItem('kb_custom_crops', JSON.stringify([cropToAdd, ...stored]));
      } catch (e) { }

      setIsSubmitting(false);
      setShowInlineAddForm(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('kb_crop_added'));
        window.dispatchEvent(new Event('storage'));
      }
      triggerSuccessSignal({
        cropName,
        cropNameHi: cropNameHi || cropName,
        logo: photos[0] || getCropLogoUrl(cropName),
        photos: photos.slice(0, 6),
        details: [category, variety, `${quantityKg} ${unit}`, grade, location],
      });
    }
  };


  const openDeleteModal = (id: string, cropNameStr: string) => {
    setCropToDelete({ id, name: cropNameStr });
    setVerifyEmail(user?.email || '');
    setVerifyPassword('');
    setDeleteError(null);
  };

  const handleConfirmDelete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropToDelete) return;

    setIsVerifyingDelete(true);
    setDeleteError(null);

    try {
      const id = cropToDelete.id;
      setMyListings((prev) => prev.filter((item) => item.id !== id));

      try {
        const stored = JSON.parse(localStorage.getItem('kb_custom_crops') || '[]');
        const filtered = stored.filter((item: any) => item.id !== id);
        localStorage.setItem('kb_custom_crops', JSON.stringify(filtered));
      } catch (e) { }

      try {
        const res = await fetch(`/api/v1/crops?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok && data?.message) {
          throw new Error(data.message);
        }
      } catch (err: any) {
        console.error('Delete crop API error:', err);
      }

      await loadCrops();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kb_crop_deleted', { detail: { id } }));
      }

      setCropToDelete(null);
      triggerSuccessSignal(
        language === 'hi' ? `फसल सफलतापूर्वक हटा दी गई!` : `Crop deleted successfully!`
      );
    } catch (err: any) {
      setDeleteError(err?.message || 'An error occurred during deletion.');
    } finally {
      setIsVerifyingDelete(false);
    }
  };

  return (
    <PortalGuard
      requiredRole="FARMER"
      portalName={language === 'hi' ? 'किसान डैशबोर्ड (Farmer Desk)' : 'Farmer Desk'}
      portalDescription={
        language === 'hi'
          ? 'यह पोर्टल केवल पंजीकृत किसानों के लिए सुरक्षित है जहाँ वे अपनी फसलों को 2 से 6 तस्वीरों के साथ पंजीकृत करके सीधे खरीदारों तक पहुँचा सकते हैं।'
          : 'This portal is restricted to registered Farmers to list, photograph (2-6 mandatory photos), and sell produce directly to buyers.'
      }
    >
      <div className="space-y-8">
        {/* Top Welcome Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0F3826] text-amber-50 p-6 rounded-3xl shadow-xl border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl">
              <Tractor className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-emerald-950 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                {t.farmerBadge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                {t.farmerWelcome}{userName ? `, ${userName}` : ''}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5">
                {language === 'hi'
                  ? 'फसल जोड़ें और सीधे खरीदार पोर्टल (Buyer Desk) तक पहुँचाएं'
                  : 'Add produce and broadcast directly to Buyer Desk'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <VoiceListingButton onExtracted={handleVoiceExtracted} />

            <button
              onClick={() => {
                setGatePassConsignment({
                  cropName: myListings[0]?.crop || 'Fresh Farm Produce',
                  quantityKg: myListings[0]?.qty || 500,
                  farmerName: userName || 'Ramesh Patil',
                  farmerVillage: 'Pimpalgaon Baswant, Nashik, MH',
                  buyerName: 'Verified Direct Buyer Hub',
                  vehicleNumber: 'MH-15-EG-8821',
                  driverName: 'Vikram Shinde',
                });
                setShowGatePassModal(true);
              }}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? '🏛️ राजकीय गेट पास' : '🏛️ Transit Gate Pass'}</span>
            </button>

            <button
              onClick={() => {
                handleCancelEdit();
                setShowInlineAddForm(true);
                setTimeout(() => formContainerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-extrabold rounded-xl shadow-lg hover:from-emerald-500 hover:to-emerald-600 transition flex items-center gap-2 text-sm border border-emerald-400/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? '+ नया उत्पाद जोड़ें' : '+ Add Product'}</span>
            </button>
          </div>
        </div>


        {/* ===================================================
            3 MAIN SECTIONS SWITCHER: "MY PRODUCTS", "ORDERS" & "MANDI ARBITRAGE"
            =================================================== */}
        <div className="flex items-center justify-center p-2 bg-[#072417]/90 dark:bg-[#03140c]/95 backdrop-blur-xl rounded-3xl max-w-2xl mx-auto border-2 border-amber-500/40 shadow-2xl">
          <button
            type="button"
            id="tab-my-products"
            onClick={() => setFarmerActiveSection('products')}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              farmerActiveSection === 'products'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-emerald-950 shadow-xl scale-[1.02] ring-2 ring-white/50'
                : 'text-amber-100/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-950/80 shrink-0" />
            <span>{language === 'hi' ? 'मेरे उत्पाद' : 'My Products'}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-extrabold shadow-xs ${
              farmerActiveSection === 'products' ? 'bg-emerald-950 text-amber-300' : 'bg-amber-500/25 text-amber-300'
            }`}>
              {myListings.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-received-orders"
            onClick={() => setFarmerActiveSection('orders')}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              farmerActiveSection === 'orders'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-emerald-950 shadow-xl scale-[1.02] ring-2 ring-white/50'
                : 'text-amber-100/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-950/80 shrink-0" />
            <span>{language === 'hi' ? 'आया Orders' : 'Orders'}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-extrabold shadow-xs ${
              farmerActiveSection === 'orders' ? 'bg-emerald-950 text-amber-300' : 'bg-amber-500/25 text-amber-300'
            }`}>
              {farmerOrders.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-mandi-arbitrage"
            onClick={() => setFarmerActiveSection('arbitrage')}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              farmerActiveSection === 'arbitrage'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-emerald-950 shadow-xl scale-[1.02] ring-2 ring-white/50'
                : 'text-amber-100/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-950/80 shrink-0" />
            <span>{language === 'hi' ? 'मंडी लाभ तुलना' : 'Mandi Arbitrage'}</span>
          </button>
        </div>

        {/* ===================================================
            SECTION 2: INCOMING BUYER ORDERS & SECURE PICKUP OTP
            =================================================== */}
        {farmerActiveSection === 'orders' && (
        <div className="glass-card p-6 rounded-3xl border border-emerald-900/10 shadow-lg space-y-4 bg-gradient-to-r from-emerald-900/5 via-white to-amber-500/5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-900/10 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-extrabold text-emerald-950">
                {language === 'hi' ? 'आया हुआ Orders (Received Buyer Orders)' : 'Received Buyer Orders & Secure Pickup'}
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                {farmerOrders.length} {language === 'hi' ? 'ऑर्डर' : 'Orders'}
              </span>
            </div>
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {language === 'hi' ? 'शून्य-जोखिम हैंडओवर OTP' : 'Zero-Risk Pickup Handover'}
            </span>
          </div>

          {loadingOrders ? (
            <div className="p-6 text-center text-xs text-emerald-800 font-medium">
              {language === 'hi' ? 'लोड हो रहा है... (Loading orders...)' : 'Loading orders...'}
            </div>
          ) : farmerOrders.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-800/70">
              {language === 'hi' ? 'अभी कोई लंबित पिकअप ऑर्डर नहीं है। जैसे ही कोई खरीदार आपकी फसल खरीदेगा, उसका पिकअप OTP यहाँ दिखेगा।' : 'No pending pickup orders. As soon as a buyer orders your produce, the pickup OTP will appear here.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmerOrders.map((ord) => {
                const isDelivered = ord.status === 'Delivered';
                const isPickedUp = ord.status === 'Out for Delivery' || ord.status === 'Delivered' || ord.delivery_status === 'IN_TRANSIT' || ord.delivery_status === 'DELIVERED';
                const hasDriver = ord.driver_name && ord.driver_name !== 'Pending';

                return (
                  <div key={ord.id} className="p-4 bg-white rounded-2xl border border-emerald-900/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-800">#{ord.id}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 font-extrabold rounded-full ${
                        isDelivered
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isPickedUp
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      }`}>
                        {isDelivered 
                          ? (language === 'hi' ? '✓ खरीदार को डिलीवर हुआ' : '✓ Delivered to Buyer')
                          : isPickedUp 
                          ? (language === 'hi' ? '🚚 माल रास्ते में है (In Transit)' : '🚚 In Transit with Driver')
                          : (language === 'hi' ? '⏳ खेत पिकअप प्रतीक्षारत' : '⏳ Awaiting Farm Pickup')}
                      </span>
                    </div>

                    {/* Assigned Driver Details */}
                    <div className="p-2.5 bg-emerald-950/5 rounded-xl border border-emerald-900/10 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-950 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{language === 'hi' ? 'लॉजिस्टिक्स ड्राइवर:' : 'Logistics Driver:'}</span>
                        </span>
                        <span className="font-extrabold text-emerald-900">
                          {hasDriver ? ord.driver_name : (language === 'hi' ? 'ड्राइवर खोज जारी...' : 'Searching for Driver...')}
                        </span>
                      </div>
                      {hasDriver && (
                        <div className="flex items-center justify-between text-[11px] text-emerald-800/90 pt-0.5">
                          <span>{language === 'hi' ? 'वाहन:' : 'Vehicle:'} <strong>{ord.driver_vehicle || 'MH-15-EG-8821'}</strong></span>
                          {ord.driver_phone && (
                            <a
                              href={`tel:${ord.driver_phone}`}
                              className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline bg-emerald-100 px-2 py-0.5 rounded"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{ord.driver_phone}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Buyer & Destination Address Card */}
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-900/10 space-y-1.5 text-xs text-emerald-950">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold flex items-center gap-1.5 text-emerald-950">
                          <User className="w-3.5 h-3.5 text-emerald-700" />
                          {ord.shipping?.fullName || ord.recipient_name || ord.buyer_name || (language === 'hi' ? 'क्रेता' : 'Buyer')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-white border border-emerald-200 rounded-full font-bold text-emerald-800">
                          {ord.shipping?.addressType === 'WORK' ? (language === 'hi' ? '🏢 दुकान/ऑफिस' : '🏢 Shop/Office') : ord.shipping?.addressType === 'MANDI_SHOP' ? (language === 'hi' ? '🏪 थोक मंडी' : '🏪 Wholesale Mandi') : (language === 'hi' ? '🏠 घर' : '🏠 Home')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-emerald-900">
                        <a
                          href={`tel:${ord.shipping?.mobileNumber || ord.recipient_phone || ord.buyer_phone || ''}`}
                          className="flex items-center gap-1 font-bold text-emerald-800 hover:underline"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          +91 {ord.shipping?.mobileNumber || ord.recipient_phone || ord.buyer_phone || '9811122233'}
                        </a>
                      </div>

                      <div className="text-[11px] text-emerald-900/90 leading-tight space-y-0.5 pt-1.5 border-t border-emerald-900/10">
                        <p className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            {ord.shipping?.flatBuilding || ord.flat_building ? (
                              <>
                                <strong>{ord.shipping?.flatBuilding || ord.flat_building}</strong>, {ord.shipping?.areaStreet || ord.area_street}
                              </>
                            ) : (
                              ord.delivery_address
                            )}
                          </span>
                        </p>
                      </div>
                    </div>

                    {ord.items && ord.items.length > 0 && (
                      <div className="bg-emerald-50/50 p-2 rounded-lg text-[11px] space-y-0.5 text-emerald-900">
                        {ord.items.map((it: any, i: number) => (
                          <div key={i} className="flex justify-between">
                            <span>{it.crop_name}</span>
                            <span className="font-bold">{it.quantity} {it.unit}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Farmer Handshake & Pickup OTP Box */}
                    {!isPickedUp ? (
                      <div className="p-3 bg-amber-500/15 border border-amber-300 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950">{language === 'hi' ? 'ड्राइवर को देने वाला पिकअप OTP:' : 'Pickup OTP for Driver:'}</span>
                          <span className="font-mono text-base font-black text-emerald-950 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 tracking-widest shadow-xs">
                            {ord.pickup_otp || '----'}
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-900 leading-tight">
                          {language === 'hi' ? '⚠️ माल अपनी निगरानी में गाड़ी में चढ़ाने के बाद ही ड्राइवर को यह कोड दें।' : '⚠️ Share this OTP with the driver only after produce is fully loaded.'}
                        </p>
                        <button
                          onClick={() => handleGeneratePickupOtp(ord.id)}
                          disabled={generatingOtp[ord.id]}
                          className="w-full py-2 bg-[#0F3826] hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          <span>{generatingOtp[ord.id] ? (language === 'hi' ? 'OTP जनरेट हो रहा...' : 'Generating OTP...') : (language === 'hi' ? '🤝 हैंडशेक करें / OTP जनरेट करें' : '🤝 Generate Handshake Pickup OTP')}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {isDelivered 
                            ? (language === 'hi' ? 'खरीदार को सुपुर्द • भुगतान खाते में सुरक्षित' : 'Delivered to Buyer • Payment Secured in Escrow')
                            : (language === 'hi' ? 'खेत से माल लोड हो चुका है • ड्राइवर रास्ते में है' : 'Loaded from Farm • In Transit with Driver')}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-emerald-900/10 flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-extrabold text-amber-800 dark:text-amber-300">
                        {language === 'hi' ? 'कुल राशि:' : 'Total Amount:'} ₹{(ord.total_amount_paise / 100).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setGatePassConsignment({
                              orderId: ord.id,
                              cropName: ord.items?.[0]?.crop_name || 'Fresh Produce',
                              quantityKg: ord.items?.[0]?.quantity || 500,
                              farmerName: userName || 'Ramesh Patil',
                              farmerVillage: 'Pimpalgaon Baswant, Nashik, MH',
                              buyerName: ord.buyer_name || 'Verified Direct Buyer Hub',
                              destinationAddress: ord.delivery_address || 'Direct Buyer Mandi Collection Hub',
                              vehicleNumber: ord.driver_vehicle || 'MH-15-EG-8821',
                              driverName: ord.driver_name || 'Vikram Shinde',
                              driverPhone: ord.driver_phone || '+91 99000 11122',
                              pickupOtpVerified: isPickedUp,
                            });
                            setShowGatePassModal(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{language === 'hi' ? 'गेट पास' : 'Gate Pass'}</span>
                        </button>

                        <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
                          {ord.payment_method === 'COD' ? (language === 'hi' ? 'COD' : 'COD') : (language === 'hi' ? 'एस्क्रो सुरक्षित' : 'Escrow')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* ===================================================
            SECTION 3: MANDI ARBITRAGE & PRICE COMPARISON
            =================================================== */}
        {farmerActiveSection === 'arbitrage' && (
          <div className="animate-fadeIn">
            <MandiArbitrageStudio />
          </div>
        )}

        {/* ===================================================
            SECTION 1: MY PRODUCTS (मेरे उत्पाद)
            =================================================== */}
        {farmerActiveSection === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            {/* My Products Top Action Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-900/15 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 rounded-2xl text-emerald-800 dark:text-emerald-300">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-50">
                      {language === 'hi' ? 'मेरे पंजीकृत उत्पाद (My Products)' : 'My Registered Products'}
                    </h2>
                    <span className="px-2.5 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-900 rounded-full">
                      {myListings.length} {language === 'hi' ? 'फसलें' : 'Items'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 mt-0.5">
                    {language === 'hi' 
                      ? 'यहाँ आपके खेत की सभी फसलें सूचीबद्ध हैं। नया उत्पाद जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें।' 
                      : 'All crops listed by you are managed here. Click "+ Add Product" to register new produce.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  id="btn-add-new-product"
                  onClick={() => setShowInlineAddForm(!showInlineAddForm)}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition shadow-md cursor-pointer ${
                    showInlineAddForm
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-emerald-600 border border-emerald-400/30'
                  }`}
                >
                  {showInlineAddForm ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>{language === 'hi' ? 'प्रविष्टि फॉर्म बंद करें' : 'Close Form'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>{language === 'hi' ? '+ नया उत्पाद जोड़ें' : '+ Add Product'}</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Produce Registration Form (Visible when toggled or in Edit mode) */}
            {(showInlineAddForm || editingCropId) && (
              <div ref={formContainerRef} className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6 bg-gradient-to-b from-white via-white to-amber-50/40 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-700/20 text-emerald-900 font-extrabold text-[11px] rounded-full border border-emerald-700/30">
                  {language === 'hi' ? 'किसान डेस्क' : 'Farmer Desk'}
                </span>
                {editingCropId && (
                  <span className="px-2.5 py-0.5 bg-amber-500 text-emerald-950 font-black text-[11px] rounded-full shadow-xs flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>{language === 'hi' ? '✏️ संपादन मोड सक्रिय' : '✏️ Edit Mode Active'}</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 mt-1">
                {editingCropId
                  ? (language === 'hi' ? `फसल विवरण अपडेट करें: "${cropName}"` : `Update Crop: "${cropName}"`)
                  : (language === 'hi' ? 'नया उत्पाद जोड़ें (Add Produce)' : 'Register Produce')}
              </h2>
              <p className="text-xs text-emerald-800/70">
                {language === 'hi'
                  ? 'अपनी फसल का विवरण दर्ज करें और सीधे खरीदार पोर्टल पर बिक्री शुरू करें।'
                  : 'Enter crop details to publish directly to buyers across India.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {editingCropId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{language === 'hi' ? 'संपादन रद्द करें' : 'Cancel Edit'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowInlineAddForm(false);
                  if (editingCropId) handleCancelEdit();
                }}
                className="px-3.5 py-2 bg-gray-200 hover:bg-gray-300 text-emerald-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>{language === 'hi' ? 'फॉर्म बंद करें' : 'Close'}</span>
              </button>
            </div>
          </div>

          {/* Active Editing Notification Banner */}
          {editingCropId && (
            <div className="p-3 bg-amber-400/20 border-2 border-amber-500/50 rounded-xl flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                <div>
                  <span className="text-xs font-black text-emerald-950">
                    {language === 'hi' ? '✏️ संपादन मोड सक्रिय:' : '✏️ Edit Mode Active:'}{' '}
                    <span className="text-amber-900 underline">{cropName}</span> ({category})
                  </span>
                  <p className="text-[10px] text-emerald-900/70">
                    {language === 'hi'
                      ? 'नीचे दिए गए विवरण बदलकर "अपडेट करें" पर क्लिक करें।'
                      : 'Update fields below and click "Update".'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 font-extrabold text-[11px] rounded-lg border border-red-300 transition shrink-0 cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          )}


          {/* Quick Insert Form Container */}
          <form onSubmit={handleAddProduce} className="space-y-6 pt-2">
            {/* Upper: Product Name & Category */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    {language === 'hi' ? 'फसल का नाम (अंग्रेज़ी / मुख्य)' : 'Crop Name (Primary)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Onion, Potato, Tomato..."
                    value={cropName}
                    onChange={(e) => handleCropNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    {language === 'hi' ? 'फसल का हिंदी नाम' : 'Crop Hindi Name'}
                  </label>
                  <input
                    type="text"
                    value={cropNameHi}
                    onChange={(e) => setCropNameHi(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    {language === 'hi' ? 'श्रेणी (Category)' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    {ALL_AGRICULTURAL_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {language === 'hi' ? cat.labelHi : cat.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ===================================================
                MIDDLE: CROP PHOTOS
                =================================================== */}
            <div className="p-4 sm:p-5 bg-emerald-950/5 rounded-2xl border-2 border-emerald-900/15 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      {language === 'hi' ? 'फसल की तस्वीरें (Crop Photos)' : 'Crop Photos'}
                    </h3>
                    <p className="text-[11px] text-emerald-800/80">
                      {language === 'hi'
                        ? 'कैमरा / डिवाइस से फोटो चुनें या इमेज URL लिंक डालें।'
                        : 'Upload photo from device/camera or enter image URL link.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-sm bg-emerald-800 text-amber-200">
                    <Camera className="w-3.5 h-3.5" />
                    <span>
                      {photos.length > 0 ? `${photos.length}/6 Photos` : (language === 'hi' ? 'फोटो जोड़ें' : 'Add Photos')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Error Banner if any */}
              {photoError && (
                <div className="p-2.5 bg-red-100/90 border border-red-300 text-red-800 rounded-xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{photoError}</span>
                </div>
              )}

              {/* Photos Grid: Camera/File trigger + preview thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {/* Upload Trigger Box */}
                {photos.length < 6 && (
                  <label className="h-28 border-2 border-dashed border-emerald-900/30 hover:border-amber-500 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white/70 hover:bg-amber-50/50 transition p-2 text-center text-emerald-950 group">
                    <Camera className="w-6 h-6 text-amber-600 mb-1 group-hover:scale-110 transition" />
                    <span className="text-[11px] font-black leading-tight">
                      + Camera / File
                    </span>
                    <span className="text-[9px] text-emerald-800/70 font-semibold">
                      ({photos.length}/6)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Uploaded Photos */}
                {photos.map((ph, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border-2 border-emerald-900/20 shadow bg-white h-28"
                  >
                    <img src={ph} alt={`Crop photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 shadow transition"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 right-1 bg-amber-500 text-emerald-950 font-extrabold text-[8px] text-center py-0.5 rounded shadow">
                        Main Logo / Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Paste Image URL */}
              {photos.length < 6 && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste image URL (e.g. Unsplash or Cloud URL)..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlPhoto}
                    className="px-4 py-2 bg-[#0F3826] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-sm transition shrink-0"
                  >
                    Add URL
                  </button>
                </div>
              )}
            </div>

            {/* ===================================================
                NICHE: PRODUCT DETAILS (Stock, Pricing, Location, Grade)
                =================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  {language === 'hi' ? 'मात्रा (Quantity)' : 'Quantity'}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-2 py-2 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 font-bold"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="packet">packet</option>
                    <option value="dozen">dozen</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  {language === 'hi' ? 'वांछित मूल्य (₹ / यूनिट)' : 'Expected Price (₹/unit)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={basePriceRupees}
                  onChange={(e) => setBasePriceRupees(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  {language === 'hi' ? 'गुणवत्ता ग्रेड (Grade)' : 'Quality Grade'}
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 font-bold"
                >
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  {language === 'hi' ? 'संकलन मंडी केंद्र' : 'Collection Hub Location'}
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-emerald-900/20 rounded-xl text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-emerald-900/10">
              {editingCropId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-3.5 bg-gray-200 hover:bg-gray-300 text-emerald-950 font-bold rounded-2xl transition text-xs"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !cropName.trim() || !quantityKg || !basePriceRupees}
                className={`px-8 py-3.5 font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${editingCropId
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-emerald-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-emerald-800 via-[#0F3826] to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-amber-50'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>
                      {editingCropId
                        ? (language === 'hi' ? 'अपडेट हो रहा है...' : 'Updating...')
                        : (language === 'hi' ? 'दर्ज हो रहा है...' : 'Publishing...')}
                    </span>
                  </>
                ) : editingCropId ? (
                  <>
                    <Save className="w-4 h-4 text-emerald-950" />
                    <span>{language === 'hi' ? 'अपडेट करें' : 'Update'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        )}

        {/* ===================================================
            REGISTERED PRODUCE LISTINGS: BULMA RESPONSIVE CARDS
            =================================================== */}
        <div className="space-y-4">
          {seedStatusMessage && (
            <div className="p-3 bg-amber-100 border-2 border-amber-400 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{seedStatusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSeedStatusMessage(null)}
                className="text-emerald-900 hover:text-red-700 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-xl text-emerald-950 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span>{language === 'hi' ? 'मेरी पंजीकृत फसलें' : 'My Registered Crops'}</span>
              </h3>
              <p className="text-xs text-emerald-800/70">
                {language === 'hi'
                  ? 'आपकी फसल सफलतापूर्वक आपकी फसल सूची में जोड़ दी गई है और अब यह प्लेटफॉर्म पर उपलब्ध है।'
                  : 'Your crop has been added successfully to your crop list and is now available on the platform.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {myListings.length} {language === 'hi' ? 'सक्रिय फसलें' : 'Active Crops'}
              </span>
              <div className="flex items-center bg-white border border-emerald-900/15 rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setViewFormat('bulma')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${viewFormat === 'bulma' ? 'bg-[#0F3826] text-amber-100' : 'text-emerald-900'
                    }`}
                >
                  {language === 'hi' ? 'Bulma कार्ड्स' : 'Bulma Cards'}
                </button>
                <button
                  type="button"
                  onClick={() => setViewFormat('table')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${viewFormat === 'table' ? 'bg-[#0F3826] text-amber-100' : 'text-emerald-900'
                    }`}
                >
                  {language === 'hi' ? 'तालिका' : 'Table'}
                </button>
              </div>
            </div>
          </div>

          {myListings.length === 0 ? (
            <div className="py-16 px-4 text-center bg-white/70 border-2 border-dashed border-emerald-900/15 rounded-3xl space-y-3">
              <div className="w-16 h-16 mx-auto bg-amber-500/10 text-amber-700 rounded-2xl flex items-center justify-center">
                <Tractor className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-950 text-lg">
                  {language === 'hi' ? 'अभी आपकी कोई फसल पंजीकृत नहीं है' : 'No produce registered yet'}
                </h4>
                <p className="text-xs text-emerald-800/70 max-w-sm mx-auto mt-1">
                  {language === 'hi'
                    ? 'ऊपर दिए गए प्रविष्टि अनुभाग से अपनी फसल 2 से 6 तस्वीरों के साथ दर्ज करें।'
                    : 'Use the produce insert board above to add crops with 2-6 photos.'}
                </p>
              </div>
            </div>
          ) : viewFormat === 'bulma' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((crop) => (
                <div key={crop.id} className="relative group/wrapper">
                  <BulmaProductCard
                    id={crop.id}
                    crop_name={crop.crop || crop.crop_name}
                    crop_name_hi={crop.crop_name_hi}
                    category={crop.category || 'Vegetables'}
                    variety={crop.variety}
                    quantity_kg={crop.qty || crop.quantity_available}
                    price_paise_per_kg={crop.pricePaise || Math.round(parseFloat(crop.priceRupees) * 100)}
                    quality_grade={crop.grade}
                    cv_trust_score={crop.cvTrustScore || 98}
                    harvest_date={crop.harvestDate || '2026-09-08'}
                    is_organic={crop.isOrganic || 0}
                    farmer_name={crop.farmer_name || userName || 'Farmer'}
                    location={crop.location}
                    images={crop.photos || [crop.imageUrl]}
                    unit={crop.unit || 'kg'}
                    badge={language === 'hi' ? 'मेरी फसल' : 'My Crop'}
                  />

                  {/* Action Buttons overlay on top right: Edit & Delete */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEditCrop(crop)}
                      className="p-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-xl shadow-md transition flex items-center gap-1"
                      title={language === 'hi' ? 'फसल विवरण व फोटो अपडेट करें' : 'Edit / Update Crop'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(crop.id, crop.crop || crop.crop_name)}
                      className="p-2 bg-red-600/90 hover:bg-red-700 text-white rounded-xl shadow-md transition"
                      title={language === 'hi' ? 'सत्यापन करके हटाएं' : 'Delete listing'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((crop) => (
                <div
                  key={crop.id}
                  className="p-4 bg-white rounded-2xl border border-emerald-900/10 shadow-sm flex items-center justify-between gap-3 group hover:border-emerald-900/20 transition"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                      {getLocalizedGrade(crop.grade, language)}
                    </span>
                    <h4 className="font-extrabold text-emerald-950 text-base mt-1 truncate">
                      {getLocalizedCropName(crop.crop || crop.crop_name, language)}
                    </h4>
                    <p className="text-xs text-emerald-800/70 mt-0.5 truncate">
                      {crop.qty || crop.quantity_available} {crop.unit || 'kg'} • {getLocalizedLocation(crop.location, language)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-amber-800">
                        ₹{crop.priceRupees} <span className="text-xs font-normal text-emerald-900">/ {crop.unit || 'kg'}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                        {crop.status || 'VERIFIED'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartEditCrop(crop)}
                      className="p-2 text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded-xl transition"
                      title={language === 'hi' ? 'फसल विवरण व फोटो अपडेट करें' : 'Edit / Update Crop'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(crop.id, crop.crop || crop.crop_name)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                      title={language === 'hi' ? 'हटाएं' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
        </div>
        )}

        {/* ===================================================
            MINIMAL TOLL-FREE IVR VOICE HELPLINE (SABSE NEECHE)
            =================================================== */}
        <div className="mt-8 p-3 sm:p-4 rounded-2xl bg-[#072417]/80 dark:bg-[#03140c]/90 backdrop-blur-md border border-amber-500/25 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-extrabold text-amber-300 text-xs sm:text-sm">
                📞 1800-NIRA-AGRI
              </span>
              <span className="text-[11px] text-amber-200/70">
                ({language === 'hi' ? 'कीपैड फोन हेतु बिना इंटरनेट वॉयस सेवा' : 'Keypad phone voice service without internet'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px]">
            <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 text-amber-100 flex items-center gap-1.5">
              <strong className="text-amber-400 font-mono font-bold">1:</strong> {language === 'hi' ? 'फसल बिक्री दर्ज' : 'Crop Reg'}
            </span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 text-amber-100 flex items-center gap-1.5">
              <strong className="text-amber-400 font-mono font-bold">2:</strong> {language === 'hi' ? 'मंडी भाव' : 'Mandi Rates'}
            </span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 text-amber-100 flex items-center gap-1.5">
              <strong className="text-amber-400 font-mono font-bold">3:</strong> {language === 'hi' ? 'खाता व एस्क्रो स्थिति' : 'Escrow Status'}
            </span>
          </div>
        </div>

        {/* Green Pulse Success Signal Toast */}
        {successSignal && (
          <div className="fixed bottom-6 right-6 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-[#0F3826] text-amber-50 shadow-2xl border border-emerald-500/40 animate-fadeIn">
            {typeof successSignal === 'string' ? (
              <div className="flex items-center gap-3 px-5 py-3.5">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-full animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs font-medium text-amber-100/90">{successSignal}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                      {language === 'hi' ? 'फसल सफलतापूर्वक दर्ज' : 'Crop registered successfully'}
                    </p>
                    <h3 className="truncate text-sm font-extrabold text-amber-50">
                      {language === 'hi' ? successSignal.cropNameHi : successSignal.cropName}
                    </h3>
                    <p className="truncate text-[11px] text-emerald-200/80">
                      {language === 'hi' ? successSignal.cropName : successSignal.cropNameHi}
                    </p>
                  </div>
                </div>

                <div className="border-t border-emerald-500/20 px-4 py-3">
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                    {language === 'hi' ? 'फसल विवरण' : 'Crop details'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {successSignal.details.map((detail) => (
                      <span key={detail} className="rounded-md bg-emerald-900/80 px-2 py-1 text-[10px] font-bold text-emerald-100">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Deletion Confirmation Modal */}
        {cropToDelete && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white dark:bg-[#0c2217] text-[#1A2E26] dark:text-[#E2E8F0] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-red-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-red-100 dark:border-red-900/30 pb-3">
                <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {language === 'hi' ? 'फसल सूची हटाएं' : 'Delete Crop Listing'}
                  </h3>
                </div>
                <button
                  onClick={() => setCropToDelete(null)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800/40 text-xs space-y-2">
                <p className="font-bold text-red-700 dark:text-red-300">
                  {language === 'hi'
                    ? 'क्या आप वाकई इस फसल को हमेशा के लिए हटाना चाहते हैं?'
                    : 'Are you sure you want to permanently delete this listing?'}
                </p>
                <div className="p-2.5 bg-white dark:bg-[#07170f] rounded-xl border border-red-200 dark:border-red-900/40">
                  <p className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">
                    🌾 {getLocalizedCropName(cropToDelete.name, language)}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    ID: {cropToDelete.id}
                  </p>
                </div>
                <p className="text-[11px] text-red-600/80 dark:text-red-300/80">
                  {language === 'hi'
                    ? 'यह कार्रवाई पूर्ववत नहीं की जा सकती। यह फसल आपके डैशबोर्ड और खरीदार मंडी दोनों से तुरंत हट जाएगी।'
                    : 'This action cannot be undone. It will be immediately removed from your dashboard and the buyer marketplace.'}
                </p>
              </div>

              {deleteError && (
                <div className="p-3 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-200 font-bold">
                  {deleteError}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCropToDelete(null)}
                  disabled={isVerifyingDelete}
                  className="flex-1 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs transition"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmDelete()}
                  disabled={isVerifyingDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifyingDelete ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{language === 'hi' ? 'हटाया जा रहा है...' : 'Deleting...'}</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>{language === 'hi' ? 'हाँ, फसल हटाएं' : 'Yes, Delete Crop'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Farmer-Driver Secure Handshake Modal */}
        {handshakeModalOrder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#FAF5EB] max-w-md w-full rounded-3xl p-6 border border-emerald-900/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-extrabold text-base text-emerald-950">
                    {language === 'hi' ? '🤝 खेत गेट सुरक्षित हैंडशेक' : '🤝 Farm-Gate Secure Handshake'}
                  </h3>
                </div>
                <button
                  onClick={() => setHandshakeModalOrder(null)}
                  className="p-1 hover:bg-emerald-100 rounded-full text-emerald-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Driver Details Card */}
              <div className="p-3 bg-white rounded-2xl border border-emerald-900/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">
                    {language === 'hi' ? 'असाइन किया गया चालक:' : 'Assigned Driver:'}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-950">
                    {handshakeModalOrder.driver_name || 'Vikram Shinde'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{language === 'hi' ? 'गाड़ी नंबर:' : 'Vehicle Number:'}</span>
                  <span className="font-mono font-bold text-emerald-900">
                    {handshakeModalOrder.driver_vehicle || 'MH-15-EG-8821 (Tata Ace)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                  <span className="text-gray-500">{language === 'hi' ? 'ड्राइवर मोबाइल:' : 'Driver Mobile:'}</span>
                  <a
                    href={`tel:${handshakeModalOrder.driver_phone || '+919900011122'}`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg hover:bg-emerald-100"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{handshakeModalOrder.driver_phone || '+91 99000 11122'}</span>
                  </a>
                </div>
              </div>

              {/* Giant OTP Display */}
              <div className="p-5 bg-gradient-to-b from-amber-500/20 to-amber-500/10 rounded-2xl border-2 border-amber-400 text-center space-y-2">
                <span className="text-xs font-bold text-amber-950 block">
                  {language === 'hi' ? '🔒 ड्राइवर को देने हेतु आपका गुप्त पिकअप OTP:' : '🔒 Your Secure Pickup OTP for Driver:'}
                </span>
                <div className="text-4xl font-mono font-black tracking-[0.3em] text-emerald-950 bg-white py-3 px-4 rounded-xl border border-amber-300 shadow-inner">
                  {handshakeModalOrder.pickup_otp || '----'}
                </div>
                <button
                  type="button"
                  onClick={() => handleGeneratePickupOtp(handshakeModalOrder.id)}
                  disabled={generatingOtp[handshakeModalOrder.id]}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-lg transition shadow-xs"
                >
                  {generatingOtp[handshakeModalOrder.id] ? (language === 'hi' ? 'नया कोड बन रहा...' : 'Generating Code...') : (language === 'hi' ? '🔄 नया OTP जनरेट करें' : '🔄 Generate New OTP')}
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
                <p className="font-bold">{language === 'hi' ? '⚠️ किसान सुरक्षा नियम:' : '⚠️ Farmer Security Rule:'}</p>
                <p>
                  {language === 'hi'
                    ? 'जब ड्राइवर आपकी पूरी फसल अपनी गाड़ी में ठीक से लोड कर ले, केवल तभी यह 4-अंकीय कोड उसे बताएं। ड्राइवर यह कोड अपने ऐप में दर्ज करेगा तभी हैंडशेक पूरा होगा।'
                    : 'Only reveal this 4-digit code to the driver after your entire produce is safely loaded onto their vehicle. The driver will verify this code in their app to complete the handover.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setHandshakeModalOrder(null)}
                  className="w-full py-3 bg-[#0F3826] text-amber-300 font-bold rounded-xl text-xs hover:bg-emerald-900 transition shadow-md"
                >
                  {language === 'hi' ? 'समझ गया (बंद करें)' : 'Understood (Close Window)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Official Agri Transit Gate Pass Modal */}
        <TransitGatePassModal
          isOpen={showGatePassModal}
          onClose={() => setShowGatePassModal(false)}
          consignment={gatePassConsignment}
        />
      </div>
    </PortalGuard>
  );
}
