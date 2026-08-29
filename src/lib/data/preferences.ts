import type { ConsentPreference } from '../types';

export const mockPreferences: ConsentPreference[] = [
  {
    key: 'academic_data',
    label: 'Academic Data',
    description: 'Use permitted academic information to provide more relevant academic support. It is not used to reduce grades, cancel benefits, or trigger discipline.',
    enabled: true,
    status: 'CONSENTED',
  },
  {
    key: 'financial_support',
    label: 'Financial Support Matching',
    description: 'Use minimal information such as expense difficulty, expense category, aid status, and support preferences to help surface support options. No bank statements, transaction history, credit score, or Aadhaar are required.',
    enabled: false,
    status: 'NOT_CONSENTED',
  },
  {
    key: 'wellbeing_checkins',
    label: 'Well-being Check-ins',
    description: 'Use voluntary check-in information to provide more relevant well-being support. These indicators are not medical diagnoses.',
    enabled: true,
    status: 'CONSENTED',
  },
];
