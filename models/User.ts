import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  // --- Core Auth ---
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // --- Permissions, Roles & Vendors ---
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  isVendor: { type: Boolean, default: false },
  vendorStatus: { type: String, enum: ['None', 'Pending', 'Approved', 'Rejected'], default: 'None' },
  businessName: { type: String },
  businessDescription: { type: String },

  // --- Wallets (Naira) ---
  adsBalance: { type: Number, default: 2000.00 }, // Welcome Bonus goes here!
  referralBalance: { type: Number, default: 0.00 },

  // --- Tier System ---
  tier: { type: Number, default: 1 },
  tierExpiresAt: { type: Date, default: null }, // To track the 20-day limit

  // --- PTC Tracking (Watch-To-Earn) ---
  dailyAdsWatched: { type: Number, default: 0 },
  dailyLinksClicked: { type: Number, default: 0 },
  lastTaskDate: { type: Date, default: null },
  completedAds: { type: [String], default: [] },
  lastAdReset: { type: Date, default: Date.now },

  // --- Referral System ---
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },

  // --- Password Reset ---
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;