import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AccessCode from '@/models/AccessCode';
import { sendPurchaseEmail } from '@/lib/email'; // Add your new email helper here!

export async function POST(req: Request) {
  try {
    await connectDB();
    const { reference, email } = await req.json();

    if (!reference || !email) {
      return NextResponse.json({ success: false, message: 'Invalid payment details' }, { status: 400 });
    }

    // --- 1. THE SECURITY CHECK: Verify Payment with Paystack ---
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        // ALWAYS use your Secret Key here, never your Public Key!
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 
        'Cache-Control': 'no-cache',
      },
    });
    
    const verifyData = await verifyRes.json();

    // Check if the API call succeeded AND if the transaction status is 'success'
    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.json({ 
        success: false, 
        message: 'Payment verification failed. If you were charged, contact support.' 
      }, { status: 400 });
    }
    // --- END SECURITY CHECK ---


    // --- 2. PREVENT DOUBLE-SPENDING (Optional but Recommended) ---
    // Make sure no one uses the same successful reference twice to get two codes
    const alreadyUsed = await AccessCode.findOne({ purchasedByRef: reference });
    if (alreadyUsed) {
       return NextResponse.json({ success: false, message: 'This payment reference has already been claimed.' }, { status: 400 });
    }


    // --- 3. FETCH AND RESERVE THE CODE ---
    // Find ONE 'Active' code, and immediately reserve it
    const availableCode = await AccessCode.findOneAndUpdate(
      { status: 'Active' },
      { 
        status: 'Sold',
        purchasedByEmail: email, // Good practice to track who bought it
        purchasedByRef: reference // Save the ref so it can't be used again
      }, 
      { new: true }
    );

    if (!availableCode) {
      return NextResponse.json({
        success: false,
        message: 'No activation codes currently available. Please contact support.'
      }, { status: 404 });
    }

    // --- 4. FIRE THE BACKUP EMAIL 🚀 ---
    // Notice there is no 'await' here. The email sends in the background!
    await sendPurchaseEmail(email, availableCode.code, "Sleepstream Access Code");

    // --- 5. SEND SUCCESS TO USER ---
    return NextResponse.json({
      success: true,
      code: availableCode.code
    });

  } catch (error: any) {
    console.error("Purchase Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}