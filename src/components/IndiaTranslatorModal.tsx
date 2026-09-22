'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES, AGRI_PHRASE_DICTIONARY } from '@/lib/i18n';
import {
  Languages,
  X,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Leaf,
  Globe2,
  MessageSquare,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function IndiaTranslatorModal() {
  const {
    language: currentSiteLang,
    setLanguage: setSiteLanguage,
    t,
    isTranslatorOpen,
    setIsTranslatorOpen,
    supportedLanguages,
    translatePhrase
  } = useLanguage();

  const [sourceLang, setSourceLang] = useState<Language>('hi');
  const [targetLang, setTargetLang] = useState<Language>(currentSiteLang !== 'hi' ? currentSiteLang : 'en');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translationSource, setTranslationSource] = useState<string | null>(null);

  if (!isTranslatorOpen) return null;

  const handleSourceLangChange = (newSource: Language) => {
    setSourceLang(newSource);
    if (newSource === targetLang) {
      // Avoid translating to the same language
      const fallbackTarget = newSource === 'hi' ? 'en' : 'hi';
      setTargetLang(fallbackTarget);
    }
  };

  const handleTargetLangChange = (newTarget: Language) => {
    setTargetLang(newTarget);
    if (newTarget === sourceLang) {
      // Avoid translating to the same language
      const fallbackSource = newTarget === 'hi' ? 'en' : 'hi';
      setSourceLang(fallbackSource);
    }
  };

  const handleSwap = () => {
    const tempSrc = sourceLang;
    const tempTrg = targetLang;
    setSourceLang(tempTrg);
    setTargetLang(tempSrc);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleTranslate = async () => {
    const textToTranslate = inputText.trim();
    if (!textToTranslate) return;

    setIsTranslating(true);
    setTranslationSource(null);

    try {
      // 1. Primary: Call Real Google Gemini AI API
      let result = '';
      try {
        const apiRes = await fetch('/api/v1/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToTranslate,
            sourceLang,
            targetLang,
          }),
        });

        if (apiRes.ok) {
          const data = await apiRes.json();
          if (data.success && data.translatedText) {
            result = data.translatedText;
            setTranslationSource(data.aiModel || 'Google Gemini AI');
          }
        }
      } catch (apiErr) {
        console.warn('Gemini API route notice, checking fallbacks:', apiErr);
      }

      // 2. Fallback: Fast dictionary match if offline/network error
      if (!result) {
        const lower = textToTranslate.toLowerCase();
        for (const [key, mapping] of Object.entries(AGRI_PHRASE_DICTIONARY)) {
          const matchedAny = Object.values(mapping).some(
            val => val.toLowerCase() === lower || lower.includes(val.toLowerCase())
          );
          if (matchedAny || lower.includes(key)) {
            result = mapping[targetLang] || '';
            if (result) {
              setTranslationSource('Agri-Dictionary');
              break;
            }
          }
        }
      }

      // 3. Fallback: Direct browser GTX
      if (!result) {
        try {
          const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
          const gtxRes = await fetch(gtxUrl);
          if (gtxRes.ok) {
            const gtxData = await gtxRes.json();
            if (Array.isArray(gtxData) && Array.isArray(gtxData[0])) {
              const joined = gtxData[0].map((item: any) => item[0]).join('');
              if (joined && joined.trim()) {
                result = joined.trim();
                setTranslationSource('Web Translation Engine');
              }
            }
          }
        } catch (e) {}
      }

      // 4. Final fallback if all else fails
      if (!result) {
        result = textToTranslate;
      }

      setOutputText(result);

      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore confetti errors
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSelectPreset = (phraseKey: string) => {
    const phrase = AGRI_PHRASE_DICTIONARY[phraseKey];
    if (phrase) {
      const srcText = phrase[sourceLang] || phrase['hi'] || phraseKey;
      const trgText = phrase[targetLang] || phrase['en'] || phraseKey;
      setInputText(srcText);
      setOutputText(trgText);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSpeak = (text: string, langCode: Language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Map language code to BCP 47 voice locale
    const voiceLocales: Record<Language, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      pa: 'pa-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      bn: 'bn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      or: 'or-IN',
    };

    utterance.lang = voiceLocales[langCode] || 'hi-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleApplySiteLanguage = (lang: Language) => {
    setSiteLanguage(lang);
    setTargetLang(lang);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FAF5EB] dark:bg-[#0c2217] rounded-3xl shadow-2xl border border-emerald-900/20 dark:border-emerald-500/30 overflow-hidden flex flex-col max-h-[90vh] text-[#1A2E26] dark:text-[#E2E8F0] transition-colors duration-200">
        {/* Modal Top Header */}
        <div className="bg-[#0F3826] text-amber-50 p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-400/20 shadow-inner">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-amber-100 leading-tight">
                  {t.translatorHeader}
                </h3>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-extrabold rounded-md border border-amber-400/30">
                  11 Languages
                </span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500/30 to-amber-500/30 text-amber-300 text-[10px] font-black rounded-md border border-amber-400/40 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Google Gemini AI
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5 hidden sm:block">
                {t.translatorSub}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTranslatorOpen(false)}
            className="p-2 hover:bg-emerald-800 text-amber-100 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Language Selection Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-900/5 dark:bg-emerald-950/50 p-3 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20">
            {/* Source Lang */}
            <div className="w-full sm:w-5/12 space-y-1">
              <label className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{t.sourceLangLabel}</span>
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value as Language)}
                className="w-full max-w-full px-3 py-2 bg-white dark:bg-[#07170f] border border-emerald-900/15 dark:border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-950 dark:text-emerald-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 truncate"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flagEmoji} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="p-2.5 bg-white dark:bg-[#07170f] hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-900/15 dark:border-emerald-500/30 rounded-xl shadow-sm transition hover:scale-105"
              title={t.swapLanguages}
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            </button>

            {/* Target Lang */}
            <div className="w-full sm:w-5/12 space-y-1">
              <label className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{t.targetLangLabel}</span>
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as Language)}
                className="w-full max-w-full px-3 py-2 bg-white dark:bg-[#07170f] border border-emerald-900/15 dark:border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-950 dark:text-emerald-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 truncate"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flagEmoji} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Preset Phrases */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.quickAgriPhrasesTitle}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: "what is today's wholesale mandi price for tomatoes?", label: "🍅 Mandi Rates" },
                { key: "produce inspected with computer vision ai and graded a+.", label: "🔍 CV Grading (Grade A+)" },
                { key: "smart contract payment securely deposited in farmer escrow.", label: "🔒 Escrow Payment" },
                { key: "present otp 4829 at the collection hub for vehicle pickup.", label: "🚚 Pickup OTP (Transport)" },
                { key: "virtual pool of 500kg wheat formed under fpo cooperative.", label: "🌾 FPO Pool (Aggregation)" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(item.key)}
                  className="px-2.5 py-1 bg-white dark:bg-[#07170f] hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-emerald-100 border border-emerald-900/10 dark:border-emerald-500/20 rounded-lg text-[11px] font-semibold transition shadow-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Output Translation Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="flex flex-col space-y-2 bg-white dark:bg-[#07170f] p-3.5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
              <div className="flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 font-bold border-b border-emerald-900/5 dark:border-emerald-500/10 pb-2">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.nativeName}</span>
                </span>
                {inputText && (
                  <button
                    onClick={() => { setInputText(''); setOutputText(''); }}
                    className="text-[10px] text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> {t.btnClear}
                  </button>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full h-28 resize-none text-xs text-emerald-950 dark:text-emerald-100 placeholder:text-emerald-900/40 dark:placeholder:text-emerald-300/40 focus:outline-none font-medium leading-relaxed bg-transparent"
              />

              <div className="flex items-center justify-between pt-2 border-t border-emerald-900/5 dark:border-emerald-500/10">
                <button
                  onClick={() => handleSpeak(inputText, sourceLang)}
                  disabled={!inputText}
                  className="p-1.5 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 disabled:opacity-30 transition"
                  title={t.btnListen}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-amber-600 dark:text-amber-400' : ''}`} />
                </button>

                <button
                  onClick={handleTranslate}
                  disabled={!inputText || isTranslating}
                  className="px-3.5 py-1.5 bg-[#0F3826] hover:bg-emerald-900 text-amber-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isTranslating ? '...' : t.btnTranslate}</span>
                </button>
              </div>
            </div>

            {/* Output Box */}
            <div className="flex flex-col space-y-2 bg-emerald-900/5 dark:bg-emerald-950/50 p-3.5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
              <div className="flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 font-bold border-b border-emerald-900/5 dark:border-emerald-500/10 pb-2">
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>{SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.nativeName}</span>
                  </span>
                  {translationSource && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-700/15 text-emerald-900 dark:text-emerald-200 font-extrabold flex items-center gap-1 border border-emerald-500/30">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      {translationSource}
                    </span>
                  )}
                </span>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? t.copiedNotice : t.btnCopy}</span>
                  </button>
                )}
              </div>

              <div className="w-full h-28 overflow-y-auto text-xs text-emerald-950 dark:text-emerald-100 font-bold leading-relaxed whitespace-pre-wrap">
                {outputText || (
                  <span className="text-emerald-900/40 dark:text-emerald-300/40 font-normal italic">
                    {t.translatedOutputPlaceholder}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-900/5 dark:border-emerald-500/10">
                <button
                  onClick={() => handleSpeak(outputText, targetLang)}
                  disabled={!outputText}
                  className="p-1.5 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 disabled:opacity-30 transition"
                  title={t.btnListen}
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleApplySiteLanguage(targetLang)}
                  className="text-[11px] text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 font-extrabold flex items-center gap-1 transition"
                >
                  <span>Set Site Language</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Strip */}
        <div className="bg-emerald-950 px-5 py-3 text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs border-t border-emerald-800/40">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">💡 Tip:</span>
            <span className="text-[11px] text-amber-200/80">
              This translator converts farmer messages, mandi rates, and contract terms into clear English instantly.
            </span>
          </div>

          <button
            onClick={() => setIsTranslatorOpen(false)}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold rounded-xl transition text-xs shadow-sm"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
