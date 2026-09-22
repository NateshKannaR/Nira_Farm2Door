import { NextResponse } from 'next/server';
import { createCropListing, getAllCrops, getCropsByFarmer, deleteCropListing, updateCropListing } from '@/lib/crops';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    const listings = farmerId ? await getCropsByFarmer(farmerId) : await getAllCrops();
    return NextResponse.json({
      success: true,
      source: 'database',
      crops: listings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createCropListing(body);

    return NextResponse.json({
      success: true,
      message: 'Crop registered successfully!',
      database: result.database,
      crop: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const result = await updateCropListing(body);

    return NextResponse.json({
      success: true,
      message: 'Crop updated successfully!',
      crop: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Crop ID is required' }, { status: 400 });
    }

    await deleteCropListing(id);
    return NextResponse.json({
      success: true,
      message: 'Crop listing deleted successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

