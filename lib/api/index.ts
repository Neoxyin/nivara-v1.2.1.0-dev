// Central API exports for easy importing
export * from './checkins';
export * from './academics';
export * from './timetable';
export * from './counsellors';
export * from './resources';
export * from './student';
export * from './support';
export * from './preferences';
export * from './academic-support';
export * from './financial-support';
export * from './support-needs';
export * from './insights';
export * from './student-data';
export * from './support-circles';

// Re-export auth functions for convenience
export { getCurrentUser, getSession, isAuthenticated, hasRole, getUserRole, setUserRole, canAccessCounsellors, useAuth } from '../auth';