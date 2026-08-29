import type { CheckIn } from '../types';
import type { ExtractedSignal, DetectedPattern, ExplainabilityContext } from './types';

/**
 * Builds explainability and grounding context for a pattern and its contributing signals.
 */
export function generateExplainability(
  pattern: DetectedPattern,
  signals: ExtractedSignal[],
  latestCheckIn?: CheckIn | null
): ExplainabilityContext {
  const directObservations: string[] = [];
  const contributingSignalLabels: string[] = [];

  // 1. Gather labels from contributing signals
  pattern.contributingSignalIds.forEach((id) => {
    const sig = signals.find((s) => s.id === id);
    if (sig) {
      contributingSignalLabels.push(sig.label);
      directObservations.push(sig.contextStatement);
    }
  });

  // If reflection was provided and not already included, add note factor
  const reflectionSig = signals.find((s) => s.category === 'reflection');
  if (reflectionSig && !contributingSignalLabels.includes(reflectionSig.label)) {
    contributingSignalLabels.push(reflectionSig.label);
  }

  // Ensure at least 3 contributing factors for rich UI display
  if (contributingSignalLabels.length < 3 && latestCheckIn) {
    if (!contributingSignalLabels.some((l) => l.includes('Sleep'))) {
      contributingSignalLabels.push(`Sleep rated ${latestCheckIn.sleep} / 5`);
    }
    if (!contributingSignalLabels.some((l) => l.includes('Workload'))) {
      contributingSignalLabels.push(`Workload rated ${latestCheckIn.workload} / 5`);
    }
    if (!contributingSignalLabels.some((l) => l.includes('Stress'))) {
      contributingSignalLabels.push(`Stress rated ${latestCheckIn.stress} / 5`);
    }
  }

  let rationale = 'Signals reflect self-reported check-in scores and current course milestones.';
  let guidance = 'Focus on manageable, bite-sized tasks and protect downtime where possible.';

  switch (pattern.id) {
    case 'WORKLOAD_CONCENTRATION':
      rationale =
        'When multiple project milestones cluster together, perceived cognitive workload rises sharply. High workload scores combined with near-term submissions indicate a temporary concentration point.';
      guidance =
        'Breaking larger assignments into a single 45-minute focused segment or shifting secondary tasks removes immediate bottleneck pressure.';
      break;

    case 'SLEEP_ENERGY_DEPLETION':
      rationale =
        'Reduced rest directly constrains available focus and executive capacity during study sessions. Recognizing this loop early helps avoid overcommitting.';
      guidance =
        'Prioritize winding down 30 minutes earlier tonight and avoid scheduling high-stakes revision late in the evening.';
      break;

    case 'SUSTAINED_POSITIVE_MOMENTUM':
      rationale =
        'High mood and steady energy with low stress create an optimal window for complex synthesis, deep writing, or advancing difficult coursework.';
      guidance =
        'Use this positive momentum to tackle challenging concepts or prepare outlines for future deadlines in advance.';
      break;

    case 'RECOVERY_PACING_STRAIN':
      rationale =
        'Carrying a heavy workload on lower rest creates invisible friction. Even if mood is steady, pacing adjustments prevent fatigue buildup.';
      guidance =
        'Insert deliberate 10-minute micro-breaks between study blocks and protect meal/sleep boundaries.';
      break;

    case 'EMOTIONAL_OVERWHELM':
      rationale =
        'Elevated stress combined with low energy signals that mental reserves are being heavily taxed.';
      guidance =
        'Pick one small, concrete step for today, and consider reaching out to institutional support or a trusted peer.';
      break;

    case 'ACADEMIC_ANCHOR':
      rationale =
        'Consistent attendance and strong coursework marks in specific subjects demonstrate existing mastery and self-efficacy.';
      guidance =
        'Borrow confidence and structured study habits from anchor subjects when tackling more demanding modules.';
      break;

    case 'BALANCED_EQUILIBRIUM':
      rationale =
        'All current metrics sit in a steady, moderate range with no acute spikes in pressure or fatigue.';
      guidance =
        'Maintain your current cadence, keeping regular check-in checkpoints throughout the term.';
      break;

    default:
      break;
  }

  return {
    directObservations,
    contributingSignals: contributingSignalLabels.slice(0, 3),
    rationale,
    guidance,
  };
}
