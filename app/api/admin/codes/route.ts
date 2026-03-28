import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AccessCode from '@/models/AccessCode';

export async function GET() {
  try {
    await connectDB();
    // Fetch latest 50 codes sorted by newest first
    const codes = await AccessCode.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}