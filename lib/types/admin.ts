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
  | "financial"
  | "wellbeing";

export type CounsellorStatus =
  | "pending"
  | "active"
  | "inactive";

export type CorrectionStatus =
  | "pending"
  | "approved"
  | "rejected";

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
  pendingCorrectionRequests?: number;
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

export interface AdminResource {
  id: string;
  title: string;
  category: 'Mental Health' | 'Academic Rhythm' | 'Financial & Food' | 'Emergency Crisis' | 'Accessibility';
  format: 'Guide' | 'Hotline' | 'Booking' | 'Toolkit';
  targetAudience: string;
  verifiedBy: string;
  lastAudited: string;
  status: 'published' | 'review' | 'archived';
  viewsThisMonth: number;
  description?: string;
}

export interface SupportProgram {
  id: string;
  title: string;
  category: string;
  targetCohort: string;
  enrolledCount: number;
  capacity: number;
  status: 'active' | 'draft' | 'archived';
  facilitator: string;
  startDate: string;
  budgetAllocated: string;
  meetingCadence?: string;
}

export interface AdminCounsellor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  activeStudents: number;
  capacity: number;
  completedSessions: number;
  status: CounsellorStatus;
  avgSatisfactionRating: number;
  burnoutRiskScore?: 'low' | 'moderate' | 'elevated';
}

/**
 * Privacy-preserving student directory entry.
 * STRICT PRIVACY BOUNDARY:
 * Explicitly excludes private clinical notes, raw journal text, or sensitive diagnoses.
 */
export interface AdminStudentRoster {
  id: string;
  name: string;
  department: string;
  year: number;
  consentLevel: 'full' | 'academic-only' | 'wellbeing-only' | 'revoked';
  supportStatus: 'none' | 'active-plan' | 'monitoring' | 'completed';
  assignedCounsellor?: string;
  lastActivityDate: string;
}

/**
 * Data Correction Appeal model under GDPR / DPDP Right to Rectification.
 */
export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  dataType: 'attendance' | 'rhythm-log' | 'consent-record';
  currentValue: string;
  requestedValue: string;
  reason: string;
  submittedAt: string;
  status: CorrectionStatus;
  reviewNotes?: string;
}

/**
 * Immutable audit trail of student consent modifications with cryptographic verification hash.
 */
export interface ConsentAuditLog {
  id: string;
  studentId: string;
  studentName: string;
  category: ConsentCategory;
  action: 'granted' | 'revoked' | 'updated';
  timestamp: string;
  ipAddress: string;
  verificationHash: string;
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
