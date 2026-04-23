import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

// The reward logic: Base reward is ₦10, but goes up by ₦5 every consecutive day (max ₦50/day)
const calculateReward = (streak: number) => {
  const reward = 10 + (streak * 5);
  return Math.min(reward, 50); // Cap it at 50 Naira per day
};

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // NOTE: Replace this with your actual auth extraction (e.g., checking the session/token)
    const { userId } = await req.json(); 

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date();
    // Normalize to midnight UTC to prevent timezone exploits
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    let lastCheckIn = null;
    if (user.lastCheckInDate) {
      const lastDate = new Date(user.lastCheckInDate);
      lastCheckIn = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()));
    }

    // 1. Check if they already claimed today
    if (lastCheckIn && lastCheckIn.getTime() === today.getTime()) {
      return NextResponse.json({ error: "Already claimed today! Come back tomorrow." }, { status: 400 });
    }

    // 2. Check if the streak is broken (difference is more than 1 day)
    let newStreak = user.currentStreak || 0;
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastCheckIn && (today.getTime() - lastCheckIn.getTime()) > oneDay) {
      // Streak broken, reset to 0
      newStreak = 0;
    }

    // 3. Increase streak and calculate reward
    newStreak += 1;
    const rewardAmount = calculateReward(newStreak);

    // 4. Update User Profile
    user.currentStreak = newStreak;
    user.lastCheckInDate = today;
    user.adsBalance = (user.adsBalance || 0) + rewardAmount;
    
    await user.save();

    // 5. Log the Transaction
    await Transaction.create({
      userId: user._id,
      type: 'Earning',
      wallet: 'Ads', 
      method: `Daily Check-in (Day ${newStreak})`,
      amount: rewardAmount,
      status: 'Success',
      txHash: `checkin_${user._id}_${today.getTime()}`
    });

    return NextResponse.json({ 
      success: true, 
      reward: rewardAmount, 
      streak: newStreak,
      message: `Claimed ₦${rewardAmount}! You are on a ${newStreak}-day streak.`
    }, { status: 200 });

  } catch (error) {
    console.error("Check-in Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}