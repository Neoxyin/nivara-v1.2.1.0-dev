import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('nivara_session')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        name: 'Demo User', // We could fetch from StudentProfile but keeping it simple for Auth phase
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
