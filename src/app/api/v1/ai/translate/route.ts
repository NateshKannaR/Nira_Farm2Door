import { NextResponse } from 'next/server';
import { AGRI_PHRASE_DICTIONARY, Language } from '@/lib/i18n';
import { translateWithGemini } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { text, sourceLang = 'auto', targetLang = 'hi' } = await request.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, message: 'Text is required for translation' },
        { status: 400 }
      );
    }

    const trimmed = text.trim();

    // 1. Primary Engine: Real Google Gemini Generative AI Model
    try {
      const geminiResult = await translateWithGemini(trimmed, targetLang, sourceLang);
      if (geminiResult && geminiResult.translatedText) {
        return NextResponse.json({
          success: true,
          translatedText: geminiResult.translatedText,
          aiModel: geminiResult.modelUsed,
          provider: geminiResult.provider,
          source: 'gemini-ai',
          targetLang,
        });
      }
    } catch (geminiErr) {
      console.warn('Google Gemini translation notice, trying fallbacks:', geminiErr);
    }

    // 2. Secondary Fast Path: Agricultural Glossary & Dictionary
    const lower = trimmed.toLowerCase();
    for (const [key, mapping] of Object.entries(AGRI_PHRASE_DICTIONARY)) {
      const matchedAny = Object.values(mapping).some(
        val => val.toLowerCase() === lower || lower.includes(val.toLowerCase())
      );
      if (matchedAny || lower.includes(key)) {
        const dictMatch = mapping[targetLang as Language];
        if (dictMatch) {
          return NextResponse.json({
            success: true,
            translatedText: dictMatch,
            aiModel: 'Agri-Dictionary Fallback',
            provider: 'Nira Native Rules',
            source: 'agri-dictionary',
            targetLang,
          });
        }
      }
    }

    // 3. Tertiary Fallback: Online Machine Translation
    const sl = sourceLang === targetLang ? 'auto' : (sourceLang || 'auto');
    const tl = targetLang || 'hi';

    try {
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(gtxUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': '*/*',
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translated = data[0]
            .map((chunk: any) => (chunk && chunk[0] ? chunk[0] : ''))
            .join('');

          if (translated && translated.trim()) {
            const detectedSource = data[2] || (sourceLang !== 'auto' ? sourceLang : 'auto');
            return NextResponse.json({
              success: true,
              translatedText: translated.trim(),
              detectedSource,
              targetLang,
              aiModel: 'Google GTX Fallback Engine',
              provider: 'Web Translation Fallback',
              source: 'web-fallback',
            });
          }
        }
      }
    } catch (gErr) {
      console.warn('Web translation fallback notice:', gErr);
    }

    // 4. Clean text fallback
    return NextResponse.json({
      success: true,
      translatedText: trimmed,
      targetLang,
      aiModel: 'Direct Pass-through',
      provider: 'None',
      source: 'offline-raw',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
