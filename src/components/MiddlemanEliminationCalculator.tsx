'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Zap,
  ShoppingBag,
  Sliders,
  DollarSign
} from 'lucide-react';

interface CalculatorProps {
  initialCrop?: string;
  initialPrice?: number;
  initialQuantity?: number;
  isModal?: boolean;
  onClose?: () => void;
}

export default function MiddlemanEliminationCalculator({
  initialCrop = 'Hybrid Tomatoes',
  initialPrice = 30,
  initialQuantity = 1000,
  isModal = false,
  onClose
}: CalculatorProps) {
  const { language } = useLanguage();

  const [cropName, setCropName] = useState(initialCrop);
  const [directPrice, setDirectPrice] = useState(initialPrice);
  const [quantityKg, setQuantityKg] = useState(initialQuantity);

  // Economic Modeling of Traditional Mandi vs Nira Direct AI
  // Traditional:
  // Farmer gets ~50% of the retail price
  // Intermediaries add ~15% wastage, commission, transport margin
  const traditionalRetailPrice = Number((directPrice * 1.18).toFixed(2));
  const traditionalFarmerPrice = Number((directPrice * 0.62).toFixed(2));

  // Intermediary cuts in traditional chain (per kg):
  const villageAggregatorCut = Number((traditionalRetailPrice * 0.08).toFixed(2));
  const apmcCommissionCut = Number((traditionalRetailPrice * 0.09).toFixed(2));
  const wholesalerCut = Number((traditionalRetailPrice * 0.11).toFixed(2));
  const retailerMarkup = Number((traditionalRetailPrice * 0.10).toFixed(2));

  // Nira Direct AI:
  // Farmer gets 88-90% of final price
  const kbFarmerEarningsPerKg = Number((directPrice * 0.88).toFixed(2));
  const kbLogisticsPerKg = Number((directPrice * 0.12).toFixed(2));

  // Lot Aggregate Metrics:
  const traditionalFarmerTotal = Math.round(traditionalFarmerPrice * quantityKg);
  const kbFarmerTotal = Math.round(kbFarmerEarningsPerKg * quantityKg);
  const farmerExtraIncome = kbFarmerTotal - traditionalFarmerTotal;
  const farmerGrowthPercent = Math.round(((kbFarmerEarningsPerKg - traditionalFarmerPrice) / traditionalFarmerPrice) * 100);

  const traditionalConsumerTotal = Math.round(traditionalRetailPrice * quantityKg);
  const kbConsumerTotal = Math.round(directPrice * quantityKg);
  const consumerTotalSavings = traditionalConsumerTotal - kbConsumerTotal;
  const consumerSavingsPercent = Math.round(((traditionalRetailPrice - directPrice) / traditionalRetailPrice) * 100);

  const wasteAvoidedKg = Math.round(quantityKg * 0.16); // 18% traditional transit rot vs 2% direct

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-900/10 dark:border-emerald-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>SIH Problem Statement Pillar 1: Intermediary Elimination Proof</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-amber-100 mt-1">
            Middleman Elimination & Value Spread Visualizer
          </h2>
          <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70">
            Real-time economic proof showing how removing 4 broker layers directly boosts farmer profit while discounting consumer prices.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/10 dark:bg-white/10 flex items-center justify-center text-emerald-950 dark:text-white font-bold hover:bg-emerald-900/20 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/60 dark:bg-emerald-950/40 p-4 sm:p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-200">
            <span>Direct Farmgate Benchmark Rate</span>
            <span className="font-mono text-amber-600 dark:text-amber-300 text-sm font-black">₹{directPrice}/kg</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="1"
            value={directPrice}
            onChange={(e) => setDirectPrice(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-emerald-800/60 dark:text-emerald-300/60 font-mono">
            <span>₹10/kg (Grains/Veg)</span>
            <span>₹60/kg</span>
            <span>₹120/kg (Spices/Exotics)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-200">
            <span>Harvest Batch Volume</span>
            <span className="font-mono text-amber-600 dark:text-amber-300 text-sm font-black">{quantityKg.toLocaleString()} kg</span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={quantityKg}
            onChange={(e) => setQuantityKg(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-emerald-800/60 dark:text-emerald-300/60 font-mono">
            <span>100 kg (Smallholder)</span>
            <span>5,000 kg (FPO Lot)</span>
            <span>10,000 kg (Bulk Commercial)</span>
          </div>
        </div>
      </div>

      {/* Outcome Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Farmer Gain */}
        <div className="bg-emerald-900 text-amber-50 p-5 rounded-2xl shadow-md border border-emerald-700 relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10">
            <TrendingUp className="w-16 h-16 text-amber-300" />
          </div>
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
            Farmer Income Surge
          </span>
          <div className="text-3xl font-black text-amber-300 mt-1">
            +{farmerGrowthPercent}%
          </div>
          <p className="text-xs text-amber-100/90 mt-1">
            Extra Earnings: <strong className="text-white font-mono">+₹{farmerExtraIncome.toLocaleString()}</strong> on this harvest lot
          </p>
        </div>

        {/* Consumer Savings */}
        <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
            Consumer Price Reduction
          </span>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            -{consumerSavingsPercent}%
          </div>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1">
            Direct Savings: <strong className="text-emerald-950 dark:text-white font-mono">₹{consumerTotalSavings.toLocaleString()}</strong> saved vs Mandi retail
          </p>
        </div>

        {/* Waste Reduction */}
        <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
            Food Spoilage Prevented
          </span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {wasteAvoidedKg.toLocaleString()} <span className="text-base font-normal">kg</span>
          </div>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1">
            Down from <strong className="text-red-600">18.2%</strong> to <strong className="text-emerald-600">&lt;2%</strong> with AI direct dispatch
          </p>
        </div>
      </div>

      {/* Side-by-Side Architectural Chain Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* TRADITIONAL 4-TIER INTERMEDIARY CHAIN */}
        <div className="bg-red-50/50 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200 dark:border-red-900/40 space-y-4">
          <div className="flex items-center justify-between border-b border-red-200/80 dark:border-red-900/50 pb-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <h3 className="font-black text-sm text-red-950 dark:text-red-200">
                Traditional Mandi Supply Chain (4 Broker Layers)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-red-700 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-full">
              High Friction
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between bg-white/80 dark:bg-black/30 p-2.5 rounded-xl">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">1. Farmer Base Realization</span>
              <span className="font-mono font-bold text-red-600">₹{traditionalFarmerPrice}/kg (52%)</span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-zinc-600 dark:text-zinc-400">
              <span>+ Village Aggregator Cut</span>
              <span className="font-mono">+₹{villageAggregatorCut}/kg</span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-zinc-600 dark:text-zinc-400">
              <span>+ APMC Mandi Adathiya Commission</span>
              <span className="font-mono">+₹{apmcCommissionCut}/kg</span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-zinc-600 dark:text-zinc-400">
              <span>+ Regional Wholesaler Margin</span>
              <span className="font-mono">+₹{wholesalerCut}/kg</span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-zinc-600 dark:text-zinc-400">
              <span>+ Final Retailer Markup & Multi-transit Wastage</span>
              <span className="font-mono">+₹{retailerMarkup}/kg</span>
            </div>
          </div>

          <div className="pt-2 border-t border-red-200 dark:border-red-900/50 flex items-center justify-between text-sm">
            <span className="font-black text-red-950 dark:text-red-200">Consumer Final Price:</span>
            <span className="font-black font-mono text-red-600 text-lg">₹{traditionalRetailPrice}/kg</span>
          </div>
        </div>

        {/* NIRA DIRECT AI CHAIN */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-400/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-300/80 dark:border-emerald-800 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-black text-sm text-emerald-950 dark:text-emerald-200">
                Nira Direct AI Protocol (Zero Brokers)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
              Zero Commission
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between bg-white/80 dark:bg-black/30 p-2.5 rounded-xl border border-emerald-400/30">
              <span className="font-bold text-emerald-950 dark:text-emerald-100">1. Direct Farmer Payout (Escrow Handshake)</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                ₹{kbFarmerEarningsPerKg}/kg (88%)
              </span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-emerald-900 dark:text-emerald-300">
              <span>+ Direct Pooled Transporter Freight (AI Routed)</span>
              <span className="font-mono">+₹{kbLogisticsPerKg}/kg</span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-emerald-900 dark:text-emerald-300">
              <span>+ Platform Intermediary Fee</span>
              <span className="font-mono font-bold text-emerald-600">₹0.00 (0% Commission)</span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-emerald-900 dark:text-emerald-300">
              <span>+ Computer Vision Quality Certified</span>
              <span className="font-mono text-emerald-600">Included</span>
            </div>

            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 p-2 rounded-xl text-emerald-900 dark:text-emerald-300">
              <span>+ Post-harvest Transit Loss</span>
              <span className="font-mono text-emerald-600">&lt;1.8% (Cold Monitored)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-300/80 dark:border-emerald-800 flex items-center justify-between text-sm">
            <span className="font-black text-emerald-950 dark:text-emerald-200">Consumer Direct Price:</span>
            <span className="font-black font-mono text-emerald-700 dark:text-emerald-400 text-lg">₹{directPrice.toFixed(2)}/kg</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#07170f] border border-emerald-900/10 dark:border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-sm">
      {content}
    </div>
  );
}
