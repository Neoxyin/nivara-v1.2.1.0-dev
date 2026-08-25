import { pause } from './mock-latency';
import { getPreferences } from './preferences';
import { buildSupportIndicator, demoPermittedSignals } from '../data/support-engine';
import type { SupportNeedProfileData } from '../types';

export async function getSupportNeedProfile(_studentId: string = 'default'): Promise<SupportNeedProfileData> {
  await pause();
  const prefs = await getPreferences();
  const has = (key: string) => prefs.some((p) => p.key === key && p.enabled);
  let withdrawal: { key: string; keepStale: boolean } | null = null;
  if (typeof window !== 'undefined') { try { withdrawal = JSON.parse(localStorage.getItem('nivara_last_withdrawal') || 'null'); } catch {} }
  const stale = (key: string) => withdrawal?.key === key && withdrawal.keepStale === true;
  return {
    academic: has('academic_data') ? buildSupportIndicator('Academic', demoPermittedSignals, 'academic_data') : stale('academic_data') ? { ...buildSupportIndicator('Academic', demoPermittedSignals, 'academic_data'), stale: true } : { dimension: 'Academic', level: 'LOW', available: false },
    financial: has('financial_support') ? buildSupportIndicator('Financial', demoPermittedSignals, 'financial_support') : stale('financial_support') ? { ...buildSupportIndicator('Financial', demoPermittedSignals, 'financial_support'), stale: true } : { dimension: 'Financial', level: 'LOW', available: false },
    wellbeing: has('wellbeing_checkins') ? buildSupportIndicator('Well-being', demoPermittedSignals, 'wellbeing_checkins') : stale('wellbeing_checkins') ? { ...buildSupportIndicator('Well-being', demoPermittedSignals, 'wellbeing_checkins'), stale: true } : { dimension: 'Well-being', level: 'LOW', available: false },
  };
}
