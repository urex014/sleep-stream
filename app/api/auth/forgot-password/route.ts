import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Security tip: Always return "success" even if the email doesn't exist.
      // This prevents hackers from using your form to guess which emails are registered.
      return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
    }

    // 1. Generate a random secure token
    const unhashedToken = crypto.randomBytes(32).toString('hex');
    
    // 2. Hash it before saving to the database (for security if your DB leaks)
    const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');

    // 3. Save to database with a 1-hour expiration
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // 4. Send the Email
    // Note: You need to set these environment variables using Resend, SendGrid, etc.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, 
      port: Number(process.env.SMTP_PORT),
      secure:true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${unhashedToken}`;

    await transporter.sendMail({
      from: '"SleepStream" <support@sleepstream.com.ng>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Reset Your Password</h2>
        <p>You requested a password reset. Click the link below to choose a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Reset link sent to your email." });

  } catch (error) {
    console.log("there was an error")
    console.error("SMTP ERROR DETAILS:", error); 
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}