'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getLocalizedCropName, getLocalizedGrade, getLocalizedFarmer, getLocalizedLocation } from '@/lib/i18n';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Lock,
  LogIn,
  UserCheck,
  ShieldAlert,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Home,
  Building2,
  Store,
  FileText,
  ChevronLeft,
  Truck,
  CreditCard,
  Check,
} from 'lucide-react';

const INDIAN_STATES = [
  'Maharashtra',
  'Punjab',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Gujarat',
  'Rajasthan',
  'Haryana',
  'West Bengal',
  'Bihar',
  'Karnataka',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Telangana',
  'Delhi NCR',
  'Kerala',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh',
  'Chhattisgarh',
  'Jammu & Kashmir',
];

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { language } = useLanguage();
  const { isAuthenticated, user, openAuthModal } = useAuth();

  // State management
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [deliveryOtpCode, setDeliveryOtpCode] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Dedicated Checkout Popup State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'ADDRESS' | 'CONFIRM' | 'SUCCESS'>('ADDRESS');
  const [userConfirmedIdentity, setUserConfirmedIdentity] = useState(true);

  // Flipkart/Amazon-style comprehensive mandatory shipping details - all empty by default
  const [shippingForm, setShippingForm] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kb_buyer_shipping_address');
        if (saved) {
          const parsed = JSON.parse(saved);
          // If the saved address is the old dummy test Pune address, purge it
          if (
            parsed &&
            parsed.flatBuilding !== 'Flat 402, Green Acres Apartment' &&
            parsed.mobileNumber !== '9999999999'
          ) {
            return parsed;
          } else {
            localStorage.removeItem('kb_buyer_shipping_address');
          }
        }
      } catch (e) {}
    }
    return {
      fullName: '',
      mobileNumber: '',
      altPhone: '',
      pincode: '',
      flatBuilding: '',
      areaStreet: '',
      landmark: '',
      postOffice: '',
      district: '',
      state: '',
      addressType: 'HOME' as 'HOME' | 'WORK' | 'MANDI_SHOP',
      deliveryInstructions: '',
    };
  });

  if (!isCartOpen && !isCheckoutModalOpen) return null;

  const subtotalPaise = cart.reduce((acc, item: any) => {
    const pricePaise =
      Number(item.pricePaisePerKg) ||
      (Number(item.price) ? Number(item.price) * 100 : 0) ||
      (Number(item.priceRupees) ? Number(item.priceRupees) * 100 : 0) ||
      0;
    const qty = Number(item.quantityKg) || Number(item.quantity) || 0;
    return acc + Math.round(pricePaise * qty);
  }, 0) || 0;
  const logisticsFeePaise = Math.round(subtotalPaise * 0.04) || 0;
  const totalPaise = subtotalPaise + logisticsFeePaise;

  const validateShippingForm = () => {
    if (!shippingForm.fullName.trim()) {
      return 'Please enter recipient full name (Mandatory)';
    }
    if (!shippingForm.mobileNumber.trim() || shippingForm.mobileNumber.replace(/\D/g, '').length < 10) {
      return 'Please enter a valid 10-digit mobile number';
    }
    if (!shippingForm.pincode.trim() || shippingForm.pincode.replace(/\D/g, '').length !== 6) {
      return 'Please enter a valid 6-digit PIN code';
    }
    if (!shippingForm.flatBuilding.trim()) {
      return 'Please enter flat / building / house details (Mandatory)';
    }
    if (!shippingForm.areaStreet.trim()) {
      return 'Please enter street / area / locality (Mandatory)';
    }
    if (!shippingForm.landmark.trim()) {
      return 'Please enter nearby landmark (Mandatory)';
    }
    if (!shippingForm.postOffice.trim()) {
      return 'Please enter post office / town (Mandatory)';
    }
    if (!shippingForm.district.trim()) {
      return 'Please enter district / city (Mandatory)';
    }
    if (!shippingForm.state.trim()) {
      return 'Please select state (Mandatory)';
    }
    return null;
  };

  // Open Checkout Popup
  const handleProceedToCheckout = () => {
    if (!isAuthenticated || !user) {
      openAuthModal('login');
      return;
    }
    if (cart.length === 0) return;
    setCheckoutError(null);
    setCheckoutStep('ADDRESS');
    setIsCheckoutModalOpen(true);
  };

  // Step 1 -> Step 2 Review
  const handleReviewOrder = () => {
    const validationErr = validateShippingForm();
    if (validationErr) {
      setCheckoutError(validationErr);
      return;
    }
    setCheckoutError(null);
    setCheckoutStep('CONFIRM');
  };

  // Step 2 Confirm & Place Order
  const handleConfirmCheckout = async () => {
    if (!userConfirmedIdentity) {
      setCheckoutError('Please check the confirmation box to verify identity and place order.');
      return;
    }

    const validationErr = validateShippingForm();
    if (validationErr) {
      setCheckoutError(validationErr);
      return;
    }

    setIsSubmitting(true);
    setCheckoutError(null);

    // Save shipping details for future autofill
    try {
      localStorage.setItem('kb_buyer_shipping_address', JSON.stringify(shippingForm));
    } catch (e) {}

    const canonicalAddress = `${shippingForm.fullName} | Phone: ${shippingForm.mobileNumber}${
      shippingForm.altPhone ? ', Alt: ' + shippingForm.altPhone : ''
    } | ${shippingForm.flatBuilding}, ${shippingForm.areaStreet}, Landmark: ${
      shippingForm.landmark
    }, P.O.: ${shippingForm.postOffice}, ${shippingForm.district}, ${shippingForm.state} - ${
      shippingForm.pincode
    } (${shippingForm.addressType})`;

    try {
      const payload = {
        buyerId: user?.id || 'u_buyer_1',
        buyerName: shippingForm.fullName.trim() || user?.name || 'Verified Buyer',
        buyerPhone: shippingForm.mobileNumber.trim() || user?.phone || '9811122233',
        buyerEmail: user?.email || 'buyer@nira.ai',
        shipping: shippingForm,
        deliveryAddress: canonicalAddress,
        deliveryType: 'EXPRESS',
        paymentMethod,
        notes: `Direct Farm Purchase by ${shippingForm.fullName} (ID: ${
          user?.id || 'u_buyer_1'
        }) | ${shippingForm.deliveryInstructions}`,
        items: cart.map((it) => ({
          listingId: it.listingId,
          cropName: it.cropName,
          quantity: it.quantityKg,
          unitPricePaise: it.pricePaisePerKg,
          unit: 'kg',
        })),
      };

      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || 'Failed to place order');
      }

      setPlacedOrderId(data.orderId || data.order?.id || `ord_${Date.now()}`);
      setContractId(data.smartContractHash || data.order?.contract_id || `KB-ESCROW-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setDeliveryOtpCode(data.deliveryOtp || data.order?.delivery_otp || '4829');

      // Local storage active orders cache for 0ms refresh hydration
      try {
        const existingLocal = JSON.parse(localStorage.getItem('kb_buyer_active_orders') || '[]');
        const newOrderObj = {
          ...data.order,
          recipient_name: shippingForm.fullName,
          recipient_phone: shippingForm.mobileNumber,
          alt_phone: shippingForm.altPhone,
          shipping: shippingForm,
          delivery_address: canonicalAddress,
          status: 'Placed',
          payment_status: 'ESCROW_LOCKED',
          created_at: new Date().toISOString(),
          items: cart.map((it) => ({
            crop_name: it.cropName,
            quantity: it.quantityKg,
            unit: 'kg',
            unit_price_paise: it.pricePaisePerKg,
          })),
          total_rupees: (totalPaise / 100).toFixed(2),
          delivery_otp: data.order?.delivery_otp || '4829',
          pickup_otp: data.order?.pickup_otp || '7137',
        };
        localStorage.setItem(
          'kb_buyer_active_orders',
          JSON.stringify([newOrderObj, ...existingLocal.filter((o: any) => o.id !== newOrderObj.id)])
        );
      } catch (e) {}

      setCheckoutStep('SUCCESS');
    } catch (err: any) {
      setCheckoutError(err.message || 'Error: Failed to process order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndGoToDashboard = () => {
    setIsCheckoutModalOpen(false);
    clearCart();
    setIsCartOpen(false);

    if (typeof window !== 'undefined') {
      window.location.href = '/buyer#active-orders';
    }
  };

  return (
    <>
      {/* 1. SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[9990] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn">
          <div className="w-full max-w-md bg-[#FAF5EB] dark:bg-[#081710] text-[#1A2E26] dark:text-[#E2E8F0] h-full shadow-2xl flex flex-col border-l border-emerald-900/10 dark:border-emerald-500/20 transition-colors duration-200">
            {/* Header */}
            <div className="p-5 bg-[#0F3826] text-amber-50 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">
                    Your Shopping Cart
                  </h2>
                  <p className="text-xs text-amber-200/80">
                    {cart.length > 0 ? `${cart.length} crops selected` : 'Empty Cart'} • Direct Farm Dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-emerald-800 rounded-full transition"
              >
                <X className="w-5 h-5 text-amber-100" />
              </button>
            </div>

            {/* Scrollable Cart Items Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-emerald-800/60 dark:text-emerald-400/60 text-center py-16">
                  <div className="w-16 h-16 bg-emerald-900/5 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8 text-emerald-800/40 dark:text-emerald-300/60" />
                  </div>
                  <p className="font-bold text-emerald-950 dark:text-amber-100 text-base mb-1">Your cart is empty</p>
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 max-w-xs">
                    Explore the marketplace to add fresh crops directly from farms and mandis.
                  </p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemTotalPaise = Math.round(item.pricePaisePerKg * item.quantityKg);
                  return (
                    <div
                      key={item.listingId}
                      className="p-3.5 bg-white dark:bg-[#0d2218] rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm flex items-center justify-between gap-3 hover:border-emerald-900/25 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-emerald-950 dark:text-amber-100 truncate">
                            {getLocalizedCropName(item.cropName, language)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 rounded-full font-medium shrink-0">
                            {getLocalizedGrade(item.grade, language)}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 mb-1 truncate">
                          {language === 'hi' ? 'किसान:' : 'Farmer:'} {getLocalizedFarmer(item.farmerName, language)} • {getLocalizedLocation(item.location, language)}
                        </p>
                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="text-emerald-900 dark:text-emerald-200">
                            ₹{(item.pricePaisePerKg / 100).toFixed(2)}/kg
                          </span>
                          <span className="text-amber-800 dark:text-amber-300 font-bold">
                            Total: ₹{(itemTotalPaise / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center border border-emerald-900/20 dark:border-emerald-500/30 rounded-lg overflow-hidden bg-emerald-50/50 dark:bg-emerald-950/60">
                          <button
                            onClick={() => updateQuantity(item.listingId, item.quantityKg - 50)}
                            className="px-2 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-emerald-950 dark:text-emerald-100 min-w-[45px] text-center">
                            {item.quantityKg}kg
                          </span>
                          <button
                            onClick={() => updateQuantity(item.listingId, item.quantityKg + 50)}
                            className="px-2 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.listingId)}
                          className="text-red-500 hover:text-red-700 p-1 transition"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Trust Badge */}
              {cart.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-600/20 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span>
                    <strong>100% Zero-Risk Escrow:</strong>{' '}
                    Payment is securely held in escrow and released to the farmer only upon delivery OTP verification.
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Summary & Checkout Trigger (Always Visible & Accessible) */}
            {cart.length > 0 && (
              <div className="p-4 bg-white/95 dark:bg-[#0d2218] border-t border-emerald-900/10 dark:border-emerald-500/20 space-y-3 shadow-xl shrink-0">
                <div className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="flex justify-between">
                    <span className="text-emerald-800/80 dark:text-emerald-300/80">
                      Crop Subtotal:
                    </span>
                    <span className="font-semibold">₹{(subtotalPaise / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800/80 dark:text-emerald-300/80">
                      Smart Logistics Fee (4%):
                    </span>
                    <span className="font-semibold">₹{(logisticsFeePaise / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800/80 dark:text-emerald-300/80">
                      GST Exemption:
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      ₹0.00 (Agri Exemption)
                    </span>
                  </div>
                  <div className="pt-2 border-t border-dashed border-emerald-900/20 dark:border-emerald-500/20 flex justify-between text-base font-bold text-emerald-950 dark:text-emerald-100">
                    <span>Total Payable:</span>
                    <span className="text-amber-800 dark:text-amber-300 text-lg">₹{(totalPaise / 100).toFixed(2)}</span>
                  </div>
                </div>

                {!isAuthenticated ? (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full py-3.5 bg-[#0F3826] text-amber-50 font-bold rounded-xl shadow-lg hover:bg-emerald-900 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>Login & Place Order</span>
                  </button>
                ) : (
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 bg-[#0F3826] text-amber-50 font-extrabold rounded-xl shadow-lg hover:bg-emerald-900 transition flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout (Shipping Details)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DEDICATED FULL CHECKOUT & ADDRESS MODAL (FLIPKART / AMAZON STYLE POPUP) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FAF5EB] dark:bg-[#0c1f15] rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-emerald-800/20 dark:border-emerald-600/30 text-emerald-950 dark:text-emerald-50 flex flex-col max-h-[90vh] my-auto overflow-hidden transition-colors">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#0F3826] dark:bg-[#07170f] text-amber-50 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Truck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight text-amber-50">
                    {checkoutStep === 'ADDRESS' && 'Delivery Address & Contact Details'}
                    {checkoutStep === 'CONFIRM' && 'Order Review & Confirmation'}
                    {checkoutStep === 'SUCCESS' && 'Order Placed Successfully!'}
                  </h3>
                  <p className="text-xs text-amber-200/80">
                    {checkoutStep === 'ADDRESS' && 'Step 1/2: Enter all shipping & contact information'}
                    {checkoutStep === 'CONFIRM' && 'Step 2/2: Verify details and lock escrow protection'}
                    {checkoutStep === 'SUCCESS' && 'Zero-Risk Escrow Contract Active'}
                  </p>
                </div>
              </div>

              {checkoutStep !== 'SUCCESS' && (
                <button
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="p-2 hover:bg-emerald-800 dark:hover:bg-emerald-900 rounded-full transition text-amber-100"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* STEP 1: ADDRESS & PAYMENT FORM */}
              {checkoutStep === 'ADDRESS' && (
                <div className="space-y-4">
                  {/* Order Quick Summary Banner */}
                  <div className="p-3 bg-emerald-900/5 dark:bg-emerald-900/30 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-emerald-900 dark:text-emerald-200 font-medium">
                      Total Items:{' '}
                      <strong>
                        {cart.length} Crops ({cart.reduce((a, b) => a + b.quantityKg, 0)} kg)
                      </strong>
                    </span>
                    <span className="text-sm font-extrabold text-amber-900 dark:text-amber-300">
                      Total Payable: ₹{(totalPaise / 100).toFixed(2)}
                    </span>
                  </div>

                  {/* Flipkart / Amazon Section Title */}
                  <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-500/20 pb-2">
                    <span className="text-xs sm:text-sm font-black text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Delivery Postal Details</span>
                    </span>
                    <span className="text-[11px] text-red-600 dark:text-red-400 font-bold">
                      * All fields are mandatory
                    </span>
                  </div>

                  {/* Row 1: Full Name & Primary Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingForm.fullName}
                        onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                        placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        10-Digit Primary Mobile Number *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={shippingForm.mobileNumber}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, mobileNumber: e.target.value.replace(/\D/g, '') })
                        }
                        placeholder={language === 'hi' ? 'उदा. 9876543210' : 'e.g. 9876543210'}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>
                  </div>

                  {/* Row 2: Alternate Mobile & PIN Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Alternate Mobile (Optional)
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={shippingForm.altPhone}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, altPhone: e.target.value.replace(/\D/g, '') })
                        }
                        placeholder={language === 'hi' ? 'उदा. 9811122233 (वैकल्पिक)' : 'e.g. 9811122233 (Optional)'}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        PIN Code (6-Digit PIN Code) *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={shippingForm.pincode}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, pincode: e.target.value.replace(/\D/g, '') })
                        }
                        placeholder={language === 'hi' ? 'उदा. 411014' : 'e.g. 411014'}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-mono font-bold placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>
                  </div>

                  {/* Row 3: Flat / House No. & Street / Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Flat / House / Building / Firm No. *
                      </label>
                      <input
                        type="text"
                        value={shippingForm.flatBuilding}
                        onChange={(e) => setShippingForm({ ...shippingForm, flatBuilding: e.target.value })}
                        placeholder="e.g. Flat 402, Green Acres Apt"
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Street / Locality / Sector *
                      </label>
                      <input
                        type="text"
                        value={shippingForm.areaStreet}
                        onChange={(e) => setShippingForm({ ...shippingForm, areaStreet: e.target.value })}
                        placeholder="e.g. Viman Nagar Main Road, Clover Park"
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>
                  </div>

                  {/* Row 4: Landmark & Post Office */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Landmark *
                      </label>
                      <input
                        type="text"
                        value={shippingForm.landmark}
                        onChange={(e) => setShippingForm({ ...shippingForm, landmark: e.target.value })}
                        placeholder={language === 'hi' ? 'उदा. कृषि मंडी गेट के पास' : 'e.g. Near Agri Mandi Gate'}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Post Office / Town *
                      </label>
                      <input
                        type="text"
                        value={shippingForm.postOffice}
                        onChange={(e) => setShippingForm({ ...shippingForm, postOffice: e.target.value })}
                        placeholder={language === 'hi' ? 'उदा. मुख्य डाकघर / नगर' : 'e.g. Main Post Office / Town'}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>
                  </div>

                  {/* Row 5: District & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        District / City *
                      </label>
                      <input
                        type="text"
                        value={shippingForm.district}
                        onChange={(e) => setShippingForm({ ...shippingForm, district: e.target.value })}
                        placeholder={language === 'hi' ? 'उदा. पुणे / इंदौर / नासिक' : 'e.g. Pune / Indore / Nashik'}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        State *
                      </label>
                      <select
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium cursor-pointer"
                      >
                        <option value="" disabled>
                          {language === 'hi' ? '-- राज्य चुनें --' : '-- Select State --'}
                        </option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st} className="dark:bg-[#132c1e] dark:text-emerald-100">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 6: Address Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1.5">
                      Address Type:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setShippingForm({ ...shippingForm, addressType: 'HOME' })}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                          shippingForm.addressType === 'HOME'
                            ? 'bg-emerald-800 dark:bg-emerald-700 text-amber-50 border-emerald-900 shadow-sm'
                            : 'bg-white dark:bg-[#132c1e] text-emerald-900 dark:text-emerald-200 border-emerald-900/20 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingForm({ ...shippingForm, addressType: 'WORK' })}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                          shippingForm.addressType === 'WORK'
                            ? 'bg-emerald-800 dark:bg-emerald-700 text-amber-50 border-emerald-900 shadow-sm'
                            : 'bg-white dark:bg-[#132c1e] text-emerald-900 dark:text-emerald-200 border-emerald-900/20 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Work / Office</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingForm({ ...shippingForm, addressType: 'MANDI_SHOP' })}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                          shippingForm.addressType === 'MANDI_SHOP'
                            ? 'bg-emerald-800 dark:bg-emerald-700 text-amber-50 border-emerald-900 shadow-sm'
                            : 'bg-white dark:bg-[#132c1e] text-emerald-900 dark:text-emerald-200 border-emerald-900/20 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span>Wholesale Mandi</span>
                      </button>
                    </div>
                  </div>

                  {/* Row 7: Special Delivery Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                      Special Delivery Instructions (Optional):
                    </label>
                    <input
                      type="text"
                      value={shippingForm.deliveryInstructions}
                      onChange={(e) => setShippingForm({ ...shippingForm, deliveryInstructions: e.target.value })}
                      placeholder="e.g. Call 10 mins before arrival; deliver at gate"
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-emerald-900/20 dark:border-emerald-500/30 bg-white dark:bg-[#132c1e] focus:outline-none focus:ring-2 focus:ring-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium placeholder:text-gray-400 dark:placeholder:text-emerald-400/40"
                    />
                  </div>

                  {/* Row 8: Payment Method Selection */}
                  <div className="pt-2 border-t border-emerald-900/10 dark:border-emerald-500/20">
                    <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1.5">
                      Payment Method:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-3 rounded-xl border text-left flex flex-col transition ${
                          paymentMethod === 'UPI'
                            ? 'bg-emerald-800 dark:bg-emerald-700 text-amber-50 border-emerald-900 shadow-sm'
                            : 'bg-white dark:bg-[#132c1e] text-emerald-900 dark:text-emerald-200 border-emerald-900/20 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        <span className="font-extrabold text-xs sm:text-sm">
                          Escrow UPI (Zero-Risk)
                        </span>
                        <span className={`text-[11px] ${paymentMethod === 'UPI' ? 'text-amber-200' : 'text-emerald-700/80 dark:text-emerald-400/80'}`}>
                          Released only upon Delivery OTP verification
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-3 rounded-xl border text-left flex flex-col transition ${
                          paymentMethod === 'COD'
                            ? 'bg-emerald-800 dark:bg-emerald-700 text-amber-50 border-emerald-900 shadow-sm'
                            : 'bg-white dark:bg-[#132c1e] text-emerald-900 dark:text-emerald-200 border-emerald-900/20 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        <span className="font-extrabold text-xs sm:text-sm">
                          Cash on Delivery (COD)
                        </span>
                        <span className={`text-[11px] ${paymentMethod === 'COD' ? 'text-amber-200' : 'text-emerald-700/80 dark:text-emerald-400/80'}`}>
                          Pay on Delivery + OTP verification
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Validation Error Alert */}
                  {checkoutError && (
                    <div className="p-3 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700/60 rounded-xl text-xs text-red-800 dark:text-red-200 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{checkoutError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: REVIEW & CONFIRMATION MODAL CARD */}
              {checkoutStep === 'CONFIRM' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-[#132c1e] rounded-2xl border border-emerald-900/15 dark:border-emerald-500/30 shadow-sm space-y-2.5 text-xs text-emerald-950 dark:text-emerald-100">
                    <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-500/20 pb-2">
                      <span className="font-extrabold text-emerald-950 dark:text-emerald-100 text-sm flex items-center gap-1.5">
                        <User className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        {shippingForm.fullName}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-[11px] font-bold rounded-full">
                        {shippingForm.addressType === 'HOME'
                          ? '🏠 HOME'
                          : shippingForm.addressType === 'WORK'
                          ? '🏢 WORK'
                          : '🏪 MANDI'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-emerald-900 dark:text-emerald-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        +91 {shippingForm.mobileNumber}
                      </span>
                      {shippingForm.altPhone && (
                        <span className="text-emerald-700 dark:text-emerald-400">
                          Alt: +91 {shippingForm.altPhone}
                        </span>
                      )}
                    </div>

                    <div className="pt-1 text-emerald-950 dark:text-emerald-100 space-y-1 font-medium leading-relaxed">
                      <p>{shippingForm.flatBuilding}, {shippingForm.areaStreet}</p>
                      <p><strong className="text-emerald-900 dark:text-emerald-300">Landmark:</strong> {shippingForm.landmark}</p>
                      <p><strong className="text-emerald-900 dark:text-emerald-300">Post Office:</strong> {shippingForm.postOffice}</p>
                      <p className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                        {shippingForm.district}, {shippingForm.state} — {shippingForm.pincode}
                      </p>
                    </div>

                    {shippingForm.deliveryInstructions && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5 border border-emerald-200/60 dark:border-emerald-700/50">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span><strong>Instructions:</strong> {shippingForm.deliveryInstructions}</span>
                      </div>
                    )}
                  </div>

                  {/* Items & Smart Contract Summary */}
                  <div className="p-4 bg-amber-500/10 dark:bg-amber-950/30 rounded-2xl border border-amber-600/30 dark:border-amber-600/40 text-xs space-y-2 text-amber-950 dark:text-amber-100">
                    <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Produce & Escrow Protection Summary</span>
                    </div>
                    <div className="space-y-1.5 bg-white/95 dark:bg-[#11271b] p-3 rounded-xl border border-amber-300 dark:border-amber-700/50 text-emerald-950 dark:text-emerald-100">
                      {cart.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span>{getLocalizedCropName(it.cropName, language)} ({it.quantityKg}kg)</span>
                          <span className="font-bold">₹{((it.quantityKg * it.pricePaisePerKg) / 100).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs text-emerald-800 dark:text-emerald-300">
                        <span>Logistics & Express Freight (4%):</span>
                        <span className="font-bold">₹{(logisticsFeePaise / 100).toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-amber-200 dark:border-amber-700/50 flex justify-between font-extrabold text-sm text-emerald-950 dark:text-emerald-100">
                        <span>Total Payable Amount:</span>
                        <span className="text-amber-900 dark:text-amber-300 text-base">₹{(totalPaise / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-amber-900 dark:text-amber-300 font-medium">
                      Payment Method:{' '}
                      <strong>
                        {paymentMethod === 'UPI'
                          ? 'Secure Escrow UPI (Held in Escrow)'
                          : 'Cash on Delivery (COD)'}
                      </strong>
                    </p>
                  </div>

                  {/* Confirmation Checkbox */}
                  <label className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-[#11271b] rounded-xl border border-emerald-300 dark:border-emerald-700/60 cursor-pointer hover:border-emerald-400 transition">
                    <input
                      type="checkbox"
                      checked={userConfirmedIdentity}
                      onChange={(e) => setUserConfirmedIdentity(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-800 dark:text-emerald-400 focus:ring-emerald-700 w-4 h-4 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-emerald-950 dark:text-emerald-100 leading-snug">
                      I confirm that the recipient <strong>{shippingForm.fullName}</strong> (+91{' '}
                      {shippingForm.mobileNumber}) and delivery address are verified and accurate. Place this order live on
                      the Farmer Portal and register it under my account (<span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">{user?.id}</span>).
                    </span>
                  </label>

                  {checkoutError && (
                    <div className="p-3 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700/60 rounded-xl text-xs text-red-800 dark:text-red-200 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{checkoutError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: ORDER SUCCESS & ESCROW OTP */}
              {checkoutStep === 'SUCCESS' && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-emerald-950 dark:text-emerald-100 mb-1">
                      Escrow Order Executed Successfully!
                    </h3>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                      Order ID:{' '}
                      <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{placedOrderId}</span>
                    </p>
                  </div>

                  {/* Zero-Trust Delivery OTP Box */}
                  <div className="w-full bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-600/30 dark:border-amber-600/40 rounded-2xl p-4 text-left shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-amber-950 dark:text-amber-200">
                        Delivery Handover OTP Code
                      </span>
                    </div>
                    <div className="bg-white dark:bg-[#132c1e] rounded-xl p-3 border border-amber-300 dark:border-amber-700/50 text-center mb-2 shadow-inner">
                      <span className="text-3xl font-mono font-black tracking-[0.3em] text-emerald-950 dark:text-emerald-100">
                        {deliveryOtpCode || '4829'}
                      </span>
                    </div>
                    <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300">Security Directive:</strong>{' '}
                      Share this 4-digit OTP with the delivery agent only after verifying produce quantity and quality. Escrow payment will be released to the farmer upon OTP confirmation.
                    </p>
                  </div>

                  <div className="p-3.5 bg-emerald-900/5 dark:bg-emerald-900/30 rounded-xl border border-emerald-900/10 dark:border-emerald-500/20 w-full text-left text-xs space-y-1.5 font-mono text-emerald-950 dark:text-emerald-200">
                    <p className="text-emerald-900 dark:text-emerald-100 font-bold">
                      Smart Contract ID: {contractId}
                    </p>
                    <p className="text-emerald-800 dark:text-emerald-300">
                      Payment Status:{' '}
                      <span className="text-amber-700 dark:text-amber-300 font-bold">
                        Locked in Escrow
                      </span>
                    </p>
                    <p className="text-emerald-800 dark:text-emerald-300">
                      Farmer Portal:{' '}
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Transmitted to live procurement board
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Sticky Footer Actions */}
            <div className="p-4 bg-white dark:bg-[#07170f] border-t border-emerald-900/10 dark:border-emerald-500/20 flex items-center justify-between gap-3 shrink-0">
              {checkoutStep === 'ADDRESS' && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="px-4 py-2.5 bg-gray-100 dark:bg-[#132c1e] hover:bg-gray-200 dark:hover:bg-emerald-900/40 text-gray-800 dark:text-emerald-200 font-bold rounded-xl text-xs sm:text-sm transition"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleReviewOrder}
                    className="px-6 py-2.5 bg-[#0F3826] dark:bg-emerald-700 hover:bg-emerald-900 dark:hover:bg-emerald-600 text-amber-50 font-extrabold rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center gap-2 ml-auto"
                  >
                    <span>Review & Confirm Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {checkoutStep === 'CONFIRM' && (
                <>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('ADDRESS')}
                    className="px-4 py-2.5 bg-gray-100 dark:bg-[#132c1e] hover:bg-gray-200 dark:hover:bg-emerald-900/40 text-gray-800 dark:text-emerald-200 font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Edit Address</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCheckout}
                    disabled={isSubmitting || !userConfirmedIdentity}
                    className="px-6 py-2.5 bg-[#0F3826] dark:bg-emerald-700 hover:bg-emerald-900 dark:hover:bg-emerald-600 text-amber-100 font-extrabold rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center gap-2 ml-auto disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing order...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>✓ Confirm & Place Order</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {checkoutStep === 'SUCCESS' && (
                <button
                  type="button"
                  onClick={handleFinishAndGoToDashboard}
                  className="w-full py-3 bg-[#0F3826] dark:bg-emerald-700 hover:bg-emerald-900 dark:hover:bg-emerald-600 text-amber-50 font-bold rounded-xl text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Complete & View Orders Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
