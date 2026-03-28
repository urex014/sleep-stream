import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

// The secret key provided by TimeWall in your publisher dashboard
const TIMEWALL_SECRET = process.env.TIMEWALL_SECRET || 'your_secret_key_here';

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming webhook payload from TimeWall
    const body = await req.json();

    // Typical TimeWall payload variables
    const {
      userId,        // The ID we passed in the iframe URL
      reward,        // The amount they earned
      campaign_id,   // Which ad they clicked
      signature      // Security hash
    } = body;

    // 2. SECURITY: Verify the signature
    // This ensures hackers aren't just sending fake requests to give themselves money.
    // TimeWall usually expects an MD5 or SHA256 hash of the payload + your secret.
    // (Check TimeWall's exact documentation for their hash formula)
    const expectedHash = crypto
      .createHash('md5')
      .update(`${userId}${campaign_id}${reward}${TIMEWALL_SECRET}`)
      .digest('hex');

    if (signature !== expectedHash) {
      console.error("TimeWall Webhook Security Failure: Invalid Signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // 3. Connect to DB and update the user
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert reward (often in USD or 'points') to your Naira rate.
    // Example: If TimeWall sends 100 points, and 1 point = 1 Naira
    const nairaReward = Number(reward);

    // Update Wallet
    user.adsBalance += nairaReward;
    user.dailyLinksClicked += 1;
    user.lastTaskDate = new Date();
    await user.save();

    // 4. Log the transaction for the user's history table
    await Transaction.create({
      userId: user._id,
      type: 'Earning',
      wallet: 'Ads',
      method: 'TimeWall Offer',
      amount: nairaReward,
      status: 'Success'
    });

    // 5. MUST return a 200 OK so TimeWall knows it succeeded
    return new NextResponse('OK', { status: 200 });

  } catch (error: any) {
    console.error("TimeWall Postback Error:", error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}