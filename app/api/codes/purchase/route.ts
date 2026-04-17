import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AccessCode from '@/models/AccessCode';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { reference, email } = await req.json();

    if (!reference || !email) {
      return NextResponse.json({ success: false, message: 'Invalid payment details' }, { status: 400 });
    }

    // Find ONE 'Active' code, and immediately reserve it by marking it as 'Sold'
    const availableCode = await AccessCode.findOneAndUpdate(
      { status: 'Active' },
      { status: 'Sold' }, // <-- Changed to 'Sold'
      { new: true }
    );

    if (!availableCode) {
      return NextResponse.json({
        success: false,
        message: 'No activation codes currently available. Please contact support for a refund.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      code: availableCode.code
    });

  } catch (error: any) {
    console.error("Purchase Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}