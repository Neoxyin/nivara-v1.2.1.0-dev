import type { ConsentPreference } from '../types';

export const mockPreferences: ConsentPreference[] = [
  { 
    key: 'checkins', 
    label: 'Well-being check-ins', 
    description: 'Use your check-ins to shape your personal overview and recommendations.', 
    enabled: true 
  },
  { 
    key: 'academic', 
    label: 'Academic signals', 
    description: 'Use attendance, workload, marks, and deadlines to explain patterns.', 
    enabled: true 
  },
  { 
    key: 'nudges', 
    label: 'Helpful reminders', 
    description: 'Receive gentle reminders about check-ins and upcoming work.', 
    enabled: false 
  },
];