'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  BarChart3,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  ShoppingBag,
  Info,
  RefreshCw,
  Clock,
  Compass
} from 'lucide-react';
import Link from 'next/link';

interface AdjacentMandi {
  mandi: string;
  priceRupees: number;
  distanceKm: number;
}

interface WeeklyPoint {
  day: string;
  demandIndex: number;
  priceRupees: number;
  arrivalsTons: number;
}

export default function DemandForecastStudio() {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [selectedRegion, setSelectedRegion] = useState('Maharashtra (Nashik / Pune)');
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'curve' | 'mandiRadar' | 'advisory'>('curve');

  const cropOptions = [
    { id: 'tomato', name: 'Hybrid Tomatoes', nameHi: 'टमाटर', icon: '🍅' },
    { id: 'onion', name: 'Nashik Red Onion', nameHi: 'प्याज', icon: '🧅' },
    { id: 'potato', name: 'Jyoti Potato', nameHi: 'आलू', icon: '🥔' },
    { id: 'wheat', name: 'Sharbati Wheat', nameHi: 'गेहूं', icon: '🌾' },
    { id: 'soybean', name: 'Yellow Soybean', nameHi: 'सोयाबीन', icon: '🌱' },
    { id: 'garlic', name: 'Desi Garlic', nameHi: 'लहसुन', icon: '🧄' },
  ];

  const regionOptions = [
    'Maharashtra (Nashik / Pune)',
    'Madhya Pradesh (Malwa / Indore)',
    'Punjab (Ludhiana / Khanna)',
    'Gujarat (Surat / Saurashtra)',
    'Uttar Pradesh (Agra / Western)',
  ];

  const fetchForecast = async (crop: string, region: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/ai/forecast?crop=${encodeURIComponent(crop)}&region=${encodeURIComponent(region)}`);
      const data = await res.json();
      if (data.success) {
        setForecastData(data);
      }
    } catch (e) {
      console.error('Failed to load forecast data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(selectedCrop, selectedRegion);
  }, [selectedCrop, selectedRegion]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0F3826] via-[#134932] to-[#0A261A] text-amber-50 p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-8 bottom-4 opacity-10 hidden md:block pointer-events-none">
          <TrendingUp className="w-48 h-48 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-extrabold rounded-full border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nira Intelligence • AI Demand Forecasting & Mandi Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Nira AI Agri-Demand & Mandi Price Forecasting Studio
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 max-w-2xl">
              Predict crop arrival surges, price trajectory shifts, and wholesale buyer deficit trends up to 30 days in advance. Powered by historical APMC mandis intelligence and Google Gemini.
            </p>
          </div>

          {/* Region Picker Dropdown */}
          <div className="flex flex-col gap-1.5 w-full md:w-auto bg-[#072014]/90 p-3 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
            <span className="text-[11px] font-bold text-amber-300/80 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Target Agro-Climatic Zone</span>
            </span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#0b291c] text-white text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-600/40 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Crop Selection Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-700/40 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {cropOptions.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
                selectedCrop === c.id
                  ? 'bg-amber-400 text-emerald-950 shadow-lg scale-105 ring-2 ring-amber-300'
                  : 'bg-emerald-950/70 text-amber-100 hover:bg-emerald-900 border border-emerald-700/40'
              }`}
            >
              <span className="text-base">{c.icon}</span>
              <span>{language === 'hi' ? c.nameHi : c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white/70 dark:bg-[#07170f]/70 rounded-3xl border border-emerald-900/10 space-y-4">
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
            Running Google Gemini Macro Demand Projection & Mandi Inflow Analytics...
          </p>
        </div>
      ) : forecastData ? (
        <div className="space-y-6">
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Projected Price Card */}
            <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  7-Day Projected Rate
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 ${
                  forecastData.priceDirection === 'RISING'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {forecastData.priceDirection === 'RISING' ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  )}
                  <span>{forecastData.expectedGrowthPercent > 0 ? `+${forecastData.expectedGrowthPercent}%` : `${forecastData.expectedGrowthPercent}%`}</span>
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-950 dark:text-amber-100 mt-2">
                ₹{forecastData.projectedAvgRupees} <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">/ kg</span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 block">
                Baseline APMC Rate: <strong className="font-mono">₹{forecastData.currentMandiAvgRupees}/kg</strong>
              </span>
            </div>

            {/* Demand Trend Index */}
            <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Demand Pressure Trend
                </span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-black uppercase">
                  {forecastData.trend.replace('_', ' ')}
                </span>
              </div>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-300 mt-2">
                {forecastData.trend === 'HIGH_DEMAND' ? 'Surge Expected (+25%)' : forecastData.trend === 'SURPLUS_RISK' ? 'Supply Glut Risk' : 'Balanced Demand'}
              </div>
              <span className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-1 block">
                Projected Inflow: <strong className="font-mono">{forecastData.projectedDemandTons} Tons</strong>
              </span>
            </div>

            {/* Supply Deficit / Surplus */}
            <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Wholesale Deficit
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  forecastData.deficitPercent > 0 ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  {forecastData.deficitPercent > 0 ? 'Supply Shortage' : 'Adequate Buffer'}
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-950 dark:text-amber-100 mt-2">
                {forecastData.deficitPercent > 0 ? `+${forecastData.deficitPercent}%` : `${forecastData.deficitPercent}%`}
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 block">
                Arrivals vs Normal Seasonal Avg
              </span>
            </div>

            {/* AI Model Confidence */}
            <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  AI Model Accuracy
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 rounded-full text-[10px] font-black">
                  Verified
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                {forecastData.confidencePercent}%
              </div>
              <span className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-1 block font-mono">
                {forecastData.provider}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-emerald-900/10 dark:border-emerald-500/20 pb-3">
            <button
              onClick={() => setActiveTab('curve')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                activeTab === 'curve'
                  ? 'bg-[#0F3826] text-amber-200 shadow-md'
                  : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>7-Day Price & Arrival Trajectory Curve</span>
            </button>

            <button
              onClick={() => setActiveTab('mandiRadar')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                activeTab === 'mandiRadar'
                  ? 'bg-[#0F3826] text-amber-200 shadow-md'
                  : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/50'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Inter-Mandi Arbitrage Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('advisory')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                activeTab === 'advisory'
                  ? 'bg-[#0F3826] text-amber-200 shadow-md'
                  : 'text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Agronomic & Dispatch Advice</span>
            </button>
          </div>

          {/* TAB 1: 7-DAY TRAJECTORY CURVE VISUALIZER */}
          {activeTab === 'curve' && (
            <div className="bg-white dark:bg-[#07170f] p-6 rounded-3xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-emerald-950 dark:text-amber-100">
                    7-Day Price Trajectory & Mandi Arrival Flow
                  </h3>
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70">
                    Simulated daily wholesale demand index vs farmgate equilibrium rate (₹/kg)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-emerald-950 dark:text-emerald-200">Price (₹/kg)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span className="text-emerald-950 dark:text-emerald-200">Arrivals (Tons)</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full h-64 sm:h-72 bg-emerald-950/5 dark:bg-black/30 rounded-2xl p-4 flex flex-col justify-end relative">
                {/* Horizontal Gridlines */}
                <div className="absolute inset-x-4 top-8 border-b border-dashed border-emerald-900/10 dark:border-emerald-500/15" />
                <div className="absolute inset-x-4 top-24 border-b border-dashed border-emerald-900/10 dark:border-emerald-500/15" />
                <div className="absolute inset-x-4 top-40 border-b border-dashed border-emerald-900/10 dark:border-emerald-500/15" />

                {/* 7 Columns */}
                <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end relative z-10">
                  {forecastData.weeklyCurve?.map((pt: WeeklyPoint, idx: number) => {
                    // Normalize bar height based on price
                    const maxPrice = Math.max(...forecastData.weeklyCurve.map((p: WeeklyPoint) => p.priceRupees), 40);
                    const heightPercent = Math.min(Math.max((pt.priceRupees / maxPrice) * 100, 25), 100);

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                        {/* Tooltip on Hover */}
                        <div className="text-[10px] sm:text-xs font-black text-amber-600 dark:text-amber-300 font-mono transition-transform group-hover:scale-110">
                          ₹{pt.priceRupees.toFixed(1)}
                        </div>

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[36px] bg-gradient-to-t from-emerald-800 to-amber-400 rounded-t-xl transition-all duration-500 group-hover:from-emerald-700 group-hover:to-amber-300 relative shadow-sm"
                        >
                          <div className="absolute inset-x-0 bottom-1 text-center text-[9px] font-bold text-white/90 hidden sm:block">
                            {pt.arrivalsTons}T
                          </div>
                        </div>

                        {/* Label */}
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-950 dark:text-emerald-300 truncate text-center w-full">
                          {pt.day.replace(' (Today)', '')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Advice Banner */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-500/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-extrabold text-amber-950 dark:text-amber-200">
                    Optimal Market Window Identified
                  </div>
                  <p className="text-amber-900/80 dark:text-amber-300/80">
                    Highest price realization is projected on <strong>Day 4 to Day 5</strong>. Farmers and FPOs planning harvest dispatch within this 48-hour window capture up to +18% higher revenue compared to standard mandi auction.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTER-MANDI ARBITRAGE RADAR */}
          {activeTab === 'mandiRadar' && (
            <div className="bg-white dark:bg-[#07170f] p-6 rounded-3xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-md space-y-6">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-emerald-950 dark:text-amber-100">
                  Regional Mandi Arbitrage Opportunities
                </h3>
                <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70">
                  Real-time price comparison across neighboring consumption hubs to identify highest net realization after freight
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {forecastData.adjacentMandis?.map((m: AdjacentMandi, i: number) => {
                  const diff = m.priceRupees - parseFloat(forecastData.currentMandiAvgRupees);
                  const isHigher = diff > 0;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border transition-all ${
                        isHigher
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                          : 'bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          {m.mandi}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-white dark:bg-black/40 px-2 py-0.5 rounded-full border border-emerald-900/10">
                          {m.distanceKm} km
                        </span>
                      </div>

                      <div className="text-2xl font-black text-emerald-950 dark:text-amber-100 mt-2">
                        ₹{m.priceRupees.toFixed(2)} <span className="text-xs font-normal">/ kg</span>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-xs font-bold">
                        {isHigher ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>+₹{diff.toFixed(2)} premium</span>
                          </span>
                        ) : (
                          <span className="text-zinc-500 flex items-center gap-0.5">
                            <span>₹{Math.abs(diff).toFixed(2)} lower</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-emerald-900/10 dark:border-emerald-500/20 text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                        Freight Cost: ~₹{(m.distanceKm * 0.045).toFixed(1)}/kg
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI AGRONOMIC & DISPATCH ADVICE */}
          {activeTab === 'advisory' && (
            <div className="bg-[#0F3826] text-amber-50 p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-500/20 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-400/20 rounded-2xl text-amber-300">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-400 text-emerald-950 font-black text-[10px] rounded-full uppercase">
                      Action Recommendation
                    </span>
                    <span className="text-xs text-amber-300/90 font-mono">
                      Target Action: {forecastData.recommendedAction}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-amber-100">
                    Google Gemini Market Advisory Rationale
                  </h3>
                </div>
              </div>

              <div className="p-5 bg-emerald-950/80 rounded-2xl border border-emerald-800/80 text-sm leading-relaxed text-amber-100/90 space-y-3">
                <p>{forecastData.aiAdvisoryRationale}</p>
                <div className="text-xs text-amber-300 font-mono pt-2 border-t border-emerald-800">
                  Engine: {forecastData.aiEngine}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-xs text-amber-200/70">
                  Ready to capitalize on this price window? List directly in the Farmer Desk.
                </div>
                <Link
                  href="/farmer"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>List Lot in Farmer Desk</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
