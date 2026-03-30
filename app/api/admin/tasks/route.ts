import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Tasks';

// GET: Fetch all tasks for the Admin table
export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Create a new Task/Ad
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, type, url, reward, duration } = await req.json();

    if (!title || !type || !url || !reward || !duration) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    const newTask = await Task.create({
      title,
      type,
      url,
      reward: Number(reward),
      duration: Number(duration)
    });

    return NextResponse.json({ success: true, message: 'Ad published successfully!', task: newTask });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}