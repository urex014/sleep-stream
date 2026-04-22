import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Default to today's date if the admin doesn't provide one
    const today = new Date().toISOString().split('T')[0]; 
    const startDate = searchParams.get('start') || today;
    const endDate = searchParams.get('end') || today;
    
    const apiKey = process.env.SURVEY_SERVER_KEY;

    // 1. Fetch the Successful Completes (The big money)
    const completesRes = await fetch(
      `https://publisher.cpx-research.com/index.php?page=api-statistics-completes&start_time=${startDate}&end_time=${endDate}&api_key=${apiKey}`
    );
    const completesData = await completesRes.json();

    // 2. Fetch the Screen-outs (The smaller compensation)
    const screenoutsRes = await fetch(
      `https://publisher.cpx-research.com/index.php?page=api-statistics-outs&start_time=${startDate}&end_time=${endDate}&api_key=${apiKey}`
    );
    const screenoutsData = await screenoutsRes.json();

    // 3. Combine them into one clean dashboard response
    return NextResponse.json({
      success: true,
      dateRange: { startDate, endDate },
      stats: {
        completes: completesData,
        screenouts: screenoutsData
      }
    });

  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}