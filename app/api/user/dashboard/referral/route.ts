import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const BONUS_PER_REFERRAL = 1800; // Fixed at 1800 Naira

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    // 2. Get Current User
    const user = await User.findById(userId).select('referralCode referralBalance');
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // 3. Find Invitees (Look for the new schema fields)
    const referrals = await User.find({ referredBy: user._id }) // Depending on how you saved it, this might need to be user.referralCode
      .select('username createdAt adsBalance')
      .sort({ createdAt: -1 });

    // 4. Calculate Stats (An active user is someone who earned past their 2000 welcome bonus)
    const totalInvites = referrals.length;
    const activeReferrals = referrals.filter((r: any) => r.adsBalance > 2000).length;

    const stats = {
      totalEarned: user.referralBalance,
      totalInvites,
      activeReferrals,
      bonusPerReferral: BONUS_PER_REFERRAL
    };

    // 5. Format History List
    const history = referrals.map((ref: any) => {
      const isActive = ref.adsBalance > 2000;
      return {
        id: ref._id,
        name: ref.username,
        date: new Date(ref.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: isActive ? 'Active' : 'Pending',
        reward: isActive ? BONUS_PER_REFERRAL : 0
      };
    });

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