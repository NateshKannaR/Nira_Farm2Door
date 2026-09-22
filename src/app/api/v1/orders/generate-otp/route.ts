import { NextResponse } from 'next/server';
import { generateOrderOtp } from '@/lib/orders';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, otpType } = body;

    if (!orderId || !otpType) {
      return NextResponse.json(
        { success: false, message: 'orderId and otpType (pickup | delivery) are required.' },
        { status: 400 }
      );
    }

    if (otpType !== 'pickup' && otpType !== 'delivery') {
      return NextResponse.json(
        { success: false, message: 'otpType must be either "pickup" or "delivery".' },
        { status: 400 }
      );
    }

    const result = await generateOrderOtp(orderId, otpType);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating order OTP:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate OTP.' },
      { status: 400 }
    );
  }
}
