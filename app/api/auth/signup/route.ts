import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import AccessCode from '@/models/AccessCode';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFERRAL_BONUS = 1.50; // Amount to pay the referrer

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, email, password, accessCode, referralCode } = await req.json();

    // 1. Basic Validation
    if (!username || !email || !password || !accessCode) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 2. Verify Access Code
    const codeDoc = await AccessCode.findOne({ code: accessCode });
    if (!codeDoc) {
      return NextResponse.json({ success: false, message: 'Invalid Access Code' }, { status: 400 });
    }
    if (codeDoc.status === 'Used') {
      return NextResponse.json({ success: false, message: 'This Access Code has already been used' }, { status: 400 });
    }

    // 3. Check if User Exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email or Username already taken' }, { status: 400 });
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Generate Referral Code for New User
    const newRefCode = username.toLowerCase() + Math.floor(Math.random() * 1000);

    // 6. Create New User
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      tier: 0, 
      activeBot: true,
      referralCode: newRefCode,
      referredBy: referralCode || null,
      balance: 0,
      referralBalance: 0
    });

    // 7. Mark Access Code as Used
    codeDoc.status = 'Used';
    codeDoc.usedBy = newUser._id;
    await codeDoc.save();

    // pay referrer 
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode });
      
      if (referrer) {
        // Add bonus to their Referral Balance
        referrer.referralBalance = (referrer.referralBalance || 0) + REFERRAL_BONUS;
        
        // Optional: Also add to main balance if you want it immediately withdrawable
        // referrer.balance += REFERRAL_BONUS; 
        
        await referrer.save();
        console.log(`Paid $${REFERRAL_BONUS} to ${referrer.username} for referring ${username}`);
      }
    }

    // auto login 
    const tokenData = {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    };

    const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({
      success: true,
      message: 'Account created and logged in successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        balance: newUser.balance,
        tier: newUser.tier
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}