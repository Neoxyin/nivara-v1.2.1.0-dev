import { mockCheckIns } from '../data/checkins';
import { mockAcademicMetrics, mockDeadlines } from '../data/academics';
import { pause } from './mock-latency';
import type { Insight } from '../types';
import { generateInsightsFromCheckIns } from '../intelligence';
import type { IntelligencePipelineResult } from '../intelligence/types';

export async function getInsights(): Promise<Insight[]> {
  await pause();

  const result = generateInsightsFromCheckIns(mockCheckIns, {
    academicMetrics: mockAcademicMetrics,
    deadlines: mockDeadlines,
  });

  if (result.status === 'success' && result.insights.length > 0) {
    return result.insights;
  }

  // A real processing failure is distinct from "no check-ins yet" â€” throw so the
  // UI's error state (retry action) engages instead of silently showing the
  // insufficient-data empty state, which would misrepresent what happened.
  if (result.status === 'error') {
    throw new Error(result.errorMessage || 'Unable to process check-in signals');
  }

  // Insufficient data (e.g. no check-ins submitted yet): empty array lets the
  // UI show its calm "not enough signal yet" state.
  return [];
}

export async function getIntelligenceReport(): Promise<IntelligencePipelineResult> {
  await pause();

  return generateInsightsFromCheckIns(mockCheckIns, {
    academicMetrics: mockAcademicMetrics,
    deadlines: mockDeadlines,
  });
}
