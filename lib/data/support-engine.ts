import type { SupportNeedLevel, SupportDimension, SupportNeedIndicator, DataPermissionKey, SupportNeedProfileData, CheckIn } from '../types';

export type RawAcademicSignals = {
  attendance?: number;
  attendanceDeclining?: boolean;
  marksDeclining?: boolean;
  overdueAssignments?: number;
  academicStress?: number;
  requestedHelp?: boolean;
};

export type RawFinancialSignals = {
  feeStatus?: 'PAID' | 'NOT_PAID';
};

export type RawWellbeingSignals = {
  mood?: number;
  energy?: number;
  stress?: number;
  sleep?: number;
};

export type RawStudentSignals = {
  academic: RawAcademicSignals | null;
  financial: RawFinancialSignals | null;
  wellbeing: RawWellbeingSignals | null;
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
    feeStatus: 'NOT_PAID',
  },
  wellbeing: {
    stress: 4,
    mood: 3,
    energy: 3,
    sleep: 3,
  },
};

export const demoPermittedSignals: SupportSignals = {
  ...(rawDemoStudentSignals.academic || {}),
  ...(rawDemoStudentSignals.financial || {}),
  ...(rawDemoStudentSignals.wellbeing || {}),
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
    academic: consentMap['academic_data'] && raw.academic ? { ...raw.academic } : null,
    financial: consentMap['financial_support'] && raw.financial ? { ...raw.financial } : null,
    wellbeing: consentMap['wellbeing_checkins'] && raw.wellbeing ? { ...raw.wellbeing } : null,
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
  const dataUsed: string[] = [];

  if (signals.attendance !== undefined && signals.attendance < 75) { 
    score += 25; 
    contributing.push(`Attendance recorded below 75% (${signals.attendance}%)`); 
    dataUsed.push('Course module attendance percentage');
  } else if (signals.attendance !== undefined) {
    dataUsed.push('Course module attendance percentage');
  }

  if (signals.attendanceDeclining) { 
    score += 15; 
    contributing.push('Attendance trend is declining'); 
    if (!dataUsed.includes('Attendance trajectory')) dataUsed.push('Attendance trajectory');
  }

  if (signals.marksDeclining) { 
    score += 20; 
    contributing.push('Assessment marks trend is declining'); 
    dataUsed.push('Recent grade trajectory');
  }

  if ((signals.overdueAssignments ?? 0) > 0) { 
    score += 15; 
    contributing.push(`${signals.overdueAssignments} assignment(s) overdue`); 
    dataUsed.push('Assignment submission deadlines');
  }

  if ((signals.academicStress ?? 0) >= 4) { 
    score += 15; 
    contributing.push(`Academic stress self-rating is elevated (${signals.academicStress}/5)`); 
    dataUsed.push('Academic workload stress response');
  }

  if (signals.requestedHelp) { 
    score += 10; 
    contributing.push('Student requested academic support'); 
    dataUsed.push('Student-initiated help flag');
  }

  return {
    dimension: 'Academic',
    level: levelFromScore(score),
    available: true,
    signals: contributing,
    lastUpdated: 'Current semester evaluation',
    explainability: {
      contributingFactors: contributing.length ? contributing : ['No active academic risk factors identified in permitted records'],
      timeWindow: 'Current semester academic records',
      dataUsed: dataUsed.length ? dataUsed : ['Permitted academic records'],
      dataNotUsed: [
        'Library swipe records',
        'Campus Wi-Fi logs',
        'Disciplinary records',
        'Unconsented student data',
      ],
    },
  };
}

export function scoreFinancial(signals: RawFinancialSignals | null): SupportNeedIndicator {
  if (!signals || !signals.feeStatus) {
    return { dimension: 'Financial', level: 'UNAVAILABLE', available: false };
  }
  const parts: string[] = [];
  const dataUsed: string[] = ['Institutional fee payment status'];

  if (signals.feeStatus === 'NOT_PAID') {
    parts.push('Institutional fee payment is pending');
  } else if (signals.feeStatus === 'PAID') {
    parts.push('Institutional tuition fees recorded as paid');
  }

  return {
    dimension: 'Financial',
    level: signals.feeStatus === 'NOT_PAID' ? 'MODERATE' : 'LOW',
    available: true,
    signals: parts,
    lastUpdated: 'Current semester fee record',
    explainability: {
      contributingFactors: parts.length ? parts : ['Institutional tuition fees recorded as paid'],
      timeWindow: 'Current semester fee record',
      dataUsed,
      dataNotUsed: [
        'Income',
        'Family income',
        'Expenses',
        'Expense categories',
        'Bank statements',
        'Transaction history',
        'Credit score',
        'Aadhaar',
        'Debt',
        'Financial stress',
      ],
    },
  };
}

export function extractWellbeingSignalsFromCheckIn(checkIn?: CheckIn | null): RawWellbeingSignals | null {
  if (!checkIn) return null;
  // If explicitly not eligible, never extract signals for personalization
  if (checkIn.assessmentEligibility === 'NOT_ELIGIBLE' || checkIn.isAssessmentEligible === false) {
    return null;
  }
  // Must be eligible
  if (checkIn.assessmentEligibility === 'ELIGIBLE' || checkIn.isAssessmentEligible === true) {
    return {
      mood: checkIn.mood,
      energy: checkIn.energy,
      stress: checkIn.stress,
      sleep: checkIn.sleep,
    };
  }
  return null;
}

