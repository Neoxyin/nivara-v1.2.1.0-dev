import { mockCheckIns } from '../data/checkins';
import { pause } from './mock-latency';
import type { CheckIn } from '../types';

const STORAGE_KEY = 'nivara_checkins';

function getStoredCheckIns(): CheckIn[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCheckIns));
    } catch {}
  }
  return [...mockCheckIns];
}

export async function getCheckIns(): Promise<CheckIn[]> {
  await pause();
  return getStoredCheckIns();
}

export async function submitCheckIn(input: Omit<CheckIn, 'date'>): Promise<CheckIn> {
  await pause();
  const isEligible = input.assessmentEligibility === 'ELIGIBLE' || input.isAssessmentEligible === true;
  const item: CheckIn = { 
    ...input, 
    date: 'Today',
    assessmentEligibility: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
    isAssessmentEligible: isEligible,
  };
  mockCheckIns.unshift(item);
  if (typeof window !== 'undefined') {
    try {
      const current = getStoredCheckIns();
      const updated = [item, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
  return item;
}