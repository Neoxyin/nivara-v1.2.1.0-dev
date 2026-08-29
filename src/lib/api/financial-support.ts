import { matchFinancialSupportOptions } from '../data/financial-support';
import { rawDemoStudentSignals } from '../data/support-engine';
import { getPreferences } from './preferences';
import { pause } from './mock-latency';
import type { FinancialSupportOption } from '../types';

export async function getFinancialSupportOptions(_studentId: string = 'default'): Promise<FinancialSupportOption[]> {
  await pause();
  const prefs = await getPreferences();
  const hasConsent = prefs.some((p) => p.key === 'financial_support' && p.status === 'CONSENTED');
  
  // Data boundary: RAW STUDENT DATA -> CONSENT FILTER -> { feeStatus | absent } -> FINANCIAL MATCHING
  // If NOT_CONSENTED or WITHDRAWN, feeStatus is strictly null/absent (never falsified)
  const feeStatus = hasConsent ? (rawDemoStudentSignals.financial?.feeStatus ?? null) : null;

  return matchFinancialSupportOptions(feeStatus);
}

