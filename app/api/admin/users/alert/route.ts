import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // NOTE: Make sure you have your admin authentication check here!
    
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ success: false, message: "Missing User ID or Message" }, { status: 400 });
    }

    // Push the message to the user's dashboardAlert field
    await User.findByIdAndUpdate(userId, { dashboardAlert: message });

    return NextResponse.json({ success: true, message: "Alert successfully pushed to user!" }, { status: 200 });

  } catch (error) {
    console.error("Admin Alert Error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}