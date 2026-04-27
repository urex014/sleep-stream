import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    // 2. Decode Token (Handling both id and userId just in case)
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 401 });
    }

    // 3. Fetch User
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Pagination Setup
    // Extract page and limit from the URL (e.g., /api/user/wallet?page=2&limit=20)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    let history = [];
    let totalTransactions = 0;
    let lockedAmount = 0;

    try {
      // 5. Run Database Queries in Parallel for Maximum Speed
      const [fetchedHistory, totalCount, pendingAggregation] = await Promise.all([
        // Get the specific page of transactions
        Transaction.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        
        // Count total transactions for pagination math
        Transaction.countDocuments({ userId: user._id }),

        // Safely sum all pending withdrawals across the entire database
        Transaction.aggregate([
          { $match: { userId: user._id, type: 'Withdrawal', status: 'Pending' } },
          { $group: { _id: null, totalLocked: { $sum: '$amount' } } }
        ])
      ]);

      history = fetchedHistory;
      totalTransactions = totalCount;
      lockedAmount = pendingAggregation[0]?.totalLocked || 0;

    } catch (txError) {
      console.log("Transaction fetch skipped or failed. Did you create the model?");
    }

    // 6. Calculate Pagination Metadata
    const totalPages = Math.ceil(totalTransactions / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // 7. Calculate Wallet Totals
    const totalBalance = (user.adsBalance || 0) + (user.referralBalance || 0);

    // 8. Return Payload
    return NextResponse.json({
      success: true,
      wallet: {
        total: totalBalance,
        available: totalBalance - lockedAmount,
        locked: lockedAmount,
        adsBalance: user.adsBalance || 0,
        referralBalance: user.referralBalance || 0
      },
      history,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error: any) {
    console.error("Wallet API Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}