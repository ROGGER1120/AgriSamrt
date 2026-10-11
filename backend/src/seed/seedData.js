import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Market } from '../models/Market.js';
import { CropPrice } from '../models/CropPrice.js';
import { Notification } from '../models/Notification.js';

dotenv.config();

const marketsData = [
  {
    name: 'Azadpur Mandi - Delhi',
    code: 'AZD-DEL',
    state: 'Delhi',
    district: 'North Delhi',
    city: 'Delhi',
    latitude: 28.7159,
    longitude: 77.1775,
    distanceBenchmarkKm: 180,
    avgTransportRatePerQuintalKm: 2.1,
    tradingHours: '04:00 AM - 02:00 PM',
    contactPhone: '+91 11 2769 1100',
  },
  {
    name: 'APMC Vashi - Navi Mumbai',
    code: 'VSH-MUM',
    state: 'Maharashtra',
    district: 'Thane',
    city: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.9980,
    distanceBenchmarkKm: 160,
    avgTransportRatePerQuintalKm: 2.0,
    tradingHours: '05:00 AM - 03:00 PM',
    contactPhone: '+91 22 2788 8000',
  },
  {
    name: 'APMC Lasalgaon - Nashik',
    code: 'LSG-NSK',
    state: 'Maharashtra',
    district: 'Nashik',
    city: 'Nashik',
    latitude: 20.1472,
    longitude: 74.2289,
    distanceBenchmarkKm: 35,
    avgTransportRatePerQuintalKm: 1.4,
    tradingHours: '07:00 AM - 05:00 PM',
    contactPhone: '+91 2550 266 225',
  },
  {
    name: 'Khanna Grain Mandi - Punjab',
    code: 'KHN-PB',
    state: 'Punjab',
    district: 'Ludhiana',
    city: 'Khanna',
    latitude: 30.7025,
    longitude: 76.2167,
    distanceBenchmarkKm: 220,
    avgTransportRatePerQuintalKm: 1.9,
    tradingHours: '06:00 AM - 04:00 PM',
    contactPhone: '+91 1628 225 330',
  },
  {
    name: 'Gultekdi Market Yard - Pune',
    code: 'GLT-PUN',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    latitude: 18.4975,
    longitude: 73.8644,
    distanceBenchmarkKm: 110,
    avgTransportRatePerQuintalKm: 1.7,
    tradingHours: '05:30 AM - 02:30 PM',
    contactPhone: '+91 20 2426 5000',
  },
  {
    name: 'APMC Surat - Gujarat',
    code: 'SRT-GUJ',
    state: 'Gujarat',
    district: 'Surat',
    city: 'Surat',
    latitude: 21.1702,
    longitude: 72.8311,
    distanceBenchmarkKm: 190,
    avgTransportRatePerQuintalKm: 1.85,
    tradingHours: '06:00 AM - 03:00 PM',
    contactPhone: '+91 261 247 1822',
  },
  {
    name: 'Choithram Mandi - Indore',
    code: 'CHT-IND',
    state: 'Madhya Pradesh',
    district: 'Indore',
    city: 'Indore',
    latitude: 22.6841,
    longitude: 75.8456,
    distanceBenchmarkKm: 260,
    avgTransportRatePerQuintalKm: 2.2,
    tradingHours: '06:30 AM - 04:30 PM',
    contactPhone: '+91 731 240 1900',
  },
  {
    name: 'Guntur Mirchi Yard - Andhra Pradesh',
    code: 'GNT-AP',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    city: 'Guntur',
    latitude: 16.3067,
    longitude: 80.4365,
    distanceBenchmarkKm: 420,
    avgTransportRatePerQuintalKm: 2.5,
    tradingHours: '07:00 AM - 05:00 PM',
    contactPhone: '+91 863 222 3444',
  },
];

// Helper to generate history
const generateHistory = (basePrice, days = 14) => {
  const history = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Smooth trend oscillation
    const factor = 1 + Math.sin(i * 0.45) * 0.06 + ((Math.random() - 0.5) * 0.02);
    const modal = Math.round(basePrice * factor);
    history.push({
      date: d,
      modalPrice: modal,
      minPrice: Math.round(modal * 0.93),
      maxPrice: Math.round(modal * 1.07),
      volume: Math.round(120 + Math.sin(i * 0.6) * 40 + Math.random() * 20),
    });
  }
  return history;
};

