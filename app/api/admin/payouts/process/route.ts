//we wann approve and reject payouts. Now i have to find out a way to work through admin auth

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'IM THAT NIGGA';

export async function POST(req: Request) {
  try {
    await connectDB();

    //  Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    // 2. Get Data
    const { id, action } = await req.json(); // action = 'Approve' or 'Reject'

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status !== 'Pending') {
      return NextResponse.json({ success: false, message: 'Transaction already processed' }, { status: 400 });
    }

    // 3. Process Logic
    if (action === 'Approve') {
      // Just mark as Success (Funds were already deducted on request)
      transaction.status = 'Success';
      await transaction.save();
      
      return NextResponse.json({ success: true, message: 'Withdrawal Approved' });

    } else if (action === 'Reject') {
      // Mark as Failed AND Refund the User
      transaction.status = 'Failed';
      await transaction.save();

      const user = await User.findById(transaction.userId);
      if (user) {
        user.adsBalance = (user.adsBalance || 0) + transaction.amount;
        await user.save();
      }

      return NextResponse.json({ success: true, message: 'Withdrawal Rejected & Refunded' });
    }

    return NextResponse.json({ success: false, message: 'Invalid Action' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}