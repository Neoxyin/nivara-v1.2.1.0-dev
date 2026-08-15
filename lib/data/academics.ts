import type { AcademicMetric, Deadline } from '../types';

export const mockAcademicMetrics: AcademicMetric[] = [
  { subject: 'Interaction systems', score: 78, attendance: 94, workload: 68, trend: 'up' },
  { subject: 'Design research', score: 84, attendance: 97, workload: 52, trend: 'steady' },
  { subject: 'Creative coding', score: 71, attendance: 88, workload: 82, trend: 'down' },
  { subject: 'Design history', score: 76, attendance: 91, workload: 44, trend: 'steady' },
];

export const mockTrendData = [
  { week: 'W1', academic: 69, wellbeing: 72 }, { week: 'W2', academic: 73, wellbeing: 68 },
  { week: 'W3', academic: 74, wellbeing: 76 }, { week: 'W4', academic: 78, wellbeing: 64 },
  { week: 'W5', academic: 77, wellbeing: 61 }, { week: 'W6', academic: 80, wellbeing: 67 },
];

export const mockDeadlines: Deadline[] = [
  { title: 'Prototype walkthrough', subject: 'Interaction systems', date: 'Tomorrow · 09:00', priority: 'high' },
  { title: 'Fieldwork synthesis', subject: 'Design research', date: '18 Mar · 16:00', priority: 'medium' },
  { title: 'Creative coding journal', subject: 'Creative coding', date: '21 Mar · 23:59', priority: 'medium' },
  { title: 'Reading response 04', subject: 'Design history', date: '25 Mar · 12:00', priority: 'low' },
];