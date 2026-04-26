import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Task from '@/models/Tasks';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function requireAdmin() {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return {
      error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { role?: string; id?: string };
  if (decoded.role !== 'admin') {
    return {
      error: NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 }),
    };
  }

  return { decoded };
}

// GET: Fetch ALL ads for the admin panel
export async function GET() {
  try {
    await connectDB();

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    // Fetch all tasks, sorted by newest first. We use populate if you want to see who created it!
    const allCampaigns = await Task.find({}).sort({ createdAt: -1 }).populate('creatorId', 'username email');

    return NextResponse.json({ success: true, campaigns: allCampaigns });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Update the status of an ad (Approve/Reject)
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { taskId, newStatus } = await req.json();

    if (!taskId || !newStatus) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 });
    }

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    // Update the task status
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Ad marked as ${newStatus}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Approve all pending ads at once
export async function POST() {
  try {
    await connectDB();

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const result = await Task.updateMany(
      { status: 'Pending Review' },
      { $set: { status: 'Active' } }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} ads approved`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
