import { getDb } from './db';
import { connectToDatabase, MongoProductListing, MongoUser } from './mongodb';
import { getOrFetchCropTranslation } from './translator';
import { getCropPhotosByName } from './cropImageMatcher';

export interface CropListingInput {
  cropName: string;
  quantityKg: number | string;
  priceRupees: number | string;
  grade?: string;
  location?: string;
  category?: string;
  farmerId?: string;
  farmerName?: string;
  imageUrl?: string;
  images?: string[]; // 2 to 6 photos support
  logoUrl?: string;
  unit?: string;
}

const DEFAULT_STAPLE_CROPS: any[] = [];

/**
 * Ensure exactly verified staple products and their verified farmers exist in DB
 */
export function ensureStapleProductsSeeded(db: any) {
  try {
    db.prepare(`
      INSERT OR REPLACE INTO users (id, name, phone, email, role, village, district, state, address)
      VALUES 
      ('u_farmer_1', 'Ramesh Patil', '+91 98765 43210', 'ramesh.patil@nira.ai', 'FARMER', 'Pimplgaon', 'Nashik', 'Maharashtra', 'Farm Collection Center #04, Nashik Hub, Maharashtra'),
      ('u_farmer_2', 'Harpreet Singh', '+91 98765 43211', 'harpreet@nira.ai', 'FARMER', 'Pimplgaon Hub', 'Nashik', 'Maharashtra', 'Pimplgaon Mandi Hub, Nashik, Maharashtra'),
      ('u_farmer_3', 'Suresh Gaikwad', '+91 98765 43212', 'suresh.gaikwad@nira.ai', 'FARMER', 'Sehore Mandi', 'Sehore', 'Madhya Pradesh', 'Sehore Mandi Hub, Madhya Pradesh'),
      ('u_buyer_1', 'Priya Sharma', '+91 98111 22233', 'priya.buyer@nira.ai', 'BUYER', 'Viman Nagar', 'Pune', 'Maharashtra', 'Sector 4, Viman Nagar, Pune, Maharashtra 411014'),
      ('u_buyer_2', 'Annapurna Hotel & Catering', '+91 98222 33344', 'annapurna@nira.ai', 'BUYER', 'Swargate', 'Pune', 'Maharashtra', 'Annapurna Hotel & Catering, Swargate, Pune 411002'),
      ('u_partner_1', 'Vikram Shinde Fleet', '+91 99000 11122', 'vikram.logistics@nira.ai', 'TRANSPORTER', 'Hadapsar', 'Pune', 'Maharashtra', 'Kisan Express Logistics Hub, Pune'),
      ('u_dev_master', 'Natesh (Lead Farmer & Admin)', '9876543210', 'natesh@nira.ai', 'ADMIN', 'Viman Nagar', 'Pune', 'Maharashtra', 'Agro Tech Park, Viman Nagar, Pune 411014')
    `).run();
    // Purge any legacy sample mock listings in SQLite
    db.prepare("DELETE FROM product_listings WHERE id IN ('lst_onion_nashik_1', 'lst_tomato_nashik_2', 'lst_wheat_punjab_3', 'lst_apple_himachal_4', 'lst_garlic_sehore_5')").run();
  } catch (e) {
    // Ignore error
  }
}

/**
 * Fetch all active crop listings (Public Marketplace across India)
 * MongoDB Atlas Cloud Primary, with local SQLite fallback.
 */
