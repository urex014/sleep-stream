/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Authenticate User
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // 2. Get Request Data
    const { amount, method, network, txHash } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    if (method === 'crypto' && !txHash) {
      return NextResponse.json({ success: false, message: 'Transaction Hash is required' }, { status: 400 });
    }

    // 3. TRANSACTION HASH CHECK (Security)
    if (method === 'crypto') {
      const existingTx = await Transaction.findOne({ txHash });
      if (existingTx) {
        return NextResponse.json({ success: false, message: 'This transaction hash has already been used.' }, { status: 409 });
      }
    }

    // 4. Create Transaction Record (PENDING STATUS)
    await Transaction.create({
      userId,
      type: 'Deposit',
      amount,
      method,
      network: method === 'crypto' ? network : 'Bank Transfer',
      txHash: method === 'crypto' ? txHash : `BANK-${Date.now()}`,
      status: 'Pending', // <--- CHANGED FROM 'Success' TO 'Pending'
      description: `Deposit via ${network || 'Bank'}`
    });

    // 5. DO NOT UPDATE BALANCE YET
    // The balance update logic has been removed. It will now happen 
    // only when the Admin clicks "Approve".

    return NextResponse.json({
      success: true,
      message: 'Deposit submitted successfully! Awaiting Admin Confirmation.'
    });

  } catch (error: any) {
    // Check for Duplicate Key Error (MongoDB Code 11000)
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Duplicate Transaction Hash detected.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}