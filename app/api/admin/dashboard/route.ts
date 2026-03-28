aimport { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Admin Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    // 2. Fetch High-Level Stats
    
    // A. Total Users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // B. Total Money In (Sum of Successful Deposits)
    const moneyInAgg = await Transaction.aggregate([
      { $match: { type: 'Deposit', status: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalMoneyIn = moneyInAgg.length > 0 ? moneyInAgg[0].total : 0;

    // C. Pending Withdrawals Count
    const pendingCount = await Transaction.countDocuments({ type: 'Withdrawal', status: 'Pending' });

    // 3. Fetch Recent Pending Withdrawals (For the Table)
    const recentWithdrawals = await Transaction.find({ type: 'Withdrawal', status: 'Pending' })
      .sort({ createdAt: -1 }) // Newest first
      .limit(5)
      .populate('userId', 'username'); // Get the username

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalMoneyIn,
        pendingCount
      },
      recentWithdrawals
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}