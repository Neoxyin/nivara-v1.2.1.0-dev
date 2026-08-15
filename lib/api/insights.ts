import { mockInsights } from '../data/insights';
import { pause } from './mock-latency';
import type { Insight } from '../types';


export async function getInsights(): Promise<Insight[]> {
  await pause();
  return [...mockInsights];
}