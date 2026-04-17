import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Earning', 'Withdrawal', 'Deposit', 'Transfer'], required: true },
  wallet: { type: String, enum: ['Ads', 'Referral', 'System'], required: true }, // Added 'System'
  method: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String }, // Added to track Paystack IDs
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Success' },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);