import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const BONUS_PER_REFERRAL = 1800; // Configurable bonus amount

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // 2. Get Current User (The Referrer)
    const user = await User.findById(userId).select('referralCode referralBalance');
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // 3. Find Invitees (Users who used my code)
    // We select only necessary fields to protect privacy
    const referrals = await User.find({ referredBy: user.referralCode })
      .select('username createdAt activeBot tier')
      .sort({ createdAt: -1 });

    // 4. Calculate Stats
    const totalInvites = referrals.length;
    const activeReferrals = referrals.filter((r: any) => r.activeBot).length;
    
    // In a real app, you might track "lifetime earnings" separate from "current balance".
    // For MVP, we'll assume the wallet balance reflects earnings.
    const stats = {
      totalEarned: user.referralBalance, 
      totalInvites,
      activeReferrals,
      bonusPerReferral: BONUS_PER_REFERRAL
    };

    // 5. Format History List
    const history = referrals.map((ref: any) => ({
      id: ref._id,
      name: ref.username,
      date: new Date(ref.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: ref.activeBot ? 'Active' : 'Pending',
      // If they are active, i assume the bonus was paid.
      reward: ref.activeBot ? BONUS_PER_REFERRAL : 0 
    }));

    return NextResponse.json({
      success: true,
      referralCode: user.referralCode,
      stats,
      history
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}