import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs'; // Assuming you use bcrypt to hash passwords!

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 1. Hash the token from the URL so it matches what we saved in the DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Find the user with this token, ensuring it hasn't expired
    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: { $gt: Date.now() }, // $gt means "greater than" right now
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Token is invalid or has expired." }, { status: 400 });
    }

    // 3. Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 4. Delete the tokens so they can't be used again!
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    
    await user.save();

    return NextResponse.json({ success: true, message: "Password successfully updated!" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}