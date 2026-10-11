import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['weather_alert', 'price_update', 'announcement'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low', 'critical'],
      default: 'medium',
    },
    crop: {
      type: String,
    },
    market: {
      type: String,
    },
    iconType: {
      type: String,
      default: 'bell',
    },
    actionUrl: {
      type: String,
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
