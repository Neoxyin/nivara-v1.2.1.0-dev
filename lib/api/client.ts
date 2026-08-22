import { mockStudent } from '../data/student';
import { mockPreferences } from '../data/preferences';
import { pause } from './mock-latency';
import type { Student, ConsentPreference, UserRole } from '../types';

/**
 * Frontend API client boundaries for Phase 1.
 * Currently uses mock fallbacks since the real backend is not yet implemented.
 * Setting NEXT_PUBLIC_USE_REAL_API=true will attempt to hit the real endpoints.
 */
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

// Authentication
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'COUNSELLOR' | 'ADMIN';
};

export async function loginApi(role: UserRole, email: string, password?: string): Promise<{ success: boolean; user?: AuthUser }> {
  const upperRole = role.toUpperCase() as AuthUser['role'];
  if (USE_REAL_API) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: upperRole, email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  }
  await pause(450);
  
  // Mock Adapter: Set an insecure cookie so middleware.ts can read it
  if (typeof document !== 'undefined') {
    const payload = encodeURIComponent(JSON.stringify({ role: upperRole, email }));
    document.cookie = `nivara_session=${payload}; path=/; max-age=86400; samesite=lax`;
  }
  
  return { 
    success: true, 
    user: { id: 'mock-id-123', name: 'Demo User', email, role: upperRole } 
  };
}

export async function getAuthMeApi(): Promise<{ user: AuthUser } | null> {
  if (USE_REAL_API) {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    return res.json();
  }
  
  // Mock fallback logic
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )nivara_session=([^;]+)'));
    if (match) {
      try {
        const payload = JSON.parse(decodeURIComponent(match[2]));
        return {
          user: {
            id: 'mock-id-123',
            name: 'Demo User',
            email: payload.email || 'demo@university.edu',
            role: payload.role as AuthUser['role']
          }
        };
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export async function logoutApi(): Promise<void> {
  if (USE_REAL_API) {
    await fetch('/api/auth/logout', { method: 'POST' });
  } else {
    // Mock Adapter: Clear the cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'nivara_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
}

// Student Profile
export async function getStudentProfileApi(): Promise<Student> {
  if (USE_REAL_API) {
    const res = await fetch('/api/student/profile');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }
  await pause();
  return { ...mockStudent };
}

export async function updateStudentProfileApi(data: Partial<Student>): Promise<Student> {
  if (USE_REAL_API) {
    const res = await fetch('/api/student/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }
  await pause();
  Object.assign(mockStudent, data);
  return { ...mockStudent };
}

export async function getStudentTransparencyApi(): Promise<any> {
  if (USE_REAL_API) {
    const res = await fetch('/api/student/transparency');
    if (!res.ok) throw new Error('Failed to fetch transparency');
    return res.json();
  }
  await pause();
  return { status: 'transparent', dataSharing: [] };
}

// Consent
export async function getConsentApi(): Promise<ConsentPreference[]> {
  if (USE_REAL_API) {
    const res = await fetch('/api/consent');
    if (!res.ok) throw new Error('Failed to fetch consent');
    return res.json();
  }
  await pause();
  return [...mockPreferences];
}

export async function updateConsentApi(next: ConsentPreference[]): Promise<ConsentPreference[]> {
  if (USE_REAL_API) {
    const res = await fetch('/api/consent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next)
    });
    if (!res.ok) throw new Error('Failed to update consent');
    return res.json();
  }
  await pause();
  mockPreferences.splice(0, mockPreferences.length, ...next);
  return [...mockPreferences];
}
