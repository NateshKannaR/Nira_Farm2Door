import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { assessWasteRiskWithGemini } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { cropName, lotAgeDays, storageType, ambientTempC } = await request.json();

    const db = getDb();
    const age = parseInt(lotAgeDays || '5', 10);

    // Run Google Gemini Decay & Waste Risk Assessment
    const geminiAssessment = await assessWasteRiskWithGemini({
      cropName: cropName || 'Produce Lot',
      lotAgeDays: age,
      storageType,
      ambientTempC,
    });

    // Find candidate buyers for automated bulk offload
    const matchingBuyers = db.prepare(`
      SELECT b.*, u.name as buyer_name, u.phone as buyer_phone
      FROM bulk_requirements b
      JOIN users u ON b.buyer_id = u.id
      WHERE b.crop_name LIKE ? AND b.status = 'OPEN'
    `).all(`%${cropName || 'Tomatoes'}%`);

    if (geminiAssessment) {
      return NextResponse.json({
        success: true,
        aiEngine: `Nira Waste Reduction AI (${geminiAssessment.modelUsed})`,
        provider: geminiAssessment.modelUsed.includes('OpenRouter') ? 'OpenRouter AI Multi-Model Gateway' : 'Google Gemini Generative AI',
        decayAnalysis: geminiAssessment,
        candidateBuyersForOffload: matchingBuyers,
      });
    }

    const maxShelfLife = cropName === 'Tomatoes' ? 10 : (cropName === 'Onions' ? 45 : 20);
    const remainingDays = Math.max(maxShelfLife - age, 1);
    const riskLevel = remainingDays <= 3 ? 'CRITICAL_DISCOUNT_NEEDED' : (remainingDays <= 6 ? 'MODERATE_SURPLUS_RISK' : 'OPTIMAL_FRESHNESS');

    return NextResponse.json({
      success: true,
      aiEngine: 'Nira Standard Loss Prevention Baseline',
      decayAnalysis: {
        cropName: cropName || 'Tomatoes',
        lotAgeDays: age,
        maxShelfLifeDays: maxShelfLife,
        remainingFreshDays: remainingDays,
        riskLevel,
        recommendedAction: riskLevel === 'CRITICAL_DISCOUNT_NEEDED'
          ? 'Trigger 15% discount for immediate institutional buyer offload to prevent 100% loss.'
          : 'Normal inventory rotation.',
      },
      candidateBuyersForOffload: matchingBuyers,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

