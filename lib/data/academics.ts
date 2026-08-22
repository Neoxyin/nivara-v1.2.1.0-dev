import type { AcademicMetric, Deadline, AcademicSuggestion } from '../types';

export const mockAcademicMetrics: AcademicMetric[] = [
  {
    subject: 'Interaction Systems',
    moduleCode: 'IXD-201',
    score: 78,
    attendance: 94,
    attendedSessions: 16,
    totalSessions: 17,
    workload: 68,
    trend: 'up',
    nextSession: 'Thu 10:00 AM · Studio 3B',
    pacingRisk: 'healthy',
    suggestion: 'Attendance is optimal. Keep momentum before tomorrow’s prototype walkthrough.',
  },
  {
    subject: 'Design Research & Ethics',
    moduleCode: 'DRE-204',
    score: 84,
    attendance: 97,
    attendedSessions: 15,
    totalSessions: 15,
    workload: 52,
    trend: 'steady',
    nextSession: 'Fri 02:00 PM · Lecture Hall 1',
    pacingRisk: 'healthy',
    suggestion: 'Perfect attendance. Research phase workload is steady and manageable.',
  },
  {
    subject: 'Creative Coding & Shaders',
    moduleCode: 'CCS-209',
    score: 71,
    attendance: 88,
    attendedSessions: 14,
    totalSessions: 16,
    workload: 82,
    trend: 'down',
    nextSession: 'Mon 11:30 AM · Lab 4',
    pacingRisk: 'moderate',
    suggestion: 'Missed 2 lab sessions. High workload spike detected for upcoming submission.',
  },
  {
    subject: 'Design History & Theory',
    moduleCode: 'DHT-108',
    score: 76,
    attendance: 91,
    attendedSessions: 11,
    totalSessions: 12,
    workload: 44,
    trend: 'steady',
    nextSession: 'Wed 09:00 AM · Seminar Rm 2',
    pacingRisk: 'healthy',
    suggestion: 'Strong theoretical pacing. 1 scheduled reading review this fortnight.',
  },
];

export const mockAttendanceSummary = {
  overallPercentage: 92.5,
  totalAttended: 56,
  totalScheduled: 60,
  institutionalRequirement: 80,
  standing: 'Good Standing · Threshold Exceeded (+12.5%)',
  consecutiveWeeks: 6,
  lastRecordedDate: 'Yesterday · Verified',
};

export const mockAcademicSuggestions: AcademicSuggestion[] = [
  {
    id: 'sug-1',
    category: 'pacing',
    title: 'Buffer Time for Creative Coding Sprint',
    description:
      'Workload for Creative Coding is peaking at 82% with an upcoming journal submission on 21 Mar. Consider scheduling two 45-min deep focus blocks before the weekend.',
    impact: 'Reduces deadline crunch stress',
    actionText: 'Review Check-in Notes',
    actionHref: '/check-in',
    tone: 'warm',
  },
  {
    id: 'sug-2',
    category: 'attendance',
    title: 'Lab 4 Attendance Calibration',
    description:
      'You are currently at 88% in Creative Coding (14/16 sessions). Attending the next two scheduled labs will lift attendance above 90% and ensure full project credit.',
    impact: '+2.8% projected attendance boost',
    actionText: 'View Class Timetable',
    actionHref: '#modules',
    tone: 'accent',
  },
  {
    id: 'sug-3',
    category: 'support',
    title: 'Drop-in Office Hours Available',
    description:
      'If coursework friction in Shaders & Syntax feels heavy, Dr. Sarah Jenkins has drop-in academic well-being slots open this week for pacing guidance.',
    impact: 'Confidential 1-on-1 support',
    actionText: 'View Counsellors',
    actionHref: '/counsellors',
    tone: 'plum',
  },
];

export const mockTrendData = [
  { week: 'W1', academic: 69, sleep: 75, stress: 60 },
  { week: 'W2', academic: 73, sleep: 70, stress: 55 },
  { week: 'W3', academic: 74, sleep: 80, stress: 50 },
  { week: 'W4', academic: 78, sleep: 65, stress: 68 },
  { week: 'W5', academic: 77, sleep: 60, stress: 72 },
  { week: 'W6', academic: 80, sleep: 65, stress: 65 },
];

export const mockDeadlines: Deadline[] = [
  { title: 'Prototype walkthrough', subject: 'Interaction systems', date: 'Tomorrow · 09:00', priority: 'high' },
  { title: 'Fieldwork synthesis', subject: 'Design research', date: '18 Mar · 16:00', priority: 'medium' },
  { title: 'Creative coding journal', subject: 'Creative coding', date: '21 Mar · 23:59', priority: 'medium' },
  { title: 'Reading response 04', subject: 'Design history', date: '25 Mar · 12:00', priority: 'low' },
];
