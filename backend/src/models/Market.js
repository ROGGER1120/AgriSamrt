import mongoose from 'mongoose';

const marketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    distanceBenchmarkKm: {
      type: Number,
      default: 45,
    },
    avgTransportRatePerQuintalKm: {
      type: Number,
      default: 1.8, // in INR per quintal per km
    },
    tradingHours: {
      type: String,
      default: '06:00 AM - 04:00 PM',
    },
    contactPhone: {
      type: String,
      default: '+91 98765 43210',
    },
  },
  { timestamps: true }
);

export const Market = mongoose.model('Market', marketSchema);
