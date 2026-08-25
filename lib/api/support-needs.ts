import { pause } from './mock-latency';
import { getPreferences } from './preferences';
import { buildSupportIndicator, demoPermittedSignals } from '../data/support-engine';
import type { SupportNeedProfileData } from '../types';

export async function getSupportNeedProfile(_studentId: string = 'default'): Promise<SupportNeedProfileData> {
  await pause();
  const prefs = await getPreferences();
  const has = (key: string) => prefs.some((p) => p.key === key && p.status === 'CONSENTED');
  
  let withdrawals: Record<string, { keepStale: boolean }> = {};
  if (typeof window !== 'undefined') { 
    try { 
      withdrawals = JSON.parse(localStorage.getItem('nivara_withdrawals') || '{}'); 
      // Also migrate from old single string if present
      const old = JSON.parse(localStorage.getItem('nivara_last_withdrawal') || 'null');
      if (old && old.key && !withdrawals[old.key]) {
        withdrawals[old.key] = { keepStale: old.keepStale };
      }
    } catch {} 
  }
  const stale = (key: string) => withdrawals[key]?.keepStale === true;

  const academicSignals = has('academic_data') ? demoPermittedSignals : null;
  const financialSignals = has('financial_support') ? demoPermittedSignals : null;
  const wellbeingSignals = has('wellbeing_checkins') ? demoPermittedSignals : null;

  return {
    academic: has('academic_data') ? buildSupportIndicator('Academic', academicSignals, 'academic_data') : stale('academic_data') ? { ...buildSupportIndicator('Academic', demoPermittedSignals, 'academic_data'), stale: true } : { dimension: 'Academic', level: 'UNAVAILABLE', available: false },
    financial: has('financial_support') ? buildSupportIndicator('Financial', financialSignals, 'financial_support') : stale('financial_support') ? { ...buildSupportIndicator('Financial', demoPermittedSignals, 'financial_support'), stale: true } : { dimension: 'Financial', level: 'UNAVAILABLE', available: false },
    wellbeing: has('wellbeing_checkins') ? buildSupportIndicator('Well-being', wellbeingSignals, 'wellbeing_checkins') : stale('wellbeing_checkins') ? { ...buildSupportIndicator('Well-being', demoPermittedSignals, 'wellbeing_checkins'), stale: true } : { dimension: 'Well-being', level: 'UNAVAILABLE', available: false },
  };
}
