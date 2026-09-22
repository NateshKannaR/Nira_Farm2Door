import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  let dbPath: string;
  // On Vercel / AWS Lambda, process.cwd() is strictly read-only.
  // /tmp is the only writable filesystem directory.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join('/tmp', 'kisanbandhan.db');
    const localDbPath = path.join(process.cwd(), 'kisanbandhan.db');
    if (!fs.existsSync(tmpDbPath)) {
      try {
        if (fs.existsSync(localDbPath)) {
          fs.copyFileSync(localDbPath, tmpDbPath);
        }
      } catch (copyErr) {
        console.warn('Notice copying db to /tmp:', copyErr);
      }
    }
    dbPath = tmpDbPath;
  } else {
    dbPath = path.join(process.cwd(), 'kisanbandhan.db');
  }

  dbInstance = new Database(dbPath, { timeout: 10000 });

  try {
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
  } catch (e) {
    // Ignore WAL mode busy during parallel compilation
  }

  initTables(dbInstance);
  return dbInstance;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT NOT NULL CHECK(role IN ('FARMER', 'FPO', 'BUYER', 'HUB_OPERATOR', 'TRANSPORTER', 'ADMIN')),
      village TEXT,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fpo_groups (
      id TEXT PRIMARY KEY,
      fpo_name TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      total_members INTEGER DEFAULT 1,
      manager_user_id TEXT REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS farmer_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id),
      farm_name TEXT NOT NULL,
      fpo_id TEXT REFERENCES fpo_groups(id),
      total_land_acres REAL DEFAULT 0,
      verification_status TEXT DEFAULT 'VERIFIED' CHECK(verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
      bank_account TEXT,
      ifsc_code TEXT
    );

    CREATE TABLE IF NOT EXISTS product_listings (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL REFERENCES users(id),
      fpo_id TEXT REFERENCES fpo_groups(id),
      crop_name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Seeds')),
      quantity_available INTEGER NOT NULL CHECK(quantity_available >= 0),
      unit TEXT NOT NULL DEFAULT 'kg' CHECK(unit IN ('kg', 'quintal', 'crate', 'ton', 'packet', 'dozen', 'piece')),
      price_paise INTEGER NOT NULL CHECK(price_paise > 0),
      mandi_retail_price_paise INTEGER NOT NULL,
      grade TEXT DEFAULT 'Grade A',
      harvest_date TEXT NOT NULL,
      organic_certified INTEGER DEFAULT 0,
      image_url TEXT NOT NULL,
      location TEXT NOT NULL,
      district TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'PAUSED', 'SOLD_OUT')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pooled_lots (
      id TEXT PRIMARY KEY,
      fpo_id TEXT NOT NULL REFERENCES fpo_groups(id),
      crop_name TEXT NOT NULL,
      total_quantity_kg INTEGER NOT NULL,
      target_price_paise INTEGER NOT NULL,
      committed_members_count INTEGER DEFAULT 1,
      status TEXT DEFAULT 'POOLING' CHECK(status IN ('POOLING', 'LOCKED', 'DISPATCHED'))
    );

    CREATE TABLE IF NOT EXISTS bulk_requirements (
      id TEXT PRIMARY KEY,
      buyer_id TEXT NOT NULL REFERENCES users(id),
      crop_name TEXT NOT NULL,
      required_quantity_kg INTEGER NOT NULL,
      fulfilled_quantity_kg INTEGER DEFAULT 0,
      max_price_paise INTEGER NOT NULL,
      delivery_location TEXT NOT NULL,
      status TEXT DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'PARTIAL', 'FULFILLED', 'EXPIRED')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      buyer_id TEXT NOT NULL REFERENCES users(id),
      farmer_id TEXT NOT NULL REFERENCES users(id),
      fpo_id TEXT REFERENCES fpo_groups(id),
      status TEXT DEFAULT 'Placed' CHECK(status IN ('Placed', 'Accepted', 'Picked Up', 'Out for Delivery', 'Delivered', 'Cancelled')),
      subtotal_paise INTEGER NOT NULL,
      delivery_fee_paise INTEGER NOT NULL,
      total_amount_paise INTEGER NOT NULL,
      delivery_address TEXT NOT NULL,
      delivery_type TEXT DEFAULT 'EXPRESS' CHECK(delivery_type IN ('EXPRESS', 'BULK_HUB')),
      payment_method TEXT DEFAULT 'COD' CHECK(payment_method IN ('COD', 'UPI', 'BANK_TRANSFER')),
      payment_status TEXT DEFAULT 'PENDING' CHECK(payment_status IN ('PENDING', 'PAID')),
      notes TEXT,
      recipient_name TEXT,
      recipient_phone TEXT,
      alt_phone TEXT,
      flat_building TEXT,
      area_street TEXT,
      landmark TEXT,
      post_office TEXT,
      district TEXT,
      state TEXT,
      pin_code TEXT,
      address_type TEXT,
      delivery_instructions TEXT,
      shipping_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id),
      listing_id TEXT NOT NULL REFERENCES product_listings(id),
      crop_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit TEXT NOT NULL,
      unit_price_paise INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY,
      order_id TEXT UNIQUE NOT NULL REFERENCES orders(id),
      partner_id TEXT REFERENCES users(id),
      pickup_location TEXT NOT NULL,
      drop_location TEXT NOT NULL,
      status TEXT DEFAULT 'ASSIGNED' CHECK(status IN ('ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED')),
      pickup_otp TEXT DEFAULT '4829',
      delivery_otp TEXT DEFAULT '9103',
      optimized_stop_sequence INTEGER DEFAULT 1,
      estimated_distance_km REAL DEFAULT 14.5,
      estimated_eta_minutes INTEGER DEFAULT 35,
      driver_name TEXT DEFAULT 'Vikram Shinde',
      driver_phone TEXT DEFAULT '+91 99000 11122',
      driver_vehicle TEXT DEFAULT 'MH-15-EG-8821 (Tata Ace Gold)',
      cod_collected INTEGER DEFAULT 0,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hub_intakes (
      id TEXT PRIMARY KEY,
      lot_id TEXT NOT NULL,
      operator_id TEXT NOT NULL REFERENCES users(id),
      crop_name TEXT NOT NULL,
      quantity_kg INTEGER NOT NULL,
      quality_grade TEXT DEFAULT 'Grade A+',
      cv_confidence_score REAL DEFAULT 0.94,
      shelf_life_days INTEGER DEFAULT 12,
      fssai_compliance TEXT DEFAULT 'PASS',
      qr_code_id TEXT NOT NULL,
      intake_status TEXT DEFAULT 'STORED' CHECK(intake_status IN ('STORED', 'DISPATCHED', 'DISCOUNT_ALERT'))
    );

    CREATE TABLE IF NOT EXISTS demand_forecasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop_name TEXT NOT NULL,
      district TEXT NOT NULL,
      forecast_period TEXT NOT NULL,
      predicted_demand_kg INTEGER NOT NULL,
      current_supply_kg INTEGER NOT NULL,
      recommended_price_paise INTEGER NOT NULL,
      confidence_percent INTEGER DEFAULT 88,
      trend TEXT CHECK(trend IN ('HIGH_DEMAND', 'STABLE', 'SURPLUS_RISK')),
      insight_note TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crop_translations_cache (
      crop_key TEXT PRIMARY KEY,
      hi_name TEXT NOT NULL,
      en_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      crop_name TEXT NOT NULL,
      crop_name_hi TEXT,
      category TEXT NOT NULL,
      variety TEXT,
      logo_id TEXT NOT NULL,
      logo_url TEXT NOT NULL,
      logo_alt TEXT,
      primary_image_id TEXT NOT NULL,
      primary_image_url TEXT NOT NULL,
      thumbnail_id TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      gallery_urls TEXT,
      logo_structure TEXT,
      images_structure TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Purge legacy dummy listings and old mock orders in SQLite
  try {
    db.exec(`
      DELETE FROM order_items WHERE order_id LIKE 'ord_178941%' OR order_id = 'ord_501' OR listing_id LIKE 'lst_kisan_%' OR listing_id LIKE 'prod_%';
      DELETE FROM deliveries WHERE id LIKE 'del_178941%' OR id = 'del_701' OR id = 'del_501';
      DELETE FROM orders WHERE id LIKE 'ord_178941%' OR id = 'ord_501';
      DELETE FROM product_listings WHERE id LIKE 'lst_kisan_%' OR id LIKE 'prod_%';
    `);
  } catch (e) {}

  try {
    db.exec('ALTER TABLE users ADD COLUMN email TEXT;');
  } catch (e) {
    // Ignore error if column already exists
  }

  try {
    db.exec('ALTER TABLE product_listings ADD COLUMN logo_url TEXT;');
  } catch (e) {
    // Ignore error if column already exists
  }

  try {
    db.exec('ALTER TABLE deliveries ADD COLUMN driver_name TEXT;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE deliveries ADD COLUMN driver_phone TEXT;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE deliveries ADD COLUMN driver_vehicle TEXT;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE deliveries ADD COLUMN cod_collected INTEGER DEFAULT 0;');
  } catch (e) {}

  const orderColumns = [
    'recipient_name TEXT',
    'recipient_phone TEXT',
    'alt_phone TEXT',
    'flat_building TEXT',
    'area_street TEXT',
    'landmark TEXT',
    'post_office TEXT',
    'district TEXT',
    'state TEXT',
    'pin_code TEXT',
    'address_type TEXT',
    'delivery_instructions TEXT',
    'shipping_json TEXT',
  ];
  for (const col of orderColumns) {
    try {
      db.exec(`ALTER TABLE orders ADD COLUMN ${col};`);
    } catch (e) {}
  }

  // Ensure product_listings supports 'Seeds' category
  try {
    const testCat = db.prepare(`SELECT 1 FROM product_listings WHERE category = 'Seeds' LIMIT 1`);
    testCat.get();
  } catch (e) {
    // If check constraint fails on older DB schema, migrate it
    try {
      db.exec('PRAGMA foreign_keys=OFF;');
      db.exec(`
        CREATE TABLE IF NOT EXISTS product_listings_temp (
          id TEXT PRIMARY KEY,
          farmer_id TEXT NOT NULL REFERENCES users(id),
          fpo_id TEXT REFERENCES fpo_groups(id),
          crop_name TEXT NOT NULL,
          category TEXT NOT NULL CHECK(category IN ('Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Seeds')),
          quantity_available INTEGER NOT NULL CHECK(quantity_available >= 0),
          unit TEXT NOT NULL DEFAULT 'kg' CHECK(unit IN ('kg', 'quintal', 'crate', 'ton', 'packet', 'dozen', 'piece')),
          price_paise INTEGER NOT NULL CHECK(price_paise > 0),
          mandi_retail_price_paise INTEGER NOT NULL,
          grade TEXT DEFAULT 'Grade A',
          harvest_date TEXT NOT NULL,
          organic_certified INTEGER DEFAULT 0,
          image_url TEXT NOT NULL,
          location TEXT NOT NULL,
          district TEXT NOT NULL,
          status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'PAUSED', 'SOLD_OUT')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        INSERT INTO product_listings_temp SELECT * FROM product_listings;
        DROP TABLE product_listings;
        ALTER TABLE product_listings_temp RENAME TO product_listings;
        PRAGMA foreign_keys=ON;
      `);
    } catch (migErr) {
      // Ignore migration errors if not needed
    }
  }

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    seedData(db);
  }
}

