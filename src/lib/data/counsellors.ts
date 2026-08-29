import type { Counsellor } from '../types';

export const mockCounsellors: Counsellor[] = [
  { 
    id: 'c-1',
    name: 'Aisha Rahman', 
    role: 'Student wellbeing adviser', 
    specializations: ['Study stress', 'Transition', 'Academic anxiety'], 
    availability: 'Today · 14:30', 
    status: 'available', 
    initials: 'AR',
    email: 'a.rahman@nivara.edu',
    phone: '+44 (0)20 7946 0192',
    activeCaseload: 12,
    location: 'Wellness Wing 2B',
    bio: 'Specialises in cognitive transition support, exam stress decompression, and workload pacing.'
  },
  { 
    id: 'c-2',
    name: 'Jon Bell', 
    role: 'Counsellor & Accessibility Lead', 
    specializations: ['Anxiety & focus', 'Accessibility', 'Time management'], 
    availability: 'Tomorrow · 10:00', 
    status: 'next', 
    initials: 'JB',
    email: 'j.bell@nivara.edu',
    phone: '+44 (0)20 7946 0843',
    activeCaseload: 15,
    location: 'Student Hub 1A',
    bio: 'Dedicated to neurodiversity adaptations, executive function scaffolding, and sensory well-being.'
  },
  { 
    id: 'c-3',
    name: 'Priya Nair', 
    role: 'Student support lead', 
    specializations: ['Course pressure', 'International students', 'Stress & burnout'], 
    availability: 'Thu · 11:30', 
    status: 'next', 
    initials: 'PN',
    email: 'p.nair@nivara.edu',
    phone: '+44 (0)20 7946 0521',
    activeCaseload: 18,
    location: 'Main Building 4C',
    bio: 'Leading cross-cultural student integration, academic burnout recovery, and peer advocacy.'
  },
  { 
    id: 'c-4',
    name: 'Marcus Vance', 
    role: 'Clinical Psychologist', 
    specializations: ['Deep burnout', 'Mindfulness', 'Crisis de-escalation'], 
    availability: 'Fri · 15:00', 
    status: 'away', 
    initials: 'MV',
    email: 'm.vance@nivara.edu',
    phone: '+44 (0)20 7946 0994',
    activeCaseload: 9,
    location: 'Health Wing 3D',
    bio: 'Focusing on evidence-based mindfulness interventions and somatic stress regulation.'
  },
];
