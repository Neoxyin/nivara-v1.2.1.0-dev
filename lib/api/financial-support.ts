import { mockFinancialSupportOptions } from '../data/financial-support';
import { pause } from './mock-latency';
import type { FinancialSupportOption } from '../types';

export async function getFinancialSupportOptions(): Promise<FinancialSupportOption[]> {
  await pause();
  return [...mockFinancialSupportOptions];
}
