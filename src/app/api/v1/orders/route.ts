import { NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/orders';
import { connectToDatabase, MongoOrder, MongoDelivery } from '@/lib/mongodb';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const role = searchParams.get('role') || undefined;
    const orderId = searchParams.get('orderId') || undefined;

    // 1. Try MongoDB Atlas Cloud first
    try {
      await connectToDatabase();
      const queryObj: any = {};
      if (orderId) {
        queryObj.id = orderId;
      } else if (userId && role === 'FARMER') {
        queryObj.$or = [{ farmer_id: userId }, { farmer_id: 'u_farmer_1' }];
      } else if (userId && role === 'BUYER') {
        queryObj.$or = [{ buyer_id: userId }, { buyer_id: 'u_buyer_1' }, { buyer_id: 'u_dev_master' }];
      }
      const mongoOrders = await MongoOrder.find(queryObj).sort({ createdAt: -1 }).lean();
      if (mongoOrders && mongoOrders.length > 0) {
        const orderIds = mongoOrders.map((o: any) => o.id);
        const deliveries = await MongoDelivery.find({ order_id: { $in: orderIds } }).lean();
        const delMap = new Map(deliveries.map((d: any) => [d.order_id, d]));

        const formattedOrders = mongoOrders.map((o: any) => {
          const del: any = delMap.get(o.id) || {};
          return {
            ...o,
            id: o.id || o._id.toString(),
            buyer_name: o.recipient_name || 'Annapurna Hotel & Catering',
            buyer_phone: o.recipient_phone || '+91 98222 33344',
            farmer_name: 'Ramesh Patil',
            farmer_phone: '+91 98765 43210',
            delivery_id: del.id,
            partner_id: del.partner_id || 'u_partner_1',
            delivery_status: del.status || 'ASSIGNED',
            pickup_otp: del.pickup_otp || '4829',
            delivery_otp: del.delivery_otp || '9103',
            pickup_location: del.pickup_location || 'Nashik Mandi Collection Hub',
            drop_location: del.drop_location || o.delivery_address,
            estimated_eta_minutes: del.estimated_eta_minutes || 35,
            estimated_distance_km: del.estimated_distance_km || 14.5,
            driver_name: del.driver_name || 'Vikram Shinde',
            driver_phone: del.driver_phone || '+91 99000 11122',
            driver_vehicle: del.driver_vehicle || 'MH-15-EG-8821 (Tata Ace Gold)',
            cod_collected: del.cod_collected || 0,
            total_rupees: (o.total_amount_paise / 100).toFixed(2),
            subtotal_rupees: (o.subtotal_paise / 100).toFixed(2),
            delivery_fee_rupees: (o.delivery_fee_paise / 100).toFixed(2),
          };
        });

        return NextResponse.json({
          success: true,
          count: formattedOrders.length,
          orders: formattedOrders,
        });
      }
    } catch (mongoEx) {
      console.warn('Notice querying MongoDB Atlas orders:', mongoEx);
    }

    const orders = getOrders({ userId, role, orderId });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOrder(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId') || searchParams.get('id');
    const all = searchParams.get('all');

    // 1. Delete from MongoDB Atlas
    try {
      await connectToDatabase();
      if (all === 'true' || !orderId) {
        await MongoOrder.deleteMany({});
        await MongoDelivery.deleteMany({});
      } else {
        await MongoOrder.deleteOne({ $or: [{ id: orderId }, { _id: orderId }] });
        await MongoDelivery.deleteMany({ order_id: orderId });
      }
    } catch (e) {
      console.warn('MongoDB order delete notice:', e);
    }

    // 2. Delete from SQLite
    try {
      const db = getDb();
      if (all === 'true' || !orderId) {
        db.prepare('DELETE FROM order_items').run();
        db.prepare('DELETE FROM deliveries').run();
        db.prepare('DELETE FROM orders').run();
      } else {
        db.prepare('DELETE FROM order_items WHERE order_id = ?').run(orderId);
        db.prepare('DELETE FROM deliveries WHERE order_id = ?').run(orderId);
        db.prepare('DELETE FROM orders WHERE id = ?').run(orderId);
      }
    } catch (e) {
      console.warn('SQLite order delete notice:', e);
    }

    return NextResponse.json({ success: true, message: 'Orders removed successfully' });
  } catch (error: any) {
    console.error('Error deleting orders:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

