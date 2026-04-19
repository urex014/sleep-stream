import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
  try {
    await connectDB();

    // We extract BOTH crypto fields and bank fields just in case!
    const {
      amount,
      walletType,
      // Crypto fields (if they exist)
      method,
      destination,
      network,
      // Bank fields (if they exist)
      bankName,
      accountNumber,
      accountName
    } = await req.json();

    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    // 1. Decode token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 401 });
    }

    // 2. Fetch User
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const withdrawAmount = Number(amount);

    // 3. Minimum Threshold & Balance Validation
    if (walletType === 'Ads' || walletType === 'ads') {
      if (withdrawAmount < 20000) {
        return NextResponse.json({ success: false, message: 'Minimum withdrawal for Ads Wallet is ₦20,000' }, { status: 400 });
      }
      if ((user.adsBalance || 0) < withdrawAmount) {
        return NextResponse.json({ success: false, message: 'Insufficient Ads Balance' }, { status: 400 });
      }
    } else if (walletType === 'Referral' || walletType === 'referrals') {
      if (withdrawAmount < 12000) {
        return NextResponse.json({ success: false, message: 'Minimum withdrawal for Referral Wallet is ₦12,000' }, { status: 400 });
      }
      if ((user.referralBalance || 0) < withdrawAmount) {
        return NextResponse.json({ success: false, message: 'Insufficient Referral Balance' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: 'Invalid wallet selection' }, { status: 400 });
    }

    // 4. Deduct Balance
    if (walletType === 'Ads' || walletType === 'ads') {
      user.adsBalance -= withdrawAmount;
    } else {
      user.referralBalance -= withdrawAmount;
    }
    await user.save();

    // 5. Smart Formatting for the Admin Dashboard
    let finalDestination = destination; // Default to the crypto address if it was sent
    let finalMethod = 'Bank Transfer';

    // If they filled out the Bank form, format it nicely for the Admin table!
    if (bankName && accountNumber) {
      finalDestination = `Bank: ${bankName} | Acc: ${accountNumber} | Name: ${accountName}`;
      finalMethod = 'Bank Transfer';
    } else if (method === 'crypto') {
      finalMethod = `Crypto (${network || 'Unknown'})`;
    }

    // 6. Create Pending Withdrawal Record
    await Transaction.create({
      userId: user._id,
      type: 'Withdrawal',
      wallet: walletType === 'ads' || walletType === 'Ads' ? 'Ads' : 'Referral',
      method: finalMethod,
      amount: withdrawAmount,
      status: 'Pending',
      destination: finalDestination // This is the magic line that fixes your admin panel!
    });

    return NextResponse.json({ success: true, message: 'Withdrawal requested successfully.' });

  } catch (error: any) {
    console.error("Withdrawal API Error:", error.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}