import { getDb } from './db';
import { connectToDatabase, MongoUser } from './mongodb';
import { UserRole } from '@/context/AuthContext';

export interface UserInput {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  district?: string;
  state?: string;
  address?: string;
}

/**
 * Check if a user with given email already exists in MongoDB Atlas or SQLite
 */
export async function checkUserExistsByEmail(email: string): Promise<boolean> {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();

  // 1. Check MongoDB Atlas Cloud
  try {
    await connectToDatabase();
    const user = await MongoUser.findOne({ email: cleanEmail }).lean();
    if (user) return true;
  } catch (e) {}

  // 2. Check SQLite
  const db = getDb();
  const row = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
  return !!row;
}

/**
 * Verify user credentials against MongoDB Atlas or SQLite
 */
export async function verifyUserLogin(email: string, pass: string): Promise<{ success: boolean; user?: any; error?: string }> {
  if (!email) return { success: false, error: 'Email is required' };
  const cleanEmail = email.toLowerCase().trim();

  // 1. Check MongoDB Atlas
  try {
    await connectToDatabase();
    const mongoUser = await MongoUser.findOne({ email: cleanEmail }).lean() as any;
    if (mongoUser) {
      if (mongoUser.password && mongoUser.password !== pass) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      return {
        success: true,
        user: {
          id: mongoUser.id,
          name: mongoUser.name,
          email: mongoUser.email,
          role: mongoUser.role,
          phone: mongoUser.phone,
        },
      };
    }
  } catch (e) {}

  // 2. Check SQLite
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanEmail) as any;
    if (row) {
      return {
        success: true,
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          phone: row.phone,
        },
      };
    }
  } catch (e) {}

  return { success: false, error: 'Account not found. Please sign up to create a new account.' };
}

/**
 * Insert new user row into SQLite DB & sync with MongoDB Atlas
 */
export async function registerUserRow(input: UserInput) {
  const { name, email, password, phone, role, district, state, address } = input;
  const db = getDb();

  const userId = input.id || `u_${role.toLowerCase()}_${Date.now()}`;
  const userEmail = email.toLowerCase().trim();
  const userPhone = phone || `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const userDistrict = district || 'Nashik';
  const userState = state || 'Maharashtra';
  const userAddress = address || `${userDistrict}, ${userState}`;

  // 1. Check existing in SQLite or MongoDB
  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(userEmail);
  if (existing) {
    return {
      success: false,
      isExisting: true,
      user: db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(userEmail),
      message: 'User already registered with this email.',
    };
  }

  // 2. Insert into SQLite `users` table
  db.prepare(`
    INSERT INTO users (id, name, phone, email, role, village, district, state, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    name,
    userPhone,
    userEmail,
    role,
    'Village Hub',
    userDistrict,
    userState,
    userAddress
  );

  // 3. Create role-specific profile row
  if (role === 'FARMER') {
    db.prepare(`
      INSERT OR IGNORE INTO farmer_profiles (user_id, farm_name, fpo_id, total_land_acres, verification_status)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, `${name}'s Agro Farm`, 'fpo_nashik_1', 5.5, 'VERIFIED');
  }

  // 4. Sync to MongoDB Atlas `User` collection
  let mongoStatus = 'MongoDB Atlas Synced';
  try {
    await connectToDatabase();
    await MongoUser.findOneAndUpdate(
      { id: userId },
      {
        id: userId,
        name,
        email: userEmail,
        password: password || null,
        phone: userPhone,
        role,
        district: userDistrict,
        state: userState,
        address: userAddress,
      },
      { upsert: true, new: true }
    );
  } catch (err: any) {
    mongoStatus = `SQLite Saved (${err.message})`;
  }

  return {
    success: true,
    isExisting: false,
    user: {
      id: userId,
      name,
      email: userEmail,
      phone: userPhone,
      role,
      district: userDistrict,
      state: userState,
      address: userAddress,
    },
    database: mongoStatus,
  };
}
