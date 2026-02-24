/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Verify User
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('tier activeBot createdAt');

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 2. Generate Active Bot Data
    const activeBots = [];

    if (user.activeBot) {
      // Calculate days running based on account creation (Mock Logic)
      const startDate = new Date(user.botActivatedAt || user.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      // Cap at 10 days for the cycle
      const currentDay = diffDays > 10 ? 10 : diffDays; 

      // Tier Data Map
      const tierData: any = {
        0: { price: 5, daily: 0.75 },
        1: { price: 10, daily: 1.50 },
        2: { price: 40, daily: 6.00 },
        3: { price: 80, daily: 12.00 },
        4: { price: 120, daily: 18.00 },
      };

      const currentTier = tierData[user.tier] || tierData[0];

      activeBots.push({
        id: 1, // Single bot for now
        tier: `Tier ${user.tier} (${user.tier === 0 ? 'Free' : 'Premium'})`,
        price: currentTier.price,
        startDate: startDate.toLocaleDateString('en-CA'), // YYYY-MM-DD
        currentDay: currentDay,
        totalDays: 10,
        dailyEarn: currentTier.daily,
        totalEarnedSoFar: currentTier.daily * currentDay,
        status: 'active'
      });
    }

    return NextResponse.json({ success: true, bots: activeBots });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}