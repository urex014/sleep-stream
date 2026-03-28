import { NextResponse } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { taskId, reward, type, title } = await req.json(); // type is 'video' or 'link'

    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    const user = await User.findById(decoded.userId);

    // 1. Check daily limits (e.g., max 20 tasks per day)
    const totalTasksToday = user.dailyAdsWatched + user.dailyLinksClicked;
    if (totalTasksToday >= 20) {
      return NextResponse.json({ success: false, message: 'Daily limit reached.' }, { status: 400 });
    }

    // 2. Increment Balance & Counters
    user.adsBalance += Number(reward);
    if (type === 'video') user.dailyAdsWatched += 1;
    if (type === 'link') user.dailyLinksClicked += 1;
    user.lastTaskDate = new Date();
    await user.save();

    // 3. Log the Earning Transaction
    await Transaction.create({
      userId: user._id,
      type: 'Earning',
      wallet: 'Ads',
      method: title || (type === 'video' ? 'Video Ad' : 'PTC Link'),
      amount: Number(reward),
      status: 'Success'
    });

    return NextResponse.json({ success: true, message: `₦${reward} credited successfully!` });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}