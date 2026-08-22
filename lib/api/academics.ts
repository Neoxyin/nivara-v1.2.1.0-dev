import {
  mockAcademicMetrics,
  mockAttendanceSummary,
  mockAcademicSuggestions,
  mockTrendData,
  mockDeadlines,
} from '../data/academics';
import { pause } from './mock-latency';
import type { AcademicMetric, Deadline, AcademicSuggestion } from '../types';

export async function getAcademicMetrics(): Promise<AcademicMetric[]> {
  await pause();
  return [...mockAcademicMetrics];
}

export async function getAttendanceSummary(): Promise<typeof mockAttendanceSummary> {
  await pause();
  return { ...mockAttendanceSummary };
}

export async function getAcademicSuggestions(): Promise<AcademicSuggestion[]> {
  await pause();
  return [...mockAcademicSuggestions];
}

export async function getTrendData(): Promise<typeof mockTrendData> {
  await pause();
  return [...mockTrendData];
}

export async function getDeadlines(): Promise<Deadline[]> {
  await pause();
  return [...mockDeadlines];
}
