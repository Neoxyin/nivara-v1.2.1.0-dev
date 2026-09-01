/**
 * NIVARA SIH 2026 - Administrative & Governance Data Models
 * 
 * CORE GOVERNANCE PRINCIPLES:
 * 1. Observe → Understand → Govern → Improve.
 * 2. Strictly non-punitive: No grade alterations, no disciplinary flags, no attendance penalties.
 * 3. Enforce privacy boundaries: Differential privacy (k-anonymity), no clinical counselling notes exposed.
 * 4. Algorithmic fairness: Anti-bias & disparate impact verification.
 * 5. Right to Rectification: GDPR / DPDP Art 16 audit ledger for data corrections.
 */

export type SupportNeedLevel =
  | "LOW"
  | "MILD"
  | "MODERATE"
  | "HIGH";

export type DemandDimension =
  | "academic"
  | "wellbeing";

export type CounsellorStatus =
  | "pending"
  | "active"
  | "inactive";

export type ConsentCategory =
  | "academic"
  | "financial"
  | "wellbeing"
  | "ai";

export interface CampusStats {
  totalStudents: number;
  activeCounsellors: number;
  openCases: number;
  activeConsentRate?: number;
  weeklyCheckinVolume?: number;
  flaggedDemographicDisparities?: number;
  averageRhythmIndex?: number;
  systemUptime?: number;
}

// Backwards-compatible alias
export type AdminStats = CampusStats;

export interface WellnessTrendPoint {
  period: string;
  mood: number;
  stress: number;
  sleep: number;
  energy: number;
  // Derived / chart compatibility fields
  week?: string;
  avgRhythm?: number;
  avgEnergy?: number;
  avgStress?: number;
  checkinCount?: number;
}

// Backwards-compatible alias
export type CampusWellnessTrend = WellnessTrendPoint;

export interface DemandTrendPoint {
  period: string;
  low: number;
  mild: number;
  moderate: number;
  high: number;
  dimension?: DemandDimension;
  department?: string;
  undergradRequests?: number;
  gradRequests?: number;
  examPeriodMultiplier?: number;
  peakHour?: string;
  topStressFactors?: string[];
}

export interface FairnessGroupMetric {
  group: string;
  sampleSize: number;
  selectionRate: number;
  falsePositiveRate?: number;
  falseNegativeRate?: number;
  truePositiveRate?: number;
  disparateImpact?: number;
  sufficientData: boolean;
}

export interface FairnessMetrics {
  dimension: string;
  referenceGroup: string;
  groups: FairnessGroupMetric[];
  humanReviewRequired: boolean;
  lastEvaluated: string;
}

export interface FairnessMetric {
  id: string;
  cohort: string;
  sampleSize: number;
  supportNudgeRate: number; // percentage
  acceptanceRate: number; // percentage
  sentimentParityRatio: number; // 1.0 is ideal mathematical parity
  parityStatus: 'balanced' | 'flagged' | 'under-represented';
  notes: string;
}

export interface SupportResource {
  id: string;
  title: string;
  description: string;
  category: "academic" | "financial" | "wellbeing" | "general";
  provider: string;
  contact?: string;
  url?: string;
  location?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backwards-compatible alias for existing imports
export type AdminResource = SupportResource;

export interface SupportProgram {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: "scholarship" | "fee-assistance" | "emergency-fund" | "hostel" | "food" | "transport" | "equipment" | "work-study" | "government-scheme";
  eligibilitySummary: string;
  applicationUrl?: string;
  deadline?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CounsellorWorkload {
  upcomingSessions: number;
  pendingRequests: number;
  openFollowUps: number;
}

export interface AdminCounsellor {
  id: string;
  name: string;
  email: string;
  department?: string;
  specialization?: string;
  status: CounsellorStatus;
  workload: {
    upcomingSessions: number;
    pendingRequests: number;
    openFollowUps: number;
  };
  activeStudents?: number;
  capacity?: number;
  completedSessions?: number;
  avgSatisfactionRating?: number;
  burnoutRiskScore?: 'low' | 'moderate' | 'elevated';
}

export type Counsellor = AdminCounsellor;

/**
 * Privacy-preserving student directory entry.
 * STRICT PRIVACY BOUNDARY:
 * Explicitly excludes private clinical notes, raw journal text, or sensitive diagnoses.
 */
export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  studentNumber: string;
  department: string;
  program?: string;
  year: number;
  status: 'active' | 'inactive';
  consentLevel: 'full' | 'academic-only' | 'wellbeing-only' | 'revoked';
  assignedCounsellor?: string;
  lastActivityDate: string;
  joinedAt?: string;
}

export type AdminStudentRoster = AdminStudent;

export type ConsentAction = 'granted' | 'withdrawn' | 'updated';
export type ConsentStatus = 'allowed' | 'withdrawn';

/**
 * Immutable audit trail of student consent modifications with cryptographic verification hash.
 */
export interface ConsentAuditLog {
  id: string;
  studentId: string;
  studentName?: string;
  category: 'academic' | 'financial' | 'wellbeing' | 'ai';
  fields: string[];
  status: 'allowed' | 'withdrawn';
  timestamp: string;
  consentVersion: string;
  action: 'granted' | 'withdrawn' | 'updated';
  ipAddress?: string;
  verificationHash?: string;
}

export type SystemStatus = "operational" | "degraded" | "offline";

export interface SystemServiceHealth {
  name: string;
  status: SystemStatus;
  latencyMs?: number;
  uptimePercentage?: number;
  lastVerified?: string;
}

export interface SystemHealthNode {
  name: string;
  latencyMs: number;
  status: 'healthy' | 'degraded' | 'offline';
  uptimePercentage: number;
  protocol?: string;
}

export type CorrectionRequestStatus = 'pending' | 'approved' | 'rejected';

/**
 * Right to Rectification (GDPR / DPDP Art 16): a student-submitted appeal to
 * correct an institutional record (attendance, program details, etc).
 */
export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName?: string;
  field: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  status: CorrectionRequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  reviewNotes?: string;
}

/**
 * Immutable audit ledger entry recorded whenever a correction request is
 * approved or rejected.
 */
export interface CorrectionAuditRecord {
  requestId: string;
  studentId?: string;
  action: 'approved' | 'rejected';
  timestamp: string;
  reviewedBy: string;
  reviewNote?: string;
}
