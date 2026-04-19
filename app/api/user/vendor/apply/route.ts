import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const { businessName, businessDescription } = await req.json();

    if (!businessName || !businessDescription) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    
    if (user.vendorStatus === 'Pending') {
      return NextResponse.json({ success: false, message: 'Application already in progress' }, { status: 400 });
    }
    
    if (user.isVendor) {
      return NextResponse.json({ success: false, message: 'You are already a vendor' }, { status: 400 });
    }

    user.businessName = businessName;
    user.businessDescription = businessDescription;
    user.vendorStatus = 'Pending';
    await user.save();

    return NextResponse.json({ success: true, message: 'Application submitted successfully!' });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}