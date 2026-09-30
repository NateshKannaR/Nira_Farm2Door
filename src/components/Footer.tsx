'use client';

import React from 'react';
import { Leaf, Shield, Cpu, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-12 pb-8 px-4 sm:px-8 mt-16">
      <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-extrabold text-xl">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Leaf className="w-4 h-4 fill-white" />
            </div>
            <span>{t.appName}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.footerMission || `${t.subTitle}. Smart India Hackathon 2026 Problem Statement 26033 (Ministry of Consumer Affairs, Food & Public Distribution).`}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> {t.aiEnginesCore || 'AI Engine Core (6 AI Engines)'}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• Fair Price AI (Mandi MSP + Quality)</li>
            <li>• CV Computer Vision Quality Grading</li>
            <li>• Demand Forecasting AI Engine</li>
            <li>• Route Optimization AI (Multi-stop)</li>
            <li>• Post-Harvest Waste Risk Engine</li>
            <li>• Buyer-Farmer Direct Matching AI</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> {t.userRolesFooter || 'User Roles (6 Personas)'}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• {t.roleFarmer} ({t.roleFarmerSub || 'IVR/SMS + Fair Price'})</li>
            <li>• {t.roleFPO} ({t.roleFPOSub || 'Virtual Lot Aggregation'})</li>
            <li>• {t.roleBuyer} ({t.roleBuyerSub || 'Bulk Procurement Contracts'})</li>
            <li>• {t.roleHub} ({t.roleHubSub || 'CV Inspection & QR Tagging'})</li>
            <li>• {t.roleTransporter} ({t.roleTransporterSub || 'OTP Dispatch Verification'})</li>
            <li>• {t.roleAdmin} ({t.roleAdminSub || 'National Mandi Governance'})</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> {t.helplineTitle || 'Helpline & Support'}
          </h4>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <p className="font-semibold text-emerald-400">{t.helplineDesc || 'Farmer Toll-Free IVR Helpline'}:</p>
            <p className="text-sm font-mono text-white font-bold">1800-KISAN-AI (1800-54726-24)</p>
            <p className="text-[11px] text-slate-400">{t.allIndiaLangs247 || 'Available 24x7 in English, Hindi & Regional Languages'}</p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Nira — Direct Farm-to-Buyer Digital Agriculture Platform (SIH 2026 PS 26033). All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/ctrlaltsolveorg-cloud/sih2026"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://sih2026-smoky.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            Live App
          </a>
          <a
            href="https://agmarknet.gov.in"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            Agmarknet API
          </a>
        </div>
      </div>
    </footer>
  );
}
