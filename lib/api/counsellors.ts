import { mockCounsellors } from '../data/counsellors';
import { pause } from './mock-latency';
import type { Counsellor } from '../types';


export async function getCounsellors(): Promise<Counsellor[]> {
  await pause();
  return [...mockCounsellors];
}

export async function requestAppointment(name: string, time: string): Promise<{ name: string; time: string; status: string }> {
  await pause();
  return { name, time, status: 'Request sent' };
}