import mongoose, { Schema, model, models } from 'mongoose';

const AccessCodeSchema = new Schema({
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active', 'Used'], default: 'Active' },
  generatedBy: { type: String, default: 'Admin' },
  usedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  value: { type: Number, default: 5 }, // Tier 0 Value
}, { timestamps: true });

const AccessCode = models.AccessCode || model('AccessCode', AccessCodeSchema);
export default AccessCode;