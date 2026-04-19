import mongoose, { Schema, model, models } from 'mongoose';

const VendorSchema = new Schema({
  name: { type: String, required: true },
  methods: [{ type: String }], // e.g., ["Bank Transfer", "USDT"]
  platform: { type: String, enum: ['WhatsApp', 'Telegram', 'Website'], required: true },
  link: { type: String, required: true }, // wa.me link or website URL
  status: { type: String, enum: ['Online', 'Offline', 'Away'], default: 'Online' },
  rating: { type: String, default: "5.0/5" },
  verified: { type: Boolean, default: true }
}, { timestamps: true });

const Vendor = models.Vendor || model('Vendor', VendorSchema);
export default Vendor;