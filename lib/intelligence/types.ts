import type { CheckIn, AcademicMetric, Deadline, Insight } from '../types';

export type SignalCategory = 
  | 'sleep'
  | 'energy'
  | 'stress'
  | 'workload'
  | 'mood'
  | 'reflection'
  | 'academic_context';

export type SignalPolarity = 'strain' | 'neutral' | 'vitality';

export type SignalSeverity = 'mild' | 'moderate' | 'elevated' | 'severe';

export interface ExtractedSignal {
  id: string;
  category: SignalCategory;
  name: string;
  label: string;
  rawValue: number | string;
  normalizedScore: number; // 0 to 1 (intensity)
  polarity: SignalPolarity;
  severity: SignalSeverity;
  weight: number; // 0 to 1
  confidence: number; // 0 to 1
  contextStatement: string;
}

export type PatternId = 
  | 'WORKLOAD_CONCENTRATION'
  | 'SLEEP_ENERGY_DEPLETION'
  | 'SUSTAINED_POSITIVE_MOMENTUM'
  | 'RECOVERY_PACING_STRAIN'
  | 'EMOTIONAL_OVERWHELM'
  | 'ACADEMIC_ANCHOR'
  | 'BALANCED_EQUILIBRIUM'
  | 'INSUFFICIENT_EVIDENCE';

export interface DetectedPattern {
  id: PatternId;
  name: string;
  category: string;
  contributingSignalIds: string[];
  strength: number; // 0 to 1
  confidenceScore: number; // 0 to 1
  certaintyLevel: 'high' | 'moderate' | 'low' | 'insufficient';
  supportingContext: string[];
  tone: 'watch' | 'steady' | 'positive';
}

export interface ExplainabilityContext {
  directObservations: string[];
  contributingSignals: string[];
  rationale: string;
  guidance: string;
}

export interface ConfidenceAssessment {
  level: 'high' | 'moderate' | 'low' | 'insufficient';
  score: number; // 0 to 1
  reasons: string[];
  isSufficientForInsight: boolean;
  label: string;
}

export interface GeneratedInsight extends Insight {
  id: string;
  patternId: PatternId;
  confidenceLevel: 'high' | 'moderate' | 'low' | 'insufficient';
  explainability?: ExplainabilityContext;
}

export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'insufficient_data' | 'error';

export interface IntelligencePipelineResult {
  status: ProcessingStatus;
  signals: ExtractedSignal[];
  patterns: DetectedPattern[];
  insights: GeneratedInsight[];
  confidence: ConfidenceAssessment;
  primaryInsight: GeneratedInsight | null;
  anchorInsight: GeneratedInsight | null;
  errorMessage?: string;
  metadata: {
    processedAt: string;
    checkInCount: number;
    hasReflection: boolean;
  };
}
