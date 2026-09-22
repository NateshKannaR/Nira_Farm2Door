import { NextResponse } from 'next/server';
import { predictFairPriceWithGemini } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { cropName, baseMandiPriceRupees, grade, organic, distanceKm, state } = await request.json();

    const basePrice = parseFloat(baseMandiPriceRupees || '35');

    // Run real Google Gemini APMC & Fair Price Intelligence
    const geminiPrice = await predictFairPriceWithGemini({
      cropName: cropName || 'Produce Lot',
      baseMandiPriceRupees: basePrice,
      grade,
      organic: !!organic,
      distanceKm: parseFloat(distanceKm || '10'),
      state,
    });

    if (geminiPrice) {
      return NextResponse.json({
        success: true,
        aiEngine: `Nira Fair Price AI (${geminiPrice.modelUsed})`,
        provider: geminiPrice.modelUsed.includes('OpenRouter') ? 'OpenRouter AI Multi-Model Gateway' : 'Google Gemini Generative AI',
        cropName: geminiPrice.cropName,
        inputs: { baseMandiPriceRupees: basePrice, grade, organic, distanceKm },
        priceBand: {
          minPricePaise: geminiPrice.minPricePaise,
          recommendedPricePaise: geminiPrice.recommendedPricePaise,
          maxPricePaise: geminiPrice.maxPricePaise,
          recommendedPriceRupees: geminiPrice.recommendedPriceRupees,
          mspBenchmarkRupees: geminiPrice.mspBenchmarkRupees,
          marketTrend: geminiPrice.marketTrend,
        },
        fairnessExplanation: geminiPrice.fairnessExplanation,
      });
    }

    // Deterministic fallback
    const qualityMultiplier = grade === 'Grade A+' || grade === 'Export Grade' ? 1.15 : (grade === 'Grade A' ? 1.08 : 0.95);
    const organicMultiplier = organic ? 1.25 : 1.0;
    const distanceCostAdjustment = Math.min((parseFloat(distanceKm || '10') * 0.15), 5.0);

    const recommendedRupees = (basePrice * qualityMultiplier * organicMultiplier) - distanceCostAdjustment;
    const recommendedPaise = Math.round(recommendedRupees * 100);
    const minBandPaise = Math.round(recommendedPaise * 0.92);
    const maxBandPaise = Math.round(recommendedPaise * 1.12);

    return NextResponse.json({
      success: true,
      aiEngine: 'Nira Agmarknet Baseline Index',
      cropName: cropName || 'Tomatoes',
      inputs: { baseMandiPriceRupees, grade, organic, distanceKm },
      priceBand: {
        minPricePaise: minBandPaise,
        recommendedPricePaise: recommendedPaise,
        maxPricePaise: maxBandPaise,
        recommendedPriceRupees: (recommendedPaise / 100).toFixed(2),
      },
      fairnessExplanation: `Calculated from Agmarknet baseline index ₹${basePrice}/kg with +${Math.round((qualityMultiplier - 1) * 100)}% quality grade bonus and zero middleman deduction.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

