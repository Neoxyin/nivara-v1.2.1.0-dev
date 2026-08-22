import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { mockPreferences } from '@/lib/data/preferences';

// Mock in-memory storage for the development API route
let currentConsent = [...mockPreferences];

export async function GET(req: NextRequest) {
  // TODO (Phase 2): Add authentication check and fetch from real database
  // const session = await getSession();
  // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  return NextResponse.json(currentConsent);
}

export async function PATCH(req: NextRequest) {
  // TODO (Phase 2): Add authentication check and update real database
  try {
    const body = await req.json();
    currentConsent = body;
    return NextResponse.json(currentConsent);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
