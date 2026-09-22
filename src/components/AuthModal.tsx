'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Lock, Mail, User, ShieldCheck, Key, Eye, EyeOff, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Generate a strong 12-character password suggestion
 */
function generateStrongPassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let pass = 'Kisan';
  pass += Math.floor(100 + Math.random() * 900);
  pass += '!Agri';
  while (pass.length < 12) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
    resetPassword,
    signInWithGoogle,
    developerLogin,
  } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>(authModalTab || 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('FARMER');

  if (!isAuthModalOpen) return null;

  // Password Strength Criteria
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/5' };
    if (strengthScore <= 3) return { label: 'Medium', color: 'bg-amber-500', width: 'w-3/5' };
    if (strengthScore === 4) return { label: 'Strong', color: 'bg-emerald-500', width: 'w-4/5' };
    return { label: 'Very Strong', color: 'bg-emerald-600', width: 'w-full' };
  };

  const handleSuggestPassword = () => {
    const suggested = generateStrongPassword();
    setPassword(suggested);
    setShowPassword(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Login failed.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (strengthScore < 2) {
      setErrorMsg('Please enter a stronger password (min 8 chars)');
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password, role);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Signup failed.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);
    if (res.message) {
      setSuccessMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#FAF5EB] dark:bg-[#0c2217] w-full max-w-md rounded-3xl shadow-2xl border border-emerald-900/20 dark:border-emerald-500/30 overflow-hidden flex flex-col text-[#1A2E26] dark:text-[#E2E8F0] transition-colors duration-200">
        {/* Header Banner */}
        <div className="bg-[#0F3826] text-amber-50 p-5 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-2xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-tight">
                Nira Secure Auth Portal
              </h2>
              <p className="text-xs text-amber-200/80">
                4-Layer Enterprise Security & Authentication
              </p>
            </div>
          </div>
          <button onClick={closeAuthModal} className="p-1.5 hover:bg-emerald-800 rounded-full transition text-amber-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-emerald-900/10 dark:border-emerald-500/20 bg-emerald-950/5 dark:bg-emerald-950/50 text-xs font-extrabold">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              activeTab === 'login' ? 'border-amber-600 text-amber-900 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/20' : 'border-transparent text-emerald-900/60 dark:text-emerald-300/60 hover:text-emerald-950 dark:hover:text-emerald-100'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              activeTab === 'signup' ? 'border-amber-600 text-amber-900 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/20' : 'border-transparent text-emerald-900/60 dark:text-emerald-300/60 hover:text-emerald-950 dark:hover:text-emerald-100'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setActiveTab('forgot');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              activeTab === 'forgot' ? 'border-amber-600 text-amber-900 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/20' : 'border-transparent text-emerald-900/60 dark:text-emerald-300/60 hover:text-emerald-950 dark:hover:text-emerald-100'
            }`}
          >
            Reset Pass
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-500/40 rounded-xl text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {/* Developer & Collaborator Master ID Card */}
              <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 rounded-2xl border-2 border-amber-500/35 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-950 font-black text-[10px] uppercase tracking-wider border border-amber-500/40">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Developer & Collaborator ID</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-900 bg-white/90 px-2 py-0.5 rounded-md font-extrabold border border-emerald-900/10">
                    ALL 6 PORTALS
                  </span>
                </div>

                <p className="text-[11px] text-emerald-950/85 leading-snug">
                  1-Click God Mode: Instant universal access to test and analyze all 6 stakeholder portals without restrictions.
                </p>

                <button
                  type="button"
                  onClick={developerLogin}
                  className="w-full py-2.5 bg-[#062215] hover:bg-[#0F3826] text-amber-300 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition border border-amber-400/40 active:scale-[0.99]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ 1-Click Developer Master Login (Full Access)</span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-emerald-950/75 font-mono px-1">
                  <span>ID: <code className="text-emerald-900 font-bold bg-white/60 px-1 rounded">natesh@nira.ai</code></span>
                  <span>Pass: <code className="text-emerald-900 font-bold bg-white/60 px-1 rounded">dev</code></span>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-emerald-800/60 dark:text-emerald-400/60" />
                  <input
                    type="email"
                    required
                    placeholder="farmer@nira.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 placeholder-emerald-900/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-emerald-800/60 dark:text-emerald-400/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 placeholder-emerald-900/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-emerald-800/60 dark:text-emerald-400/60 hover:text-emerald-950 dark:hover:text-emerald-100"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
                <span>Log In Securely</span>
              </button>

              <div className="relative my-4 text-center text-xs text-emerald-900/40 dark:text-emerald-300/40 font-bold">
                <span className="bg-[#FAF5EB] dark:bg-[#0c2217] px-3 relative z-10">OR 1-CLICK QUICK LOGIN</span>
                <div className="absolute inset-0 top-1/2 border-t border-emerald-900/10 dark:border-emerald-500/20" />
              </div>

              {/* Quick Demo Login Preset Buttons */}
              <div className="p-3 bg-emerald-900/5 dark:bg-emerald-950/50 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 space-y-2">
                <p className="text-[10px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Instant Quick Demo Login Accounts:</span>
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-extrabold">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('farmer@nira.ai');
                      setPassword('Kisan#9824!Agri');
                    }}
                    className="p-2 bg-white dark:bg-[#07170f] hover:bg-amber-100/60 dark:hover:bg-emerald-900/40 border border-emerald-900/10 dark:border-emerald-500/20 rounded-xl text-left truncate text-emerald-950 dark:text-emerald-100 transition"
                  >
                    🚜 Ramesh Patil (Farmer)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('buyer@nira.ai');
                      setPassword('Kisan#9824!Agri');
                    }}
                    className="p-2 bg-white dark:bg-[#07170f] hover:bg-amber-100/60 dark:hover:bg-emerald-900/40 border border-emerald-900/10 dark:border-emerald-500/20 rounded-xl text-left truncate text-emerald-950 dark:text-emerald-100 transition"
                  >
                    🛒 Annapurna (Buyer)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('fpo@nira.ai');
                      setPassword('Kisan#9824!Agri');
                    }}
                    className="p-2 bg-white dark:bg-[#07170f] hover:bg-amber-100/60 dark:hover:bg-emerald-900/40 border border-emerald-900/10 dark:border-emerald-500/20 rounded-xl text-left truncate text-emerald-950 dark:text-emerald-100 transition"
                  >
                    🏢 Sanjay Lead (FPO)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('rajesh.hub@nira.ai');
                      setPassword('Kisan#9824!Agri');
                    }}
                    className="p-2 bg-white dark:bg-[#07170f] hover:bg-amber-100/60 dark:hover:bg-emerald-900/40 border border-emerald-900/10 dark:border-emerald-500/20 rounded-xl text-left truncate text-emerald-950 dark:text-emerald-100 transition"
                  >
                    🔬 Rajesh (Hub Inspector)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('natesh@nira.ai');
                      setPassword('dev');
                    }}
                    className="p-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-500/30 rounded-xl text-left truncate text-amber-950 transition font-black col-span-2 text-center"
                  >
                    ⚡ Natesh Dev God Mode (Full Access)
                  </button>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
            </div>
          )}

          {/* TAB 2: SIGNUP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-emerald-800/60 dark:text-emerald-400/60" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 placeholder-emerald-900/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-emerald-800/60 dark:text-emerald-400/60" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 placeholder-emerald-900/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  Select Platform Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="FARMER">Farmer Portal</option>
                  <option value="BUYER">Direct Buyer Portal</option>
                  <option value="FPO">FPO Manager Portal</option>
                  <option value="HUB_OPERATOR">Hub Operator Portal</option>
                  <option value="TRANSPORTER">Transporter Partner Portal</option>
                  <option value="ADMIN">National Governance Admin</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    Create Strong Password
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggestPassword}
                    className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full hover:bg-amber-500/30 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Suggest Strong Password</span>
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-emerald-800/60 dark:text-emerald-400/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 placeholder-emerald-900/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-emerald-800/60 dark:text-emerald-400/60 hover:text-emerald-950 dark:hover:text-emerald-100"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-emerald-900/70 dark:text-emerald-300/70">Security Strength:</span>
                      <span className="text-emerald-950 dark:text-emerald-200">{getStrengthLabel().label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-900/10 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                      <div className={`h-full ${getStrengthLabel().color} ${getStrengthLabel().width} transition-all duration-300`} />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-emerald-800/70 dark:text-emerald-300/70 pt-1">
                      <span className={hasMinLength ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}>✓ 8+ chars</span>
                      <span className={hasUpper ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}>✓ Uppercase</span>
                      <span className={hasNumber ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}>✓ Number</span>
                      <span className={hasSymbol ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}>✓ Special char</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
                <span>Register Account</span>
              </button>

              <div className="relative my-3 text-center text-xs text-emerald-900/40 dark:text-emerald-300/40 font-bold">
                <span className="bg-[#FAF5EB] dark:bg-[#0c2217] px-3 relative z-10">OR</span>
                <div className="absolute inset-0 top-1/2 border-t border-emerald-900/10 dark:border-emerald-500/20" />
              </div>

              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12s.47 3.8 1.29 5.42l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Sign Up with Google</span>
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                Enter your registered email address. We will send you a password reset verification link.
              </p>

              <div>
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-emerald-800/60 dark:text-emerald-400/60" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#07170f] border border-emerald-900/20 dark:border-emerald-500/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 placeholder-emerald-900/40 dark:placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
                <span>Send Reset Link</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full text-center text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline pt-2 block"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
