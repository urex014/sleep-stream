import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Permissions & Roles
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  isVendor: { type: Boolean, default: false }, // <--- ADDED THIS FIELD
  
  // Wallet & Earnings
  balance: { type: Number, default: 0.00 },
  referralBalance: { type: Number, default: 0.00 },
  
  // Bot Info
  tier: { type: Number, default: 0 }, // 0 = Free tier
  activeBot: { type: Boolean, default: false },
  
  // Referral System
  referralCode: { type: String, unique: true }, // The code they share
  referredBy: { type: String, default: null }, // The code they used to join

  vendorStatus: { type: String, enum: ['None', 'Pending', 'Approved', 'Rejected'], default: 'None' },
  businessName: { type: String },
  businessDescription: { type: String },
  
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;