import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { farmerPhone, dtmfInput, textCommand } = await request.json();

    const db = getDb();
    let responseAudioText = '';

    if (dtmfInput === '1' || textCommand?.toLowerCase().includes('list')) {
      // Auto list produce from voice/SMS command
      const listingId = 'lst_ivr_' + Date.now();
      db.prepare(`
        INSERT INTO product_listings (
          id, farmer_id, fpo_id, crop_name, category, quantity_available, unit,
          price_paise, mandi_retail_price_paise, grade, harvest_date,
          organic_certified, image_url, location, district, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        listingId,
        'u_farmer_1',
        'fpo_nashik_1',
        'Nashik Tomatoes (IVR Voice Listed)',
        'Vegetables',
        500,
        'kg',
        2800,
        4500,
        'Grade A',
        new Date().toISOString().split('T')[0],
        0,
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        'Nashik IVR Hub',
        'Nashik',
        'ACTIVE'
      );

      responseAudioText = 'Thank you! Your 500 kg tomato produce has been listed successfully at ₹28 per kg on Nira Direct Market. (Listing Created via IVR Call)';
    } else if (dtmfInput === '2' || textCommand?.toLowerCase().includes('price')) {
      responseAudioText = 'Today in Nashik Mandi, the AI recommended price for tomatoes is ₹28 to ₹32 per kg. Demand is very high.';
    } else {
      responseAudioText = 'Welcome farmer! Press 1 to list your produce for sale, press 2 to check current mandi prices.';
    }

    return NextResponse.json({
      success: true,
      channel: 'Toll-Free IVR Phone Voice & SMS Gateway Simulator',
      receivedPhone: farmerPhone || '9876543210',
      dtmfInput,
      simulatedAudioResponseHindi: responseAudioText,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
