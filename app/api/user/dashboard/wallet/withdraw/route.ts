import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MIN_WITHDRAWAL = 15; // <--- Set limit here

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const { amount, method, destination, network } = await req.json();

    // 2. Validate Inputs
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }
    
    // --- NEW CHECK: Minimum Amount ---
    if (amount < MIN_WITHDRAWAL) {
      return NextResponse.json({ 
        success: false, 
        message: `Minimum withdrawal amount is $${MIN_WITHDRAWAL}` 
      }, { status: 400 });
    }

    if (!destination) {
      return NextResponse.json({ success: false, message: 'Destination details required' }, { status: 400 });
    }

    // 3. Check Balance
    const user = await User.findById(userId);
    if (user.balance < amount) {
      return NextResponse.json({ success: false, message: 'Insufficient funds' }, { status: 400 });
    }

    // 4. Deduct Balance Immediately (Locking funds)
    user.balance -= parseFloat(amount);
    await user.save();

    // 5. Create Pending Transaction
    await Transaction.create({
      userId,
      type: 'Withdrawal',
      amount,
      method,
      network: method === 'crypto' ? network : 'Bank Transfer',
      status: 'Pending', 
      description: `Withdrawal to ${destination}`,
      txHash: `REQ-${Date.now()}` 
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted. Awaiting Admin Approval.',
      newBalance: user.balance
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}