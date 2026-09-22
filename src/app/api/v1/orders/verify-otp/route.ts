import { NextResponse } from 'next/server';
import { verifyOrderOtp } from '@/lib/orders';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, otpType, enteredOtp, partnerId, codCollected } = body;

    if (!orderId || !otpType || !enteredOtp) {
      return NextResponse.json(
        { success: false, message: 'orderId, otpType, and enteredOtp are required.' },
        { status: 400 }
      );
    }

    const result = await verifyOrderOtp({
      orderId,
      otpType,
      enteredOtp,
      partnerId,
      codCollected: Boolean(codCollected),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error verifying order OTP:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'OTP verification failed.' },
      { status: 400 }
    );
  }
}
