import { mockPreferences } from '../data/preferences';
import { pause } from './mock-latency';
import type { ConsentPreference } from '../types';


export async function getPreferences(): Promise<ConsentPreference[]> {
  await pause();
  return [...mockPreferences];
}

export async function savePreferences(next: ConsentPreference[]): Promise<ConsentPreference[]> {
  await pause();
  mockPreferences.splice(0, mockPreferences.length, ...next);
  return [...mockPreferences];
}