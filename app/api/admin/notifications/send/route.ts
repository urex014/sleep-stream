import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Admin Auth
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { title, message, type, recipientId } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ success: false, message: 'Title and message required' }, { status: 400 });
    }

    // 2. Create Notification
    await Notification.create({
      title,
      message,
      type: type || 'info',
      recipientId: recipientId || null, // Specific ID or Null
      isGlobal: !recipientId // If no ID, it's global
    });

    return NextResponse.json({ success: true, message: 'Notification sent successfully' });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}