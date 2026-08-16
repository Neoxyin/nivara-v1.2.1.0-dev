import type { CheckIn, AcademicMetric, Deadline } from '../types';
import type {
  IntelligencePipelineResult,
  GeneratedInsight,
  ExtractedSignal,
  DetectedPattern,
  ConfidenceAssessment,
} from './types';
import { extractSignals } from './signals';
import { weightSignals } from './weighting';
import { detectPatterns } from './patterns';
import { evaluateConfidence } from './confidence';
import { generateExplainability } from './explainability';

/**
 * Validates that a GeneratedInsight conforms to safety, schema, and quality standards.
 */
function validateInsight(insight: GeneratedInsight): boolean {
  if (!insight || typeof insight !== 'object') return false;
  if (!insight.title || typeof insight.title !== 'string' || insight.title.trim().length === 0) return false;
  if (!insight.summary || typeof insight.summary !== 'string' || insight.summary.trim().length === 0) return false;
  if (!Array.isArray(insight.contributingFactors) || insight.contributingFactors.length === 0) return false;
  if (!insight.certainty || typeof insight.certainty !== 'string') return false;
  if (!['watch', 'steady', 'positive'].includes(insight.tone)) return false;
  if (!Array.isArray(insight.actions) || insight.actions.length === 0) return false;
  return true;
}

/**
 * Converts a primary pattern into a validated user-facing insight.
 */
function buildPrimaryInsight(
  pattern: DetectedPattern,
  signals: ExtractedSignal[],
  confidence: ConfidenceAssessment,
  latestCheckIn: CheckIn | null
): GeneratedInsight {
  const explainability = generateExplainability(pattern, signals, latestCheckIn);
  const certaintyLabel = confidence.label;

  let title = 'Weekly workload & rhythm';
  let summary =
    'Your latest check-in reflects steady pace alongside current course requirements.';
  let tone: 'watch' | 'steady' | 'positive' = pattern.tone;
  let actions = ['Break your next deadline into one small step', 'Check in again tomorrow'];

  switch (pattern.id) {
    case 'WORKLOAD_CONCENTRATION':
      title = 'Your workload is concentrating';
      summary = `Two high-effort submissions land within the next 48 hours. Your latest check-in also reflects elevated workload (${latestCheckIn?.workload ?? 4}/5) and sleep at ${latestCheckIn?.sleep ?? 2}/5.`;
      tone = 'watch';
      actions = ['Break the next deadline into one 45-minute block', 'Move one lower-priority task to later this week'];
      break;

    case 'SLEEP_ENERGY_DEPLETION':
      title = 'Energy and rest appear connected';
      summary = `Your latest check-in indicates lower sleep (${latestCheckIn?.sleep ?? 2}/5) alongside reduced available energy (${latestCheckIn?.energy ?? 2}/5). Pacing today's work protects your recovery.`;
      tone = 'watch';
      actions = ['Wind down 30 minutes earlier tonight', 'Keep today to shorter, lower-stakes tasks'];
      break;

    case 'SUSTAINED_POSITIVE_MOMENTUM':
      title = 'Positive study momentum';
      summary = `Your responses suggest steady energy (${latestCheckIn?.energy ?? 4}/5) and an upbeat mood (${latestCheckIn?.mood ?? 4}/5) with low stress. A good window for focused progress.`;
      tone = 'positive';
      actions = ['Use this window for your hardest task', 'Get a head start on an upcoming deadline'];
      break;

    case 'RECOVERY_PACING_STRAIN':
      title = 'Pacing and workload balance';
      summary = `While your mood remains steady, elevated academic workload (${latestCheckIn?.workload ?? 4}/5) combined with lighter sleep (${latestCheckIn?.sleep ?? 2}/5) suggests protecting small recovery intervals.`;
      tone = 'watch';
      actions = ['Add a 10-minute break between study blocks', 'Protect tonight\u2019s sleep window'];
      break;

    case 'EMOTIONAL_OVERWHELM':
      title = 'Stress signals are elevated';
      summary = `Your check-in indicates higher stress (${latestCheckIn?.stress ?? 4}/5) and lower energy. Taking things in single 20-minute focus blocks will keep pressure manageable.`;
      tone = 'watch';
      actions = ['Pick one small, concrete step for today', 'Talk it through with a counsellor'];
      break;

    case 'BALANCED_EQUILIBRIUM':
    default:
      title = 'Steady workload & rhythm';
      summary = `Your latest snapshot reflects a balanced pace (mood ${latestCheckIn?.mood ?? 3}/5, energy ${latestCheckIn?.energy ?? 3}/5, stress ${latestCheckIn?.stress ?? 3}/5).`;
      tone = 'steady';
      actions = ['Keep your current rhythm going', 'Check in again tomorrow'];
      break;
  }

  const candidate: GeneratedInsight = {
    id: `insight-primary-${pattern.id.toLowerCase()}`,
    title,
    summary,
    contributingFactors: explainability.contributingSignals,
    certainty: certaintyLabel,
    tone,
    actions,
    patternId: pattern.id,
    confidenceLevel: confidence.level,
    explainability,
  };

  // Fallback guard
  if (!validateInsight(candidate)) {
    return {
      id: 'insight-primary-fallback',
      title: 'Weekly workload & rhythm',
      summary: 'Your latest check-in reflects steady pace alongside current course requirements.',
      contributingFactors: ['Sleep rated 3 / 5', 'Workload rated 3 / 5', 'Stress rated 3 / 5'],
      certainty: 'Good confidence · based on latest check-in signals',
      tone: 'steady',
      actions: ['Keep your current rhythm going', 'Check in again tomorrow'],
      patternId: 'BALANCED_EQUILIBRIUM',
      confidenceLevel: 'moderate',
    };
  }

  return candidate;
}

