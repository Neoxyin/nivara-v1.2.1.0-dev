import type { CheckIn } from '../types';
import type { ExtractedSignal, DetectedPattern, ConfidenceAssessment } from './types';

/**
 * Assesses data sufficiency, coherence, and confidence for insight generation.
 */
export function evaluateConfidence(
  signals: ExtractedSignal[],
  patterns: DetectedPattern[],
  latestCheckIn?: CheckIn | null
): ConfidenceAssessment {
  if (!latestCheckIn || signals.length === 0) {
    return {
      level: 'insufficient',
      score: 0.0,
      reasons: ['No recent check-in response found.'],
      isSufficientForInsight: false,
      label: 'Insufficient data · take a check-in to generate signals',
    };
  }

  // Count active non-neutral signals
  const activeStrain = signals.filter((s) => s.polarity === 'strain');
  const activeVitality = signals.filter((s) => s.polarity === 'vitality');
  const nonNeutralCount = activeStrain.length + activeVitality.length;

  // If student answered neutral 3/5 on everything with no notes
  const isCompletelyFlat =
    latestCheckIn.mood === 3 &&
    latestCheckIn.energy === 3 &&
    latestCheckIn.stress === 3 &&
    latestCheckIn.sleep === 3 &&
    latestCheckIn.workload === 3 &&
    (!latestCheckIn.reflection || latestCheckIn.reflection.trim().length === 0);

  if (isCompletelyFlat) {
    return {
      level: 'moderate',
      score: 0.65,
      reasons: ['All snapshot responses are in the neutral middle band.'],
      isSufficientForInsight: true,
      label: 'Moderate confidence · based on steady baseline responses',
    };
  }

  // High alignment between signals
  const primaryPattern = patterns.find((p) => p.id !== 'ACADEMIC_ANCHOR' && p.id !== 'INSUFFICIENT_EVIDENCE');

  if (primaryPattern && (primaryPattern.strength >= 0.8 || activeStrain.length >= 2 || activeVitality.length >= 2)) {
    return {
      level: 'high',
      score: Math.min(0.95, primaryPattern.confidenceScore),
      reasons: [
        'Multiple aligned signals across physical rest, cognitive load, and energy.',
        'Directly grounded in latest submitted check-in ratings.',
      ],
      isSufficientForInsight: true,
      label: `High confidence · based on ${primaryPattern.contributingSignalIds.length} aligned signals`,
    };
  }

  return {
    level: 'moderate',
    score: 0.75,
    reasons: ['Single check-in snapshot provides moderate observational clarity.'],
    isSufficientForInsight: true,
    label: 'Good confidence · based on latest check-in snapshot',
  };
}
