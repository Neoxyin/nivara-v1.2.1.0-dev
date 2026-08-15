import type { Counsellor } from '../types';

export const mockCounsellors: Counsellor[] = [
  { 
    name: 'Aisha Rahman', 
    role: 'Student wellbeing adviser', 
    specializations: ['Study stress', 'Transition'], 
    availability: 'Today · 14:30', 
    status: 'available', 
    initials: 'AR' 
  },
  { 
    name: 'Jon Bell', 
    role: 'Counsellor', 
    specializations: ['Anxiety & focus', 'Accessibility'], 
    availability: 'Tomorrow · 10:00', 
    status: 'next', 
    initials: 'JB' 
  },
  { 
    name: 'Priya Nair', 
    role: 'Student support lead', 
    specializations: ['Course pressure', 'International students'], 
    availability: 'Thu · 11:30', 
    status: 'next', 
    initials: 'PN' 
  },
];