export function scoreWellbeing(signals: RawWellbeingSignals | null): SupportNeedIndicator {
  if (!signals) {
    return { dimension: 'Well-being', level: 'UNAVAILABLE', available: false };
  }
  const stress = signals.stress ?? 0;
  const mood = signals.mood ?? 0;
  const energy = signals.energy ?? 5;
  const sleep = signals.sleep ?? 5;

  const contributing: string[] = [];
  const dataUsed: string[] = [];

  let score = 0;
  if (stress >= 4) {
    score += 25;
    contributing.push(`Self-reported stress level is elevated (${stress}/5)`);
    dataUsed.push('Voluntary stress self-rating');
  }
  if (mood <= 2 && mood > 0) {
    score += 20;
    contributing.push(`Reported mood score is low (${mood}/5)`);
    dataUsed.push('Voluntary mood self-rating');
  }
  if (energy <= 2 && energy > 0) {
    score += 15;
    contributing.push(`Reported energy level is low (${energy}/5)`);
    dataUsed.push('Voluntary energy self-rating');
  }
  if (sleep <= 2 && sleep > 0) {
    score += 10;
    contributing.push(`Reported sleep quality is low (${sleep}/5)`);
    dataUsed.push('Voluntary sleep self-rating');
  }

  return {
    dimension: 'Well-being',
    level: levelFromScore(score),
    available: true,
    signals: contributing,
    lastUpdated: 'Latest eligible check-in',
    explainability: {
      contributingFactors: contributing.length
        ? contributing
        : ['Voluntary check-in responses reflect balanced well-being levels'],
      timeWindow: 'Latest eligible voluntary check-in',
      dataUsed: dataUsed.length ? dataUsed : ['Eligible voluntary check-in responses'],
      dataNotUsed: [
        'Private reflection notes',
        'Ineligible check-in responses',
        'Medical / clinical records',
        'Counselling session notes',
      ],
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
  const baseAcademic = scoreAcademic(rawDemoStudentSignals.academic);
  const academic = permittedInputs.academic
    ? scoreAcademic(permittedInputs.academic)
    : staleMap['academic_data']
    ? {
        ...baseAcademic,
        stale: true,
        lastUpdated: 'Historical assessment (Permission withdrawn)',
        explainability: {
          contributingFactors: (baseAcademic.explainability?.contributingFactors || []).map(
            (f) => `${f} (Historical assessment)`
          ),
          timeWindow: 'Generated prior to permission withdrawal; no longer updated with new data',
          dataUsed: (baseAcademic.explainability?.dataUsed || []).map((d) => `${d} (historical record)`),
          dataNotUsed: [
            ...(baseAcademic.explainability?.dataNotUsed || []),
            'Newly recorded academic data after withdrawal',
          ],
        },
      }
    : { dimension: 'Academic' as const, level: 'UNAVAILABLE' as const, available: false };

  const baseFinancial = scoreFinancial(rawDemoStudentSignals.financial);
  const financial = permittedInputs.financial
    ? scoreFinancial(permittedInputs.financial)
    : staleMap['financial_support']
    ? {
        ...baseFinancial,
        stale: true,
        lastUpdated: 'Historical assessment (Permission withdrawn)',
        explainability: {
          contributingFactors: (baseFinancial.explainability?.contributingFactors || []).map(
            (f) => `${f} (Historical assessment)`
          ),
          timeWindow: 'Generated prior to permission withdrawal; no longer updated with new data',
          dataUsed: (baseFinancial.explainability?.dataUsed || []).map((d) => `${d} (historical record)`),
          dataNotUsed: [
            ...(baseFinancial.explainability?.dataNotUsed || []),
            'Newly recorded fee status after withdrawal',
          ],
        },
      }
    : { dimension: 'Financial' as const, level: 'UNAVAILABLE' as const, available: false };

  const baseWellbeing = scoreWellbeing(rawDemoStudentSignals.wellbeing);
  const wellbeing = permittedInputs.wellbeing
    ? scoreWellbeing(permittedInputs.wellbeing)
    : staleMap['wellbeing_checkins']
    ? {
        ...baseWellbeing,
        stale: true,
        lastUpdated: 'Historical assessment (Permission withdrawn)',
        explainability: {
          contributingFactors: (baseWellbeing.explainability?.contributingFactors || []).map(
            (f) => `${f} (Historical assessment)`
          ),
          timeWindow: 'Generated prior to permission withdrawal; no longer updated with new data',
          dataUsed: (baseWellbeing.explainability?.dataUsed || []).map((d) => `${d} (historical record)`),
          dataNotUsed: [
            ...(baseWellbeing.explainability?.dataNotUsed || []),
            'Newly submitted check-in responses after withdrawal',
          ],
        },
      }
    : { dimension: 'Well-being' as const, level: 'UNAVAILABLE' as const, available: false };

  return { academic, financial, wellbeing };
}

