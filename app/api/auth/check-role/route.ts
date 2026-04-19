import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Check for Token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, role: null }, { status: 401 });
    }

    // 2. Verify Token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, role: null }, { status: 401 });
    }

    // 3. Fetch ONLY the role (High Performance)
    const user = await User.findById(decoded.id).select('role');

    if (!user) {
      return NextResponse.json({ success: false, role: null }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      role: user.role 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}