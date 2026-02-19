import mongoose, { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Deposit', 'Withdrawal'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  
  // Payment Details
  method: { type: String, enum: ['crypto', 'fiat'], required: true },
  network: { type: String },
  txHash: { type: String, unique: true, sparse: true }, 
  
  // Admin/System Notes
  description: { type: String },
  
}, { timestamps: true });

const Transaction = models.Transaction || model('Transaction', TransactionSchema);
export default Transaction;