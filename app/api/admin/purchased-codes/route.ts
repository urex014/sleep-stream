import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AccessCode from '@/models/AccessCode';
import User from '@/models/User'; // Pulling in the User model to get their name

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // 1. Grab search and pagination from the URL (e.g., ?page=2&search=john)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10; // Show 10 records per page

    // 2. Build the query (Only look for Sold codes)
    const query: any = { status: 'Sold' };
    
    // If an admin typed a search, filter by email
    if (search) {
      query.purchasedByEmail = { $regex: search, $options: 'i' }; // 'i' makes it case-insensitive
    }

    // 3. Count total documents (needed for frontend pagination math)
    const totalRecords = await AccessCode.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    // 4. Fetch the specific page of codes
    const codes = await AccessCode.find(query)
      .sort({ updatedAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 5. Bonus: Get the User's Name
    // The AccessCode only has the email. Let's quickly match those emails to their Names in the User DB.
    const emails = codes.map(c => c.purchasedByEmail).filter(Boolean);
    const users = await User.find({ email: { $in: emails } }).select('email name').lean();
    
    // Create a dictionary for instant name lookups
    const userMap: Record<string, string> = {};
    users.forEach((u: any) => { userMap[u.email] = u.name; });

    // Combine the code data with the user's name
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