import { getConsentApi, updateConsentApi } from './client';
import type { ConsentPreference } from '../types';

export async function getPreferences(): Promise<ConsentPreference[]> {
  return getConsentApi();
}

export async function savePreferences(next: ConsentPreference[]): Promise<ConsentPreference[]> {
  return updateConsentApi(next);
}
