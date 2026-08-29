import { mockAcademicSupportOptions } from '../data/academic-support';
import { pause } from './mock-latency';
import type { AcademicSupportOption } from '../types';

export async function getAcademicSupportOptions(): Promise<AcademicSupportOption[]> {
  await pause();
  return [...mockAcademicSupportOptions];
}
