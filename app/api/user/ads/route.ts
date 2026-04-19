/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import Task from '@/models/Tasks' // Make sure this matches your Task/Ad model name

export async function GET() {
  try {
    await connectDB();

    // 1. Basic Auth Check (Make sure they are logged in)
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch ONLY Active Ads
    // We do NOT check for an 'admin' role here!
    const activeAds = await Task.find({ 
      $or: [
        { status: 'Active' },
        { status: { $exists: false } } // Catch older ads that might not have a status
      ] 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tasks: activeAds });

  } catch (error: any) {
    console.error("User Ads Fetch Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}