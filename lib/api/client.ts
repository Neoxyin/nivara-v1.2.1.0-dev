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
  if (typeof window === 'undefined') return null;
  
  // Primary check via session cookie
  const match = document.cookie.match(/(?:^|; )nivara_session=([^;]+)/);
  if (match) {
    try {
      let raw = match[1].trim();
      if (raw.startsWith('"') && raw.endsWith('"')) raw = raw.slice(1, -1).trim();
      
      let decoded = raw;
      try { decoded = decodeURIComponent(raw); } catch {}

      try {
        const payload = JSON.parse(decoded);
        if (payload?.role) {
          return {
            user: {
              id: 'mock-id-123',
              name: payload.role.toLowerCase() === 'student' ? 'Aria Chen' : 'Dr. Amanda Ross',
              email: payload.email || 'demo@university.edu',
              role: payload.role.toUpperCase() as AuthUser['role'],
            },
          };
        }
      } catch {
        const upper = decoded.toUpperCase();
        if (upper === 'STUDENT' || upper === 'COUNSELLOR' || upper === 'ADMIN') {
          return {
            user: {
              id: 'mock-id-123',
              name: upper === 'STUDENT' ? 'Aria Chen' : 'Dr. Amanda Ross',
              email: upper === 'STUDENT' ? 'aria.chen@university.edu' : 'a.ross@wellbeing.university.edu',
              role: upper as AuthUser['role'],
            },
          };
        }
      }
    } catch {}
  }

  // Fallback to localStorage session state
  const isAuth = window.localStorage.getItem('nivara_authenticated') === 'true';
  const role = window.localStorage.getItem('nivara_user_role');
  if (isAuth && role && ['student', 'counsellor', 'admin'].includes(role)) {
    const upperRole = role.toUpperCase() as AuthUser['role'];
    return {
      user: {
        id: 'mock-id-123',
        name: role === 'student' ? 'Aria Chen' : 'Dr. Amanda Ross',
        email: role === 'student' ? 'aria.chen@university.edu' : 'a.ross@wellbeing.university.edu',
        role: upperRole,
      },
    };
  }

  return null;
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
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('nivara_consent_preferences');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
  }
  return [...mockPreferences];
}

export async function updateConsentApi(next: ConsentPreference[]): Promise<ConsentPreference[]> {
  await pause();
  
  // Read current to determine status transition
  let current: ConsentPreference[] = [...mockPreferences];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('nivara_consent_preferences');
      if (stored) current = JSON.parse(stored);
    } catch {}
  }

  const updated = next.map((p) => {
    const old = current.find((o) => o.key === p.key);
    return {
      ...p,
      status: (p.enabled ? 'CONSENTED' : (old?.status === 'CONSENTED' ? 'WITHDRAWN' : 'NOT_CONSENTED')) as ConsentPreference['status'],
    };
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('nivara_consent_preferences', JSON.stringify(updated));
  }
  
  // Update in-memory for server-side or fallback
  mockPreferences.splice(0, mockPreferences.length, ...updated);
  
  return updated;
}
