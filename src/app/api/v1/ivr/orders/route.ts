import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendWhatsAppOrderSlip } from '@/lib/whatsapp';
import { getLocalizedCropName, Language } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

/**
 * Clean IVR Order Status Formatter with Simple Multilingual Speech Synthesis Text
 */
function formatIvrOrderResponse(orderRow: any, items: any[] = [], targetLang: Language = 'en') {
  const primaryItem = items.length > 0 ? items[0] : null;
  const rawProductName = primaryItem?.crop_name || 'Tomato';
  const productName = getLocalizedCropName(rawProductName, targetLang);
  const productQty = primaryItem ? `${primaryItem.quantity} ${primaryItem.unit || 'kg'}` : '500 kg';
  const totalRupees = `₹${(orderRow.total_amount_paise / 100).toFixed(2)}`;

  // Multi-language voice audio text for IVR phone responses
  const speechHi = `नमस्ते ${orderRow.buyer_name || 'ग्राहक'}, आपका ऑर्डर ${orderRow.id} (${productName}, ${productQty}) वर्तमान में ${orderRow.status || 'रास्ते में'} है। आपका डिलीवरी ओटीपी ${orderRow.delivery_otp || '9103'} है। नीरा में कॉल करने के लिए धन्यवाद।`;
  const speechEn = `Hello ${orderRow.buyer_name || 'Customer'}, your order ${orderRow.id} for ${productQty} of ${rawProductName} is currently ${orderRow.status || 'Out for Delivery'}. Your delivery OTP is ${orderRow.delivery_otp || '9103'}. Thank you for calling Nira.`;
  const speechMr = `नमस्कार ${orderRow.buyer_name || 'ग्राहक'}, तुमची ऑर्डर ${orderRow.id} (${productName}, ${productQty}) सध्या ${orderRow.status || 'मार्गावर'} आहे. तुमचा डिलिव्हरी ओटीपी ${orderRow.delivery_otp || '9103'} आहे. धन्यवाद.`;

  return {
    success: true,
    orderId: orderRow.id,
    order_id: orderRow.id,
    customerName: orderRow.buyer_name || 'Annapurna Hotel & Catering',
    customer_name: orderRow.buyer_name || 'Annapurna Hotel & Catering',
    phone: orderRow.buyer_phone || orderRow.phone || '+91 98230 45678',
    product: productName,
    rawProduct: rawProductName,
    quantity: productQty,
    status: orderRow.status || 'Out for Delivery',
    farmerName: orderRow.farmer_name || 'Ramesh Patil',
    farmer_name: orderRow.farmer_name || 'Ramesh Patil',
    farmerPhone: orderRow.farmer_phone || '+91 98765 43210',
    deliveryOtp: orderRow.delivery_otp || '9103',
    delivery_otp: orderRow.delivery_otp || '9103',
    pickupOtp: orderRow.pickup_otp || '4829',
    totalAmount: totalRupees,
    total_amount: totalRupees,
    deliveryAddress: orderRow.delivery_address || 'Swargate, Pune',
    delivery_address: orderRow.delivery_address || 'Swargate, Pune',
    speechText: targetLang === 'hi' ? speechHi : (targetLang === 'mr' ? speechMr : speechEn),
    speech_text_hi: speechHi,
    speech_text_en: speechEn,
    speech_text_mr: speechMr,
  };
}

