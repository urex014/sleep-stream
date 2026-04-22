import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // 1. Parse the incoming data from the Survey Provider
    // Providers like BitLabs usually send this as a URL-encoded string or JSON
    const body = await req.text();
    const data = JSON.parse(body);

    // Variables depend on the specific provider, but generally look like this:
    const { uid, val, tx_id, status } = data; 
    // uid = Your user's _id
    // val = The amount they earned (Payout)
    // tx_id = The unique transaction ID from the survey company
    // status = 'COMPLETE' (or similar)

    // --- SECURITY CHECK 1: IS IT ACTUALLY FROM THE PROVIDER? ---
    // Hackers will try to find this URL and send fake "success" messages.
    // Providers always send a "Signature" in the headers to prove it's really them.
    const signature = req.headers.get('X-Provider-Signature');
    
    // You recreate the hash using your Secret Key (provided by the survey network)
    const expectedSignature = crypto
      .createHmac('sha1', process.env.SURVEY_SECRET_KEY || '')
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error("ALERT: Fake webhook attempt blocked!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // --- SECURITY CHECK 2: PREVENT DOUBLE CREDITING ---
    // Check if you already processed this exact survey tx_id
    const existingTx = await Transaction.findOne({ txHash: tx_id });
    if (existingTx) {
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    // --- CREDIT THE USER ---
    if (status === 'COMPLETE') {
      const user = await User.findById(uid);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const earnedAmount = parseFloat(val); // The amount in Naira

      // Update their wallet
      user.adsBalance = (user.adsBalance || 0) + earnedAmount;
      await user.save();

      // Log it in your transaction history
      await Transaction.create({
        userId: user._id,
        type: 'Earning',
        wallet: 'Ads', // Keep it in the Ads wallet
        method: 'Survey Completed',
        amount: earnedAmount,
        status: 'Success',
        txHash: tx_id // Save their transaction ID to prevent double-spending
      });
    }

    // 4. ALWAYS return a 200 OK so the provider knows you received it
    return NextResponse.json({ status: "OK" }, { status: 200 });

  } catch (error) {
    console.error("Survey Webhook Error:", error);
    // Even on error, return 200 so the provider tries again later if needed
    return NextResponse.json({ status: "Error processing" }, { status: 200 }); 
  }
}