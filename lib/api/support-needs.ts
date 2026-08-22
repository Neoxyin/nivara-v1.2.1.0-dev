import { mockSupportNeeds } from '../data/support-needs';
import { pause } from './mock-latency';
import type { SupportNeedProfileData } from '../types';

export async function getSupportNeedProfile(studentId: string = 'default'): Promise<SupportNeedProfileData> {
  await pause();
  return mockSupportNeeds[studentId] || mockSupportNeeds['default'];
}
