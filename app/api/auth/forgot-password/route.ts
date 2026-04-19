/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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
      // Security best practice: Don't reveal if the email exists
      return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // 2. Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Hash the token and set expiration (15 minutes from now)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // 4. Create the reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    // 5. Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 6. Define the Email Template (Classic Enterprise Styling)
    const mailOptions = {
      from: `"SleepStream Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'SleepStream - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; background-color: #e9ecef;">
          <div style="background-color: #ffffff; border-top: 5px solid #337ab7; border-left: 1px solid #cccccc; border-right: 1px solid #cccccc; border-bottom: 1px solid #cccccc; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); padding: 30px;">
            <h2 style="color: #222222; margin-top: 0; margin-bottom: 5px; font-size: 24px;">Password Reset Request</h2>
            <p style="color: #555555; font-size: 14px; margin-top: 0; margin-bottom: 20px;">SleepStream Enterprise</p>
            
            <p style="color: #333333; line-height: 1.6; font-size: 15px;">Hello <strong>${user.username}</strong>,</p>
            <p style="color: #333333; line-height: 1.6; font-size: 15px;">We received a request to reset the password for your SleepStream account. Please click the button below to choose a new password.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetUrl}" style="background-color: #5cb85c; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; border: 1px solid #4cae4c; font-size: 16px;">Reset Password</a>
            </div>
            
            <p style="color: #777777; font-size: 13px; line-height: 1.5; background-color: #f9f9f9; padding: 10px; border: 1px solid #eeeeee; border-radius: 4px;">
              <strong>Note:</strong> This link is only valid for the next 15 minutes. If you did not request this reset, you can safely ignore this email. Your password will not change.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;" />
            <p style="color: #999999; font-size: 11px; text-align: center; margin: 0;">
              &copy; ${new Date().getFullYear()} SleepStream Enterprise. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    // 7. Send the Email
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    } catch (mailError) {
      console.error("Nodemailer Error:", mailError);

      // ROLLBACK: If email fails to send, remove the token so the user isn't locked out
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return NextResponse.json({ success: false, message: 'Server error: Email could not be sent. Please check SMTP configuration.' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}