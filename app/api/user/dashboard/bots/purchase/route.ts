import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction'; // Added for logging the purchase
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define Pricing Source of Truth (Backend)
const TIER_PRICES: Record<number, number> = {
  1: 10,
  2: 40,
  3: 80,
  4: 120
};

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Verify Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // 2. Get Request Data
    const { tierId } = await req.json();

    // Validate Tier
    if (!TIER_PRICES[tierId]) {
      return NextResponse.json({ success: false, message: 'Invalid Tier selected' }, { status: 400 });
    }

    const price = TIER_PRICES[tierId];

    // 3. Fetch User (with Wallet Balance)
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Check Business Logic
    
    // Check A: STRICT BOT CHECK - Prevent purchase if ANY bot is running
    if (user.activeBot) {
      return NextResponse.json({ 
        success: false, 
        message: 'You already have an active bot running. Please wait for its cycle to complete.' 
      }, { status: 400 });
    }

    // Check B: Insufficient Funds
    if (user.balance < price) {
      return NextResponse.json({ 
        success: false, 
        message: `Insufficient balance. You need $${(price - user.balance).toFixed(2)} more.` 
      }, { status: 400 });
    }

    // 5. PROCESS TRANSACTION
    
    // Deduct Balance
    user.balance -= price;
    
    // Update Bot Status
    user.tier = tierId;
    user.activeBot = true;
    
    // Reset cycle start date so the 10-day countdown starts today
    // (Make sure to add `botActivatedAt: { type: Date }` to your User model!)
    user.botActivatedAt = new Date(); 

    await user.save();

    // 6. Log the Transaction (Optional but highly recommended for accounting)
    await Transaction.create({
      userId: user._id,
      type: 'Bot Purchase',
      amount: price,
      method: 'Wallet Balance',
      status: 'Success',
      description: `Purchased Tier ${tierId} Bot`
    });

    return NextResponse.json({
      success: true,
      message: `Successfully activated Tier ${tierId} Bot!`,
      newBalance: user.balance,
      tier: user.tier
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}