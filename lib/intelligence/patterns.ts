import type { CheckIn } from '../types';
import type { ExtractedSignal, DetectedPattern, PatternId } from './types';

/**
 * Detects grounded patterns across weighted signals.
 * Strictly non-diagnostic and rooted in self-reported check-in responses and academic context.
 */
export function detectPatterns(
  signals: ExtractedSignal[],
  recentCheckIns: CheckIn[] = []
): DetectedPattern[] {
  if (!signals || signals.length === 0) {
    return [
      {
        id: 'INSUFFICIENT_EVIDENCE',
        name: 'Insufficient check-in data',
        category: 'general',
        contributingSignalIds: [],
        strength: 0.1,
        confidenceScore: 0.1,
        certaintyLevel: 'insufficient',
        supportingContext: ['No check-in responses are currently available.'],
        tone: 'steady',
      },
    ];
  }

  const detected: DetectedPattern[] = [];

  const getSig = (cat: string) => signals.find((s) => s.category === cat);
  const sleepSig = getSig('sleep');
  const energySig = getSig('energy');
  const stressSig = getSig('stress');
  const workloadSig = getSig('workload');
  const moodSig = getSig('mood');
  const deadlineSig = signals.find((s) => s.id === 'sig-academic-deadlines');
  const anchorSig = signals.find((s) => s.id === 'sig-academic-anchor');

  const sleepVal = Number(sleepSig?.rawValue ?? 3);
  const energyVal = Number(energySig?.rawValue ?? 3);
  const stressVal = Number(stressSig?.rawValue ?? 3);
  const workloadVal = Number(workloadSig?.rawValue ?? 3);
  const moodVal = Number(moodSig?.rawValue ?? 3);

  // Pattern 1: Workload Concentration (Elevated workload + Elevated stress or Deadlines)
  if (workloadVal >= 4 && (stressVal >= 4 || deadlineSig || energyVal <= 2)) {
    const contributingIds: string[] = ['sig-workload'];
    if (stressVal >= 4) contributingIds.push('sig-stress');
    if (deadlineSig) contributingIds.push('sig-academic-deadlines');
    if (energyVal <= 2) contributingIds.push('sig-energy');
    if (sleepVal <= 2) contributingIds.push('sig-sleep');

    const strength = Math.min(
      0.95,
      ((workloadVal - 3) * 0.25 + (stressVal >= 4 ? 0.3 : 0.1) + (deadlineSig ? 0.25 : 0.1))
    );

    detected.push({
      id: 'WORKLOAD_CONCENTRATION',
      name: 'Workload is concentrating',
      category: 'workload_pressure',
      contributingSignalIds: contributingIds,
      strength: Math.max(0.65, strength),
      confidenceScore: 0.9,
      certaintyLevel: 'high',
      supportingContext: [
        `Workload rated ${workloadVal} / 5`,
        stressVal >= 4 ? `Stress rated ${stressVal} / 5` : 'Near-term deliverables',
        deadlineSig ? deadlineSig.label : `Sleep rated ${sleepVal} / 5`,
      ],
      tone: 'watch',
    });
  }

  // Pattern 2: Sleep & Energy Depletion Loop
  if (sleepVal <= 2 && energyVal <= 2) {
    const contributingIds = ['sig-sleep', 'sig-energy'];
    if (stressVal >= 4) contributingIds.push('sig-stress');
    if (moodVal <= 2) contributingIds.push('sig-mood');

    detected.push({
      id: 'SLEEP_ENERGY_DEPLETION',
      name: 'Sleep and energy connection',
      category: 'recovery',
      contributingSignalIds: contributingIds,
      strength: 0.88,
      confidenceScore: 0.88,
      certaintyLevel: 'high',
      supportingContext: [
        `Sleep rated ${sleepVal} / 5`,
        `Energy rated ${energyVal} / 5`,
        stressVal >= 4 ? `Stress rated ${stressVal} / 5` : 'Daytime reserves limited',
      ],
      tone: 'watch',
    });
  }

  // Pattern 3: Sustained Positive Momentum
  if (moodVal >= 4 && energyVal >= 3 && stressVal <= 2) {
    detected.push({
      id: 'SUSTAINED_POSITIVE_MOMENTUM',
      name: 'Positive study momentum',
      category: 'vitality',
      contributingSignalIds: ['sig-mood', 'sig-energy', 'sig-stress'],
      strength: 0.85,
      confidenceScore: 0.85,
      certaintyLevel: 'high',
      supportingContext: [
        `Mood rated ${moodVal} / 5 (upbeat)`,
        `Energy rated ${energyVal} / 5 (available)`,
        `Stress rated ${stressVal} / 5 (quiet)`,
      ],
      tone: 'positive',
    });
  }

  // Pattern 4: Recovery & Pacing Strain (High workload + low sleep with moderate mood)
  if (workloadVal >= 4 && sleepVal <= 2 && !detected.some((p) => p.id === 'WORKLOAD_CONCENTRATION')) {
    detected.push({
      id: 'RECOVERY_PACING_STRAIN',
      name: 'Recovery and pacing imbalance',
      category: 'pacing',
      contributingSignalIds: ['sig-workload', 'sig-sleep'],
      strength: 0.75,
      confidenceScore: 0.8,
      certaintyLevel: 'moderate',
      supportingContext: [
        `Workload rated ${workloadVal} / 5`,
        `Sleep rated ${sleepVal} / 5`,
        'High output with reduced rest intervals',
      ],
      tone: 'watch',
    });
  }

  // Pattern 5: Emotional Overwhelm (High stress + low mood + drained energy)
  if (stressVal >= 4 && moodVal <= 2 && !detected.some((p) => p.id === 'SLEEP_ENERGY_DEPLETION' || p.id === 'WORKLOAD_CONCENTRATION')) {
    detected.push({
      id: 'EMOTIONAL_OVERWHELM',
      name: 'Heightened mental load',
      category: 'emotional_wellbeing',
      contributingSignalIds: ['sig-stress', 'sig-mood', 'sig-energy'],
      strength: 0.85,
      confidenceScore: 0.85,
      certaintyLevel: 'high',
      supportingContext: [
        `Stress rated ${stressVal} / 5`,
        `Mood rated ${moodVal} / 5`,
        `Energy rated ${energyVal} / 5`,
      ],
      tone: 'watch',
    });
  }

  // Pattern 6: Academic Anchor (Subject strength)
  if (anchorSig) {
    detected.push({
      id: 'ACADEMIC_ANCHOR',
      name: 'Academic anchor strength',
      category: 'academic_strength',
      contributingSignalIds: ['sig-academic-anchor'],
      strength: 0.8,
      confidenceScore: 0.9,
      certaintyLevel: 'high',
      supportingContext: [
        anchorSig.label,
        'Consistent attendance and strong results',
        'Useful foundation to build momentum from',
      ],
      tone: 'positive',
    });
  }

  // Pattern 7: Balanced Equilibrium (All middle-range 3s or steady ratings)
  if (
    detected.length === 0 ||
    (moodVal === 3 && energyVal === 3 && stressVal === 3 && sleepVal === 3 && workloadVal === 3)
  ) {
    detected.push({
      id: 'BALANCED_EQUILIBRIUM',
      name: 'Steady rhythm and balance',
      category: 'equilibrium',
      contributingSignalIds: ['sig-mood', 'sig-energy', 'sig-workload'],
      strength: 0.7,
      confidenceScore: 0.75,
      certaintyLevel: 'moderate',
      supportingContext: [
        `Mood and energy in moderate range (3 / 5)`,
        `Workload manageable (${workloadVal} / 5)`,
        'Rhythm is steady across academic activities',
      ],
      tone: 'steady',
    });
  }

  return detected;
}
