import mongoose, { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  
  // Targeting
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // If null, it's for everyone
  isGlobal: { type: Boolean, default: false },

  // Read Status Logic
  isRead: { type: Boolean, default: false }, // For direct messages
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // For global messages: list of users who read it

}, { timestamps: true });

const Notification = models.Notification || model('Notification', NotificationSchema);
export default Notification;