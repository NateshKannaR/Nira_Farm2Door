import { getDb } from './db';
import { cropTranslations } from './i18n';
import { findProbabilisticCropMatch } from './fuzzyMatcher';
import { translateWithGemini } from './gemini';

export interface TranslationResult {
  hi: string;
  en: string;
  source: 'dictionary' | 'db_cache' | 'google_ai_live' | 'probabilistic_fuzzy_match';
  confidence?: number;
  matchedKey?: string;
}

/**
 * Live Google Gemini AI Translation with fallback
 */
export async function translateOnline(text: string): Promise<{ hi: string; en: string }> {
  const trimmed = text.trim();
  if (!trimmed) return { hi: text, en: text };

  let hi = '';
  let en = '';
  const isDevanagari = /[\u0900-\u097F]/.test(trimmed);

  // 1. Try Google Gemini Generative AI first
  try {
    if (isDevanagari) {
      hi = trimmed;
      const geminiRes = await translateWithGemini(trimmed, 'en', 'hi');
      if (geminiRes?.translatedText) {
        en = geminiRes.translatedText;
      }
    } else {
      en = trimmed;
      const geminiRes = await translateWithGemini(trimmed, 'hi', 'en');
      if (geminiRes?.translatedText) {
        hi = geminiRes.translatedText;
      }
    }
  } catch (geminiErr) {
    console.warn('Gemini translateOnline notice:', geminiErr);
  }

  // 2. Web fallback if Gemini did not return
  if (!hi || !en) {
    try {
      if (isDevanagari && !en) {
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();
        if (data?.[0]?.[0]?.[0]) {
          en = data[0][0][0].trim();
        }
      } else if (!hi) {
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();
        if (data?.[0]?.[0]?.[0]) {
          hi = data[0][0][0].trim();
        }
      }
    } catch (err) {
      console.error('[AI Translator] Google Translate error:', err);
    }
  }

  // Backup: MyMemory Translate API
  if (!hi || !en || hi === en) {
    try {
      if (!hi || hi === en) {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|hi`);
        const data = await res.json();
        if (data?.responseData?.translatedText) {
          hi = data.responseData.translatedText.trim();
        }
      }
      if (!en || en === hi) {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=hi|en`);
        const data = await res.json();
        if (data?.responseData?.translatedText) {
          en = data.responseData.translatedText.trim();
        }
      }
    } catch (err2) {
      console.error('[AI Translator] MyMemory Translate error:', err2);
    }
  }

  return {
    hi: hi || trimmed,
    en: en || trimmed,
  };
}

/**
 * Translate a single crop name with caching in SQLite DB
 */
export async function getOrFetchCropTranslation(cropName: string): Promise<TranslationResult> {
  const trimmed = cropName.trim();
  const lower = trimmed.toLowerCase();

  // 1. Static Dictionary
  if (cropTranslations[trimmed]) {
    return {
      hi: cropTranslations[trimmed].hi,
      en: cropTranslations[trimmed].en,
      source: 'dictionary',
      confidence: 1.0,
      matchedKey: trimmed,
    };
  }

  // 1b. Smart Probabilistic & Phonetic Matcher (e.g., 'baigan', 'began', 'bagan' -> 'baingan')
  const probMatch = findProbabilisticCropMatch(trimmed, cropTranslations, 0.75);
  if (probMatch && probMatch.confidence >= 0.75) {
    return {
      hi: probMatch.translation.hi,
      en: probMatch.translation.en,
      source: 'probabilistic_fuzzy_match',
      confidence: probMatch.confidence,
      matchedKey: probMatch.matchedKey,
    };
  }

  const db = getDb();

  // 2. Database Cache
  const cached = db.prepare('SELECT hi_name, en_name FROM crop_translations_cache WHERE LOWER(crop_key) = ?').get(lower) as
    | { hi_name: string; en_name: string }
    | undefined;

  if (cached) {
    return {
      hi: cached.hi_name,
      en: cached.en_name,
      source: 'db_cache',
    };
  }

  // 3. Live AI Translation
  const translated = await translateOnline(trimmed);

  // Save to SQLite DB Cache
  try {
    db.prepare(`
      INSERT OR REPLACE INTO crop_translations_cache (crop_key, hi_name, en_name)
      VALUES (?, ?, ?)
    `).run(lower, translated.hi, translated.en);
  } catch (dbErr) {
    console.error('[AI Translator] DB cache insert error:', dbErr);
  }

  return {
    hi: translated.hi,
    en: translated.en,
    source: 'google_ai_live',
  };
}

/**
 * Fetch all cached crop translations from SQLite DB
 */
export function getAllCachedTranslations(): Record<string, { hi: string; en: string }> {
  const db = getDb();
  const rows = db.prepare('SELECT crop_key, hi_name, en_name FROM crop_translations_cache').all() as Array<{
    crop_key: string;
    hi_name: string;
    en_name: string;
  }>;

  const cache: Record<string, { hi: string; en: string }> = {};
  for (const r of rows) {
    cache[r.crop_key] = { hi: r.hi_name, en: r.en_name };
  }
  return cache;
}
