import mongoose, { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'link','url'], required: true },
  url: { type: String, required: true }, // YouTube URL or Website Link
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who created the ad
  status: { type: String, default: 'Pending Review' }, // 'Active' or 'Pending Review'
  duration: { type: Number, required: true }, // Timer in seconds
  // status: { type: String, enum: ['Active', 'Paused'], default: 'Active' },
}, { timestamps: true });

const Task = models.Task || model('Task', TaskSchema);
export default Task;