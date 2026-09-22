'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedCropName, getLocalizedFarmer } from '@/lib/i18n';
import { useRole } from '@/context/RoleContext';
import PortalGuard from '@/components/PortalGuard';
import {
  Users,
  Layers,
  TrendingUp,
  CheckCircle2,
  Building2,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  Percent,
  Sliders,
} from 'lucide-react';

export default function FpoDashboardPage() {
  const { t, language } = useLanguage();
  const { userName } = useRole();
  const [successSignal, setSuccessSignal] = useState<string | null>(null);

  const [pooledLots, setPooledLots] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nira_fpo_pools');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      { id: 'pool_101', crop_name: 'Nashik Hybrid Tomato (Virtual Pool)', total_quantity_kg: 5500, target_price_rs: '27.50', members: 34, status: 'Pooling Active' },
      { id: 'pool_102', crop_name: 'Lasalgaon Red Onion (Bulk Aggregation)', total_quantity_kg: 12000, target_price_rs: '34.00', members: 52, status: 'Lot Locked & Secured' },
    ];
  });

  const [bulkReqs, setBulkReqs] = useState([
    { id: 'req_201', buyer: 'Annapurna Hotel & Catering Services', crop_name: 'Tomato', qty_kg: 2000, max_price_rs: '29.00', fill_percent: 65, status: 'OPEN' },
    { id: 'req_202', buyer: 'Reliance Retail Agri', crop_name: 'Sharbati Wheat', qty_kg: 10000, max_price_rs: '39.00', fill_percent: 85, status: 'OPEN' },
  ]);

  // Modal State for New Pool
  const [showNewPoolModal, setShowNewPoolModal] = useState(false);
  const [newCropName, setNewCropName] = useState('Nashik Hybrid Tomato');
  const [newMembersCount, setNewMembersCount] = useState(25);
  const [newAvgYieldKg, setNewAvgYieldKg] = useState(60);
  const [newTargetRate, setNewTargetRate] = useState('28.50');

  const handleLockLot = (id: string) => {
    const updated = pooledLots.map((lot) =>
      lot.id === id ? { ...lot, status: 'Lot Locked & Secured' } : lot
    );
    setPooledLots(updated);
    try {
      localStorage.setItem('nira_fpo_pools', JSON.stringify(updated));
    } catch (e) {}
    setSuccessSignal('FPO Bulk Lot Locked & Secured with Digital Escrow!');
    setTimeout(() => setSuccessSignal(null), 4000);
  };

  const handleAcceptRfq = (id: string) => {
    setBulkReqs(bulkReqs.map(r => r.id === id ? { ...r, fill_percent: 100, status: 'FULFILLED' } : r));
    setSuccessSignal('RFQ Contract Accepted! Direct FPO Supply Commitment Escrow Provisioned.');
    setTimeout(() => setSuccessSignal(null), 4000);
  };

  const handleCreatePool = (e: React.FormEvent) => {
    e.preventDefault();
    const totalQty = newMembersCount * newAvgYieldKg;
    const newLot = {
      id: `pool_${Date.now().toString().slice(-4)}`,
      crop_name: `${newCropName} (Virtual Aggregate)`,
      total_quantity_kg: totalQty,
      target_price_rs: newTargetRate,
      members: newMembersCount,
      status: 'Pooling Active',
    };
    const updated = [newLot, ...pooledLots];
    setPooledLots(updated);
    try {
      localStorage.setItem('nira_fpo_pools', JSON.stringify(updated));
    } catch (e) {}
    setShowNewPoolModal(false);
    setSuccessSignal(`Created ${totalQty.toLocaleString()} kg Virtual Pool with ${newMembersCount} smallholders!`);
    setTimeout(() => setSuccessSignal(null), 4000);
  };

  const totalMembersCount = pooledLots.reduce((acc, l) => acc + (l.members || 0), 0);

  return (
    <PortalGuard
      requiredRole="FPO"
      portalName="FPO Aggregator"
      portalDescription="This portal is restricted to registered FPO managers for pooling member farm yields and collective bargaining."
    >
      <div className="space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0F3826] text-amber-50 p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-emerald-950 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                {t.fpoHeaderBadge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                Sahyadri Farmers Producer FPO Group
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5">
                Manager: {userName} • {totalMembersCount} Member Farmers Pooled (Collective Bargaining)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewPoolModal(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pool New Member Yield Lot</span>
          </button>
        </div>

        {/* AI Advisory Callout Banner */}
        <div className="p-5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/20 rounded-xl text-amber-800 dark:text-amber-300 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-emerald-950 dark:text-amber-100">
                AI Crop Planning & Demand Advisory for FPO Members
              </h4>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                Tomatoes projecting <strong>+21.4% price surge</strong> next week in Pune mandis. Lasalgaon onions facing temporary harvest glut. Recommend member pooling for tomatoes.
              </p>
            </div>
          </div>

          <Link
            href="/forecast"
            className="px-4 py-2 bg-[#0F3826] hover:bg-emerald-900 text-amber-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            <span>Open AI Forecast Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl space-y-1 border-l-4 border-l-emerald-700 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{t.fpoStatTotalSupply}</span>
            <div className="text-2xl font-extrabold text-emerald-950 dark:text-amber-100">
              {(pooledLots.reduce((acc, l) => acc + l.total_quantity_kg, 0) / 1000).toFixed(1)} Tons
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">{t.fpoStatBargaining}</span>
          </div>

          <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl space-y-1 border-l-4 border-l-amber-600 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{t.fpoStatVirtualLots}</span>
            <div className="text-2xl font-extrabold text-amber-800 dark:text-amber-400">{pooledLots.length} Lots</div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
              {pooledLots.reduce((acc, l) => acc + l.members, 0)} Smallholder Farmers Pooled
            </span>
          </div>

          <div className="bg-white dark:bg-[#07170f] p-5 rounded-2xl space-y-1 border-l-4 border-l-blue-600 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{t.fpoStatBuyerReqs}</span>
            <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">{bulkReqs.length} Offers</div>
            <span className="text-[11px] text-blue-600 dark:text-blue-300 font-medium">Institutional Bulk Demand Ready</span>
          </div>
        </div>

        {/* Pooled Lots & RFQs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pooled Virtual Lots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-emerald-950 dark:text-amber-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>{t.fpoSectionVirtualLots}</span>
              </h2>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Collective Yields
              </span>
            </div>

            <div className="space-y-4">
              {pooledLots.map((lot) => (
                <div key={lot.id} className="bg-white dark:bg-[#07170f] p-5 rounded-2xl space-y-3 border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">Lot #{lot.id}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      lot.status === 'Lot Locked & Secured'
                        ? 'bg-emerald-900 text-amber-200'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {lot.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-emerald-950 dark:text-white">{lot.crop_name}</h3>
                  <div className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                    Total Quantity: <strong className="text-emerald-950 dark:text-white">{lot.total_quantity_kg.toLocaleString()} kg</strong> • Target Rate: <strong className="text-amber-800 dark:text-amber-300">₹{lot.target_price_rs}/kg</strong>
                  </div>

                  <div className="pt-3 border-t border-emerald-900/10 dark:border-emerald-500/20 flex items-center justify-between">
                    <span className="text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                      {lot.members} Smallholders Pooled (+₹3.50/kg Bargaining Power)
                    </span>
                    {lot.status !== 'Lot Locked & Secured' ? (
                      <button
                        type="button"
                        onClick={() => handleLockLot(lot.id)}
                        className="px-4 py-2 bg-[#0F3826] text-amber-50 hover:bg-emerald-900 font-bold rounded-xl text-xs shadow transition cursor-pointer"
                      >
                        {t.fpoLockLotBtn}
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {t.fpoLotLockedStatus}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Bulk RFQs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-emerald-950 dark:text-amber-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Bulk Institutional Procurement Offers (RFQs)</span>
              </h2>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Direct B2B Contracts
              </span>
            </div>

            <div className="space-y-4">
              {bulkReqs.map((req) => (
                <div key={req.id} className="bg-white dark:bg-[#07170f] p-5 rounded-2xl space-y-3 border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-emerald-950 dark:text-white">{req.buyer}</h3>
                    <span className={`text-[10px] px-2.5 py-0.5 font-bold rounded-full ${
                      req.status === 'FULFILLED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {req.status === 'FULFILLED' ? 'Contract Committed ✓' : 'Active Demand Offer'}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                    Requirement: <strong>{req.qty_kg.toLocaleString()} kg {req.crop_name}</strong> @ Max ₹{req.max_price_rs}/kg
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-emerald-950 dark:text-emerald-200">
                      <span>{t.fpoFulfilledPercent}</span>
                      <span className="text-amber-800 dark:text-amber-400">{req.fill_percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-emerald-900/10 dark:bg-emerald-950 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${req.fill_percent}%` }} />
                    </div>
                  </div>

                  {req.status !== 'FULFILLED' ? (
                    <button
                      type="button"
                      onClick={() => handleAcceptRfq(req.id)}
                      className="w-full py-2.5 bg-[#0F3826] text-amber-50 hover:bg-emerald-900 font-bold rounded-xl text-xs shadow transition cursor-pointer"
                    >
                      Commit FPO Pooled Supply (Escrow Lock)
                    </button>
                  ) : (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                      Escrow Provisioned: Payout Scheduled on Dual-OTP Dropoff
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: Create Virtual Pooling Lot */}
        {showNewPoolModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <h3 className="font-extrabold text-lg text-emerald-950 dark:text-amber-100">
                    Aggregate Smallholder Crop Yields
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPoolModal(false)}
                  className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePool} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-emerald-950 dark:text-emerald-200 block mb-1">
                    Crop Variety to Aggregate
                  </label>
                  <input
                    type="text"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#FAF5EB] dark:bg-[#0c2217] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl font-medium focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-emerald-950 dark:text-emerald-200 block mb-1">
                      Member Farmers Pooled
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={newMembersCount}
                      onChange={(e) => setNewMembersCount(parseInt(e.target.value) || 2)}
                      required
                      className="w-full p-2.5 bg-[#FAF5EB] dark:bg-[#0c2217] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 dark:text-emerald-200 block mb-1">
                      Avg Yield per Farmer (kg)
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={newAvgYieldKg}
                      onChange={(e) => setNewAvgYieldKg(parseInt(e.target.value) || 10)}
                      required
                      className="w-full p-2.5 bg-[#FAF5EB] dark:bg-[#0c2217] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-400/30 text-[11px] space-y-1">
                  <div className="font-bold text-emerald-950 dark:text-white flex justify-between">
                    <span>Total Aggregated Commercial Volume:</span>
                    <span className="font-mono text-emerald-700 dark:text-amber-300 font-black">
                      {(newMembersCount * newAvgYieldKg).toLocaleString()} kg
                    </span>
                  </div>
                  <p className="text-emerald-800/80 dark:text-emerald-300/80">
                    By pooling yields, smallholder members gain <strong>+₹3.50 to ₹5.00/kg</strong> in collective bargaining power versus individual mandi distress sales.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-emerald-950 dark:text-emerald-200 block mb-1">
                    FPO Target Price Floor (₹/kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newTargetRate}
                    onChange={(e) => setNewTargetRate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#FAF5EB] dark:bg-[#0c2217] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl font-medium focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-black rounded-xl text-xs shadow-md transition"
                >
                  Create & Lock Virtual FPO Batch
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Green Pulse Success Signal Toast */}
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
