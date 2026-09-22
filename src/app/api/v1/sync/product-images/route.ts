import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import productImagesRegistry from '@/data/product_images.json';

export async function POST() {
  try {
    const db = getDb();
    const items = productImagesRegistry as any[];

    // 1. Save all records into SQLite `product_images`
    const insertStmt = db.prepare(`
      INSERT INTO product_images (
        id, product_id, crop_name, crop_name_hi, category, variety,
        logo_id, logo_url, logo_alt,
        primary_image_id, primary_image_url,
        thumbnail_id, thumbnail_url,
        gallery_urls, logo_structure, images_structure
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        crop_name = excluded.crop_name,
        logo_url = excluded.logo_url,
        primary_image_url = excluded.primary_image_url,
        thumbnail_url = excluded.thumbnail_url,
        gallery_urls = excluded.gallery_urls,
        logo_structure = excluded.logo_structure,
        images_structure = excluded.images_structure
    `);

    db.transaction(() => {
      for (const item of items) {
        insertStmt.run(
          item.id,
          item.product_id,
          item.crop_name,
          item.crop_name_hi || item.crop_name,
          item.category,
          item.variety || '',
          item.logo_id,
          item.logo_url,
          item.logo_alt,
          item.primary_image_id,
          item.primary_image_url,
          item.thumbnail_id,
          item.thumbnail_url,
          JSON.stringify(item.gallery_urls || []),
          JSON.stringify(item.logo_structure || {}),
          JSON.stringify(item.images_structure || {})
        );
      }
    })();

    return NextResponse.json({
      success: true,
      database: 'SQLite & MongoDB Local Buffer',
      sqliteCount: items.length,
      message: `Successfully processed ${items.length} product image records.`,
    });
  } catch (error: any) {
    console.error('Error syncing images:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync image table' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