/**
 * Builds the secondary/anchor insight card.
 */
function buildAnchorInsight(
  signals: ExtractedSignal[],
  academicMetrics: AcademicMetric[] = []
): GeneratedInsight {
  const topSubject = academicMetrics.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), {
    subject: 'Design research',
    score: 84,
    attendance: 97,
    workload: 52,
    trend: 'steady' as const,
  });

  const anchor: GeneratedInsight = {
    id: 'insight-anchor-academic',
    title: `${topSubject.subject} is a reliable anchor`,
    summary: `Your strongest marks (${topSubject.score}%) and most consistent attendance (${topSubject.attendance}%) are in ${topSubject.subject}. It may be a useful place to borrow momentum from.`,
    contributingFactors: [
      `${topSubject.score}% latest score`,
      `${topSubject.attendance}% attendance`,
      'Steady workload',
    ],
    certainty: 'Good confidence · based on academic data',
    tone: 'positive',
    actions: ['Use your fieldwork notes as a starting point'],
    patternId: 'ACADEMIC_ANCHOR',
    confidenceLevel: 'high',
    explainability: {
      directObservations: [`Strong academic track record in ${topSubject.subject}`],
      contributingSignals: [`${topSubject.score}% score`, `${topSubject.attendance}% attendance`],
      rationale: 'Academic anchors provide psychological grounding and proof of capability during high-stress weeks.',
      guidance: 'Draw from your strongest research practices when navigating challenging assignments.',
    },
  };

  return anchor;
}

/**
 * Main Insight Intelligence Engine pipeline:
 * RAW CHECK-IN DATA -> SIGNALS -> WEIGHTING -> PATTERNS -> CONFIDENCE -> INSIGHTS + EXPLAINABILITY
 */
export function generateInsightsFromCheckIns(
  checkIns: CheckIn[] = [],
  options?: {
    academicMetrics?: AcademicMetric[];
    deadlines?: Deadline[];
  }
): IntelligencePipelineResult {
  try {
    const latestCheckIn = checkIns.length > 0 ? checkIns[0] : null;
    const recentCheckIns = checkIns.slice(0, 5);
    const academicMetrics = options?.academicMetrics || [];
    const deadlines = options?.deadlines || [];

    // Step 1: Signal Extraction
    const extractedSignals = extractSignals(latestCheckIn, recentCheckIns, academicMetrics, deadlines);

    // Step 2: Signal Weighting
    const weightedSignals = weightSignals(extractedSignals, recentCheckIns);

    // Step 3: Pattern Detection
    const detectedPatterns = detectPatterns(weightedSignals, recentCheckIns);

    // Step 4: Confidence Assessment
    const confidence = evaluateConfidence(weightedSignals, detectedPatterns, latestCheckIn);

    // Check if data is completely missing or insufficient
    if (!latestCheckIn || extractedSignals.length === 0) {
      return {
        status: 'insufficient_data',
        signals: [],
        patterns: [],
        insights: [],
        confidence,
        primaryInsight: null,
        anchorInsight: null,
        metadata: {
          processedAt: new Date().toISOString(),
          checkInCount: 0,
          hasReflection: false,
        },
      };
    }

    // Step 5: Insight Generation
    const primaryPattern =
      detectedPatterns.find((p) => p.id !== 'ACADEMIC_ANCHOR') ||
      detectedPatterns[0] || {
        id: 'BALANCED_EQUILIBRIUM' as const,
        name: 'Steady rhythm',
        category: 'equilibrium',
        contributingSignalIds: ['sig-workload'],
        strength: 0.7,
        confidenceScore: 0.75,
        certaintyLevel: 'moderate' as const,
        supportingContext: ['Snapshot is steady.'],
        tone: 'steady' as const,
      };

    const primaryInsight = buildPrimaryInsight(primaryPattern, weightedSignals, confidence, latestCheckIn);
    const anchorInsight = buildAnchorInsight(weightedSignals, academicMetrics);

    const validatedInsights: GeneratedInsight[] = [primaryInsight, anchorInsight].filter(validateInsight);

    return {
      status: 'success',
      signals: weightedSignals,
      patterns: detectedPatterns,
      insights: validatedInsights,
      confidence,
      primaryInsight,
      anchorInsight,
      metadata: {
        processedAt: new Date().toISOString(),
        checkInCount: checkIns.length,
        hasReflection: Boolean(latestCheckIn.reflection && latestCheckIn.reflection.trim().length > 0),
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown insight processing error';
    return {
      status: 'error',
      signals: [],
      patterns: [],
      insights: [],
      confidence: {
        level: 'insufficient',
        score: 0,
        reasons: [errorMsg],
        isSufficientForInsight: false,
        label: 'Unable to process signals',
      },
      primaryInsight: null,
      anchorInsight: null,
      errorMessage: errorMsg,
      metadata: {
        processedAt: new Date().toISOString(),
        checkInCount: checkIns.length,
        hasReflection: false,
      },
    };
  }
}
