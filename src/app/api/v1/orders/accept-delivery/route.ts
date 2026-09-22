import { NextResponse } from 'next/server';
import { acceptDelivery } from '@/lib/orders';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, partnerId, driverName, driverPhone, driverVehicle } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'orderId is required.' },
        { status: 400 }
      );
    }

    const result = await acceptDelivery({
      orderId,
      partnerId,
      driverName,
      driverPhone,
      driverVehicle,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error accepting delivery:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to accept delivery.' },
      { status: 400 }
    );
  }
}
