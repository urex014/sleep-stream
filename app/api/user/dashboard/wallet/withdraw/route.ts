import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
  try {
    await connectDB();
    // walletType dictates which balance they are withdrawing from ('ads' or 'referrals')
    const { amount, method, destination, network, walletType } = await req.json();

    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    // 1. Decode token handling BOTH potential ID formats
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 401 });
    }

    // 2. Fetch User AND verify they exist before checking balances
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const withdrawAmount = Number(amount);

    // 3. Minimum Threshold & Balance Validation
    if (walletType === 'ads') {
      if (withdrawAmount < 20000) {
        return NextResponse.json({ success: false, message: 'Minimum withdrawal for Ads Wallet is ₦20,000' }, { status: 400 });
      }
      if (user.adsBalance < withdrawAmount) {
        return NextResponse.json({ success: false, message: 'Insufficient Ads Balance' }, { status: 400 });
      }
    } else if (walletType === 'referrals') {
      if (withdrawAmount < 12000) {
        return NextResponse.json({ success: false, message: 'Minimum withdrawal for Referral Wallet is ₦12,000' }, { status: 400 });
      }
      if (user.referralBalance < withdrawAmount) {
        return NextResponse.json({ success: false, message: 'Insufficient Referral Balance' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: 'Invalid wallet selection' }, { status: 400 });
    }

    // 4. Deduct Balance
    if (walletType === 'ads') {
      user.adsBalance -= withdrawAmount;
    } else {
      user.referralBalance -= withdrawAmount;
    }
    await user.save();

    // 5. Create Pending Withdrawal Record
    await Transaction.create({
      userId: user._id,
      type: 'Withdrawal',
      wallet: walletType === 'ads' ? 'Ads' : 'Referral',
      method: method === 'crypto' ? `Crypto (${network})` : 'Bank Transfer',
      amount: withdrawAmount,
      status: 'Pending',
      destination: destination
    });

    return NextResponse.json({ success: true, message: 'Withdrawal requested successfully.' });

  } catch (error: any) {
    console.error("Withdrawal API Error:", error.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}