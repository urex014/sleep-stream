import mongoose from 'mongoose';

const vendorRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['None','Pending', 'Approved', 'Rejected'], default: 'None' },
}, { timestamps: true });

export default mongoose.models.VendorRequest || mongoose.model('VendorRequest', vendorRequestSchema);