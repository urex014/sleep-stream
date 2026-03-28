import { NextResponse } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();

    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    const user = await User.findById(decoded.userId);

    // 1. Get History
    const history = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);

    // 2. Calculate "Locked" funds (Pending withdrawals)
    const pendingWithdrawals = await Transaction.find({
      userId: user._id,
      type: 'Withdrawal',
      status: 'Pending'
    });
    const lockedAmount = pendingWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);

    return NextResponse.json({
      success: true,
      wallet: {
        total: user.adsBalance + user.referralBalance,
        available: (user.adsBalance + user.referralBalance) - lockedAmount,
        locked: lockedAmount,
        adsBalance: user.adsBalance,
        referralBalance: user.referralBalance
      },
      history
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}