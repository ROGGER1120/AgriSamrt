import mongoose from 'mongoose';

const priceHistoryItemSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  modalPrice: { type: Number, required: true },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  volume: { type: Number, default: 0 },
});

const cropPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['Cereals', 'Vegetables', 'Pulses', 'Oilseeds', 'Cash Crops', 'Fruits', 'Spices'],
      default: 'Cereals',
    },
    variety: {
      type: String,
      default: 'Standard / Desi',
    },
    market: {
      type: String,
      required: [true, 'Market name is required'],
      index: true,
    },
    marketRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    modalPrice: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: '₹/Quintal (100 kg)',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    arrivalVolume: {
      type: Number,
      default: 120, // in Quintals
    },
    priceChange: {
      type: Number,
      default: 0,
    },
    priceChangePercentage: {
      type: Number,
      default: 0,
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable',
    },
    qualityGrade: {
      type: String,
      enum: ['Grade A (FAQ)', 'Grade B', 'Super Premium'],
      default: 'Grade A (FAQ)',
    },
    mspPrice: {
      type: Number, // Minimum Support Price benchmark if applicable
    },
    priceHistory: [priceHistoryItemSchema],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Indexes for fast searching, filtering, and cross-market comparisons
cropPriceSchema.index({ cropName: 1, market: 1 });
cropPriceSchema.index({ date: -1 });

export const CropPrice = mongoose.model('CropPrice', cropPriceSchema);
