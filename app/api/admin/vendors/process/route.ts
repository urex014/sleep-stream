import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import VendorRequest from '@/models/VendorRequest';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    // Add your admin auth check here!
    
    const { requestId, action } = await req.json(); // action is 'Approve' or 'Reject'

    const vendorReq = await VendorRequest.findById(requestId);
    if (!vendorReq) return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });

    if (action === 'Approve') {
      vendorReq.status = 'Approved';
      // Upgrade the user
      await User.findByIdAndUpdate(vendorReq.userId, { isVendor: true });
    } else {
      vendorReq.status = 'Rejected';
    }

    await vendorReq.save();

    return NextResponse.json({ success: true, message: `Application ${action}d successfully.` });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}