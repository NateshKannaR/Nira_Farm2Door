import { NextResponse } from 'next/server';
import { seedDefaultKisanAllProducts } from '@/lib/crops';

export async function POST() {
  try {
    const result = await seedDefaultKisanAllProducts();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error seeding default kisan products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed products' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await seedDefaultKisanAllProducts();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error seeding default kisan products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed products' },
      { status: 500 }
    );
  }
}
