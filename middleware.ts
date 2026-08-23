import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Frontend-only demo session guard. Authentication state is represented by the
 * lightweight nivara_session cookie created by the client-side mock auth flow.
 * No backend, database, JWT, or external auth service is involved.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const authCookie = request.cookies.get('nivara_session')?.value;
  let role: string | null = null;

  if (authCookie) {
    try {
      let rawValue = authCookie;
      if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
        rawValue = rawValue.slice(1, -1);
      }
      const parsed = JSON.parse(decodeURIComponent(rawValue));
      if (parsed && typeof parsed === 'object' && typeof parsed.role === 'string') {
        role = parsed.role.toLowerCase();
      }
    } catch {
      role = null;
    }
  }

  // Decommission the old standalone login page. Preserve old URLs by routing
  // them into the existing role-specific login modal flow on the landing page.
  if (pathname === '/login') {
    const requestedRole = searchParams.get('role');
    const role = requestedRole === 'student' || requestedRole === 'counsellor' ? requestedRole : null;
    const url = new URL('/', request.url);
    url.searchParams.set('auth', 'required');
    if (role) url.searchParams.set('role', role);
    return NextResponse.redirect(url);
  }

  const isCounsellorRoute = pathname === '/counsellor' || pathname.startsWith('/counsellor/');
  const isStudentRoute =
    pathname.startsWith('/dashboard') ||
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

  if (isProtected && !role) {
    const url = new URL('/', request.url);
    url.searchParams.set('auth', 'required');
    if (isCounsellorRoute) url.searchParams.set('role', 'counsellor');
    else if (isStudentRoute) url.searchParams.set('role', 'student');
    return NextResponse.redirect(url);
  }

  if (role) {
    if (isCounsellorRoute && role !== 'counsellor' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isStudentRoute && role !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // `/` is always the public NIVARA homepage. Authentication does not
    // imply automatic workspace entry; users enter their workspace explicitly.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
