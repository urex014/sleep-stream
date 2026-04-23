import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { userId, lockAmount, lockDays } = await req.json();

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Validate request
    const amount = parseFloat(lockAmount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (user.adsBalance < amount) {
      return NextResponse.json({ error: "Insufficient Ads Balance" }, { status: 400 });
    }

    // Calculate the Lock Economics
    // Example: 14 days = 5% bonus, 30 days = 15% bonus
    let bonusPercentage = 0;
    if (lockDays === 14) bonusPercentage = 0.05;
    else if (lockDays === 30) bonusPercentage = 0.15;
    else return NextResponse.json({ error: "Invalid lock duration" }, { status: 400 });

    const bonusAmount = amount * bonusPercentage;
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + lockDays);

    // 1. Deduct from their active balance
    user.adsBalance -= amount;

    // 2. Add to their locked balances array
    user.lockedBalances.push({
      amount: amount,
      bonusAmount: bonusAmount,
      lockDate: new Date(),
      unlockDate: unlockDate,
      status: 'Active'
    });

    await user.save();

    // 3. Log the lock transaction (negative amount to show deduction from main wallet)
    await Transaction.create({
      userId: user._id,
      type: 'Deduction',
      wallet: 'Ads', 
      method: `Funds Locked (${lockDays} Days)`,
      amount: amount,
      status: 'Success',
      txHash: `lock_${user._id}_${Date.now()}`
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully locked ₦${amount}. You will receive ₦${amount + bonusAmount} on ${unlockDate.toLocaleDateString()}.` 
    }, { status: 200 });

  } catch (error) {
    console.error("Lock Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}