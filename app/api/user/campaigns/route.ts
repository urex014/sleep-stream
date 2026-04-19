import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Task from '@/models/Tasks'; // Ensure this matches your model name
import Transaction from '@/models/Transaction';

// GET: Fetch ads created by this user
export async function GET() {
  try {
    await connectDB();
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    // Fetch tasks where this user is the creator
    const campaigns = await Task.find({ creatorId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Verify Paystack & Save the Ad
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, url, type, duration, reference } = await req.json();

    if (!title || !url || !reference) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Authenticate the User
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId;

    // 2. Verify payment with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json({ success: false, message: 'Payment verification failed.' }, { status: 400 });
    }

    // Ensure they actually paid the 5000 Naira (500000 kobo)
    if (paystackData.data.amount < 500000) {
      return NextResponse.json({ success: false, message: 'Payment amount mismatch.' }, { status: 400 });
    }

    // 3. Create the Task (Pending Review)
    const newTask = await Task.create({
      title,
      type,
      url,
      duration: Number(duration),
      creatorId: userId,
      status: 'Pending Review' // Make sure admins review it before it goes live!
    });

    // 4. Log the Transaction in the accounting system
    await Transaction.create({
      userId: userId,
      type: 'Deposit',
      wallet: 'System', // Money goes to you, not their ad balance
      method: 'Ad Campaign Purchase',
      amount: 5000,
      status: 'Success',
      reference: reference
    });

    return NextResponse.json({ success: true, message: 'Ad submitted successfully!', task: newTask });
  } catch (error: any) {
    console.error("Ad Creation Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}