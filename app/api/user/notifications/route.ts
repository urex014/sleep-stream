import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET: Fetch My Notifications
export async function GET(req: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Fetch: Either sent specifically to me OR sent globally
    const notifications = await Notification.find({
      $or: [
        { recipientId: userId },
        { isGlobal: true }
      ]
    }).sort({ createdAt: -1 }).limit(20);

    // Process "Read" status for frontend
    const processed = notifications.map((n: any) => {
      let isRead = false;
      if (n.isGlobal) {
        isRead = n.readBy.includes(userId);
      } else {
        isRead = n.isRead;
      }
      return { ...n.toObject(), isRead };
    });

    return NextResponse.json({ success: true, notifications: processed });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Mark as Read
export async function PUT(req: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { id } = await req.json();

    const notif = await Notification.findById(id);
    if (!notif) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    if (notif.isGlobal) {
      // Add user to readBy array if not already there
      if (!notif.readBy.includes(userId)) {
        notif.readBy.push(userId);
        await notif.save();
      }
    } else {
      // Direct message check
      if (notif.recipientId.toString() === userId) {
        notif.isRead = true;
        await notif.save();
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}