import { pause } from './mock-latency';
import { getPreferences } from './preferences';
import { getCheckIns } from './checkins';
import { getAppointedSessions, getActiveCounsellorName } from './counsellors';
import { 
  rawDemoStudentSignals, 
  filterSignalsByConsent, 
  evaluateSupportNeedProfile,
  extractWellbeingSignalsFromCheckIn,
  type RawStudentSignals
} from '../data/support-engine';
import type { SupportNeedProfileData, DataPermissionKey } from '../types';

export async function getSupportNeedProfile(
  studentOrSessionId: string = 'default',
  requesterCounsellorName?: string
): Promise<SupportNeedProfileData> {
  await pause();
  const prefs = await getPreferences();
  
  // 1. Resolve active consent state per dimension (CONSENTED only)
  const consentMap: Record<DataPermissionKey, boolean> = {
    academic_data: prefs.some((p) => p.key === 'academic_data' && p.status === 'CONSENTED'),
    financial_support: prefs.some((p) => p.key === 'financial_support' && p.status === 'CONSENTED'),
    wellbeing_checkins: prefs.some((p) => p.key === 'wellbeing_checkins' && p.status === 'CONSENTED'),
  };

  // 2. Resolve stale retention preferences from withdrawal choices
  let withdrawals: Record<string, { keepStale?: boolean }> = {};
  if (typeof window !== 'undefined') { 
    try { 
      withdrawals = JSON.parse(localStorage.getItem('nivara_withdrawals') || '{}'); 
    } catch {} 
  }
  const staleMap: Record<DataPermissionKey, boolean> = {
    academic_data: Boolean(withdrawals['academic_data']?.keepStale === true),
    financial_support: Boolean(withdrawals['financial_support']?.keepStale === true),
    wellbeing_checkins: Boolean(withdrawals['wellbeing_checkins']?.keepStale === true),
  };

  let studentSignals: RawStudentSignals;
  let isSessionAccepted = true;

  if (studentOrSessionId && studentOrSessionId !== 'default') {
    const sessions = await getAppointedSessions();
    const session = sessions.find(
      (s) =>
        s.id === studentOrSessionId ||
        s.studentName.toLowerCase() === studentOrSessionId.toLowerCase() ||
        s.studentEmail.toLowerCase() === studentOrSessionId.toLowerCase()
    );

    if (session) {
      // Access Control: check counsellor assignment
      const activeCounsellor = requesterCounsellorName || getActiveCounsellorName();
      const isAssigned = session.counsellorName.toLowerCase() === activeCounsellor.toLowerCase();
      
      if (!isAssigned) {
        // Restricted to other counsellors: do not return support assessment data
        return {
          academic: { dimension: 'Academic', available: false },
          financial: { dimension: 'Financial', available: false },
          wellbeing: { dimension: 'Well-being', available: false },
        };
      }

      isSessionAccepted = session.status === 'accepted';

      const hasDownTrend = session.academics.activeSubjects.some((s) => s.trend === 'down');
      const hasAttendanceWatch = session.academics.insights.some(
        (i) => i.title.toLowerCase().includes('attendance') || i.summary.toLowerCase().includes('attendance')
      );

      studentSignals = {
        academic: {
          attendance: session.academics.attendance,
          attendanceDeclining: hasAttendanceWatch || session.academics.attendance < 88,
          marksDeclining: hasDownTrend,
          overdueAssignments: session.academics.upcomingDeadlines.filter((d) => d.priority === 'high').length > 1 ? 1 : 0,
          academicStress: session.academics.recentCheckIn.stress,
          requestedHelp: session.status === 'requested' || session.status === 'pending' || session.status === 'accepted',
        },
        financial: {
          feeStatus: session.id === 'ses-2' || session.studentName.toLowerCase().includes('liam') ? 'NOT_PAID' : 'PAID',
        },
        wellbeing: {
          mood: session.academics.recentCheckIn.mood,
          energy: session.academics.recentCheckIn.energy,
          stress: session.academics.recentCheckIn.stress,
          sleep: session.academics.recentCheckIn.sleep,
        },
      };
    } else {
      studentSignals = {
        academic: { ...rawDemoStudentSignals.academic },
        financial: { ...rawDemoStudentSignals.financial },
        wellbeing: { ...rawDemoStudentSignals.wellbeing },
      };
    }
  } else {
    // Default flow (e.g. for student Aria Chen / default profile)
    const allCheckIns = await getCheckIns();
    const latestEligibleCheckIn = allCheckIns.find(
      (c) => c.assessmentEligibility === 'ELIGIBLE' || c.isAssessmentEligible === true
    );
    
    // If stored check-ins exist but NONE are eligible, derived wellbeing is null
    const hasOnlyIneligibleCheckIns = allCheckIns.length > 0 && !latestEligibleCheckIn;
    const derivedWellbeing = hasOnlyIneligibleCheckIns
      ? null
      : (extractWellbeingSignalsFromCheckIn(latestEligibleCheckIn) || (allCheckIns.length === 0 ? rawDemoStudentSignals.wellbeing : null));

    studentSignals = {
      academic: { ...rawDemoStudentSignals.academic },
      financial: { ...rawDemoStudentSignals.financial },
      wellbeing: (derivedWellbeing ?? {}) as any,
    };
  }

  // STEP A -> B: Pass raw student data through consent filter
  const permittedEngineInputs = filterSignalsByConsent(studentSignals, consentMap);

  // STEP C: Pass ONLY permitted signals into Support Need Engine
  const profile = evaluateSupportNeedProfile(permittedEngineInputs, staleMap);

  // Pre-acceptance privacy guard: if appointment not yet accepted, strip contributing factors
  if (!isSessionAccepted) {
    return {
      academic: {
        ...profile.academic,
        signals: [],
        explainability: profile.academic.explainability
          ? {
              ...profile.academic.explainability,
              contributingFactors: ['Contributing factors are locked until appointment acceptance by assigned counsellor.'],
            }
          : undefined,
      },
      financial: {
        ...profile.financial,
        signals: [],
        explainability: profile.financial.explainability
          ? {
              ...profile.financial.explainability,
              contributingFactors: ['Contributing factors are locked until appointment acceptance by assigned counsellor.'],
            }
          : undefined,
      },
      wellbeing: {
        ...profile.wellbeing,
        signals: [],
        explainability: profile.wellbeing.explainability
          ? {
              ...profile.wellbeing.explainability,
              contributingFactors: ['Contributing factors are locked until appointment acceptance by assigned counsellor.'],
            }
          : undefined,
      },
    };
  }

  return profile;
}

