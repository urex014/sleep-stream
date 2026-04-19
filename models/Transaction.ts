import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['Earning', 'Withdrawal', 'Deposit', 'Transfer'], required: true },
  // Added 'General' so old legacy data doesn't crash your app
  wallet: { type: String, enum: ['Ads', 'Referral', 'System', 'General'], required: true }, 
  method: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String }, 
  // CRITICAL FIX: Added 'Rejected' to the enum array!
  status: { type: String, enum: ['Pending', 'Success', 'Failed', 'Rejected'], default: 'Success' },
  destination: {
    type: String
  },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);