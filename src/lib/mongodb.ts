import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('Successfully connected to MongoDB Atlas (Cluster0.wwp3oig.mongodb.net)');
      return mongooseInstance;
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// -------------------------------------------------------------------
// MONGOOSE SCHEMAS & MODELS FOR KISANBANDHAN
// -------------------------------------------------------------------

// 1. User Schema
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  role: { type: String, enum: ['FARMER', 'FPO', 'BUYER', 'HUB_OPERATOR', 'TRANSPORTER', 'ADMIN'], required: true },
  village: { type: String },
  district: { type: String },
  state: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);

// 2. Product Listing Schema
const ProductListingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  farmer_id: { type: String, required: true },
  fpo_id: { type: String },
  crop_name: { type: String, required: true },
  category: { type: String, required: true },
  quantity_available: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  price_paise: { type: Number, required: true },
  mandi_retail_price_paise: { type: Number },
  grade: { type: String, default: 'Grade A+' },
  harvest_date: { type: String },
  organic_certified: { type: Number, default: 0 },
  image_url: { type: String },
  images: [{ type: String }],
  location: { type: String },
  district: { type: String },
  farmer_name: { type: String },
  status: { type: String, default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
});

export const MongoProductListing = mongoose.models.ProductListing || mongoose.model('ProductListing', ProductListingSchema);

// 3. Order Schema
const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  buyer_id: { type: String, required: true },
  farmer_id: { type: String, required: true },
  fpo_id: { type: String },
  status: { type: String, default: 'Placed' },
  subtotal_paise: { type: Number, required: true },
  delivery_fee_paise: { type: Number, required: true },
  total_amount_paise: { type: Number, required: true },
  delivery_address: { type: String, required: true },
  delivery_type: { type: String, default: 'EXPRESS' },
  payment_method: { type: String, default: 'COD' },
  payment_status: { type: String, default: 'PENDING' },
  notes: { type: String },
  recipient_name: { type: String },
  recipient_phone: { type: String },
  items: [{
    listing_id: String,
    crop_name: String,
    quantity: Number,
    unit: String,
    unit_price_paise: Number
  }],
  createdAt: { type: Date, default: Date.now },
});

export const MongoOrder = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// 4. Delivery Schema
const DeliverySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  order_id: { type: String, required: true, unique: true },
  partner_id: { type: String },
  pickup_location: { type: String, required: true },
  drop_location: { type: String, required: true },
  status: { type: String, default: 'ASSIGNED' },
  pickup_otp: { type: String, default: '4829' },
  delivery_otp: { type: String, default: '9103' },
  optimized_stop_sequence: { type: Number, default: 1 },
  estimated_distance_km: { type: Number, default: 14.5 },
  estimated_eta_minutes: { type: Number, default: 35 },
  driver_name: { type: String, default: 'Vikram Shinde' },
  driver_phone: { type: String, default: '+91 99000 11122' },
  driver_vehicle: { type: String, default: 'MH-15-EG-8821 (Tata Ace Gold)' },
  cod_collected: { type: Number, default: 0 },
  assignedAt: { type: Date, default: Date.now },
});

export const MongoDelivery = mongoose.models.Delivery || mongoose.model('Delivery', DeliverySchema);

// 5. Demand Forecast Schema
const DemandForecastSchema = new mongoose.Schema({
  crop_name: { type: String, required: true },
  district: { type: String, required: true },
  forecast_period: { type: String, required: true },
  predicted_demand_kg: { type: Number, required: true },
  current_supply_kg: { type: Number, required: true },
  recommended_price_paise: { type: Number, required: true },
  confidence_percent: { type: Number, default: 90 },
  trend: { type: String, default: 'HIGH_DEMAND' },
  insight_note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const MongoDemandForecast = mongoose.models.DemandForecast || mongoose.model('DemandForecast', DemandForecastSchema);
