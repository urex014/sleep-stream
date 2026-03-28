import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET: Fetch Settings
export async function GET(req: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('username email vendorStatus businessName isVendor');

    return NextResponse.json({
      success: true,
      profile: {
        fullName: user.username,
        email: user.email,
        vendorStatus: user.vendorStatus,
        businessName: user.businessName,
        isVendor: user.isVendor
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Update Profile
export async function PUT(req: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { fullName, email } = await req.json();

    await User.findByIdAndUpdate(decoded.id, { username: fullName, email });

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}