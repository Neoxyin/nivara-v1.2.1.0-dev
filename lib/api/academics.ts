import { mockAcademicMetrics, mockTrendData, mockDeadlines } from '../data/academics';
import { pause } from './mock-latency';
import type { AcademicMetric, Deadline } from '../types';


export async function getAcademicMetrics(): Promise<AcademicMetric[]> {
  await pause();
  return [...mockAcademicMetrics];
}

export async function getTrendData(): Promise<typeof mockTrendData> {
  await pause();
  return [...mockTrendData];
}

export async function getDeadlines(): Promise<Deadline[]> {
  await pause();
  return [...mockDeadlines];
}