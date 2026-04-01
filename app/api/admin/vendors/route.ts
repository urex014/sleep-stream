import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/models/Vendor';

// GET: Fetch ALL vendors for the admin table (including unverified ones)
export async function GET() {
  try {
    await connectDB();
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Add a new vendor
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // If the frontend sends a comma-separated string, convert it to an array
    if (typeof body.methods === 'string') {
      body.methods = body.methods.split(',').map((m: string) => m.trim()).filter(Boolean);
    }

    const newVendor = await Vendor.create(body);
    return NextResponse.json({ success: true, message: 'Vendor added successfully!', vendor: newVendor });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Remove a vendor
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) return NextResponse.json({ success: false, message: 'Vendor ID is required' }, { status: 400 });

    await Vendor.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Vendor removed successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}