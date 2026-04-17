import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { reference, tierLevel } = await req.json();

    if (!reference || !tierLevel) {
      return NextResponse.json({ success: false, message: 'Invalid upgrade data.' }, { status: 400 });
    }

    // 1. Authenticate the User
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id || decoded.userId);

    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // 2. Verify the transaction directly with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json({ success: false, message: 'Payment verification failed.' }, { status: 400 });
    }

    // 3. Double-check the amount paid matches the Tier price (Security measure)
    const expectedPrices: { [key: number]: number } = {
      2: 25000 * 100,
      3: 50000 * 100,
      4: 80000 * 100,
      5: 100000 * 100,
    };

    if (paystackData.data.amount < expectedPrices[tierLevel]) {
      return NextResponse.json({ success: false, message: 'Payment amount mismatch.' }, { status: 400 });
    }

    // 4. Update the User's Tier and reset their Ad Cycle
    user.tier = Number(tierLevel); // Force it to be a number just in case

    // CRITICAL FIX: Calculate the 20-day expiration date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 20);
    user.tierExpiresAt = expiryDate;

    // CRITICAL FIX: Use the EXACT names from your Mongoose UserSchema
    user.dailyAdsWatched = 0;
    user.dailyLinksClicked = 0;
    user.completedAds = [];
    user.lastAdReset = new Date();

    await user.save(); // Now this will successfully save to the database!

    // 5. Log the Transaction
    await Transaction.create({
      userId: user._id,
      type: 'Deposit',
      wallet: 'System', // This matches the updated Transaction schema
      method: 'Paystack Upgrade',
      amount: paystackData.data.amount / 100,
      status: 'Success',
      reference: reference
    });

    return NextResponse.json({ success: true, message: 'Upgrade successful!' });

  } catch (error: any) {
    console.error("Upgrade Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}