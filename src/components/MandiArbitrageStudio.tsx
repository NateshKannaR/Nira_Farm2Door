'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, ArrowRight, CheckCircle2, DollarSign, Sparkles, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MandiData {
  name: string;
  location: string;
  distanceKm: number;
  basePricePerKg: number;
  commissionPercent: number; // typically 8.5%
  transitLossPercent: number; // typically 3.5%
  freightPerKg: number;
}

export default function MandiArbitrageStudio() {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [quantityKg, setQuantityKg] = useState(1000);

  const cropBaselines: Record<
    string,
    {
      name: string;
      nameHi: string;
      niraDirectPrice: number;
      mandis: MandiData[];
    }
  > = {
    Tomato: {
      name: 'Tomato (टमाटर)',
      nameHi: 'टमाटर (Desi Hybrid)',
      niraDirectPrice: 32,
      mandis: [
        {
          name: 'Nashik APMC Mandi',
          location: 'Panchavati, Nashik',
          distanceKm: 18,
          basePricePerKg: 24,
          commissionPercent: 8.5,
          transitLossPercent: 4.0,
          freightPerKg: 1.2,
        },
        {
          name: 'Lasalgaon Mandi Hub',
          location: 'Niphad, Nashik',
          distanceKm: 42,
          basePricePerKg: 25,
          commissionPercent: 8.0,
          transitLossPercent: 4.5,
          freightPerKg: 2.0,
        },
        {
          name: 'Pune Market Yard',
          location: 'Gultekdi, Pune',
          distanceKm: 215,
          basePricePerKg: 28,
          commissionPercent: 9.0,
          transitLossPercent: 6.5,
          freightPerKg: 4.5,
        },
        {
          name: 'Mumbai Vashi APMC',
          location: 'Turbhe, Navi Mumbai',
          distanceKm: 165,
          basePricePerKg: 30,
          commissionPercent: 10.0,
          transitLossPercent: 5.5,
          freightPerKg: 4.0,
        },
      ],
    },
    Onion: {
      name: 'Red Onion (नासिक लाल प्याज)',
      nameHi: 'लाल प्याज (Grade A+)',
      niraDirectPrice: 28,
      mandis: [
        {
          name: 'Lasalgaon Asia Onion Hub',
          location: 'Lasalgaon, Nashik',
          distanceKm: 38,
          basePricePerKg: 20,
          commissionPercent: 7.5,
          transitLossPercent: 3.0,
          freightPerKg: 1.5,
        },
        {
          name: 'Nashik Dindori Mandi',
          location: 'Dindori Road',
          distanceKm: 22,
          basePricePerKg: 19,
          commissionPercent: 8.0,
          transitLossPercent: 3.5,
          freightPerKg: 1.2,
        },
        {
          name: 'Mumbai Vashi Mandi',
          location: 'Turbhe, Navi Mumbai',
          distanceKm: 165,
          basePricePerKg: 24,
          commissionPercent: 9.5,
          transitLossPercent: 4.5,
          freightPerKg: 3.8,
        },
      ],
    },
    Wheat: {
      name: 'Sharbati Wheat (शरबती गेहूं)',
      nameHi: 'शरबती गेहूं',
      niraDirectPrice: 38,
      mandis: [
        {
          name: 'Sehore Krishi Mandi',
          location: 'MP Border Hub',
          distanceKm: 95,
          basePricePerKg: 29,
          commissionPercent: 6.5,
          transitLossPercent: 1.5,
          freightPerKg: 2.5,
        },
        {
          name: 'Nashik Grain APMC',
          location: 'Ambad, Nashik',
          distanceKm: 15,
          basePricePerKg: 27,
          commissionPercent: 7.0,
          transitLossPercent: 1.0,
          freightPerKg: 1.0,
        },
      ],
    },
    Potato: {
      name: 'Fresh Potato (आलू / बटाटा)',
      nameHi: 'ताजा आलू',
      niraDirectPrice: 24,
      mandis: [
        {
          name: 'Pune Market Yard',
          location: 'Gultekdi, Pune',
          distanceKm: 180,
          basePricePerKg: 17,
          commissionPercent: 8.0,
          transitLossPercent: 3.5,
          freightPerKg: 2.8,
        },
        {
          name: 'Nashik APMC Sub-Yard',
          location: 'Nashik Mandi',
          distanceKm: 20,
          basePricePerKg: 16,
          commissionPercent: 7.5,
          transitLossPercent: 2.5,
          freightPerKg: 1.2,
        },
      ],
    },
  };

  const currentCrop = cropBaselines[selectedCrop] || cropBaselines['Tomato'];

  // Calculations
  const niraTotalIncome = useMemo(() => {
    return quantityKg * currentCrop.niraDirectPrice;
  }, [quantityKg, currentCrop]);

  const mandiCalculations = useMemo(() => {
    return currentCrop.mandis.map((m) => {
      const grossMandiValue = quantityKg * m.basePricePerKg;
      const commissionDeduction = grossMandiValue * (m.commissionPercent / 100);
      const transitLossDeduction = grossMandiValue * (m.transitLossPercent / 100);
      const totalFreight = quantityKg * m.freightPerKg;

      const netFarmerRealization = grossMandiValue - commissionDeduction - transitLossDeduction - totalFreight;
      const netPerKg = netFarmerRealization / quantityKg;
      const farmerExtraProfit = niraTotalIncome - netFarmerRealization;
      const percentageGain = ((farmerExtraProfit / netFarmerRealization) * 100).toFixed(1);

      return {
        ...m,
        grossMandiValue,
        commissionDeduction,
        transitLossDeduction,
        totalFreight,
        netFarmerRealization,
        netPerKg,
        farmerExtraProfit,
        percentageGain,
      };
    });
  }, [currentCrop, quantityKg, niraTotalIncome]);

  return (
    <div className="bg-white dark:bg-[#0c2217] rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/10 dark:border-emerald-500/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/10 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'hi' ? 'वास्तविक मंडी मध्यस्थ तुलना' : 'Live APMC Arbitrage & Net Revenue Studio'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-white">
            {language === 'hi' ? 'मंडी बनाम निरा सीधा किसान लाभ' : 'Mandi Middlemen vs. Nira Direct Net Payout'}
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {language === 'hi'
              ? 'देखें कि पारंपरिक APMC मंडी आढ़तिया कमीशन, तौल कटौती और भाड़ा कटने के बाद आपको निरा पर कितना अधिक शुद्ध मुनाफा मिलता है।'
              : 'Calculate real take-home farmer earnings after eliminating 8-10% mandi dalali, weighing cuts & freight.'}
          </p>
        </div>

        {/* Crop Select Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(cropBaselines).map((cropKey) => (
            <button
              key={cropKey}
              onClick={() => setSelectedCrop(cropKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedCrop === cropKey
                  ? 'bg-emerald-800 text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/15'
              }`}
            >
              {cropKey}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Slider */}
        <div className="bg-emerald-50/60 dark:bg-white/5 p-5 rounded-2xl border border-emerald-900/10 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-gray-700 dark:text-gray-300">
              {language === 'hi' ? 'फसल मात्रा (Quantity):' : 'Consignment Volume:'}
            </span>
            <span className="text-emerald-800 dark:text-emerald-300 font-extrabold font-mono text-sm">
              {quantityKg.toLocaleString()} Kg ({(quantityKg / 100).toFixed(1)} Qtl)
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="10000"
            step="100"
            value={quantityKg}
            onChange={(e) => setQuantityKg(Number(e.target.value))}
            className="w-full h-2 bg-emerald-200 dark:bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>200 Kg (Small Batch)</span>
            <span>10,000 Kg (Truckload)</span>
          </div>
        </div>

        {/* Nira Direct Champion Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Nira Direct Farmgate (0% Commission)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              ₹{currentCrop.niraDirectPrice}/kg Direct Price
            </h3>
            <p className="text-xs text-emerald-100 font-medium">
              Zero middleman deductions • Escrow locked • Direct bank payout
            </p>
          </div>

          <div className="text-center sm:text-right bg-black/20 p-3.5 rounded-xl border border-white/10 w-full sm:w-auto">
            <span className="text-[10px] uppercase text-emerald-200 block font-bold">Total Farmer Payout</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              ₹{niraTotalIncome.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Regional Mandi Comparison Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {language === 'hi' ? 'नजदीकी APMC मंडियों में मिलने वाली शुद्ध राशि' : 'Net Take-Home Comparison Against Regional APMC Mandis'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mandiCalculations.map((mandi, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-emerald-500/40 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{mandi.name}</span>
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {mandi.location} • {mandi.distanceKm} km transit
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
                  Gross: ₹{mandi.basePricePerKg}/kg
                </span>
              </div>

              {/* Deductions Breakdown */}
              <div className="p-3 bg-red-50/60 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30 text-[11px] space-y-1">
                <div className="flex justify-between text-red-800 dark:text-red-300 font-medium">
                  <span>Mandi Dalali ({mandi.commissionPercent}%):</span>
                  <span>-₹{Math.round(mandi.commissionDeduction).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-800 dark:text-red-300 font-medium">
                  <span>Transport Freight ({mandi.freightPerKg} ₹/kg):</span>
                  <span>-₹{Math.round(mandi.totalFreight).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-800 dark:text-red-300 font-medium">
                  <span>Transit Spoilage/Deduction ({mandi.transitLossPercent}%):</span>
                  <span>-₹{Math.round(mandi.transitLossDeduction).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Net Result */}
              <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Net Take-Home</span>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white font-mono">
                    ₹{Math.round(mandi.netFarmerRealization).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono block">
                    (₹{mandi.netPerKg.toFixed(2)} / kg net)
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{mandi.percentageGain}% on Nira</span>
                  </span>
                  <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold mt-0.5">
                    +₹{Math.round(mandi.farmerExtraProfit).toLocaleString('en-IN')} extra profit
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
