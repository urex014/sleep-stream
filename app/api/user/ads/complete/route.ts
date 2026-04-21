/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

// GET: Fetch the user's completed ads for today
export async function GET() {
  try {
    await connectDB();
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false }, { status: 404 });

    // --- DAILY RESET LOGIC ---
    const now = new Date();
    const lastReset = new Date(user.lastAdReset || Date.now());

    if (now.toDateString() !== lastReset.toDateString()) {
      user.dailyAdsWatched = 0;   // FIXED SCHEMA NAME
      user.dailyLinksClicked = 0; // FIXED SCHEMA NAME
      user.lastAdReset = now;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      completedAds: user.completedAds || [],
      totalTasksToday: (user.dailyAdsWatched || 0) + (user.dailyLinksClicked || 0)
    });

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// POST: Securely verify and complete a task
export async function POST(req: Request) {
  try {
    await connectDB();

    // REMOVED `reward` from here. The frontend cannot be trusted with money.
    const { taskId, type, title } = await req.json();

    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // --- SECURITY CHECK 1: TIER EXPIRATION ---
    // If they bought a tier, make sure the 20 days haven't passed!
    if (user.tierExpiresAt && new Date() > new Date(user.tierExpiresAt)) {
      return NextResponse.json({
        success: false,
        message: 'Your current Tier package has expired. Please upgrade to continue earning.'
      }, { status: 403 });
    }

    // --- DAILY RESET LOGIC (Failsafe) ---
    const now = new Date();
    const lastReset = new Date(user.lastAdReset || Date.now());

    if (now.toDateString() !== lastReset.toDateString()) {
      user.dailyAdsWatched = 0;   // FIXED SCHEMA NAME
      user.dailyLinksClicked = 0; // FIXED SCHEMA NAME
      user.lastAdReset = now;
    }

    // --- SECURITY CHECK 2: HAS THIS AD BEEN CLAIMED? ---
    if (user.completedAds && user.completedAds.includes(taskId)) {
      return NextResponse.json({ success: false, message: 'You have already claimed this ad.' }, { status: 400 });
    }

    // --- SECURITY CHECK 3: DAILY LIMIT ---
    const dailyLimit = 20;
    const todayTasks = (user.dailyAdsWatched || 0) + (user.dailyLinksClicked || 0);

    if (todayTasks >= dailyLimit) {
      return NextResponse.json({ success: false, message: 'Daily limit reached.' }, { status: 400 });
    }

    // --- DYNAMIC TIER-BASED REWARD CALCULATION ---
    let earnedAmount = 0;
    switch (user.tier) {
      case 1: earnedAmount = 37.5; break; // Starter (750 total)
      case 2: earnedAmount = 93.75; break; // Pro (1875 total) ROI: 37500
      case 3: earnedAmount = 187.5; break; // Elite (3750 total) ROI: 75000
      case 4: earnedAmount = 300.0; break; // Master (6000 total) ROI: 120000
      case 5: earnedAmount = 375.0; break; // Grandmaster (7500 total) ROI: 150000
      default: earnedAmount = 37.5; // Fallback
    }

    // --- CREDIT USER ---
    user.adsBalance = (user.adsBalance || 0) + earnedAmount;

    // Add the taskId to the history array
    if (!user.completedAds) user.completedAds = [];
    user.completedAds.push(taskId);

    // Update the specific trackers
    if (type === 'video') {
      user.dailyAdsWatched = (user.dailyAdsWatched || 0) + 1;
    } else {
      user.dailyLinksClicked = (user.dailyLinksClicked || 0) + 1;
    }
    user.lastTaskDate = new Date();

    await user.save();

    // Log the transaction securely
    await Transaction.create({
      userId: user._id,
      type: 'Earning',
      wallet: 'Ads',
      method: `Task Completed: ${title}`,
      amount: earnedAmount,
      status: 'Success'
    });

    return NextResponse.json({ success: true, message: `₦${earnedAmount} credited successfully.` });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}