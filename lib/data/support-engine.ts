import type { SupportNeedLevel, SupportDimension, SupportNeedIndicator, DataPermissionKey, SupportNeedProfileData } from '../types';

export type RawAcademicSignals = {
  attendance?: number;
  attendanceDeclining?: boolean;
  marksDeclining?: boolean;
  overdueAssignments?: number;
  academicStress?: number;
  requestedHelp?: boolean;
};

export type RawFinancialSignals = {
  expenseDifficulty?: number;
  currentAidStatus?: 'receiving' | 'not_receiving';
};

export type RawWellbeingSignals = {
  mood?: number;
  energy?: number;
  stress?: number;
  sleep?: number;
};

export type RawStudentSignals = {
  academic: RawAcademicSignals;
  financial: RawFinancialSignals;
  wellbeing: RawWellbeingSignals;
};

export type PermittedEngineInputs = {
  academic: RawAcademicSignals | null;
  financial: RawFinancialSignals | null;
  wellbeing: RawWellbeingSignals | null;
};

// Legacy flat signal type for backwards compatibility
export type SupportSignals = RawAcademicSignals & RawFinancialSignals & RawWellbeingSignals;

export const rawDemoStudentSignals: RawStudentSignals = {
  academic: {
    attendance: 72,
    attendanceDeclining: true,
    marksDeclining: true,
    overdueAssignments: 2,
    academicStress: 5,
    requestedHelp: true,
  },
  financial: {
    expenseDifficulty: 3,
    currentAidStatus: 'not_receiving',
  },
  wellbeing: {
    stress: 4,
    mood: 3,
    energy: 3,
    sleep: 3,
  },
};

export const demoPermittedSignals: SupportSignals = {
  ...rawDemoStudentSignals.academic,
  ...rawDemoStudentSignals.financial,
  ...rawDemoStudentSignals.wellbeing,
};

/**
 * Explicit Data Boundary: Consent Filter
 * Strips and blocks unconsented data from reaching the calculation engine.
 */
export function filterSignalsByConsent(
  raw: RawStudentSignals,
  consentMap: Record<DataPermissionKey, boolean>
): PermittedEngineInputs {
  return {
    academic: consentMap['academic_data'] ? { ...raw.academic } : null,
    financial: consentMap['financial_support'] ? { ...raw.financial } : null,
    wellbeing: consentMap['wellbeing_checkins'] ? { ...raw.wellbeing } : null,
  };
}

function levelFromScore(score: number): SupportNeedLevel {
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MODERATE';
  if (score >= 20) return 'MILD';
  return 'LOW';
}

export function scoreAcademic(signals: RawAcademicSignals | null): SupportNeedIndicator {
  if (!signals) {
    return { dimension: 'Academic', level: 'UNAVAILABLE', available: false };
  }
  let score = 0;
  const contributing: string[] = [];
  if (signals.attendance !== undefined && signals.attendance < 75) { score += 25; contributing.push('Attendance below 75%'); }
  if (signals.attendanceDeclining) { score += 15; contributing.push('Declining attendance'); }
  if (signals.marksDeclining) { score += 20; contributing.push('Declining marks'); }
  if ((signals.overdueAssignments ?? 0) > 0) { score += 15; contributing.push('Multiple overdue assignments'); }
  if ((signals.academicStress ?? 0) >= 4) { score += 15; contributing.push('Academic stress ≥4'); }
  if (signals.requestedHelp) { score += 10; contributing.push('Student requested help'); }
  return {
    dimension: 'Academic',
    level: levelFromScore(score),
    available: true,
    signals: contributing,
    lastUpdated: 'Demo assessment',
    explainability: {
      contributingFactors: contributing,
      timeWindow: 'Configured assessment window',
      dataUsed: contributing.length ? contributing : ['No weighted signal triggered'],
      dataNotUsed: ['Punitive institutional systems'],
    },
  };
}

