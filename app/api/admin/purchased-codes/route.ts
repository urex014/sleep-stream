import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AccessCode from '@/models/AccessCode';
import User from '@/models/User'; 

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10; 

    // Look for Sold codes
    const query: any = { status: 'Sold' };
    
    // --- UPGRADED SEARCH LOGIC ---
    // Now it searches Emails OR Codes OR Payment References!
    if (search) {
      query.$or = [
        { purchasedByEmail: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { purchasedByRef: { $regex: search, $options: 'i' } }
      ];
    }

    const totalRecords = await AccessCode.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    const codes = await AccessCode.find(query)
      .sort({ updatedAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Grab all the emails attached to these codes
    const emails = codes.map(c => c.purchasedByEmail).filter(Boolean);
    
    // --- BUG FIX: 'username' instead of 'name' ---
    const users = await User.find({ email: { $in: emails } }).select('email username').lean();
    
    const userMap: Record<string, string> = {};
    users.forEach((u: any) => { 
      // Map it using u.username!
      userMap[u.email] = u.username; 
    });

    // Combine the code data with the user's username
    const enrichedCodes = codes.map(c => ({
      ...c,
      userName: c.purchasedByEmail ? (userMap[c.purchasedByEmail] || 'Unknown User') : 'N/A'
    }));

    return NextResponse.json({
      success: true,
      data: enrichedCodes,
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages: totalPages === 0 ? 1 : totalPages,
      }
    });

  } catch (error: any) {
    console.error("Fetch Purchased Codes Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}