import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Get Token from Cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify Token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 });
    }

    // 3. Fetch User Data
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Calculate Derived Data (Mock logic for now, usually stored in a Transaction model)
    // In a real app, you'd calculate daysRunning based on "activeBotStartDate"
    const botData = {
      daysRunning: user.activeBot ? 4 : 0, // Placeholder
      daysTotal: 10,
      dailyProfit: user.tier === 0 ? 0.75 : user.tier * 2.5, // Logic based on tier
      deposit: user.tier === 0 ? 5.00 : user.tier * 50 // Logic based on tier
    };

    return NextResponse.json({
      success: true,
      user: {
        name: user.username,
        tier: `Tier ${user.tier} (${user.tier === 0 ? 'Free' : 'Paid'})`,
        deposit: botData.deposit,
        dailyProfit: botData.dailyProfit,
        totalBalance: user.balance,
        daysRunning: botData.daysRunning,
        daysTotal: botData.daysTotal,
        referralEarnings: user.referralBalance
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}