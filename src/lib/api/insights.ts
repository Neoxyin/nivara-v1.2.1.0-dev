import { getCheckIns } from './checkins';
import { mockAcademicMetrics, mockDeadlines } from '../data/academics';
import { pause } from './mock-latency';
import type { Insight } from '../types';
import { generateInsightsFromCheckIns } from '../intelligence';
import type { IntelligencePipelineResult } from '../intelligence/types';

export async function getInsights(): Promise<Insight[]> {
  await pause();
  const allCheckIns = await getCheckIns();
  const eligibleCheckIns = allCheckIns.filter(
    (c) => c.assessmentEligibility === 'ELIGIBLE' || c.isAssessmentEligible === true
  );

  const result = generateInsightsFromCheckIns(eligibleCheckIns, {
    academicMetrics: mockAcademicMetrics,
    deadlines: mockDeadlines,
  });

  if (result.status === 'success' && result.insights.length > 0) {
    return result.insights;
  }

  // A real processing failure is distinct from "no check-ins yet"
  if (result.status === 'error') {
    throw new Error(result.errorMessage || 'Unable to process check-in signals');
  }

  // Insufficient data (e.g. no eligible check-ins submitted yet): empty array lets the
  // UI show its calm "not enough signal yet" state.
  return [];
}

export async function getIntelligenceReport(): Promise<IntelligencePipelineResult> {
  await pause();
  const allCheckIns = await getCheckIns();
  const eligibleCheckIns = allCheckIns.filter(
    (c) => c.assessmentEligibility === 'ELIGIBLE' || c.isAssessmentEligible === true
  );

  return generateInsightsFromCheckIns(eligibleCheckIns, {
    academicMetrics: mockAcademicMetrics,
    deadlines: mockDeadlines,
  });
}
