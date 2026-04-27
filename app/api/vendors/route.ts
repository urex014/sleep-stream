//add and fetch vendors for the vendor page


import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/models/Vendor';

// GET: Fetch verified vendors with pagination and search filtering
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6'); // 6 per page fits the 3-column grid perfectly
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build the query
    const query: any = { verified: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { methods: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination metadata
    const total = await Vendor.countDocuments(query);

    // Fetch the specific page chunk
    const vendors = await Vendor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      vendors,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Quick route to add vendors
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newVendor = await Vendor.create(body);
    return NextResponse.json({ success: true, message: 'Vendor added', vendor: newVendor });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}