function seedData(db: Database.Database) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, phone, email, role, village, district, state, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFpo = db.prepare(`
    INSERT INTO fpo_groups (id, fpo_name, district, state, total_members, manager_user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertFarmer = db.prepare(`
    INSERT INTO farmer_profiles (user_id, farm_name, fpo_id, total_land_acres, verification_status, bank_account, ifsc_code)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertListing = db.prepare(`
    INSERT INTO product_listings (id, farmer_id, fpo_id, crop_name, category, quantity_available, unit, price_paise, mandi_retail_price_paise, grade, harvest_date, organic_certified, image_url, location, district, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPooled = db.prepare(`
    INSERT INTO pooled_lots (id, fpo_id, crop_name, total_quantity_kg, target_price_paise, committed_members_count, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertBulkReq = db.prepare(`
    INSERT INTO bulk_requirements (id, buyer_id, crop_name, required_quantity_kg, fulfilled_quantity_kg, max_price_paise, delivery_location, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, buyer_id, farmer_id, fpo_id, status, subtotal_paise, delivery_fee_paise, total_amount_paise, delivery_address, delivery_type, payment_method, payment_status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (order_id, listing_id, crop_name, quantity, unit, unit_price_paise)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertDelivery = db.prepare(`
    INSERT INTO deliveries (id, order_id, partner_id, pickup_location, drop_location, status, pickup_otp, delivery_otp, optimized_stop_sequence, estimated_distance_km, estimated_eta_minutes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertHub = db.prepare(`
    INSERT INTO hub_intakes (id, lot_id, operator_id, crop_name, quantity_kg, quality_grade, cv_confidence_score, shelf_life_days, fssai_compliance, qr_code_id, intake_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertForecast = db.prepare(`
    INSERT INTO demand_forecasts (crop_name, district, forecast_period, predicted_demand_kg, current_supply_kg, recommended_price_paise, confidence_percent, trend, insight_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    // 1. Users for 6 Personas
    // Farmer
    insertUser.run('u_farmer_1', 'Ramesh Patil', '9876543210', 'ramesh.patil@nira.ai', 'FARMER', 'Pimplgaon', 'Nashik', 'Maharashtra', 'Pimplgaon Baswant, Nashik, MH 422209');
    // FPO Manager
    insertUser.run('u_fpo_1', 'Sanjay Deshmukh (FPO Lead)', '9876543219', 'sanjay.fpo@nira.ai', 'FPO', 'Lasalgaon Hub', 'Nashik', 'Maharashtra', 'Sahyadri Farmers Producer Co., Nashik');
    insertFpo.run('fpo_nashik_1', 'Sahyadri Farmers Producer Co.', 'Nashik', 'Maharashtra', 142, 'u_fpo_1');
    insertFarmer.run('u_farmer_1', 'Patil Organic Farms', 'fpo_nashik_1', 8.5, 'VERIFIED', 'SBIN0001234', 'SBIN0001234');

    insertUser.run('u_farmer_2', 'Harpreet Singh', '9876543211', 'harpreet@nira.ai', 'FARMER', 'Khanna', 'Ludhiana', 'Punjab', 'G.T. Road, Khanna, Ludhiana, PB 141401');
    insertFarmer.run('u_farmer_2', 'Green Field Farms', null, 15.0, 'VERIFIED', 'HDFC0005678', 'HDFC0005678');

    insertUser.run('u_farmer_3', 'Suresh Gaikwad', '9876543212', 'suresh.gaikwad@nira.ai', 'FARMER', 'Baramati', 'Pune', 'Maharashtra', 'Baramati Agro Hub, Pune, MH 413102');
    insertFarmer.run('u_farmer_3', 'Gaikwad Fruit Orchards', null, 12.0, 'VERIFIED', 'MAHB0001122', 'MAHB0001122');

    insertUser.run('u_farmer_4', 'Ananya Roy', '9876543213', 'ananya.roy@nira.ai', 'FARMER', 'Singur', 'Hooghly', 'West Bengal', 'Singur Krishi Mandi, Hooghly, WB 712409');
    insertFarmer.run('u_farmer_4', 'Bengal Green Organics', null, 6.5, 'VERIFIED', 'PUNB0003344', 'PUNB0003344');

    insertUser.run('u_farmer_5', 'Rajesh Choudhary', '9876543214', 'rajesh.farmer@nira.ai', 'FARMER', 'Chomu', 'Jaipur', 'Rajasthan', 'Chomu Mandi Link Road, Jaipur, RJ 303702');
    insertFarmer.run('u_farmer_5', 'Marwar Spices & Pulses', null, 20.0, 'VERIFIED', 'BARB0005566', 'BARB0005566');

    // Buyer
    insertUser.run('u_buyer_1', 'Priya Sharma (Consumer)', '9811122233', 'priya@nira.ai', 'BUYER', 'Viman Nagar', 'Pune', 'Maharashtra', 'Flat 402, Green Acres, Viman Nagar, Pune 411014');
    insertUser.run('u_buyer_2', 'Annapurna Hotel & Catering', '9822233344', 'annapurna@nira.ai', 'BUYER', 'Swargate', 'Pune', 'Maharashtra', 'Sector 17, Swargate, Pune 411002');
    insertUser.run('u_dev_master', 'Natesh (Lead Farmer & Admin)', '9876543210', 'natesh@nira.ai', 'ADMIN', 'Viman Nagar', 'Pune', 'Maharashtra', 'Agro Tech Park, Viman Nagar, Pune 411014');

    // Hub Operator
    insertUser.run('u_hub_1', 'Rajesh Kulkarni (Hub Supervisor)', '9900088877', 'rajesh.hub@nira.ai', 'HUB_OPERATOR', 'Hadapsar Mandi', 'Pune', 'Maharashtra', 'Nira Hub 4, Hadapsar, Pune');

    // Transporter
    insertUser.run('u_partner_1', 'Vikram Shinde Fleet', '9900011122', 'vikram.logistics@nira.ai', 'TRANSPORTER', 'Hadapsar', 'Pune', 'Maharashtra', 'Kisan Express Logistics Hub, Pune');

    // Admin
    insertUser.run('u_admin_1', 'Ministry Governance Admin', '9000000000', 'admin@nira.ai', 'ADMIN', '', 'New Delhi', 'Delhi', 'Dept of Consumer Affairs, Krishi Bhawan, New Delhi');

    // 2. Product Listings & Orders start completely clean - populated by real actions
    // No mock seed products or orders

    // 8. Demand Forecasts
    insertForecast.run('Tomatoes', 'Nashik / Pune Region', 'Next 7 Days', 8500, 6200, 3000, 92, 'HIGH_DEMAND', 'Festival surge expected next week. Hotel demand up 35%. Recommended to list extra 2,000 kg for optimal profit.');
    insertForecast.run('Onions', 'Nashik Region', 'Next 14 Days', 25000, 28000, 3400, 85, 'SURPLUS_RISK', 'Harvest peak in Lasalgaon. Sell early to prevent storage decay. Bulk buyer discounts recommended.');
    insertForecast.run('Sharbati Wheat', 'Ludhiana Region', 'Next 30 Days', 18000, 15000, 2750, 89, 'HIGH_DEMAND', 'Steady institutional buyer demand from urban retail stores. Prices expected to remain firm.');
  })();
}