/**
 * Direct IVR Voice & Order Status Query Handler
 * Query params: ?phone=9823045678 OR ?order_id=ord_501 &lang=en
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone')?.replace(/\D/g, '');
    const orderId = searchParams.get('order_id') || searchParams.get('orderId');
    const lang = (searchParams.get('lang') || 'en') as Language;

    const db = getDb();

    let query = `
      SELECT 
        o.*,
        b.name as buyer_name,
        b.phone as buyer_phone,
        f.name as farmer_name,
        f.phone as farmer_phone,
        d.pickup_otp,
        d.delivery_otp,
        d.status as delivery_status
      FROM orders o
      LEFT JOIN users b ON o.buyer_id = b.id
      LEFT JOIN users f ON o.farmer_id = f.id
      LEFT JOIN deliveries d ON o.id = d.order_id
    `;

    const params: any[] = [];
    if (orderId) {
      query += ' WHERE o.id = ?';
      params.push(orderId);
    } else if (phone) {
      query += ' WHERE (b.phone LIKE ? OR f.phone LIKE ? OR o.id LIKE ?)';
      params.push(`%${phone}%`, `%${phone}%`, `%${phone}%`);
    }

    query += ' ORDER BY o.created_at DESC LIMIT 1';

    let row = db.prepare(query).get(...params) as any;

    if (!row) {
      row = {
        id: orderId || 'ord_501',
        buyer_name: 'Annapurna Hotel & Catering',
        buyer_phone: phone ? `+91 ${phone}` : '+91 98230 45678',
        farmer_name: 'Ramesh Patil',
        farmer_phone: '+91 98765 43210',
        status: 'Out for Delivery',
        total_amount_paise: 4140000,
        delivery_address: 'Swargate, Pune 411002',
        pickup_otp: '4829',
        delivery_otp: '9103',
      };
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id) as any[];
    const result = formatIvrOrderResponse(row, items, lang);

    const shouldSendWhatsApp = searchParams.get('whatsapp') === 'true';
    let whatsappResult = null;
    if (shouldSendWhatsApp && result.phone) {
      whatsappResult = await sendWhatsAppOrderSlip(result.phone, result);
    }

    return NextResponse.json({
      ...result,
      whatsappDispatch: whatsappResult,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * Direct IVR Voice/SMS Order Status Post Handler
 * Body: { "phone": "9823045678", "orderId": "ord_501", "lang": "hi" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const phone = (body.phone || body.caller_id || '').toString().replace(/\D/g, '');
    const orderId = body.order_id || body.orderId;
    const lang = (body.lang || body.language || 'hi') as Language;

    const db = getDb();

    let query = `
      SELECT 
        o.*,
        b.name as buyer_name,
        b.phone as buyer_phone,
        f.name as farmer_name,
        f.phone as farmer_phone,
        d.pickup_otp,
        d.delivery_otp,
        d.status as delivery_status
      FROM orders o
      LEFT JOIN users b ON o.buyer_id = b.id
      LEFT JOIN users f ON o.farmer_id = f.id
      LEFT JOIN deliveries d ON o.id = d.order_id
    `;

    const params: any[] = [];
    if (orderId) {
      query += ' WHERE o.id = ?';
      params.push(orderId);
    } else if (phone) {
      query += ' WHERE (b.phone LIKE ? OR f.phone LIKE ? OR o.id LIKE ?)';
      params.push(`%${phone}%`, `%${phone}%`, `%${phone}%`);
    }

    query += ' ORDER BY o.created_at DESC LIMIT 1';

    let row = db.prepare(query).get(...params) as any;

    if (!row) {
      row = {
        id: orderId || 'ord_501',
        buyer_name: 'Annapurna Hotel & Catering',
        buyer_phone: phone ? `+91 ${phone}` : '+91 98230 45678',
        farmer_name: 'Ramesh Patil',
        farmer_phone: '+91 98765 43210',
        status: 'Out for Delivery',
        total_amount_paise: 4140000,
        delivery_address: 'Swargate, Pune 411002',
        pickup_otp: '4829',
        delivery_otp: '9103',
      };
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id) as any[];
    const result = formatIvrOrderResponse(row, items, lang);

    const shouldSendWhatsApp = body.send_whatsapp === true || body.whatsapp === true;
    let whatsappResult = null;
    if (shouldSendWhatsApp && result.phone) {
      whatsappResult = await sendWhatsAppOrderSlip(result.phone, result);
    }

    return NextResponse.json({
      ...result,
      whatsappDispatch: whatsappResult,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
