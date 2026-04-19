import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, description, returnUrl } = await req.json();

    // Generate a unique Order ID for this transaction
    const orderId = `AD_FEE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Call NowPayments to create an invoice
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amount, // e.g., 5000
        price_currency: 'NGN', // NowPayments will auto-convert NGN to whatever crypto they choose
        order_id: orderId,
        order_description: description,
        // Where to send the user after they pay (or cancel)
        success_url: `${returnUrl}?status=success&orderId=${orderId}`,
        cancel_url: `${returnUrl}?status=cancelled`,
      }),
    });

    const data = await response.json();

    if (data.invoice_url) {
      return NextResponse.json({ success: true, url: data.invoice_url, orderId });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to create crypto invoice' });
    }
  } catch (error) {
    console.error("NowPayments Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}