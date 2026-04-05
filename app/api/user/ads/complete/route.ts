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
    // --- DAILY RESET LOGIC ---
    const now = new Date();
    const lastReset = new Date(user.lastAdReset || Date.now());

    if (now.toDateString() !== lastReset.toDateString()) {
      user.adsWatchedToday = 0;
      user.linksClickedToday = 0;
      // user.completedAds = []; <-- REMOVED THIS LINE!
      user.lastAdReset = now;
      await user.save(); // Don't forget to save the reset state
      // (Make sure `await user.save();` is still here in the GET route)
    }

    return NextResponse.json({
      success: true,
      completedAds: user.completedAds || [],
      totalTasksToday: (user.adsWatchedToday || 0) + (user.linksClickedToday || 0)
    });

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 
// POST: Securely verify and complete a task
export async function POST(req: Request) {
  try {
    await connectDB();
    const { taskId, reward, type, title } = await req.json();

    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // --- DAILY RESET LOGIC (Failsafe) ---
    const now = new Date();
    const lastReset = new Date(user.lastAdReset || Date.now());

    if (now.toDateString() !== lastReset.toDateString()) {
      user.adsWatchedToday = 0;
      user.linksClickedToday = 0;
      // CRITICAL FIX: Removed user.completedAds = []; from here!
      user.lastAdReset = now;
    }

    // --- SECURITY CHECK: HAS THIS AD BEEN CLAIMED? ---
    if (user.completedAds && user.completedAds.includes(taskId)) {
      // Updated message to reflect permanent status
      return NextResponse.json({ success: false, message: 'You have already claimed this ad.' }, { status: 400 }); 
    }

    // --- SECURITY CHECK: DAILY LIMIT ---
    const dailyLimit = 20;
    const todayTasks = (user.adsWatchedToday || 0) + (user.linksClickedToday || 0);

    if (todayTasks >= dailyLimit) {
      return NextResponse.json({ success: false, message: 'Daily limit reached.' }, { status: 400 });
    }

    // --- CREDIT USER ---
    const earnedAmount = Number(reward);
    user.adsBalance = (user.adsBalance || 0) + earnedAmount;

    // Add the taskId to the history array so they can't click it again
    if (!user.completedAds) user.completedAds = [];
    user.completedAds.push(taskId);

    if (type === 'video') {
      user.adsWatchedToday = (user.adsWatchedToday || 0) + 1;
    } else {
      user.linksClickedToday = (user.linksClickedToday || 0) + 1;
    }

    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'Earning',
      wallet: 'Ads',
      method: `Task Completed: ${title}`,
      amount: earnedAmount,
      status: 'Success'
    });

    return NextResponse.json({ success: true, message: 'Reward credited successfully.' });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}