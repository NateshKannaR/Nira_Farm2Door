'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldAlert, Lock, ArrowRight, LogIn, UserPlus, ArrowLeft, RefreshCw } from 'lucide-react';

interface PortalGuardProps {
  requiredRole: UserRole | UserRole[];
  portalName: string;
  portalDescription?: string;
  children: React.ReactNode;
}

const rolePathMap: Record<UserRole, string> = {
  FARMER: '/farmer',
  BUYER: '/buyer',
  FPO: '/fpo',
  HUB_OPERATOR: '/hub',
  TRANSPORTER: '/transporter',
  ADMIN: '/admin',
};

const roleDisplayName: Record<UserRole, { en: string; hi: string }> = {
  FARMER: { en: 'Farmer', hi: 'Farmer' },
  BUYER: { en: 'Direct Buyer', hi: 'Direct Buyer' },
  FPO: { en: 'FPO Manager', hi: 'FPO Manager' },
  HUB_OPERATOR: { en: 'Hub Quality Inspector', hi: 'Hub Quality Inspector' },
  TRANSPORTER: { en: 'Transporter Fleet', hi: 'Transporter Fleet' },
  ADMIN: { en: 'National Governance Admin', hi: 'National Governance Admin' },
};

export default function PortalGuard({
  requiredRole,
  portalName,
  portalDescription,
  children,
}: PortalGuardProps) {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { language } = useLanguage();

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const primaryRequired = allowedRoles[0];

  // 1. Not Authenticated Screen
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
        <div className="max-w-md w-full bg-[#FAF5EB] dark:bg-[#0c2217] border border-emerald-900/15 dark:border-emerald-500/30 rounded-3xl p-8 shadow-xl text-center space-y-6 text-[#1A2E26] dark:text-[#E2E8F0] transition-colors duration-200">
          <div className="w-16 h-16 mx-auto bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8 text-amber-700 dark:text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-900 dark:text-amber-300 font-extrabold text-[10px] rounded-full uppercase tracking-wider border border-amber-500/30">
              Secure Portal • Login Required
            </span>
            <h2 className="text-2xl font-black text-emerald-950 dark:text-amber-100">
              {portalName}
            </h2>
            <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
              {portalDescription ||
                `You must be logged in as a registered ${roleDisplayName[primaryRequired]?.en || primaryRequired} to access this portal.`}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3.5 px-4 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>
                Log In as {roleDisplayName[primaryRequired]?.en}
              </span>
            </button>

            <button
              onClick={() => openAuthModal('signup')}
              className="w-full py-3 px-4 bg-white dark:bg-[#07170f] hover:bg-amber-50/80 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 font-bold rounded-2xl text-xs border border-emerald-900/20 dark:border-emerald-500/30 flex items-center justify-center gap-2 shadow-sm transition"
            >
              <UserPlus className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>
                Register as New {roleDisplayName[primaryRequired]?.en}
              </span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-900/70 dark:text-emerald-300/70 hover:text-emerald-950 dark:hover:text-emerald-100 font-semibold pt-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated but Wrong Role Screen (Admins and Devs are exempt)
  const isDeveloper = user.role === 'ADMIN' || !!user.email?.toLowerCase().includes('dev') || !!user.email?.toLowerCase().includes('admin');
  const hasAccess = allowedRoles.includes(user.role) || isDeveloper;

  if (!hasAccess) {
    const userRoleText = roleDisplayName[user.role] || { en: user.role, hi: user.role };
    const targetRoleText = roleDisplayName[primaryRequired] || { en: primaryRequired, hi: primaryRequired };
    const myDashboardHref = rolePathMap[user.role] || '/';

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
        <div className="max-w-lg w-full bg-[#FAF5EB] dark:bg-[#0c2217] border-2 border-red-500/20 dark:border-red-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6 text-[#1A2E26] dark:text-[#E2E8F0] transition-colors duration-200">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/40 rounded-2xl flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 font-extrabold text-[10px] rounded-full uppercase tracking-wider border border-red-200 dark:border-red-500/40">
              Role Restricted • Access Prohibited
            </span>
            <h2 className="text-2xl font-black text-emerald-950 dark:text-amber-100">
              Portal Access Prohibited
            </h2>
            <div className="bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 text-xs text-emerald-950 dark:text-emerald-100 space-y-1.5 text-left">
              <p>
                <strong>Your Current Role: </strong>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-950 dark:text-amber-300 rounded-md font-extrabold">
                  {userRoleText.en} ({user.name})
                </span>
              </p>
              <p>
                <strong>Required Role: </strong>
                <span className="px-2 py-0.5 bg-emerald-700 text-white rounded-md font-bold">
                  {targetRoleText.en}
                </span>
              </p>
              <p className="text-emerald-900/70 dark:text-emerald-300/70 pt-1 text-[11px] leading-relaxed">
                To protect supply-chain integrity, only verified {targetRoleText.en} accounts can access this portal.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={myDashboardHref}
              className="w-full py-3.5 px-4 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>
                Go to your {userRoleText.en} Dashboard
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>

            <button
              onClick={async () => {
                await logout();
                openAuthModal('login');
              }}
              className="w-full py-3 px-4 bg-white dark:bg-[#07170f] hover:bg-amber-50/80 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 font-bold rounded-2xl text-xs border border-emerald-900/20 dark:border-emerald-500/30 flex items-center justify-center gap-2 shadow-sm transition"
            >
              <RefreshCw className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>
                Switch Account / Login as {targetRoleText.en}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated and Authorized
  return <>{children}</>;
}
