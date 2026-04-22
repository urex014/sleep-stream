import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // 1. Get the transaction ID from the URL (e.g., ?txId=123456)
    const { searchParams } = new URL(req.url);
    const txId = searchParams.get('txId');

    if (!txId) {
      return NextResponse.json({ success: false, message: 'Transaction ID is required' }, { status: 400 });
    }

    const apiKey = process.env.SURVEY_SERVER_KEY; // Your Secure Server Key

    // 2. Fetch the true status from CPX Research
    const cpxUrl = `https://publisher.cpx-research.com/index.php?page=api-check-transaction-id&transaction_id=${txId}&api_key=${apiKey}`;
    
    const response = await fetch(cpxUrl);
    const data = await response.json();

    // 3. Return the exact status to your admin dashboard
    return NextResponse.json({
      success: true,
      data: data // This will tell you if the status is 1 (Success), 2 (Screenout), etc.
    });

  } catch (error) {
    console.error("Validation Error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}