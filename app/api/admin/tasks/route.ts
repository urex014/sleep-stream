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
    // REMOVED 'reward' from the incoming data
    const { title, type, url, duration } = await req.json();

    // REMOVED 'reward' from the validation check
    if (!title || !type || !url || !duration) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Create the task WITHOUT a hardcoded reward
    const newTask = await Task.create({
      title,
      type,
      url,
      duration: Number(duration)
    });

    return NextResponse.json({ success: true, message: 'Ad published successfully!', task: newTask });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Remove an Ad
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) return NextResponse.json({ success: false, message: 'Ad ID is required' }, { status: 400 });

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Ad not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Ad deleted successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}