import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction'; // Optional, but great for the wallet history

export async function POST(req: Request) {
  try {
    await connectDB();
    const { taskId, reward, type, title } = await req.json();

    // 1. Await the cookies() function (Next.js 15+ requirement)
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Safely decode the token looking for id or userId
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 401 });
    }

    // 3. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Verify Daily Limits before rewarding
    const dailyLimit = 20;
    const todayTasks = (user.adsWatchedToday || 0) + (user.linksClickedToday || 0);

    if (todayTasks >= dailyLimit) {
      return NextResponse.json({ success: false, message: 'Daily limit reached.' }, { status: 400 });
    }

    const earnedAmount = Number(reward);

    // 5. Update User Balance and Stats
    user.adsBalance = (user.adsBalance || 0) + earnedAmount;

    if (type === 'video') {
      user.adsWatchedToday = (user.adsWatchedToday || 0) + 1;
    } else {
      user.linksClickedToday = (user.linksClickedToday || 0) + 1;
    }

    await user.save();

    // 6. Log the transaction so it appears in their Wallet History
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
    console.error("Ad Completion Error:", error.message);
    // NextResponse.json will now work because it is properly imported at the top
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}