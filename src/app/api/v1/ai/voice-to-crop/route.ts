import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';

export const dynamic = 'force-dynamic';

interface VoiceCropResult {
  success: boolean;
  cropName: string;
  cropNameHi: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices' | 'Seeds';
  quantityKg: number;
  basePriceRupees: number;
  variety: string;
  grade: 'A+' | 'A' | 'B';
  confidenceScore: number;
  extractedSummary: string;
  originalTranscript: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { speechText, language = 'hi' } = body;

    if (!speechText || typeof speechText !== 'string' || speechText.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Spoken transcript is required.' },
        { status: 400 }
      );
    }

    const trimmedText = speechText.trim();

    // 1. Try OpenRouter AI
    try {
      const systemPrompt = `You are Nira Voice Intelligence, an Indian agricultural assistant.
Parse the user's spoken vernacular crop statement (which could be in Hindi, Hinglish, Marathi, Tamil, Telugu, Gujarati, Bengali, or English) into precise structured agricultural listing JSON.

Allowed categories strictly: 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Seeds'.
Allowed grades: 'A+', 'A', 'B'.

Return ONLY valid JSON matching this schema:
{
  "cropName": "English standard name like Tomato, Onion, Wheat, Potato, Green Chilli, Soybean, Mango, Banana",
  "cropNameHi": "Hindi equivalent like टमाटर, प्याज, गेहूं, आलू, हरी मिर्च, सोयाबीन",
  "category": "Vegetables",
  "quantityKg": 500,
  "basePriceRupees": 25,
  "variety": "Desi Local / Hybrid Harvest",
  "grade": "A+",
  "confidenceScore": 0.95,
  "extractedSummary": "500 kg fresh A+ Tomatoes at ₹25/kg"
}`;

      const aiResponse = await callOpenRouter(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Spoken sentence: "${trimmedText}". Current language context: ${language}. Extract the crop listing parameters accurately.` }
        ],
        {
          jsonMode: true,
          maxTokens: 400,
          temperature: 0.1,
        }
      );

      if (aiResponse && aiResponse.content) {
        const cleaned = aiResponse.content.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        const validCategories = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Seeds'];
        const category = validCategories.includes(parsed.category) ? parsed.category : 'Vegetables';
        const validGrades = ['A+', 'A', 'B'];
        const grade = validGrades.includes(parsed.grade) ? parsed.grade : 'A+';

        const result: VoiceCropResult = {
          success: true,
          cropName: parsed.cropName || 'Fresh Produce',
          cropNameHi: parsed.cropNameHi || parsed.cropName || 'ताज़ी उपज',
          category,
          quantityKg: Number(parsed.quantityKg) || 100,
          basePriceRupees: Number(parsed.basePriceRupees) || 20,
          variety: parsed.variety || 'Desi Local Harvest',
          grade,
          confidenceScore: Number(parsed.confidenceScore) || 0.9,
          extractedSummary: parsed.extractedSummary || `${parsed.quantityKg || 100} kg at ₹${parsed.basePriceRupees || 20}/kg`,
          originalTranscript: trimmedText,
        };

        return NextResponse.json(result);
      }
    } catch (aiErr) {
      console.warn('OpenRouter voice parsing notice, falling back to rule engine:', aiErr);
    }

    // 2. Rule-Based Fallback
    const lower = trimmedText.toLowerCase();
    let detectedCrop = 'Tomato';
    let detectedCropHi = 'टमाटर';
    let detectedCat: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices' | 'Seeds' = 'Vegetables';

    if (lower.includes('onion') || lower.includes('प्याज़') || lower.includes('प्याज') || lower.includes('कांदा') || lower.includes('kanda')) {
      detectedCrop = 'Onion';
      detectedCropHi = 'प्याज';
      detectedCat = 'Vegetables';
    } else if (lower.includes('potato') || lower.includes('आलू') || lower.includes('बटाटा') || lower.includes('batata')) {
      detectedCrop = 'Potato';
      detectedCropHi = 'आलू';
      detectedCat = 'Vegetables';
    } else if (lower.includes('wheat') || lower.includes('गेहूं') || lower.includes('gehun')) {
      detectedCrop = 'Wheat';
      detectedCropHi = 'गेहूं';
      detectedCat = 'Grains';
    } else if (lower.includes('rice') || lower.includes('चावल') || lower.includes('dhan')) {
      detectedCrop = 'Basmati Rice';
      detectedCropHi = 'बासमती चावल';
      detectedCat = 'Grains';
    } else if (lower.includes('chilli') || lower.includes('मिर्च') || lower.includes('mirch')) {
      detectedCrop = 'Green Chilli';
      detectedCropHi = 'हरी मिर्च';
      detectedCat = 'Vegetables';
    } else if (lower.includes('soybean') || lower.includes('सोयाबीन')) {
      detectedCrop = 'Soybean';
      detectedCropHi = 'सोयाबीन';
      detectedCat = 'Pulses';
    } else if (lower.includes('garlic') || lower.includes('लहसुन')) {
      detectedCrop = 'Garlic';
      detectedCropHi = 'लहसुन';
      detectedCat = 'Spices';
    }

    // Extract numbers: first large number is quantity (kg/quintal), second is price
    const numbers = trimmedText.match(/\d+(\.\d+)?/g)?.map(Number) || [];
    let qty = 200;
    let price = 25;

    if (numbers.length >= 2) {
      qty = numbers[0];
      price = numbers[1];
    } else if (numbers.length === 1) {
      qty = numbers[0];
    }

    // Check quintal mention (1 quintal = 100 kg)
    if (lower.includes('quintal') || lower.includes('कुंतल') || lower.includes('क्विंटल')) {
      qty = qty * 100;
    }

    const fallbackResult: VoiceCropResult = {
      success: true,
      cropName: detectedCrop,
      cropNameHi: detectedCropHi,
      category: detectedCat,
      quantityKg: qty,
      basePriceRupees: price,
      variety: 'Local Harvest (Desi Variety)',
      grade: 'A+',
      confidenceScore: 0.85,
      extractedSummary: `${qty} kg ${detectedCrop} at ₹${price}/kg`,
      originalTranscript: trimmedText,
    };

    return NextResponse.json(fallbackResult);
  } catch (error: any) {
    console.error('Error in voice-to-crop route:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
