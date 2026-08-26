import { pause } from './mock-latency';
import { getPreferences } from './preferences';
import { 
  rawDemoStudentSignals, 
  filterSignalsByConsent, 
  evaluateSupportNeedProfile 
} from '../data/support-engine';
import type { SupportNeedProfileData, DataPermissionKey } from '../types';

export async function getSupportNeedProfile(_studentId: string = 'default'): Promise<SupportNeedProfileData> {
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

  // 3. STEP A -> B: Pass raw student data through consent filter
  // RAW STUDENT/DEMO DATA -> CONSENT FILTER -> PERMITTED ENGINE INPUT
  const permittedEngineInputs = filterSignalsByConsent(rawDemoStudentSignals, consentMap);

  // 4. STEP C: Pass ONLY permitted signals into Support Need Engine
  // PERMITTED ENGINE INPUT -> SUPPORT NEED ENGINE
  return evaluateSupportNeedProfile(permittedEngineInputs, staleMap);
}

