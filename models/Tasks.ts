import mongoose, { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'link'], required: true },
  url: { type: String, required: true }, // YouTube URL or Website Link
  reward: { type: Number, required: true }, // Amount in Naira
  duration: { type: Number, required: true }, // Timer in seconds
  status: { type: String, enum: ['Active', 'Paused'], default: 'Active' },
}, { timestamps: true });

const Task = models.Task || model('Task', TaskSchema);
export default Task;