/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Please provide an email' }, { status: 400 });
    }

    // 1. Find the user
    const user = await User.findOne({ email });

    if (!user) {
      // Security best practice: Don't reveal if the email exists or not to prevent enumeration
      return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // 2. Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Hash the token and set expiration (15 minutes from now)
    // Hashing it in the DB is safer in case your database is compromised
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // 4. Create the reset URL
    // Use your actual domain in production via environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    // 5. SEND THE EMAIL (Placeholder)
    // Here is where you would integrate Nodemailer, Resend, or SendGrid.
    // For now, we will log it to the console so you can click it during development.
    console.log(`\n\n--- PASSWORD RESET LINK FOR ${email} ---\n${resetUrl}\n---------------------------------------\n\n`);

    return NextResponse.json({ 
      success: true, 
      message: 'If that email exists, a reset link has been sent.' 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}