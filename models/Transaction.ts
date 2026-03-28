import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Earning', 'Withdrawal', 'Deposit'], required: true },
  wallet: { type: String, enum: ['Ads', 'Referral'], required: true },
  method: { type: String, required: true }, // e.g., "Video Ad", "Bank Transfer", "Crypto"
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Success' },
  destination: { type: String }, // For withdrawals (Bank details or Crypto address)
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);