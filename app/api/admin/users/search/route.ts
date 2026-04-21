import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// --- LEVENSHTEIN DISTANCE ALGORITHM ---
// This calculates the mathematical "distance" (number of typos) between two strings.
// A distance of 0 means a perfect match. 
function getDistance(a: string, b: string): number {
  if (!a) return b.length;
  if (!b) return a.length;
  
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || '';
    const username = searchParams.get('username') || '';

    if (!email && !username) {
      return NextResponse.json({ success: false, message: 'Please provide a search term.' }, { status: 400 });
    }

    const query: any = { $or: [] };

    // 1. CAST A WIDER NET IN MONGODB
    // Instead of forcing an exact regex, we grab the first 3 characters of the search term.
    // This allows us to fetch users even if the end of their email/name has a typo.
    if (email) {
      const emailPrefix = email.length > 3 ? email.substring(0, 3) : email;
      query.$or.push({ email: { $regex: emailPrefix, $options: 'i' } });
    }
    
    if (username) {
      const userPrefix = username.length > 3 ? username.substring(0, 3) : username;
      query.$or.push({ username: { $regex: userPrefix, $options: 'i' } });
    }

    // Fetch up to 50 "potential" candidates to run our typo-checker on
    const candidates = await User.find(query).select('-password').limit(50).lean();

    // 2. SCORE AND SORT THE CANDIDATES
    // We map through the results, calculate how close they are to the ORIGINAL search term, and sort them.
    const scoredUsers = candidates.map((user: any) => {
      let score = Infinity;
      
      if (email) {
        score = Math.min(score, getDistance(email, user.email));
      }
      if (username) {
        score = Math.min(score, getDistance(username, user.username));
      }
      
      return { ...user, matchScore: score };
    });

    // Sort ascending by score (0 is a perfect match, 1 means one typo, etc.)
    scoredUsers.sort((a, b) => a.matchScore - b.matchScore);

    // Return only the top 10 absolute closest matches
    const finalUsers = scoredUsers.slice(0, 10).map((user) => {
      // Remove the score before sending to frontend to keep the payload clean
      const { matchScore, ...cleanUser } = user;
      return cleanUser;
    });

    return NextResponse.json({ success: true, users: finalUsers });

  } catch (error: any) {
    console.error("User Search Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}