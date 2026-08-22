import { useState, useEffect } from 'react';
import { mockStudent } from '../data/student';
import type { Student, UserRole } from '../types';
import { logoutApi } from '../api/client';

const ROLE_STORAGE_KEY = 'nivara_user_role';
const AUTH_STORAGE_KEY = 'nivara_authenticated';

// Helper to safely get stored role in browser or SSR
export function getStoredRole(): UserRole | null {
  if (typeof window !== 'undefined') {
    const isAuth = window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    const stored = window.localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
    if (isAuth && stored && ['student', 'counsellor', 'admin'].includes(stored)) {
      return stored;
    }
  }
  return null;
}

export function getCurrentUser(): Student {
  const role = getStoredRole() || 'student';
  return {
    ...mockStudent,
    role,
  };
}

export function getSession(): string | null {
  return isAuthenticated() ? 'mock-session-token' : null;
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  }
  return false;
}

export function setAuthenticated(status: boolean = true): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_STORAGE_KEY, status ? 'true' : 'false');
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await logoutApi();
  } catch (e) {
    console.error('Logout API failed', e);
  } finally {
    clearUserSession();
  }
}

export function clearUserSession(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ROLE_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem('nivara_initial_role_selected');
    window.dispatchEvent(new CustomEvent('nivara-role-changed', { detail: { role: null } }));
  }
}

export function getUserRole(): UserRole | null {
  return getStoredRole();
}

export function setUserRole(role: UserRole): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    window.localStorage.setItem('nivara_initial_role_selected', 'true');
    window.dispatchEvent(new CustomEvent('nivara-role-changed', { detail: { role } }));
  }
}

export function hasRole(role: UserRole | UserRole[]): boolean {
  const current = getUserRole();
  if (!current) return false;
  if (Array.isArray(role)) {
    return role.includes(current);
  }
  return current === role;
}

export function canAccessCounsellors(): boolean {
  const role = getUserRole();
  return role === 'counsellor' || role === 'admin';
}

// React Hook for reactive RBAC across UI components
export function useAuth() {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isAuth, setIsAuthState] = useState<boolean>(false);
  const [user, setUser] = useState<Student>(mockStudent);

  useEffect(() => {
    const current = getStoredRole();
    const authed = isAuthenticated();
    setRoleState(current);
    setIsAuthState(authed);
    if (current) {
      setUser({ ...mockStudent, role: current });
    }

    const handleRoleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ role: UserRole | null }>;
      const nextRole = customEvent.detail?.role !== undefined ? customEvent.detail.role : getStoredRole();
      const nextAuthed = isAuthenticated();
      setRoleState(nextRole);
      setIsAuthState(nextAuthed);
      if (nextRole) {
        setUser({ ...mockStudent, role: nextRole });
      }
    };

    window.addEventListener('nivara-role-changed', handleRoleChange);
    window.addEventListener('storage', handleRoleChange);

    return () => {
      window.removeEventListener('nivara-role-changed', handleRoleChange);
      window.removeEventListener('storage', handleRoleChange);
    };
  }, []);

  const changeRole = (newRole: UserRole) => {
    setUserRole(newRole);
    setRoleState(newRole);
    setIsAuthState(true);
    setUser({ ...mockStudent, role: newRole });
  };

  const isAuthorized = role === 'counsellor' || role === 'admin';

  return {
    user,
    role,
    setUserRole: changeRole,
    isAuthorized,
    isAuthenticated: isAuth,
    hasRole: (requiredRole: UserRole | UserRole[]) => {
      if (!role) return false;
      if (Array.isArray(requiredRole)) return requiredRole.includes(role);
      return role === requiredRole;
    },
  };
}
