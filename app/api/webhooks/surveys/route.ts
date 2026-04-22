import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import crypto from 'crypto';

// CPX Research Postbacks are usually GET requests
export async function GET(req: Request) {
  try {
    await connectDB();
    
    // 1. Grab the data from the CPX URL parameters
    const { searchParams } = new URL(req.url);
    
    const status = searchParams.get('status');
    const trans_id = searchParams.get('trans_id'); // CPX's unique transaction ID
    const ext_user_id = searchParams.get('ext_user_id'); // This is your user's database _id
    const amount_local = searchParams.get('amount_local'); // The payout in Naira
    const hash = searchParams.get('hash'); // The security hash CPX sends

    if (!trans_id || !ext_user_id || !amount_local || !hash) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // --- SECURITY CHECK: VERIFY IT IS ACTUALLY CPX ---
    // CPX creates their hash by combining the trans_id and your secret hash using MD5
    const secureHash = process.env.CPX_SECURE_HASH || '';
    const expectedHash = crypto
      .createHash('md5')
      .update(`${trans_id}-${secureHash}`)
      .digest('hex');

    // If the hashes don't match, a hacker is trying to fake a survey completion!
    if (hash !== expectedHash) {
      console.error("ALERT: Fake CPX webhook blocked!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // --- HANDLE THE MONEY (SUCCESS OR REVERSAL) ---
    const user = await User.findById(ext_user_id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const earnedAmount = parseFloat(amount_local);
    const existingTx = await Transaction.findOne({ txHash: trans_id });

    if (status === '1') {
      // 🟢 STATUS 1: SUCCESSFUL COMPLETION
      
      // Prevent Double Crediting: Check if we already paid them for this
      if (existingTx) {
        return NextResponse.json({ message: "Already processed" }, { status: 200 }); 
      }

      // Update their wallet
      user.adsBalance = (user.adsBalance || 0) + earnedAmount;
      await user.save();

      // Log it securely
      await Transaction.create({
        userId: user._id,
        type: 'Earning',
        wallet: 'Ads', 
        method: 'CPX Survey Completed',
        amount: earnedAmount,
        status: 'Success',
        txHash: trans_id
      });

    } else if (status === '2') {
      // 🔴 STATUS 2: CHARGEBACK / REVERSAL (The user cheated or got rejected)
      
      // Check if we already reversed it so we don't deduct twice
      if (existingTx && existingTx.status === 'Reversed') {
        return NextResponse.json({ message: "Already reversed" }, { status: 200 });
      }

      // Deduct the money from their wallet safely
      // Math.max(0, ...) ensures we never give the user a negative balance
      user.adsBalance = Math.max(0, (user.adsBalance || 0) - earnedAmount);
      await user.save();

      // Update the transaction log to show it was reversed
      if (existingTx) {
        existingTx.status = 'Reversed';
        await existingTx.save();
      } else {
        // If we somehow didn't have the original transaction, log the deduction anyway
        await Transaction.create({
          userId: user._id,
          type: 'Deduction',
          wallet: 'Ads', 
          method: 'CPX Survey Chargeback',
          amount: earnedAmount,
          status: 'Reversed',
          txHash: trans_id
        });
      }
    }

    // ALWAYS return a 200 OK so CPX knows the money was delivered/reversed
    return NextResponse.json({ status: "OK" }, { status: 200 });

  } catch (error) {
    console.error("CPX Webhook Error:", error);
    return NextResponse.json({ status: "Error processing" }, { status: 500 }); 
  }
}