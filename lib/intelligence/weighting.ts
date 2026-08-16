import type { CheckIn } from '../types';
import type { ExtractedSignal } from './types';

/**
 * Weights and contextualizes extracted signals based on cross-signal compounding
 * and recent check-in trends.
 */
export function weightSignals(
  signals: ExtractedSignal[],
  recentCheckIns: CheckIn[] = []
): ExtractedSignal[] {
  if (!signals || signals.length === 0) {
    return [];
  }

  // Create shallow clones of signals to apply weights deterministically
  const weighted = signals.map((sig) => ({ ...sig }));

  const sleepSig = weighted.find((s) => s.category === 'sleep');
  const energySig = weighted.find((s) => s.category === 'energy');
  const stressSig = weighted.find((s) => s.category === 'stress');
  const workloadSig = weighted.find((s) => s.category === 'workload');
  const moodSig = weighted.find((s) => s.category === 'mood');
  const deadlineSig = weighted.find((s) => s.id === 'sig-academic-deadlines');

  // Compounding Effect 1: Sleep disruption + Energy depletion
  if (sleepSig?.polarity === 'strain' && energySig?.polarity === 'strain') {
    sleepSig.weight = Math.min(1.0, sleepSig.weight + 0.15);
    energySig.weight = Math.min(1.0, energySig.weight + 0.15);
    sleepSig.contextStatement = 'Sleep disruption is actively compounding daytime energy drain.';
    energySig.contextStatement = 'Energy depletion is strongly coupled with recent low rest.';
  }

  // Compounding Effect 2: Workload volume + High stress + Urgent deadlines
  if (workloadSig?.polarity === 'strain' && stressSig?.polarity === 'strain') {
    workloadSig.weight = Math.min(1.0, workloadSig.weight + 0.15);
    stressSig.weight = Math.min(1.0, stressSig.weight + 0.15);
    if (deadlineSig) {
      deadlineSig.weight = Math.min(1.0, deadlineSig.weight + 0.1);
      workloadSig.contextStatement = 'Heavy course workload coincides with near-term submission deadlines.';
    }
  }

  // Compounding Effect 3: Sustained positive momentum (Good mood + Good energy + Low stress)
  if (moodSig?.polarity === 'vitality' && energySig?.polarity === 'vitality' && stressSig?.polarity === 'vitality') {
    moodSig.weight = Math.min(1.0, moodSig.weight + 0.1);
    energySig.weight = Math.min(1.0, energySig.weight + 0.1);
    moodSig.contextStatement = 'Positive mood, strong energy, and quiet stress create resilient study conditions.';
  }

  // Multi-day trend reinforcement: Check previous 2 check-ins if available
  if (recentCheckIns.length > 1) {
    const historicalSleepAvg =
      recentCheckIns.slice(1, 3).reduce((acc, c) => acc + (Number(c.sleep) || 3), 0) /
      Math.min(2, recentCheckIns.length - 1);

    if (sleepSig && sleepSig.polarity === 'strain' && historicalSleepAvg <= 2.5) {
      sleepSig.weight = Math.min(1.0, sleepSig.weight + 0.1);
      sleepSig.contextStatement = 'Sleep disruption has persisted across multiple recent check-ins.';
    }

    const historicalWorkloadAvg =
      recentCheckIns.slice(1, 3).reduce((acc, c) => acc + (Number(c.workload) || 3), 0) /
      Math.min(2, recentCheckIns.length - 1);

    if (workloadSig && workloadSig.polarity === 'strain' && historicalWorkloadAvg >= 3.5) {
      workloadSig.weight = Math.min(1.0, workloadSig.weight + 0.1);
      workloadSig.contextStatement = 'Academic workload has remained at elevated levels over consecutive check-ins.';
    }
  }

  return weighted;
}
