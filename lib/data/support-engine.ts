import type { SupportNeedLevel, SupportDimension, SupportNeedIndicator, DataPermissionKey } from '../types';

export type SupportSignals = {
  attendance?: number;
  attendanceDeclining?: boolean;
  marksDeclining?: boolean;
  overdueAssignments?: number;
  academicStress?: number;
  requestedHelp?: boolean;
  expenseDifficulty?: number;
  currentAidStatus?: 'receiving' | 'not_receiving';
  mood?: number;
  energy?: number;
  stress?: number;
  sleep?: number;
};

export function scoreAcademic(signals: SupportSignals): SupportNeedIndicator {
  let score = 0;
  const contributing: string[] = [];
  if (signals.attendance !== undefined && signals.attendance < 75) { score += 25; contributing.push('Attendance below 75%'); }
  if (signals.attendanceDeclining) { score += 15; contributing.push('Declining attendance'); }
  if (signals.marksDeclining) { score += 20; contributing.push('Declining marks'); }
  if ((signals.overdueAssignments ?? 0) > 0) { score += 15; contributing.push('Multiple overdue assignments'); }
  if ((signals.academicStress ?? 0) >= 4) { score += 15; contributing.push('Academic stress ≥4'); }
  if (signals.requestedHelp) { score += 10; contributing.push('Student requested help'); }
  return { dimension: 'Academic', level: levelFromScore(score), available: true, signals: contributing, lastUpdated: 'Demo assessment', explainability: { contributingFactors: contributing, timeWindow: 'Configured assessment window', dataUsed: contributing.length ? contributing : ['No weighted signal triggered'], dataNotUsed: ['Punitive institutional systems'] } };
}

function levelFromScore(score: number): SupportNeedLevel {
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MODERATE';
  if (score >= 20) return 'MILD';
  return 'LOW';
}

export function buildSupportIndicator(dimension: SupportDimension, signals: SupportSignals | null, permission: DataPermissionKey): SupportNeedIndicator {
  if (!signals) {
    return { dimension, level: 'UNAVAILABLE', available: false };
  }

  if (dimension === 'Academic' && permission === 'academic_data') return scoreAcademic(signals);
  if (dimension === 'Financial' && permission === 'financial_support') {
    const parts: string[] = [];
    if ((signals.expenseDifficulty ?? 0) >= 4) parts.push('Expense difficulty is high');
    if (signals.currentAidStatus === 'not_receiving') parts.push('No current aid reported');
    return { dimension, level: parts.length > 1 ? 'MODERATE' : parts.length ? 'MILD' : 'LOW', available: true, signals: parts, lastUpdated: 'Demo assessment', explainability: { contributingFactors: parts, timeWindow: 'Current support context', dataUsed: parts, dataNotUsed: ['Bank statements', 'Transaction history', 'Credit score', 'Aadhaar'] } };
  }
  if (dimension === 'Well-being' && permission === 'wellbeing_checkins') {
    const stress = signals.stress ?? 0;
    const mood = signals.mood ?? 0;
    const score = (stress >= 4 ? 25 : 0) + (mood <= 2 ? 20 : 0) + ((signals.energy ?? 5) <= 2 ? 15 : 0) + ((signals.sleep ?? 5) <= 2 ? 10 : 0);
    return { dimension, level: levelFromScore(score), available: true, signals: score ? ['Voluntary check-in signals contributed'] : [], lastUpdated: 'Demo assessment', explainability: { contributingFactors: score ? ['Stress, mood, energy and/or sleep from a voluntary check-in'] : ['No elevated check-in signal triggered'], timeWindow: 'Latest available voluntary check-in', dataUsed: ['Voluntary well-being check-in'], dataNotUsed: ['Medical records', 'Counselling notes'] } };
  }
  
  return { dimension, level: 'UNAVAILABLE', available: false };
}

export const demoPermittedSignals: SupportSignals = {
  attendance: 72,
  attendanceDeclining: true,
  marksDeclining: true,
  overdueAssignments: 2,
  academicStress: 5,
  requestedHelp: true,
  expenseDifficulty: 3,
  currentAidStatus: 'not_receiving',
  stress: 4,
  mood: 3,
  energy: 3,
  sleep: 3,
};
