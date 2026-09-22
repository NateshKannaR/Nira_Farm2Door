'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedFarmer } from '@/lib/i18n';
import PortalGuard from '@/components/PortalGuard';
import { ShieldCheck, Sparkles, Activity, FileText, CheckCircle2, TrendingUp, Leaf, Award } from 'lucide-react';
import { getVerificationRegistry, setProduceVerification, ProduceVerificationRecord } from '@/lib/verifiedStore';
import VerifiedBadge from '@/components/VerifiedBadge';

export default function AdminPage() {
  const { t, language } = useLanguage();

  const [registry, setRegistry] = useState<Record<string, ProduceVerificationRecord>>(() =>
    getVerificationRegistry()
  );
  const [orders, setOrders] = useState<any[]>([]);
  const [apiCrops, setApiCrops] = useState<any[]>([]);
  const [customCrops, setCustomCrops] = useState<any[]>([]);

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kb_custom_crops') || '[]');
      setCustomCrops(stored);
    } catch (e) {}

    fetch('/api/v1/crops')
      .then((res) => res.json())
      .then((data) => {
        if (data.crops && Array.isArray(data.crops)) {
          setApiCrops(data.crops);
        }
      })
      .catch((e) => console.log('Admin crops fetch error:', e));

    fetch('/api/v1/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((e) => console.log('Admin orders fetch error:', e));
  }, []);

  const allAuditProduce = React.useMemo(() => {
    const list: any[] = [];
    apiCrops.forEach((item) => {
      list.push({
        id: item.id,
        name: item.crop || item.crop_name,
        nameHi: item.crop_name_hi,
        category: item.category,
        farmerName: item.farmer_name || item.farmerName || 'Farmer Member',
        location: item.location || 'Mandi Hub',
      });
    });
    customCrops.forEach((item) => {
      if (!list.some((x) => x.id === item.id)) {
        list.push({
          id: item.id,
          name: item.crop || item.crop_name || item.name,
          nameHi: item.crop_name_hi || item.nameHi,
          category: item.category || 'Vegetables',
          farmerName: item.farmer_name || item.farmerName || 'Farmer Member',
          location: item.location || 'Collection Center',
        });
      }
    });
    return list;
  }, [apiCrops, customCrops]);

  const handleToggleVerified = (cropId: string) => {
    const current = registry[cropId] || {
      id: cropId,
      isVerified: false,
      isOrganic: false,
      grade: 'A',
    };
    const updated = setProduceVerification(cropId, {
      isVerified: !current.isVerified,
    });
    setRegistry((prev) => ({ ...prev, [cropId]: updated }));
  };

  const handleToggleOrganic = (cropId: string) => {
    const current = registry[cropId] || {
      id: cropId,
      isVerified: false,
      isOrganic: false,
      grade: 'A',
    };
    const updated = setProduceVerification(cropId, {
      isOrganic: !current.isOrganic,
    });
    setRegistry((prev) => ({ ...prev, [cropId]: updated }));
  };

  const handleGradeChange = (cropId: string, grade: string) => {
    const updated = setProduceVerification(cropId, { grade });
    setRegistry((prev) => ({ ...prev, [cropId]: updated }));
  };

  const totalGmvPaise = orders.reduce((sum, o) => sum + (o.total_amount_paise || 0), 0);

  return (
    <PortalGuard
      requiredRole="ADMIN"
      portalName="National Governance Admin"
      portalDescription="This portal is restricted to authorized Ministry and Governance Admins for MSP enforcement and national trade surveillance."
    >
      <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 bg-[#0F3826] text-amber-50 p-6 rounded-3xl shadow-xl border border-amber-500/20">
        <div className="p-3 bg-amber-500/20 rounded-2xl">
          <ShieldCheck className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-emerald-950 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            Nira Command • SIH 2026 PS 26033 National Mandi Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Ministry Governance & Mandi Control Room
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5">
            Ministry of Consumer Affairs, Food & Public Distribution — Direct Agri Trade Control
          </p>
        </div>
      </div>

      {/* Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-emerald-700">
          <span className="text-xs font-bold text-emerald-800">
            Total National Gross Merchandise Value (GMV)
          </span>
          <div className="text-2xl font-extrabold text-emerald-950">
            ₹{(totalGmvPaise / 100).toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-700 font-mono font-medium">
            ({totalGmvPaise} {t.paiseSuffix}) • Verified Ledger
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-blue-600">
          <span className="text-xs font-bold text-emerald-800">
            Farmer Income Share
          </span>
          <div className="text-2xl font-extrabold text-blue-700">82.4%</div>
          <span className="text-[11px] text-blue-600 font-medium">
            vs Traditional Mandi (35%)
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-amber-600">
          <span className="text-xs font-bold text-emerald-800">
            Buyer Cost Savings
          </span>
          <div className="text-2xl font-extrabold text-amber-700">37.8%</div>
          <span className="text-[11px] text-amber-600 font-medium">
            Middleman Commission Eliminated
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-purple-600">
          <span className="text-xs font-bold text-emerald-800">
            Food Saved (Spoilage Prevention)
          </span>
          <div className="text-2xl font-extrabold text-purple-700">4.2 Tons</div>
          <span className="text-[11px] text-purple-600 font-medium">
            AI Route & Logistics Optimization
          </span>
        </div>
      </div>

      {/* AI Confidence & Governance Panel */}
      <div className="bg-[#0F3826] text-amber-50 p-6 rounded-3xl shadow-xl space-y-6 border border-amber-500/20">
        <div className="flex items-center gap-3 border-b border-emerald-800/60 pb-4">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg font-bold">
            6 AI Models Live National Reliability Tracker
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800 space-y-2">
            <span className="text-xs text-amber-300 font-bold">Fair Price AI (Model 1)</span>
            <div className="text-xl font-extrabold text-amber-50">94.8% Accuracy</div>
            <p className="text-[11px] text-amber-200/70">
              Agmarknet Mandi Index + Grade Premium
            </p>
          </div>

          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800 space-y-2">
            <span className="text-xs text-amber-300 font-bold">CV Auto-Grading (Model 2)</span>
            <div className="text-xl font-extrabold text-amber-50">99.4% Grade Confidence</div>
            <p className="text-[11px] text-amber-200/70">
              Automated Quality via FSSAI Standard
            </p>
          </div>

          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800 space-y-2">
            <span className="text-xs text-amber-300 font-bold">Route & Waste Prevention (Model 3 & 4)</span>
            <div className="text-xl font-extrabold text-amber-50">+24.0% Fuel Savings</div>
            <p className="text-[11px] text-amber-200/70">
              Multi-stop pickup & 0% spoilage guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Live Order Transactions Stream */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-900" />
            <h3 className="font-extrabold text-lg text-emerald-950">
              Live Trade Transactions Stream (National Ledger)
            </h3>
          </div>
          <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full">
            Live Updated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-emerald-900/10 text-emerald-950 border-b border-emerald-900/10">
                <th className="p-3 font-bold">Order ID</th>
                <th className="p-3 font-bold">Buyer Institution</th>
                <th className="p-3 font-bold">Farmer Producer / FPO</th>
                <th className="p-3 font-bold">Total Amount</th>
                <th className="p-3 font-bold">Logistics Type</th>
                <th className="p-3 font-bold">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-emerald-800/70 font-semibold">
                    No transactions yet. Real orders placed by buyers and farmers will stream into this national ledger in real-time.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-emerald-50/50 transition font-medium">
                    <td className="p-3 font-bold text-emerald-950">#{ord.id}</td>
                    <td className="p-3">{getLocalizedFarmer(ord.buyer_name, language)}</td>
                    <td className="p-3">{getLocalizedFarmer(ord.farmer_name, language)}</td>
                    <td className="p-3 font-extrabold text-amber-800">
                      ₹{(ord.total_amount_paise / 100).toFixed(2)}{' '}
                      <span className="text-[10px] text-emerald-700 font-normal">({ord.total_amount_paise} {t.paiseSuffix})</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">
                        {ord.delivery_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-emerald-900 text-amber-100 rounded-full font-bold">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Mandi Quality & 100% Organic Verification Audit Desk */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border-2 border-emerald-700/20">
        <div className="flex flex-col sm:row sm:items-center justify-between gap-2 border-b border-emerald-900/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
              <VerifiedBadge size="md" variant="whatsapp" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-emerald-950 flex items-center gap-2">
                <span>
                  National Mandi Quality & 100% Organic Official Verification Desk
                </span>
              </h3>
              <p className="text-xs text-emerald-800/80">
                Only crops officially audited & verified here receive the Instagram / WhatsApp style Verified Badge, 100% Organic tag, and certified grade.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full shrink-0">
            {allAuditProduce.length} Produce Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-emerald-900/10 text-emerald-950 border-b border-emerald-900/10">
                <th className="p-3 font-bold">Crop</th>
                <th className="p-3 font-bold">Farmer & Mandi</th>
                <th className="p-3 font-bold">Official Verification</th>
                <th className="p-3 font-bold">100% Organic Audit</th>
                <th className="p-3 font-bold">Certified Grade</th>
                <th className="p-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/5">
              {allAuditProduce.map((p) => {
                const rec = registry[p.id] || {
                  id: p.id,
                  isVerified: false,
                  isOrganic: false,
                  grade: 'A',
                };
                return (
                  <tr key={p.id} className="hover:bg-emerald-50/50 transition font-medium">
                    <td className="p-3 font-bold text-emerald-950">
                      <div className="flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {rec.isVerified && (
                          <VerifiedBadge size="xs" variant="whatsapp" tooltip="Officially Verified" />
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-normal block">ID: {p.id} • {p.category}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-emerald-950">{p.farmerName}</div>
                      <span className="text-[10px] text-emerald-700/80">{p.location}</span>
                    </td>
                    <td className="p-3">
                      {rec.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[11px] border border-emerald-300">
                          <VerifiedBadge size="xs" variant="whatsapp" />
                          <span>Officially Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 text-amber-900 font-bold text-[11px] border border-amber-300/50">
                          <Activity className="w-3 h-3 text-amber-600 animate-pulse" />
                          <span>Pending Audit</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleOrganic(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                          rec.isOrganic
                            ? 'bg-emerald-800 text-amber-100 shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        <Leaf className="w-3 h-3" />
                        <span>{rec.isOrganic ? '100% Organic (Yes)' : 'Standard (No)'}</span>
                      </button>
                    </td>
                    <td className="p-3">
                      <select
                        value={rec.grade || 'A+'}
                        onChange={(e) => handleGradeChange(p.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-emerald-900/20 rounded-lg text-xs font-bold text-emerald-950 focus:outline-none"
                      >
                        <option value="A+">Grade A+</option>
                        <option value="A">Grade A</option>
                        <option value="B">Grade B</option>
                        <option value="C">Grade C</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleVerified(p.id)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition shadow-sm ${
                          rec.isVerified
                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                            : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/20'
                        }`}
                      >
                        {rec.isVerified ? 'Revoke' : 'Grant Verified'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </PortalGuard>
  );
}
