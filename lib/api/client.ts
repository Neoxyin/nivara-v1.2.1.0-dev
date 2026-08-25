import { mockStudent } from '../data/student';
import { mockPreferences } from '../data/preferences';
import { pause } from './mock-latency';
import type { Student, ConsentPreference, UserRole } from '../types';

/** Frontend-only data boundary. No remote/backend services are used. */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'COUNSELLOR' | 'ADMIN';
};

export async function loginApi(
  role: UserRole,
  email: string,
  _password?: string,
): Promise<{ success: boolean; user?: AuthUser }> {
  await pause(450);
  const upperRole = role.toUpperCase() as AuthUser['role'];
  return {
    success: true,
    user: { id: 'mock-id-123', name: 'Demo User', email, role: upperRole },
  };
}

export async function getAuthMeApi(): Promise<{ user: AuthUser } | null> {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )nivara_session=([^;]+)/);
  if (!match) return null;
  try {
    const payload = JSON.parse(decodeURIComponent(match[1]));
    if (!payload?.role) return null;
    return {
      user: {
        id: 'mock-id-123',
        name: 'Demo User',
        email: payload.email || 'demo@university.edu',
        role: payload.role as AuthUser['role'],
      },
    };
  } catch {
    return null;
  }
}

export async function logoutApi(): Promise<void> {
  await pause(120);
}

export async function getStudentProfileApi(): Promise<Student> {
  await pause();
  return { ...mockStudent };
}

export async function updateStudentProfileApi(data: Partial<Student>): Promise<Student> {
  await pause();
  Object.assign(mockStudent, data);
  return { ...mockStudent };
}

export async function getStudentTransparencyApi(): Promise<any> {
  await pause();
  return { status: 'transparent', dataSharing: [] };
}

export async function getConsentApi(): Promise<ConsentPreference[]> {
  await pause();
  return [...mockPreferences];
}

export async function updateConsentApi(next: ConsentPreference[]): Promise<ConsentPreference[]> {
  await pause();
  mockPreferences.splice(0, mockPreferences.length, ...next.map((p) => ({
    ...p,
    status: (p.enabled ? 'CONSENTED' : (mockPreferences.find((old) => old.key === p.key)?.status === 'CONSENTED' ? 'WITHDRAWN' : 'NOT_CONSENTED')) as ConsentPreference['status'],
  })));
  return [...mockPreferences];
}
