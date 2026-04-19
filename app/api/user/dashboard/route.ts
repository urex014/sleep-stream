import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

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
    if (!decoded || (!decoded.id && !decoded.userId)) {
      return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 });
    }

    const userId = decoded.id || decoded.userId;

    // 3. Fetch User Data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    let hasChanges = false;

    // 4A. Legacy Failsafe: Fix old accounts that don't have a tier
    if (!user.tier) {
      user.tier = 1;
      hasChanges = true;
    }

    // 4B. Daily Task Reset Logic
    const today = new Date().toDateString();
    const lastTaskDay = user.lastTaskDate ? new Date(user.lastTaskDate).toDateString() : null;

    if (lastTaskDay !== today) {
      user.dailyAdsWatched = 0;
      user.dailyLinksClicked = 0;
      hasChanges = true;
    }

    // Save if we reset the counters or fixed a legacy tier
    if (hasChanges) {
      await user.save();
    }

    // 5. Calculate Active Referrals
    const activeReferrals = await User.countDocuments({ referredBy: user.referralCode });
    // Note: I changed `user._id` to `user.referralCode` here assuming they sign up using the code!

    // 6. Return Payload for the PTC Dashboard
    return NextResponse.json({
      success: true,
      user: {
        name: user.username,
        email: user.email, // CRITICAL: Paystack needs this for the upgrade page
        tier: user.tier, // CRITICAL: Frontend needs this to know their rank
        tierExpiresAt: user.tierExpiresAt,
        adsBalance: user.adsBalance || 0,
        referralBalance: user.referralBalance || 0,
        adsWatchedToday: user.dailyAdsWatched || 0,
        linksClickedToday: user.dailyLinksClicked || 0,
        activeReferrals: activeReferrals,
        hasClaimedBonus: (user.adsBalance || 0) >= 2000
      }
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}