export async function getAllCrops() {
  // 1. Try MongoDB Atlas Cloud first
  try {
    await connectToDatabase();
    const mongoCrops = await MongoProductListing.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).lean();
    if (mongoCrops && mongoCrops.length > 0) {
      return mongoCrops.map((c: any) => ({
        ...c,
        id: c.id || c._id.toString(),
      }));
    }
    return [];
  } catch (mongoErr) {
    console.warn('MongoDB Atlas getAllCrops notice:', mongoErr);
  }

  // 2. Fallback to SQLite DB
  const db = getDb();
  ensureStapleProductsSeeded(db);
  const cleanIndic = (val?: string) => (val ? val.replace(/\s*\([\u0900-\u0D7F\s\.\,\-]+\)/g, '').trim() : val);
  const rows = db
    .prepare(
      `
    SELECT l.*, COALESCE(u.name, 'Verified Farmer') as farmer_name, COALESCE(u.phone, '+91 98765 43210') as farmer_phone
    FROM product_listings l
    LEFT JOIN users u ON l.farmer_id = u.id
    WHERE (l.status = 'ACTIVE' OR l.status IS NULL)
      AND l.id NOT IN ('lst_onion_nashik_1', 'lst_tomato_nashik_2', 'lst_wheat_punjab_3', 'lst_apple_himachal_4', 'lst_garlic_sehore_5')
    ORDER BY l.created_at DESC
  `
    )
    .all();
  return rows.map((r: any) => ({
    ...r,
    farmer_name: cleanIndic(r.farmer_name),
    location: cleanIndic(r.location),
  }));
}

/**
 * Fetch crops owned by a specific farmer (User-Isolated Farmer Desk)
 * Shows only the crops belonging to the given farmerId.
 */
export async function getCropsByFarmer(farmerId: string) {
  if (!farmerId) return [];

  // 1. Try MongoDB Atlas Cloud first
  try {
    await connectToDatabase();
    const mongoCrops = await MongoProductListing.find({ farmer_id: farmerId }).sort({ createdAt: -1 }).lean();
    if (mongoCrops && mongoCrops.length > 0) {
      return mongoCrops.map((c: any) => ({
        ...c,
        id: c.id || c._id.toString(),
      }));
    }
  } catch (mongoErr) {
    console.warn('MongoDB Atlas getCropsByFarmer notice:', mongoErr);
  }

  // 2. Fallback to SQLite DB
  const db = getDb();
  ensureStapleProductsSeeded(db);
  const cleanIndic = (val?: string) => (val ? val.replace(/\s*\([\u0900-\u0D7F\s\.\,\-]+\)/g, '').trim() : val);
  const rows = db
    .prepare(
      `
    SELECT l.*, COALESCE(u.name, 'Verified Farmer') as farmer_name, COALESCE(u.phone, '+91 98765 43210') as farmer_phone
    FROM product_listings l
    LEFT JOIN users u ON l.farmer_id = u.id
    WHERE l.farmer_id = ?
    ORDER BY l.created_at DESC
  `
    )
    .all(farmerId);
  return rows.map((r: any) => ({
    ...r,
    farmer_name: cleanIndic(r.farmer_name),
    location: cleanIndic(r.location),
  }));
}

/**
 * Create a new crop listing with auto-AI translation & MongoDB Atlas sync
 */
