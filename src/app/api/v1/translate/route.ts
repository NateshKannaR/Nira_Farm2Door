import { NextResponse } from 'next/server';
import { getAllCachedTranslations, getOrFetchCropTranslation } from '@/lib/translator';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cache = getAllCachedTranslations();
    return NextResponse.json({
      success: true,
      translations: cache,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, crops } = body;

    // 1. Single crop translation request
    if (text && typeof text === 'string') {
      const result = await getOrFetchCropTranslation(text);
      return NextResponse.json({
        success: true,
        original: text.trim(),
        hi: result.hi,
        en: result.en,
        source: result.source,
        confidence: result.confidence ?? 1.0,
        matchedKey: result.matchedKey ?? text.trim(),
      });
    }

    // 2. Batch crop translation request
    if (crops && Array.isArray(crops)) {
      const results: Record<string, { hi: string; en: string }> = {};
      for (const item of crops) {
        if (!item || typeof item !== 'string') continue;
        const res = await getOrFetchCropTranslation(item);
        results[item.trim()] = { hi: res.hi, en: res.en };
      }
      return NextResponse.json({
        success: true,
        translations: results,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid payload. Provide text or crops array.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
