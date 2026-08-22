import type { ConsentPreference } from '../types';

export const mockPreferences: ConsentPreference[] = [
  { 
    key: 'academic_data', 
    label: 'Academic Data', 
    description: 'Use attendance, workload, marks, and deadlines to explain patterns.', 
    enabled: true,
    required: true
  },
  { 
    key: 'financial_support', 
    label: 'Financial Support Matching', 
    description: 'Use basic eligibility data (e.g., course, year, general demographic status) to match you with available grants or bursaries. No bank statements or transaction history are collected.', 
    enabled: false 
  },
  { 
    key: 'wellbeing_checkins', 
    label: 'Well-being Check-ins', 
    description: 'Use your check-ins to shape your personal overview and recommendations.', 
    enabled: true 
  },
  { 
    key: 'ai_support', 
    label: 'AI Support', 
    description: 'Enable AI-driven suggestions and guidance to help manage your workload and stress.', 
    enabled: true 
  },
];