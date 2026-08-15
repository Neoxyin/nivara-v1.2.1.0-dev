import { mockStudent } from '../data/student';
import type { Student, UserRole } from '../types';

// Mock auth functions for prototype
// These will be replaced with Supabase Auth in production

export function getCurrentUser(): Student | null {
  // In production, this would check Supabase Auth session
  return { ...mockStudent };
}

export function getSession(): string | null {
  // In production, this would return Supabase session token
  return 'mock-session-token';
}

export function isAuthenticated(): boolean {
  // In production, this would check Supabase Auth
  return true; // Mock: always authenticated for prototype
}

export function hasRole(role: UserRole): boolean {
  // In production, this would check user's role from backend
  return role === 'student'; // Mock: always student for prototype
}

export function getUserRole(): UserRole {
  // In production, this would return user's role from backend
  return 'student'; // Mock: always student for prototype
}