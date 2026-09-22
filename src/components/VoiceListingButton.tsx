'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Loader2, Volume2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceListingButtonProps {
  onExtracted: (data: {
    cropName: string;
    cropNameHi: string;
    category: any;
    quantityKg: number;
    basePriceRupees: number;
    variety: string;
    grade: string;
    extractedSummary: string;
  }) => void;
}

export default function VoiceListingButton({ onExtracted }: VoiceListingButtonProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Quick interactive vernacular presets for instant 1-click test
  const presets = [
    {
      label: '🇮🇳 Hindi (प्याज / Onion)',
      text: 'मेरे पास 800 किलो नासिक लाल प्याज है 22 रुपये प्रति किलो',
    },
    {
      label: '🍅 English (Tomatoes)',
      text: 'I have 500 kg Grade A organic tomatoes at 30 rupees per kg',
    },
    {
      label: '🌾 Hindi (गेहूं / Wheat)',
      text: 'मेरे पास 2000 किलो शरबती गेहूं है 35 रुपये प्रति किलो ग्रेड A+',
    },
    {
      label: '🥔 Marathi (बटाटा / Potato)',
      text: 'माझ्याकडे 1200 किलो ताजे बटाटे आहेत 20 रुपये प्रति किलो',
    },
    {
      label: '🌶️ Tamil (மிளகாய் / Chilli)',
      text: 'என்னிடம் 400 கிலோ குண்டூர் பச்சை மிளகாய் உள்ளது கிலோ 45 ரூபாய்',
    },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMsg(
              language === 'hi'
                ? 'माइक्रोफ़ोन अनुमति नहीं मिली। आप नीचे दिए गए उदाहरणों पर क्लिक करके भी आज़मा सकते हैं।'
                : 'Microphone permission blocked. You can also tap any preset sample below.'
            );
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const startListening = async () => {
    setErrorMsg(null);
    setStatusMessage(null);
    setTranscript('');

    if (typeof window !== 'undefined' && navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (err: any) {
        console.warn('Microphone permission check:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMsg(
            language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति ब्लॉक है। कृपया ब्राउज़र URL बार में 🔒 या सेटिंग्स आइकन पर क्लिक करके Microphone को "Allow" करें।'
              : 'Microphone permission blocked in Chrome. Click the site settings icon (left of localhost:3000 in your URL bar) and switch Microphone to "Allow".'
          );
          return;
        }
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    } else {
      setErrorMsg(
        language === 'hi'
          ? 'आपका ब्राउज़र सीधे माइक्रोफ़ोन को सपोर्ट नहीं करता, कृपया नीचे दिए गए उदाहरणों में से चुनें।'
          : 'Speech recognition not supported in this browser. Please select a sample prompt below.'
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const processSpeech = async (textToProcess: string) => {
    if (!textToProcess.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया पहले कुछ बोलें या उदाहरण चुनें।' : 'Please speak or select a preset first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setStatusMessage(language === 'hi' ? 'निरा AI वॉयस ट्रांसक्रिप्ट समझ रहा है...' : 'Nira AI is parsing your vernacular speech...');

    try {
      const res = await fetch('/api/v1/ai/voice-to-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speechText: textToProcess, language }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to extract crop details.');
      }

      onExtracted({
        cropName: data.cropName,
        cropNameHi: data.cropNameHi,
        category: data.category,
        quantityKg: data.quantityKg,
        basePriceRupees: data.basePriceRupees,
        variety: data.variety,
        grade: data.grade,
        extractedSummary: data.extractedSummary,
      });

      setStatusMessage(`✅ ${data.extractedSummary}`);
      setTimeout(() => {
        setIsOpen(false);
        setIsProcessing(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse speech with AI.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all transform active:scale-95"
      >
        <Mic className="w-4 h-4 animate-pulse" />
        <span>{language === 'hi' ? '🎙️ बोलकर फसल जोड़ें' : '🎙️ Voice Crop Listing'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#0c2217] text-[#1A2E26] dark:text-[#E2E8F0] rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-amber-500/30 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{language === 'hi' ? 'निरा वॉयस फसल लिस्टिंग' : 'Nira Vernacular Voice Listing'}</span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-mono">
                      AI Powered
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {language === 'hi'
                      ? 'अपनी मातृभाषा में बोलें — AI सीधे फसल का नाम, मात्रा और भाव पहचान लेगा।'
                      : 'Speak naturally in your native dialect — AI detects crop, quantity & price.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopListening();
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mic Center Stage */}
            <div className="flex flex-col items-center justify-center p-6 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-500/20 space-y-3">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                  isListening
                    ? 'bg-red-500 text-white animate-ping scale-105'
                    : 'bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
              </button>

              <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">
                {isListening
                  ? language === 'hi'
                    ? '🔴 सुन रहे हैं... कृपया बोलें'
                    : '🔴 Listening... speak now'
                  : language === 'hi'
                  ? 'माइक दबाएं और फसल विवरण बोलें'
                  : 'Tap the mic to start speaking'}
              </p>

              {transcript && (
                <div className="w-full p-3 bg-white dark:bg-[#07170f] rounded-xl border border-amber-500/30 text-xs font-medium text-gray-800 dark:text-gray-200 shadow-inner">
                  "{transcript}"
                </div>
              )}
            </div>

            {/* Status & Error */}
            {statusMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-800 dark:text-red-200 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-lg text-[11px] font-black whitespace-nowrap shadow transition self-end sm:self-auto"
                >
                  {language === 'hi' ? '🔄 पेज रीलोड करें (Apply)' : '🔄 Reload Page to Apply'}
                </button>
              </div>
            )}

            {/* Quick Vernacular Presets (1-Click Judge Demo) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400">
                <span>{language === 'hi' ? 'त्वरित डेमो परीक्षण (Quick Presets):' : 'Or tap a 1-click test sample:'}</span>
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> SIH Ready
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(p.text);
                      processSpeech(p.text);
                    }}
                    disabled={isProcessing}
                    className="text-left p-2.5 bg-gray-50 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-gray-200 dark:border-white/10 hover:border-amber-500/40 rounded-xl transition group"
                  >
                    <p className="font-bold text-[11px] text-amber-800 dark:text-amber-300 group-hover:underline">
                      {p.label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      "{p.text}"
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setIsOpen(false);
                }}
                disabled={isProcessing}
                className="flex-1 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs transition"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => processSpeech(transcript)}
                disabled={isProcessing || !transcript.trim()}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{language === 'hi' ? 'AI विश्लेषित कर रहा है...' : 'AI Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'hi' ? 'फॉर्म में भरें' : 'Extract & Fill Form'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
