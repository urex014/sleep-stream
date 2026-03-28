import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Make sure this matches your actual db import path
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

    // Support both decoded.id and decoded.userId depending on how you signed the JWT during login
    const userId = decoded.id || decoded.userId;

    // 3. Fetch User Data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Daily Task Reset Logic
    // If the last time they did a task wasn't today, reset their daily counters to 0.
    const today = new Date().toDateString();
    const lastTaskDay = user.lastTaskDate ? new Date(user.lastTaskDate).toDateString() : null;

    let hasChanges = false;
    if (lastTaskDay !== today) {
      user.dailyAdsWatched = 0;
      user.dailyLinksClicked = 0;
      hasChanges = true;
    }

    // Save if we reset the counters
    if (hasChanges) {
      await user.save();
    }

    // 5. Calculate Active Referrals
    // Count how many users signed up using this user's referral code.
    // (Optional: You can add a condition like { adsBalance: { $gt: 2000 } } to only count "active" users who actually clicked an ad)
    const activeReferrals = await User.countDocuments({ referredBy: user._id });

    // 6. Return Payload for the PTC Dashboard
    return NextResponse.json({
      success: true,
      user: {
        name: user.username,
        adsBalance: user.adsBalance || 0,
        referralBalance: user.referralBalance || 0,
        adsWatchedToday: user.dailyAdsWatched || 0,
        linksClickedToday: user.dailyLinksClicked || 0,
        activeReferrals: activeReferrals,
        // If they have 2000 or more in their ads balance, they've received the default sign-up bonus
        hasClaimedBonus: (user.adsBalance || 0) >= 2000
      }
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    // Handle JWT expiration specifically to tell the frontend to redirect to login
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}