export function scoreFinancial(signals: RawFinancialSignals | null): SupportNeedIndicator {
  if (!signals) {
    return { dimension: 'Financial', level: 'UNAVAILABLE', available: false };
  }
  const parts: string[] = [];
  if ((signals.expenseDifficulty ?? 0) >= 4) parts.push('Expense difficulty is high');
  if (signals.currentAidStatus === 'not_receiving') parts.push('No current aid reported');
  return {
    dimension: 'Financial',
    level: parts.length > 1 ? 'MODERATE' : parts.length ? 'MILD' : 'LOW',
    available: true,
    signals: parts,
    lastUpdated: 'Demo assessment',
    explainability: {
      contributingFactors: parts,
      timeWindow: 'Current support context',
      dataUsed: parts.length ? parts : ['General student context'],
      dataNotUsed: ['Bank statements', 'Transaction history', 'Credit score', 'Aadhaar'],
    },
  };
}

export function scoreWellbeing(signals: RawWellbeingSignals | null): SupportNeedIndicator {
  if (!signals) {
    return { dimension: 'Well-being', level: 'UNAVAILABLE', available: false };
  }
  const stress = signals.stress ?? 0;
  const mood = signals.mood ?? 0;
  const score = (stress >= 4 ? 25 : 0) + (mood <= 2 ? 20 : 0) + ((signals.energy ?? 5) <= 2 ? 15 : 0) + ((signals.sleep ?? 5) <= 2 ? 10 : 0);
  return {
    dimension: 'Well-being',
    level: levelFromScore(score),
    available: true,
    signals: score ? ['Voluntary check-in signals contributed'] : [],
    lastUpdated: 'Demo assessment',
    explainability: {
      contributingFactors: score ? ['Stress, mood, energy and/or sleep from a voluntary check-in'] : ['No elevated check-in signal triggered'],
      timeWindow: 'Latest available voluntary check-in',
      dataUsed: ['Voluntary well-being check-in'],
      dataNotUsed: ['Medical records', 'Counselling notes'],
    },
  };
}

export function buildSupportIndicator(dimension: SupportDimension, signals: SupportSignals | null, permission: DataPermissionKey): SupportNeedIndicator {
  if (!signals) {
    return { dimension, level: 'UNAVAILABLE', available: false };
  }
  if (dimension === 'Academic' && permission === 'academic_data') return scoreAcademic(signals);
  if (dimension === 'Financial' && permission === 'financial_support') return scoreFinancial(signals);
  if (dimension === 'Well-being' && permission === 'wellbeing_checkins') return scoreWellbeing(signals);
  return { dimension, level: 'UNAVAILABLE', available: false };
}

export function evaluateSupportNeedProfile(
  permittedInputs: PermittedEngineInputs,
  staleMap: Record<DataPermissionKey, boolean> = { academic_data: false, financial_support: false, wellbeing_checkins: false }
): SupportNeedProfileData {
  const academic = permittedInputs.academic
    ? scoreAcademic(permittedInputs.academic)
    : staleMap['academic_data']
    ? { ...scoreAcademic(rawDemoStudentSignals.academic), stale: true }
    : { dimension: 'Academic' as const, level: 'UNAVAILABLE' as const, available: false };

  const financial = permittedInputs.financial
    ? scoreFinancial(permittedInputs.financial)
    : staleMap['financial_support']
    ? { ...scoreFinancial(rawDemoStudentSignals.financial), stale: true }
    : { dimension: 'Financial' as const, level: 'UNAVAILABLE' as const, available: false };

  const wellbeing = permittedInputs.wellbeing
    ? scoreWellbeing(permittedInputs.wellbeing)
    : staleMap['wellbeing_checkins']
    ? { ...scoreWellbeing(rawDemoStudentSignals.wellbeing), stale: true }
    : { dimension: 'Well-being' as const, level: 'UNAVAILABLE' as const, available: false };

  return { academic, financial, wellbeing };
}