const cropPricings = [
  // WHEAT in multiple markets
  {
    cropName: 'Wheat',
    category: 'Cereals',
    variety: 'Sharbati Premium',
    market: 'Khanna Grain Mandi - Punjab',
    state: 'Punjab',
    modalPrice: 2475,
    minPrice: 2350,
    maxPrice: 2620,
    mspPrice: 2275,
    priceChange: 35,
    priceChangePercentage: 1.43,
    trend: 'up',
    arrivalVolume: 420,
  },
  {
    cropName: 'Wheat',
    category: 'Cereals',
    variety: 'Lokwan Grade-1',
    market: 'Azadpur Mandi - Delhi',
    state: 'Delhi',
    modalPrice: 2650,
    minPrice: 2500,
    maxPrice: 2800,
    mspPrice: 2275,
    priceChange: 50,
    priceChangePercentage: 1.92,
    trend: 'up',
    arrivalVolume: 310,
  },
  {
    cropName: 'Wheat',
    category: 'Cereals',
    variety: 'Sihar Golden',
    market: 'Choithram Mandi - Indore',
    state: 'Madhya Pradesh',
    modalPrice: 2580,
    minPrice: 2420,
    maxPrice: 2710,
    mspPrice: 2275,
    priceChange: -20,
    priceChangePercentage: -0.77,
    trend: 'down',
    arrivalVolume: 260,
  },
  {
    cropName: 'Wheat',
    category: 'Cereals',
    variety: 'Desi Lokwan',
    market: 'Gultekdi Market Yard - Pune',
    state: 'Maharashtra',
    modalPrice: 2720,
    minPrice: 2590,
    maxPrice: 2890,
    mspPrice: 2275,
    priceChange: 20,
    priceChangePercentage: 0.74,
    trend: 'up',
    arrivalVolume: 180,
  },

  // TOMATO in multiple markets
  {
    cropName: 'Tomato',
    category: 'Vegetables',
    variety: 'Hybrid Vaishali',
    market: 'APMC Lasalgaon - Nashik',
    state: 'Maharashtra',
    modalPrice: 1850,
    minPrice: 1600,
    maxPrice: 2100,
    mspPrice: 0,
    priceChange: -120,
    priceChangePercentage: -6.09,
    trend: 'down',
    arrivalVolume: 560,
  },
  {
    cropName: 'Tomato',
    category: 'Vegetables',
    variety: 'Hybrid Himsona',
    market: 'Azadpur Mandi - Delhi',
    state: 'Delhi',
    modalPrice: 2650,
    minPrice: 2400,
    maxPrice: 2950,
    mspPrice: 0,
    priceChange: 180,
    priceChangePercentage: 7.29,
    trend: 'up',
    arrivalVolume: 290,
  },
  {
    cropName: 'Tomato',
    category: 'Vegetables',
    variety: 'Desi Red',
    market: 'APMC Vashi - Navi Mumbai',
    state: 'Maharashtra',
    modalPrice: 2400,
    minPrice: 2150,
    maxPrice: 2650,
    mspPrice: 0,
    priceChange: 70,
    priceChangePercentage: 3.0,
    trend: 'up',
    arrivalVolume: 340,
  },
  {
    cropName: 'Tomato',
    category: 'Vegetables',
    variety: 'Hybrid Abhinav',
    market: 'APMC Surat - Gujarat',
    state: 'Gujarat',
    modalPrice: 2250,
    minPrice: 2000,
    maxPrice: 2480,
    mspPrice: 0,
    priceChange: 50,
    priceChangePercentage: 2.27,
    trend: 'up',
    arrivalVolume: 210,
  },

  // ONION in multiple markets
  {
    cropName: 'Onion',
    category: 'Vegetables',
    variety: 'Garwa Red Quality',
    market: 'APMC Lasalgaon - Nashik',
    state: 'Maharashtra',
    modalPrice: 2180,
    minPrice: 1950,
    maxPrice: 2390,
    mspPrice: 0,
    priceChange: 90,
    priceChangePercentage: 4.31,
    trend: 'up',
    arrivalVolume: 1250,
  },
  {
    cropName: 'Onion',
    category: 'Vegetables',
    variety: 'Nashik Big Bulb',
    market: 'APMC Vashi - Navi Mumbai',
    state: 'Maharashtra',
    modalPrice: 2540,
    minPrice: 2320,
    maxPrice: 2780,
    mspPrice: 0,
    priceChange: 110,
    priceChangePercentage: 4.53,
    trend: 'up',
    arrivalVolume: 820,
  },
  {
    cropName: 'Onion',
    category: 'Vegetables',
    variety: 'Grade A Red',
    market: 'Azadpur Mandi - Delhi',
    state: 'Delhi',
    modalPrice: 2850,
    minPrice: 2600,
    maxPrice: 3100,
    mspPrice: 0,
    priceChange: 140,
    priceChangePercentage: 5.17,
    trend: 'up',
    arrivalVolume: 610,
  },
  {
    cropName: 'Onion',
    category: 'Vegetables',
    variety: 'Medium Red',
    market: 'Gultekdi Market Yard - Pune',
    state: 'Maharashtra',
    modalPrice: 2380,
    minPrice: 2150,
    maxPrice: 2550,
    mspPrice: 0,
    priceChange: 40,
    priceChangePercentage: 1.71,
    trend: 'up',
    arrivalVolume: 490,
  },

  // BASMATI RICE in multiple markets
  {
    cropName: 'Basmati Rice',
    category: 'Cereals',
    variety: 'Pusa 1121 Traditional',
    market: 'Khanna Grain Mandi - Punjab',
    state: 'Punjab',
    modalPrice: 3850,
    minPrice: 3600,
    maxPrice: 4120,
    mspPrice: 2203,
    priceChange: 75,
    priceChangePercentage: 1.99,
    trend: 'up',
    arrivalVolume: 380,
  },
  {
    cropName: 'Basmati Rice',
    category: 'Cereals',
    variety: 'Pusa 1509 Aged',
    market: 'Azadpur Mandi - Delhi',
    state: 'Delhi',
    modalPrice: 4200,
    minPrice: 3950,
    maxPrice: 4500,
    mspPrice: 2203,
    priceChange: 120,
    priceChangePercentage: 2.94,
    trend: 'up',
    arrivalVolume: 220,
  },
  {
    cropName: 'Basmati Rice',
    category: 'Cereals',
    variety: '1121 Export Grade',
    market: 'APMC Vashi - Navi Mumbai',
    state: 'Maharashtra',
    modalPrice: 4450,
    minPrice: 4150,
    maxPrice: 4750,
    mspPrice: 2203,
    priceChange: 50,
    priceChangePercentage: 1.14,
    trend: 'up',
    arrivalVolume: 150,
  },

  // SOYBEAN
  {
    cropName: 'Soybean',
    category: 'Oilseeds',
    variety: 'Yellow JS-335',
    market: 'Choithram Mandi - Indore',
    state: 'Madhya Pradesh',
    modalPrice: 4680,
    minPrice: 4420,
    maxPrice: 4890,
    mspPrice: 4600,
    priceChange: 80,
    priceChangePercentage: 1.74,
    trend: 'up',
    arrivalVolume: 480,
  },
  {
    cropName: 'Soybean',
    category: 'Oilseeds',
    variety: 'Yellow FAQ',
    market: 'APMC Lasalgaon - Nashik',
    state: 'Maharashtra',
    modalPrice: 4610,
    minPrice: 4380,
    maxPrice: 4780,
    mspPrice: 4600,
    priceChange: -30,
    priceChangePercentage: -0.65,
    trend: 'down',
    arrivalVolume: 290,
  },
  {
    cropName: 'Soybean',
    category: 'Oilseeds',
    variety: 'Processed Grade',
    market: 'Gultekdi Market Yard - Pune',
    state: 'Maharashtra',
    modalPrice: 4740,
    minPrice: 4500,
    maxPrice: 4920,
    mspPrice: 4600,
    priceChange: 40,
    priceChangePercentage: 0.85,
    trend: 'up',
    arrivalVolume: 170,
  },

  // COTTON
  {
    cropName: 'Cotton',
    category: 'Cash Crops',
    variety: 'Medium Staple (Shankar-6)',
    market: 'APMC Surat - Gujarat',
    state: 'Gujarat',
    modalPrice: 7200,
    minPrice: 6850,
    maxPrice: 7550,
    mspPrice: 6620,
    priceChange: 150,
    priceChangePercentage: 2.13,
    trend: 'up',
    arrivalVolume: 310,
  },
  {
    cropName: 'Cotton',
    category: 'Cash Crops',
    variety: 'Long Staple BT',
    market: 'Guntur Mirchi Yard - Andhra Pradesh',
    state: 'Andhra Pradesh',
    modalPrice: 7450,
    minPrice: 7100,
    maxPrice: 7800,
    mspPrice: 7020,
    priceChange: 90,
    priceChangePercentage: 1.22,
    trend: 'up',
    arrivalVolume: 240,
  },

  // POTATO
  {
    cropName: 'Potato',
    category: 'Vegetables',
    variety: 'Kufri Jyoti Fresh',
    market: 'Azadpur Mandi - Delhi',
    state: 'Delhi',
    modalPrice: 1420,
    minPrice: 1250,
    maxPrice: 1580,
    mspPrice: 0,
    priceChange: -40,
    priceChangePercentage: -2.74,
    trend: 'down',
    arrivalVolume: 890,
  },
  {
    cropName: 'Potato',
    category: 'Vegetables',
    variety: 'Kufri Pukhraj',
    market: 'APMC Vashi - Navi Mumbai',
    state: 'Maharashtra',
    modalPrice: 1680,
    minPrice: 1490,
    maxPrice: 1850,
    mspPrice: 0,
    priceChange: 30,
    priceChangePercentage: 1.82,
    trend: 'up',
    arrivalVolume: 510,
  },
  {
    cropName: 'Potato',
    category: 'Vegetables',
    variety: 'Chipsona Special',
    market: 'Choithram Mandi - Indore',
    state: 'Madhya Pradesh',
    modalPrice: 1520,
    minPrice: 1380,
    maxPrice: 1660,
    mspPrice: 0,
    priceChange: 15,
    priceChangePercentage: 1.0,
    trend: 'up',
    arrivalVolume: 370,
  },

  // GREEN CHILLI
  {
    cropName: 'Green Chilli',
    category: 'Spices',
    variety: 'Teja Supreme Hot',
    market: 'Guntur Mirchi Yard - Andhra Pradesh',
    state: 'Andhra Pradesh',
    modalPrice: 14200,
    minPrice: 13100,
    maxPrice: 15500,
    mspPrice: 0,
    priceChange: 450,
    priceChangePercentage: 3.27,
    trend: 'up',
    arrivalVolume: 420,
  },
  {
    cropName: 'Green Chilli',
    category: 'Spices',
    variety: 'G4 Spiced Green',
    market: 'APMC Vashi - Navi Mumbai',
    state: 'Maharashtra',
    modalPrice: 5200,
    minPrice: 4700,
    maxPrice: 5800,
    mspPrice: 0,
    priceChange: -200,
    priceChangePercentage: -3.7,
    trend: 'down',
    arrivalVolume: 190,
  },

  // MUSTARD
  {
    cropName: 'Mustard',
    category: 'Oilseeds',
    variety: 'Black Bold Seed',
    market: 'Khanna Grain Mandi - Punjab',
    state: 'Punjab',
    modalPrice: 5350,
    minPrice: 5100,
    maxPrice: 5580,
    mspPrice: 5650,
    priceChange: 65,
    priceChangePercentage: 1.23,
    trend: 'up',
    arrivalVolume: 210,
  },
  {
    cropName: 'Mustard',
    category: 'Oilseeds',
    variety: 'Desi Pili Sarson',
    market: 'Azadpur Mandi - Delhi',
    state: 'Delhi',
    modalPrice: 5520,
    minPrice: 5280,
    maxPrice: 5740,
    mspPrice: 5650,
    priceChange: 80,
    priceChangePercentage: 1.47,
    trend: 'up',
    arrivalVolume: 175,
  },
];

