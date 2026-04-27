import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import VendorRequest from '@/models/VendorRequest';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, email } = await req.json();

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    await VendorRequest.create({
      userId,
      email,
      status: 'Pending'
    });

    return NextResponse.json({ success: true, message: "Application submitted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: `Server Error: ${error}` }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const vendorRequest = await VendorRequest.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('status');

    return NextResponse.json(
      {
        success: true,
        // If there is no request in the DB, default to "None"
        status: vendorRequest?.status ?? 'None', 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: `Server Error: ${error}` }, { status: 500 });
  }
}