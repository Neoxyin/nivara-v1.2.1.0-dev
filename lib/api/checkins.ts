import { mockCheckIns } from '../data/checkins';
import { pause } from './mock-latency';
import type { CheckIn } from '../types';


export async function getCheckIns(): Promise<CheckIn[]> {
  await pause();
  return [...mockCheckIns];
}

export async function submitCheckIn(input: Omit<CheckIn, 'date'>): Promise<CheckIn> {
  await pause();
  const item = { ...input, date: 'Today' };
  mockCheckIns.unshift(item);
  return item;
}