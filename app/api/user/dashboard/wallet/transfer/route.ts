import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Adjust if your path is '@/lib/mongodb'
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Authenticate User
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    // 2. Parse Amount
    const { amount } = await req.json();
    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    // 3. Fetch User
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // 4. Validate Balance
    if (user.referralBalance < transferAmount) {
      return NextResponse.json({ success: false, message: 'Insufficient Referral Balance' }, { status: 400 });
    }

    // 5. Execute Transfer
    user.referralBalance -= transferAmount;
    user.adsBalance += transferAmount;
    await user.save();

    // 6. Log Transaction for the History Table
    await Transaction.create({
      userId: user._id,
      type: 'Transfer',
      wallet: 'Referral', // Withdrawn from Referral
      method: 'Internal Transfer to Ads Wallet',
      amount: transferAmount,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ₦${transferAmount} to Ads Wallet.`
    });

  } catch (error: any) {
    console.error("Transfer API Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}