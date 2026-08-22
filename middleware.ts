import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This middleware enforces centralized Route-Based Access Control (RBAC)
// It checks for a session cookie which will be set by the real backend
// (or our development mock adapter).

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the auth cookie. In mock mode, this is set by lib/api/client.ts
  // In production, this will be your HttpOnly JWT cookie.
  const authCookie = request.cookies.get('nivara_session');
  let role: string | null = null;
  let isAuthenticated = false;

  if (authCookie) {
    try {
      // First try standard JSON parse (for mock adapter)
      const payload = JSON.parse(decodeURIComponent(authCookie.value));
      role = payload.role;
      isAuthenticated = true;
    } catch (e) {
      // If it's not JSON, assume it's a real JWT
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
        const { payload } = await jwtVerify(authCookie.value, secret);
        role = payload.role as string;
        isAuthenticated = true;
      } catch (jwtError) {
        // Invalid JWT
      }
    }
  }

  // 1. Unauthenticated users trying to access protected routes -> login
  const isCounsellorRoute = pathname === '/counsellor' || pathname.startsWith('/counsellor/');
  const isStudentRoute = pathname.startsWith('/dashboard') || 
                         pathname.startsWith('/profile') ||
                         pathname.startsWith('/resources') ||
                         pathname.startsWith('/counsellors') ||
                         pathname.startsWith('/check-in') ||
                         pathname.startsWith('/student') ||
                         pathname.startsWith('/academics') ||
                         pathname.startsWith('/support') ||
                         pathname.startsWith('/settings');
  const isAdminRoute = pathname.startsWith('/admin');

  const isProtected = isCounsellorRoute || isStudentRoute || isAdminRoute;

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Role-Based Access Control (RBAC)
  if (isAuthenticated && role) {
    // Normalize role to lowercase for matching, though backend payload should use uppercase
    const normalizedRole = role.toLowerCase();

    // Counsellor routes
    if (isCounsellorRoute) {
      if (normalizedRole !== 'counsellor' && normalizedRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Student routes
    if (isStudentRoute) {
      if (normalizedRole !== 'student') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Admin routes
    if (isAdminRoute) {
      if (normalizedRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    
    // If authenticated user is on the landing page, redirect to their portal
    if (pathname === '/' || pathname === '/login') {
      if (normalizedRole === 'student') return NextResponse.redirect(new URL('/dashboard', request.url));
      if (normalizedRole === 'counsellor') return NextResponse.redirect(new URL('/counsellor/overview', request.url));
      if (normalizedRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
