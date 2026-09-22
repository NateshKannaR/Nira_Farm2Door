'use client';

import React from 'react';
import {
  QrCode,
  MapPin,
  Calendar,
  Award,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Leaf,
  Sparkles,
  ExternalLink,
  Lock,
  Compass
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TraceabilityModalProps {
  cropName: string;
  farmerName: string;
  location: string;
  harvestDate: string;
  grade: string;
  cvScore: number;
  isOrganic: number;
  lotId?: string | number;
  onClose: () => void;
}

export default function TraceabilityModal({
  cropName,
  farmerName,
  location,
  harvestDate,
  grade,
  cvScore,
  isOrganic,
  lotId = 'LOT-KB-2026-984',
  onClose,
}: TraceabilityModalProps) {
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-emerald-900/10 dark:border-emerald-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-amber-300 rounded-2xl border border-emerald-300/40">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Farm-to-Fork Traceability Passport</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-amber-100 mt-1">
                {cropName}
              </h3>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 font-mono">
                Lot Hash: #{lotId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/10 dark:bg-white/10 flex items-center justify-center text-emerald-950 dark:text-white font-bold hover:bg-emerald-900/20 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* QR Visual Stamping Box */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20">
          {/* Simulated QR Code Graphic */}
          <div className="w-28 h-28 bg-white p-2 rounded-xl border border-zinc-300 shadow-sm flex flex-col items-center justify-center shrink-0">
            <div className="w-full h-full bg-emerald-950 p-1.5 rounded flex items-center justify-center text-amber-300">
              <QrCode className="w-20 h-20 text-white" />
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="text-xs font-bold text-emerald-950 dark:text-amber-200 flex items-center justify-center sm:justify-start gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Government Mandi Board & FSSAI Compliant Lot</span>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
              Scanned and registered at origin farm gate. Cryptographic dual-OTP handshake ensures chain-of-custody without unauthorized broker tampering.
            </p>
            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
              Blockchain Ledger Verification: <span className="font-bold">VERIFIED_IMMUTABLE</span>
            </div>
          </div>
        </div>

        {/* Farm & Agronomic Origin Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white dark:bg-[#0b2418] p-4 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300 block">
              Origin Farm & Producer
            </span>
            <div className="font-black text-sm text-emerald-950 dark:text-white">
              {farmerName}
            </div>
            <div className="text-emerald-800/80 dark:text-emerald-300/80 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{location}</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
              GPS Coordinates: 20.165° N, 73.985° E (Nashik Agro Zone)
            </div>
          </div>

          <div className="bg-white dark:bg-[#0b2418] p-4 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300 block">
              Harvest & Quality Scoring
            </span>
            <div className="font-black text-sm text-emerald-950 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{grade}</span>
            </div>
            <div className="text-emerald-800/80 dark:text-emerald-300/80 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Harvest Date: {harvestDate}</span>
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Computer Vision Trust Score: {cvScore}%</span>
            </div>
          </div>
        </div>

        {/* Chain of Custody Timeline */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-emerald-950 dark:text-amber-200 uppercase tracking-wider block">
            Verified Physical Custody Handshakes
          </span>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-400/30 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                1
              </div>
              <div className="flex-1">
                <strong className="text-emerald-950 dark:text-white">Farm Gate Harvesting & Computer Vision Grading</strong>
                <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70">Produce photographed and certified at farm origin with 0% middleman markdowns.</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded text-[10px] font-bold">
                COMPLETED
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-400/30 text-xs">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-bold text-[10px]">
                2
              </div>
              <div className="flex-1">
                <strong className="text-emerald-950 dark:text-white">Transporter Custody Handshake (Farmer OTP)</strong>
                <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70">Physical truck arrival confirmed on-site via 4-digit secret cryptographic key.</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold">
                STAGE 1 OTP
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-400/30 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                3
              </div>
              <div className="flex-1">
                <strong className="text-emerald-950 dark:text-white">Destination Inspection & Escrow Release (Buyer OTP)</strong>
                <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70">Buyer validates goods, shares delivery OTP, and digital escrow unlocks directly to farmer.</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded text-[10px] font-bold">
                STAGE 2 OTP
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0F3826] hover:bg-emerald-900 text-amber-100 font-extrabold text-xs rounded-xl shadow transition text-center"
          >
            Close Traceability Record
          </button>
        </div>
      </div>
    </div>
  );
}
