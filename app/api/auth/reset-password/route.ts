import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // 1. Recreate the hash from the URL token to match what's in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Find the user with this token AND ensure it hasn't expired yet
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Expiration must be greater than current time
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired reset token' }, { status: 400 });
    }

    // 3. Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Clear the reset token fields so they can't be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });

  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}