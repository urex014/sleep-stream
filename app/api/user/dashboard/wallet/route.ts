import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import Transaction from '@/models/Transaction'; // Make sure this file exists!

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    // 2. Decode Token (Handling both id and userId just in case)
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 401 });
    }

    // 3. Fetch User
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Get Transaction History safely
    let history = [];
    try {
      history = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);
    } catch (txError) {
      console.log("Transaction fetch skipped or failed. Did you create the model?");
      // We don't crash the server here, just return an empty array if the table doesn't exist yet
    }

    // 5. Calculate "Locked" funds (Pending withdrawals)
    const pendingWithdrawals = history.filter(tx => tx.type === 'Withdrawal' && tx.status === 'Pending');
    const lockedAmount = pendingWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);

    const totalBalance = (user.adsBalance || 0) + (user.referralBalance || 0);

    // 6. Return Payload
    return NextResponse.json({
      success: true,
      wallet: {
        total: totalBalance,
        available: totalBalance - lockedAmount,
        locked: lockedAmount,
        adsBalance: user.adsBalance || 0,
        referralBalance: user.referralBalance || 0
      },
      history
    });

  } catch (error: any) {
    console.error("Wallet API Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}