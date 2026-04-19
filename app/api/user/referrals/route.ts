import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // 1. Authenticate the User
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify Token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    // 3. Find the current user to get their unique referral code
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Find all users who used this person's code (Direct Referrals)
    const directReferrals = await User.find({ referredBy: currentUser.referralCode }).sort({ createdAt: -1 });

    // 5. Format the data to match your frontend table exactly
    const formattedHistory = directReferrals.map((ref) => {
      // Format the date nicely (e.g., "Apr 19, 2026")
      const dateJoined = new Date(ref.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return {
        id: ref._id.toString(),
        name: ref.username,
        date: dateJoined,
        status: 'Active',
        reward: 1800 // The Level 1 direct payout
      };
    });

    return NextResponse.json({ success: true, history: formattedHistory });

  } catch (error: any) {
    console.error("Referrals Fetch Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}