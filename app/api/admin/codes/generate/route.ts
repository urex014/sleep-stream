import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AccessCode from '@/models/AccessCode';

export async function POST(req: Request) {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Get quantity from request (default to 10 if not provided)
    const { amount } = await req.json();
    const quantity = amount || 10;

    const newCodes = [];

    // 3. Generate Codes Loop
    for (let i = 0; i < quantity; i++) {
      // Format: SLEEP-XXXX-XXXX (Random alphanumeric)
      const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const codeString = `SLEEP-${part1}-${part2}`;

      newCodes.push({
        code: codeString,
        status: 'Active',
        value: 5, // Default Value (Tier 0 cost)
        generatedBy: 'Admin'
      });
    }

    // 4. Bulk Insert into MongoDB (Much faster than saving one by one)
    await AccessCode.insertMany(newCodes);

    return NextResponse.json({ 
      success: true, 
      count: newCodes.length, 
      message: `${newCodes.length} codes generated successfully` 
    });

  } catch (error: any) {
    console.error("Code Generation Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}