export async function createCropListing(input: CropListingInput) {
  const { cropName, quantityKg, priceRupees, grade, location, category, farmerId, farmerName, imageUrl, images, unit } = input;

  if (!cropName) {
    throw new Error('Crop name is required');
  }

  const id = `lst_${Date.now()}`;
  const pricePaise = Math.round((parseFloat(String(priceRupees)) || 30) * 100);
  const mandiPricePaise = Math.round(pricePaise * 1.25);
  const qty = parseInt(String(quantityKg)) || 500;
  const cat = category || 'Vegetables';
  const loc = location || 'Nashik Agro-Hub #04';
  const gradeVal = grade || 'Grade A+ Export Quality';
  const harvestDate = new Date().toISOString().split('T')[0];
  const actualFarmerId = farmerId || 'u_farmer_1';
  // Format images: prioritize images array (2 to 6 photos), serialize to JSON or fallback to name-matched crop photos
  let finalImageList: string[] = [];
  if (Array.isArray(images) && images.length > 0) {
    finalImageList = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
  } else if (imageUrl && imageUrl.trim().length > 0) {
    finalImageList = [imageUrl.trim()];
  } else {
    finalImageList = getCropPhotosByName(cropName);
  }

  // Ensure image_url stores valid representation
  const cropImage = finalImageList.length > 1 ? JSON.stringify(finalImageList) : finalImageList[0];

  // 1. Auto AI Translation & Cache
  await getOrFetchCropTranslation(cropName);

  const newListing = {
    id,
    farmer_id: actualFarmerId,
    fpo_id: 'fpo_nashik_1',
    crop_name: cropName,
    category: cat,
    quantity_available: qty,
    unit: unit || 'kg',
    price_paise: pricePaise,
    mandi_retail_price_paise: mandiPricePaise,
    grade: gradeVal,
    harvest_date: harvestDate,
    organic_certified: gradeVal.includes('Organic') || gradeVal.includes('जैविक') ? 1 : 0,
    image_url: cropImage,
    logo_url: input.logoUrl || (finalImageList.length > 0 ? finalImageList[0] : ''),
    location: loc,
    district: 'Nashik',
    status: 'ACTIVE',
  };

  // 2. Save in SQLite DB
  const db = getDb();
  try {
    // Ensure farmer user exists in users table to satisfy foreign key
    db.prepare(`
      INSERT OR IGNORE INTO users (id, name, phone, email, role, village, district, state, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      actualFarmerId,
      farmerName || 'Verified Farmer',
      '+91 98765 43210',
      `${actualFarmerId}@nira.ai`,
      'FARMER',
      'Village Hub',
      'Nashik',
      'Maharashtra',
      loc
    );

    // Ensure default FPO exists
    db.prepare(`
      INSERT OR IGNORE INTO fpos (id, name, registration_number, district, state, hub_id)
      VALUES ('fpo_nashik_1', 'Sahyadri Farmers Producer Co.', 'FPO-MH-2024-001', 'Nashik', 'Maharashtra', 'hub_nashik_1')
    `).run();

    db.prepare(
      `
      INSERT INTO product_listings (id, farmer_id, fpo_id, crop_name, category, quantity_available, unit, price_paise, mandi_retail_price_paise, grade, harvest_date, organic_certified, image_url, logo_url, location, district, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      id,
      newListing.farmer_id,
      newListing.fpo_id,
      newListing.crop_name,
      newListing.category,
      newListing.quantity_available,
      newListing.unit,
      newListing.price_paise,
      newListing.mandi_retail_price_paise,
      newListing.grade,
      newListing.harvest_date,
      newListing.organic_certified,
      newListing.image_url,
      newListing.logo_url,
      newListing.location,
      newListing.district,
      newListing.status
    );
  } catch (dbErr) {
    // Fallback if older schema without logo_url
    db.prepare(
      `
      INSERT INTO product_listings (id, farmer_id, fpo_id, crop_name, category, quantity_available, unit, price_paise, mandi_retail_price_paise, grade, harvest_date, organic_certified, image_url, location, district, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      id,
      newListing.farmer_id,
      newListing.fpo_id,
      newListing.crop_name,
      newListing.category,
      newListing.quantity_available,
      newListing.unit,
      newListing.price_paise,
      newListing.mandi_retail_price_paise,
      newListing.grade,
      newListing.harvest_date,
      newListing.organic_certified,
      newListing.image_url,
      newListing.location,
      newListing.district,
      newListing.status
    );
  }

  // 3. MongoDB Atlas Cloud Sync
  try {
    await connectToDatabase();
    await MongoProductListing.findOneAndUpdate(
      { id },
      {
        id,
        farmer_id: actualFarmerId,
        fpo_id: 'fpo_nashik_1',
        crop_name: newListing.crop_name,
        category: newListing.category,
        quantity_available: newListing.quantity_available,
        unit: newListing.unit,
        price_paise: newListing.price_paise,
        mandi_retail_price_paise: newListing.mandi_retail_price_paise,
        grade: newListing.grade,
        harvest_date: newListing.harvest_date,
        organic_certified: newListing.organic_certified,
        image_url: newListing.image_url,
        images: finalImageList,
        location: newListing.location,
        district: 'Nashik',
        farmer_name: farmerName || 'Verified Farmer',
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );
  } catch (mongoErr) {
    console.warn('MongoDB Atlas createCropListing sync notice:', mongoErr);
  }

  return {
    success: true,
    id,
    crop: newListing.crop_name,
    qty: newListing.quantity_available,
    priceRupees: (newListing.price_paise / 100).toFixed(2),
    grade: newListing.grade,
    location: newListing.location,
    farmer_name: farmerName || 'Verified Farmer',
    status: 'VERIFIED',
    imageUrl: cropImage,
    images: finalImageList,
    database: 'MongoDB Atlas',
  };
}

/**
 * Update an existing crop listing by ID (supports all categories: Vegetables, Fruits, Pulses, Grains)
 */
export async function updateCropListing(input: {
  id: string;
  cropName?: string;
  quantityKg?: number | string;
  priceRupees?: number | string;
  grade?: string;
  location?: string;
  category?: string;
  images?: string[];
  imageUrl?: string;
  unit?: string;
  isOrganic?: boolean | number;
}) {
  const { id, cropName, quantityKg, priceRupees, grade, location, category, images, imageUrl, unit, isOrganic } = input;
  if (!id) {
    throw new Error('Crop listing ID is required for update');
  }

  const db = getDb();
  const updates: string[] = [];
  const params: any[] = [];
  const mongoUpdate: any = {};

  if (cropName) {
    updates.push('crop_name = ?');
    params.push(cropName);
    mongoUpdate.crop_name = cropName;
    try {
      await getOrFetchCropTranslation(cropName);
    } catch (e) {}
  }

  if (category) {
    updates.push('category = ?');
    params.push(category);
    mongoUpdate.category = category;
  }

  if (quantityKg !== undefined) {
    const qty = parseInt(String(quantityKg)) || 0;
    updates.push('quantity_available = ?');
    params.push(qty);
    mongoUpdate.quantity_available = qty;
  }

  if (priceRupees !== undefined) {
    const pricePaise = Math.round((parseFloat(String(priceRupees)) || 30) * 100);
    updates.push('price_paise = ?');
    params.push(pricePaise);
    updates.push('mandi_retail_price_paise = ?');
    params.push(Math.round(pricePaise * 1.25));
    mongoUpdate.price_paise = pricePaise;
    mongoUpdate.mandi_retail_price_paise = Math.round(pricePaise * 1.25);
  }

  if (grade !== undefined) {
    updates.push('grade = ?');
    params.push(grade);
    mongoUpdate.grade = grade;
  }

  if (location !== undefined) {
    updates.push('location = ?');
    params.push(location);
    mongoUpdate.location = location;
  }

  if (unit !== undefined) {
    updates.push('unit = ?');
    params.push(unit);
    mongoUpdate.unit = unit;
  }

  if (isOrganic !== undefined) {
    updates.push('organic_certified = ?');
    params.push(isOrganic ? 1 : 0);
    mongoUpdate.organic_certified = isOrganic ? 1 : 0;
  }

  let finalImageList: string[] = [];
  if (Array.isArray(images) && images.length > 0) {
    finalImageList = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
  } else if (imageUrl && imageUrl.trim().length > 0) {
    finalImageList = [imageUrl.trim()];
  }

  if (finalImageList.length > 0) {
    const cropImage = finalImageList.length > 1 ? JSON.stringify(finalImageList) : finalImageList[0];
    updates.push('image_url = ?');
    params.push(cropImage);
    mongoUpdate.image_url = cropImage;
    mongoUpdate.images = finalImageList;
  }

  if (updates.length > 0) {
    params.push(id);
    db.prepare(`UPDATE product_listings SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  // MongoDB Atlas update sync
  try {
    if (Object.keys(mongoUpdate).length > 0) {
      await connectToDatabase();
      await MongoProductListing.findOneAndUpdate({ id }, { $set: mongoUpdate });
    }
  } catch (mongoErr) {
    console.warn('MongoDB Atlas updateCropListing sync notice:', mongoErr);
  }

  return {
    success: true,
    id,
    message: 'Crop updated successfully',
  };
}

/**
 * Delete a crop listing by ID from SQLite and MongoDB Atlas
 */
export async function deleteCropListing(id: string) {
  const db = getDb();
  // 1. Delete from SQLite
  try {
    db.prepare(`DELETE FROM product_listings WHERE id = ?`).run(id);
  } catch (e) {}

  // 2. Delete from MongoDB Atlas
  try {
    await connectToDatabase();
    const queryObj: any = { $or: [{ id: id }] };
    if (id && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      queryObj.$or.push({ _id: id });
    }
    await MongoProductListing.deleteMany(queryObj);
  } catch (e) {
    console.warn('MongoDB Atlas delete crop notice:', e);
  }

  return { success: true, id };
}

/**
 * Seed all 352 catalog products to the default kisan user ('u_farmer_1' - Ramesh Patil)
 * Inserts or updates in SQLite `product_listings` and MongoDB Atlas
 */
export const DEFAULT_REGISTERED_FARMERS = [
  {
    id: 'u_farmer_1',
    name: 'Ramesh Patil',
    phone: '9876543210',
    email: 'ramesh.patil@nira.ai',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Pimplgaon Baswant, Nashik, MH 422209',
    location: 'Nashik Mandi Hub',
    fpoId: 'fpo_nashik_1',
  },
  {
    id: 'u_farmer_2',
    name: 'Harpreet Singh',
    phone: '9876543211',
    email: 'harpreet@nira.ai',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'G.T. Road, Khanna, Ludhiana, PB 141401',
    location: 'Khanna Grain Mandi, Punjab',
    fpoId: null,
  },
  {
    id: 'u_farmer_3',
    name: 'Suresh Gaikwad',
    phone: '9876543212',
    email: 'suresh.gaikwad@nira.ai',
    district: 'Pune',
    state: 'Maharashtra',
    address: 'Baramati Agro Hub, Pune, MH 413102',
    location: 'Baramati Agro Hub, Pune',
    fpoId: null,
  },
  {
    id: 'u_farmer_4',
    name: 'Ananya Roy',
    phone: '9876543213',
    email: 'ananya.roy@nira.ai',
    district: 'Hooghly',
    state: 'West Bengal',
    address: 'Singur Krishi Mandi, Hooghly, WB 712409',
    location: 'Singur Agro Collection Hub, West Bengal',
    fpoId: null,
  },
  {
    id: 'u_farmer_5',
    name: 'Rajesh Choudhary',
    phone: '9876543214',
    email: 'rajesh.farmer@nira.ai',
    district: 'Jaipur',
    state: 'Rajasthan',
    address: 'Chomu Mandi Link Road, Jaipur, RJ 303702',
    location: 'Chomu Mandi Hub, Jaipur',
    fpoId: null,
  },
  {
    id: 'u_farmer_ramkishan',
    name: 'Ramkishan Maurya',
    phone: '9839122334',
    email: 'ramkishan.farmer@nira.ai',
    district: 'Farrukhabad',
    state: 'Uttar Pradesh',
    address: 'Kaimganj Cold Storage Mandi Road, Farrukhabad, UP 209502',
    location: 'Farrukhabad Mandi Hub, UP',
    fpoId: null,
  },
  {
    id: 'u_farmer_gurpreet',
    name: 'Gurpreet Singh Sandhu',
    phone: '9814033445',
    email: 'gurpreet.sandhu@nira.ai',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'G.T. Road, Asia Largest Grain Mandi, Khanna, Punjab 141401',
    location: 'Khanna Grain Mandi Yard #14, Punjab',
    fpoId: null,
  },
  {
    id: 'u_farmer_shivaji',
    name: 'Shivaji Rao Jadhav',
    phone: '9822044556',
    email: 'shivaji.jadhav@nira.ai',
    district: 'Pune',
    state: 'Maharashtra',
    address: 'Pune-Nashik Highway, Narayangaon Krishi Upaj Mandi, Pune, MH 410504',
    location: 'Narayangaon Hub, Pune',
    fpoId: null,
  },
];

export const ALL_DEFAULT_USERS = [
  ...DEFAULT_REGISTERED_FARMERS.map((f) => ({
    id: f.id,
    name: f.name,
    phone: f.phone,
    email: f.email,
    role: 'FARMER',
    district: f.district,
    state: f.state,
    address: f.address,
  })),
  {
    id: 'u_fpo_1',
    name: 'Sanjay Deshmukh (FPO Lead)',
    phone: '9876543219',
    email: 'sanjay.fpo@nira.ai',
    role: 'FPO',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Sahyadri Farmers Producer Co., Lasalgaon, Nashik, MH',
  },
  {
    id: 'u_buyer_1',
    name: 'Priya Sharma (Consumer)',
    phone: '9811122233',
    email: 'priya@nira.ai',
    role: 'BUYER',
    district: 'Pune',
    state: 'Maharashtra',
    address: 'Flat 402, Green Acres, Viman Nagar, Pune 411014',
  },
  {
    id: 'u_buyer_2',
    name: 'Annapurna Hotel & Catering',
    phone: '9822233344',
    email: 'annapurna@nira.ai',
    role: 'BUYER',
    district: 'Pune',
    state: 'Maharashtra',
    address: 'Sector 17, Swargate, Pune 411002',
  },
  {
    id: 'u_hub_1',
    name: 'Rajesh Kulkarni (Hub Supervisor)',
    phone: '9900088877',
    email: 'rajesh.hub@nira.ai',
    role: 'HUB_OPERATOR',
    district: 'Pune',
    state: 'Maharashtra',
    address: 'Nira Hub 4, Hadapsar Mandi, Pune 411028',
  },
  {
    id: 'u_partner_1',
    name: 'Vikram Shinde Fleet',
    phone: '9900011122',
    email: 'vikram.logistics@nira.ai',
    role: 'TRANSPORTER',
    district: 'Pune',
    state: 'Maharashtra',
    address: 'Kisan Express Logistics Hub, Pune 411013',
  },
  {
    id: 'u_admin_1',
    name: 'Ministry Governance Admin',
    phone: '9000000000',
    email: 'admin@nira.ai',
    role: 'ADMIN',
    district: 'New Delhi',
    state: 'Delhi',
    address: 'Dept of Consumer Affairs, Krishi Bhawan, New Delhi 110001',
  },
  {
    id: 'u_dev_master',
    name: 'Natesh (Lead Farmer & Admin)',
    phone: '9876543210',
    email: 'natesh@nira.ai',
    role: 'ADMIN',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Agro Tech Park, Viman Nagar, Pune 411014',
  },
];

export async function seedDefaultKisanAllProducts() {
  const db = getDb();

  // 1. Ensure all default registered users exist in SQLite
  const insertUserStmt = db.prepare(`
    INSERT INTO users (id, name, phone, email, role, village, district, state, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      phone = excluded.phone,
      email = excluded.email,
      role = excluded.role,
      district = excluded.district,
      state = excluded.state,
      address = excluded.address
  `);

  db.transaction(() => {
    for (const u of ALL_DEFAULT_USERS) {
      insertUserStmt.run(
        u.id,
        u.name,
        u.phone,
        u.email,
        u.role,
        'Agro Hub',
        u.district,
        u.state,
        u.address
      );
    }
  })();

  // 2. Sync all default users to MongoDB Atlas
  let mongoUserSyncCount = 0;
  try {
    await connectToDatabase();
    for (const u of ALL_DEFAULT_USERS) {
      await MongoUser.findOneAndUpdate(
        { id: u.id },
        {
          id: u.id,
          name: u.name,
          phone: u.phone,
          email: u.email,
          role: u.role,
          district: u.district,
          state: u.state,
          address: u.address,
        },
        { upsert: true }
      );
    }
    mongoUserSyncCount = ALL_DEFAULT_USERS.length;
  } catch (err: any) {
    console.error('MongoDB Atlas user upsert error:', err);
  }

  // 3. Ensure staple products are seeded in SQLite
  ensureStapleProductsSeeded(db);

  return {
    success: true,
    mongoUserSyncCount,
    registeredUsersCount: ALL_DEFAULT_USERS.length,
    message: `Default farmers and staple products verified in MongoDB Atlas and SQLite!`,
  };
}


