import mongoose, { Schema, model, models } from 'mongoose';

const AccessCodeSchema = new Schema({
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active', 'Sold', 'Used'], default: 'Active' }, // <-- Added 'Sold'
  generatedBy: { type: String, default: 'Admin' },
  usedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  value: { type: Number, default: 5 },
  purchasedByEmail: { 
    type: String,
    required: false 
  },
  purchasedByRef: { 
    type: String,
    required: false
  }
}, { timestamps: true });

const AccessCode = models.AccessCode || model('AccessCode', AccessCodeSchema);
export default AccessCode;