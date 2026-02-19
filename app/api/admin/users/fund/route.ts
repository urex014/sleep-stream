import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
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
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { id, action } = await req.json(); // action: 'Approve' | 'Reject'

    // 2. Find Transaction
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.status !== 'Pending') {
      return NextResponse.json({ success: false, message: 'Invalid or processed transaction' }, { status: 400 });
    }

    // 3. Process Logic
    if (action === 'Approve') {
      // A. Update Transaction Status
      transaction.status = 'Success';
      await transaction.save();

      // B. Credit User Balance
      const user = await User.findById(transaction.userId);
      if (user) {
        user.balance += transaction.amount;
        await user.save();
      }
      return NextResponse.json({ success: true, message: 'Deposit Approved & User Credited' });

    } else if (action === 'Reject') {
      // Just mark as failed, no balance change needed
      transaction.status = 'Failed';
      await transaction.save();
      return NextResponse.json({ success: true, message: 'Deposit Rejected' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}