const seedNotifications = [
  {
    title: 'Severe Rainfall Advisory for Western Ghats & Nashik',
    message: 'Localized heavy rainfall (35-50mm) anticipated across Nashik and Pune grape/onion belts over next 48 hrs. Postpone chemical spray application.',
    type: 'weather_alert',
    priority: 'high',
    iconType: 'cloud-rain',
  },
  {
    title: 'Tomato Prices Surge +7.2% in Azadpur Mandi',
    message: 'Due to reduced arrivals from Himachal and southern routes, modal price for Tomato has risen to ₹2,650/quintal in Azadpur.',
    type: 'price_update',
    priority: 'medium',
    crop: 'Tomato',
    market: 'Azadpur Mandi - Delhi',
    iconType: 'trending-up',
  },
  {
    title: 'Cabinet Approves Revision of Rabi MSP for 2026 Season',
    message: 'Government has increased MSP for Wheat by ₹150/quintal and Mustard by ₹210/quintal to incentivize oilseed production.',
    type: 'announcement',
    priority: 'high',
    iconType: 'award',
  },
  {
    title: 'Onion Export Duty Clarification Issued by DGFT',
    message: 'Standardized export inspection protocol now live across Nhava Sheva and Surat ports. Transit clearance times reduced to under 12 hours.',
    type: 'announcement',
    priority: 'low',
    crop: 'Onion',
    iconType: 'info',
  },
  {
    title: 'Heat Stress Warning: Punjab & Haryana Mandi Belts',
    message: 'Afternoon temperatures forecasted to hover around 36-38°C. Ensure adequate moisture retention for standing spring maize and fodder.',
    type: 'weather_alert',
    priority: 'medium',
    iconType: 'sun',
  },
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrismart';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Market.deleteMany({});
    await CropPrice.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed] Cleared collections');

    // Create Admin and Farmer accounts
    const adminUser = await User.create({
      name: 'Dr. Ramesh Patel (Admin)',
      email: 'admin@agrismart.in',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98230 11223',
      state: 'Maharashtra',
      district: 'Nashik',
      favoriteCrops: ['Wheat', 'Tomato', 'Onion', 'Cotton'],
      securityQuestion: 'What is your primary crop?',
      securityAnswer: 'wheat',
    });

    const farmerUser = await User.create({
      name: 'Balwinder Singh (Kisan)',
      email: 'farmer@agrismart.in',
      password: 'Farmer@123',
      role: 'farmer',
      phone: '+91 98140 55678',
      state: 'Punjab',
      district: 'Ludhiana',
      favoriteCrops: ['Wheat', 'Basmati Rice', 'Mustard'],
      securityQuestion: 'What is your primary crop?',
      securityAnswer: 'wheat',
    });

    console.log('[Seed] Created default Admin (admin@agrismart.in) and Farmer (farmer@agrismart.in)');

    // Seed Markets
    const createdMarkets = await Market.insertMany(marketsData);
    console.log(`[Seed] Seeded ${createdMarkets.length} APMC Markets`);

    // Seed Crop Prices with history
    const enrichedCropPrices = cropPricings.map((crop) => {
      return {
        ...crop,
        date: new Date(),
        unit: '₹/Quintal (100 kg)',
        qualityGrade: 'Grade A (FAQ)',
        priceHistory: generateHistory(crop.modalPrice, 14),
        addedBy: adminUser._id,
      };
    });

    const createdPrices = await CropPrice.insertMany(enrichedCropPrices);
    console.log(`[Seed] Seeded ${createdPrices.length} Crop Price entries with 14-day history`);

    // Seed Notifications
    const createdNotifications = await Notification.insertMany(seedNotifications);
    console.log(`[Seed] Seeded ${createdNotifications.length} Notifications`);

    console.log('[Seed] Database initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    throw error;
  }
};

// If run directly via node
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
