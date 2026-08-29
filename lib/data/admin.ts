import {
  CampusStats,
  WellnessTrendPoint,
  DemandTrendPoint,
  FairnessMetric,
  AdminResource,
  SupportProgram,
  AdminCounsellor,
  AdminStudentRoster,
  CorrectionRequest,
  ConsentAuditLog,
  SystemHealthNode,
  SystemServiceHealth,
} from '../types/admin';

// 1. Students Dataset (Privacy-Preserving Admin Roster)
export const students: AdminStudentRoster[] = [
  {
    id: 'STU-2026-081',
    name: 'Aarav Patel',
    department: 'Computer Science',
    year: 3,
    consentLevel: 'full',
    supportStatus: 'active-plan',
    assignedCounsellor: 'Dr. Aisha Rahman',
    lastActivityDate: '2026-08-28 09:15',
  },
  {
    id: 'STU-2026-104',
    name: 'Elena Rostova',
    department: 'Design & Media',
    year: 2,
    consentLevel: 'full',
    supportStatus: 'monitoring',
    assignedCounsellor: 'Dr. David Chen',
    lastActivityDate: '2026-08-27 16:40',
  },
  {
    id: 'STU-2026-219',
    name: 'Kavita Iyer',
    department: 'Bioengineering',
    year: 4,
    consentLevel: 'academic-only',
    supportStatus: 'none',
    lastActivityDate: '2026-08-28 11:30',
  },
  {
    id: 'STU-2026-302',
    name: 'Liam Zhang',
    department: 'Management',
    year: 1,
    consentLevel: 'full',
    supportStatus: 'active-plan',
    assignedCounsellor: 'Marcus Vance, MA',
    lastActivityDate: '2026-08-28 08:20',
  },
  {
    id: 'STU-2026-411',
    name: 'Sophia Miller',
    department: 'Humanities',
    year: 2,
    consentLevel: 'revoked',
    supportStatus: 'none',
    lastActivityDate: '2026-08-20 14:10',
  },
];

// 2. Counsellor Staff Dataset
export const counsellors: AdminCounsellor[] = [
  {
    id: 'coun-1',
    name: 'Dr. Aisha Rahman',
    email: 'aisha.rahman@nivara.edu',
    specialization: 'Cognitive Behavioral & Rhythm Therapy',
    activeStudents: 18,
    capacity: 22,
    completedSessions: 142,
    status: 'active',
    avgSatisfactionRating: 4.9,
    burnoutRiskScore: 'low',
  },
  {
    id: 'coun-2',
    name: 'Dr. David Chen',
    email: 'david.chen@nivara.edu',
    specialization: 'ADHD & Executive Function Coaching',
    activeStudents: 20,
    capacity: 20,
    completedSessions: 168,
    status: 'active',
    avgSatisfactionRating: 4.8,
    burnoutRiskScore: 'moderate',
  },
  {
    id: 'coun-3',
    name: 'Priya Sharma, LCSW',
    email: 'priya.sharma@nivara.edu',
    specialization: 'Mindfulness & Somatic Grounding',
    activeStudents: 14,
    capacity: 20,
    completedSessions: 96,
    status: 'active',
    avgSatisfactionRating: 5.0,
    burnoutRiskScore: 'low',
  },
  {
    id: 'coun-4',
    name: 'Marcus Vance, MA',
    email: 'marcus.vance@nivara.edu',
    specialization: 'Academic Distress & Burnout',
    activeStudents: 12,
    capacity: 18,
    completedSessions: 84,
    status: 'active',
    avgSatisfactionRating: 4.7,
    burnoutRiskScore: 'low',
  },
  {
    id: 'coun-5',
    name: 'Dr. Evelyn Morales',
    email: 'evelyn.morales@nivara.edu',
    specialization: 'Crisis Intervention & Trauma',
    activeStudents: 0,
    capacity: 20,
    completedSessions: 42,
    status: 'pending',
    avgSatisfactionRating: 4.9,
    burnoutRiskScore: 'low',
  },
];

// 3. Correction Requests Dataset
export const correctionRequests: CorrectionRequest[] = [
  {
    id: 'corr-1',
    studentId: 'STU-2026-081',
    studentName: 'Aarav Patel',
    dataType: 'attendance',
    currentValue: 'Absent on Aug 24 (Creative Coding)',
    requestedValue: 'Excused / Field Research Verification',
    reason: 'Approved fieldwork attendance slip submitted to course convenor.',
    submittedAt: '2026-08-26 14:00',
    status: 'pending',
    reviewNotes: 'Awaiting faculty liaison signed verification document.',
  },
  {
    id: 'corr-2',
    studentId: 'STU-2026-104',
    studentName: 'Elena Rostova',
    dataType: 'rhythm-log',
    currentValue: 'Energy score 20 on Aug 22',
    requestedValue: 'Energy score 80 (Misclick in quick check-in)',
    reason: 'Accidentally hit bottom rating slider during rapid check-in entry on mobile device.',
    submittedAt: '2026-08-23 18:20',
    status: 'approved',
    reviewNotes: 'Rectification applied to longitudinal aggregate graph.',
  },
  {
    id: 'corr-3',
    studentId: 'STU-2026-219',
    studentName: 'Kavita Iyer',
    dataType: 'consent-record',
    currentValue: 'Full Consent Enabled',
    requestedValue: 'Revoke AI Check-in Processing',
    reason: 'Student opted out of automated sentiment analysis.',
    submittedAt: '2026-08-27 10:15',
    status: 'pending',
    reviewNotes: 'Pending cryptographic ledger block entry.',
  },
];

// 4. Consent Audit Logs Dataset
export const consentAuditLogs: ConsentAuditLog[] = [
  {
    id: 'log-101',
    studentId: 'STU-2026-081',
    studentName: 'Aarav Patel',
    category: 'academic',
    action: 'granted',
    timestamp: '2026-08-28 09:15:22',
    ipAddress: '10.14.22.81',
    verificationHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'log-102',
    studentId: 'STU-2026-411',
    studentName: 'Sophia Miller',
    category: 'wellbeing',
    action: 'revoked',
    timestamp: '2026-08-20 14:10:05',
    ipAddress: '10.14.88.19',
    verificationHash: 'sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
  },
  {
    id: 'log-103',
    studentId: 'STU-2026-104',
    studentName: 'Elena Rostova',
    category: 'ai',
    action: 'updated',
    timestamp: '2026-08-18 11:04:45',
    ipAddress: '10.14.33.90',
    verificationHash: 'sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
  },
  {
    id: 'log-104',
    studentId: 'STU-2026-302',
    studentName: 'Liam Zhang',
    category: 'financial',
    action: 'granted',
    timestamp: '2026-08-15 16:22:10',
    ipAddress: '10.14.45.12',
    verificationHash: 'sha256:8b7123ef982cba1248039abfe21980312cbfa9821389012398abefc2890123ef',
  },
];

// 5. Wellness Longitudinal Trend Dataset (Aggregate campus averages on a 1-5 scale)
export const wellnessTrend: WellnessTrendPoint[] = [
  { period: 'Week 1', week: 'Week 1', mood: 4.1, stress: 2.1, sleep: 4.0, energy: 3.9, checkinCount: 2900 },
  { period: 'Week 2', week: 'Week 2', mood: 4.2, stress: 2.3, sleep: 3.9, energy: 3.8, checkinCount: 3100 },
  { period: 'Week 3', week: 'Week 3', mood: 3.9, stress: 2.7, sleep: 3.6, energy: 3.6, checkinCount: 3250 },
  { period: 'Week 4', week: 'Week 4', mood: 3.7, stress: 3.4, sleep: 3.3, energy: 3.2, checkinCount: 3420 },
  { period: 'Week 5', week: 'Week 5', mood: 3.5, stress: 3.8, sleep: 3.1, energy: 3.0, checkinCount: 3500 },
  { period: 'Week 6', week: 'Week 6 (Midterms)', mood: 3.4, stress: 4.2, sleep: 2.7, energy: 2.8, checkinCount: 3620 },
  { period: 'Week 7', week: 'Week 7', mood: 3.8, stress: 3.0, sleep: 3.5, energy: 3.4, checkinCount: 3340 },
  { period: 'Week 8', week: 'Week 8 (Current)', mood: 4.0, stress: 2.5, sleep: 3.8, energy: 3.7, checkinCount: 3240 },
];

// 6. Demand Trends Dataset
export const demandTrends: DemandTrendPoint[] = [
  {
    period: '2026-Q3',
    department: 'Computer Science & AI',
    dimension: 'academic',
    low: 45,
    mild: 80,
    moderate: 65,
    high: 20,
    undergradRequests: 142,
    gradRequests: 68,
    examPeriodMultiplier: 1.8,
    peakHour: '16:00 - 18:00',
    topStressFactors: ['Compiler Project Deadlines', 'Algorithmic Problem Sets'],
  },
  {
    period: '2026-Q3',
    department: 'Design & Interaction',
    dimension: 'wellbeing',
    low: 30,
    mild: 55,
    moderate: 35,
    high: 9,
    undergradRequests: 95,
    gradRequests: 34,
    examPeriodMultiplier: 1.5,
    peakHour: '14:00 - 16:00',
    topStressFactors: ['Studio Critique Reviews', 'Portfolio Assembly'],
  },
  {
    period: '2026-Q3',
    department: 'Bioengineering & Life Sciences',
    dimension: 'academic',
    low: 35,
    mild: 62,
    moderate: 48,
    high: 10,
    undergradRequests: 110,
    gradRequests: 45,
    examPeriodMultiplier: 1.6,
    peakHour: '11:00 - 13:00',
    topStressFactors: ['Lab Protocols', 'Organic Chemistry Practicals'],
  },
  {
    period: '2026-Q3',
    department: 'Humanities & Social Sciences',
    dimension: 'financial',
    low: 28,
    mild: 44,
    moderate: 30,
    high: 8,
    undergradRequests: 82,
    gradRequests: 28,
    examPeriodMultiplier: 1.3,
    peakHour: '13:00 - 15:00',
    topStressFactors: ['Term Paper Submissions', 'Fieldwork Analysis'],
  },
  {
    period: '2026-Q3',
    department: 'Management Studies',
    dimension: 'academic',
    low: 40,
    mild: 68,
    moderate: 50,
    high: 14,
    undergradRequests: 120,
    gradRequests: 52,
    examPeriodMultiplier: 1.7,
    peakHour: '15:00 - 17:00',
    topStressFactors: ['Case Competition Deadlines', 'Financial Modeling'],
  },
];

// 7. Fairness & Parity Dataset
export const fairnessMetrics: FairnessMetric[] = [
  {
    id: 'fair-1',
    cohort: 'First-Generation College Students',
    sampleSize: 640,
    supportNudgeRate: 24.2,
    acceptanceRate: 78.4,
    sentimentParityRatio: 0.98,
    parityStatus: 'balanced',
    notes: 'Support nudge acceptance is consistent with campus baseline. Disparate impact ratio within 4/5ths threshold.',
  },
  {
    id: 'fair-2',
    cohort: 'International & Non-Resident Students',
    sampleSize: 820,
    supportNudgeRate: 28.5,
    acceptanceRate: 82.1,
    sentimentParityRatio: 0.96,
    parityStatus: 'balanced',
    notes: 'High engagement with circadian rhythm and cultural adjustment toolkits; parity maintained.',
  },
  {
    id: 'fair-3',
    cohort: 'STEM High-Workload Undergraduates',
    sampleSize: 1850,
    supportNudgeRate: 34.0,
    acceptanceRate: 71.2,
    sentimentParityRatio: 1.02,
    parityStatus: 'balanced',
    notes: 'Higher volume of deadline-clustering check-ins accurately reflects lab assignment calendar.',
  },
  {
    id: 'fair-4',
    cohort: 'Postgraduate Research Scholars',
    sampleSize: 450,
    supportNudgeRate: 19.8,
    acceptanceRate: 64.5,
    sentimentParityRatio: 0.92,
    parityStatus: 'under-represented',
    notes: 'Lower opt-in rate for group sessions; recommending tailored asynchronous research cadence resources.',
  },
];

// 8. Verified Resources Dataset
export const resources: AdminResource[] = [
  {
    id: 'res-1',
    title: 'De-escalation & Panic Attack Immediate Protocol',
    category: 'Emergency Crisis',
    format: 'Hotline',
    targetAudience: 'All Campus Members',
    verifiedBy: 'Campus Health Directorate',
    lastAudited: '2026-08-15',
    status: 'published',
    viewsThisMonth: 1240,
    description: 'Direct priority contact for campus emergency dispatch and immediate de-escalation support.',
  },
  {
    id: 'res-2',
    title: 'Neurodiversity Focus & Sensory Rhythm Guide',
    category: 'Accessibility',
    format: 'Guide',
    targetAudience: 'ADHD / Autism Spectrum Cohorts',
    verifiedBy: 'Dr. Aisha Rahman',
    lastAudited: '2026-08-10',
    status: 'published',
    viewsThisMonth: 890,
    description: 'Evidence-based strategies for managing sensory overwhelm, hyperfocus transitions, and study pacing.',
  },
  {
    id: 'res-3',
    title: 'Emergency Micro-Bursary & Transit Aid Portal',
    category: 'Financial & Food',
    format: 'Booking',
    targetAudience: 'Underrepresented & Low-Income Students',
    verifiedBy: 'Dean of Student Affairs',
    lastAudited: '2026-08-01',
    status: 'published',
    viewsThisMonth: 430,
    description: 'Confidential micro-grant requests ($50-$250) for immediate food, medicine, and transit necessities.',
  },
  {
    id: 'res-4',
    title: 'Sleep Hygiene & Circadian Entrainment for Exam Blocks',
    category: 'Academic Rhythm',
    format: 'Toolkit',
    targetAudience: 'Undergraduates',
    verifiedBy: 'Wellness Committee',
    lastAudited: '2026-08-20',
    status: 'published',
    viewsThisMonth: 610,
    description: 'Practical sleep entrainment schedule to prevent burnout during midterm and final exam crunches.',
  },
];

// 9. Support Programs Dataset
export const supportPrograms: SupportProgram[] = [
  {
    id: 'prog-1',
    title: 'First-Year Academic Transition & Rhythm Cohort',
    category: 'Academic Rhythm',
    targetCohort: 'Freshmen (Batch 2026)',
    enrolledCount: 145,
    capacity: 150,
    status: 'active',
    facilitator: 'Dr. Aisha Rahman',
    startDate: '2026-08-01',
    budgetAllocated: '$4,000',
    meetingCadence: 'Weekly Tuesdays 17:00',
  },
  {
    id: 'prog-2',
    title: 'STEM Studio Stress Buffering Workshop',
    category: 'Stress & Rhythm',
    targetCohort: 'CS & Design Undergraduates',
    enrolledCount: 68,
    capacity: 80,
    status: 'active',
    facilitator: 'Dr. David Chen',
    startDate: '2026-08-15',
    budgetAllocated: '$2,800',
    meetingCadence: 'Bi-weekly Thursdays 18:00',
  },
  {
    id: 'prog-3',
    title: 'Postgraduate Thesis Isolation Countermeasures',
    category: 'Community & Peer Support',
    targetCohort: 'PhD & Masters Candidates',
    enrolledCount: 32,
    capacity: 40,
    status: 'active',
    facilitator: 'Priya Sharma, LCSW',
    startDate: '2026-08-10',
    budgetAllocated: '$1,500',
    meetingCadence: 'Monthly Saturdays 10:00',
  },
];

// 10. System Health Nodes & Services
export const systemServices: SystemServiceHealth[] = [
  { name: 'Core Services', status: 'operational', latencyMs: 14, uptimePercentage: 99.99, lastVerified: 'Just now' },
  { name: 'Data Sync', status: 'operational', latencyMs: 22, uptimePercentage: 99.97, lastVerified: '1m ago' },
  { name: 'Consent Enforcement', status: 'operational', latencyMs: 18, uptimePercentage: 100.0, lastVerified: 'Just now' },
  { name: 'Notifications', status: 'operational', latencyMs: 31, uptimePercentage: 99.95, lastVerified: '2m ago' },
];

export const systemHealthNodes: SystemHealthNode[] = [
  { name: 'Student Data Encryption Enclave', latencyMs: 14, status: 'healthy', uptimePercentage: 99.99, protocol: 'AES-256-GCM / Hardware HSM' },
  { name: 'Differential Privacy Aggregation Engine', latencyMs: 28, status: 'healthy', uptimePercentage: 99.95, protocol: 'Laplace Noise (ε=0.5, k=50)' },
  { name: 'Zero-Knowledge Consent Verifier', latencyMs: 19, status: 'healthy', uptimePercentage: 100.0, protocol: 'zk-SNARKs Proof Verification' },
  { name: 'Audit Trail Cryptographic Ledger', latencyMs: 34, status: 'healthy', uptimePercentage: 99.98, protocol: 'SHA-256 Merkle Chaining' },
];

// ==========================================
// DERIVED COMPUTATION FUNCTIONS (NO MOCK API)
// ==========================================

export function getCampusStats(): CampusStats {
  const activeCounsellorsCount = counsellors.filter((c) => c.status === 'active').length;
  const activeConsentCount = students.filter((s) => s.consentLevel === 'full' || s.consentLevel === 'academic-only').length;
  const openCasesCount = students.filter((s) => s.supportStatus === 'active-plan' || s.supportStatus === 'monitoring').length;
  const pendingCorrections = correctionRequests.filter((r) => r.status === 'pending').length;

  return {
    totalStudents: 4850, // Extrapolated institutional population representation
    activeCounsellors: activeCounsellorsCount,
    openCases: openCasesCount,
    activeConsentRate: Number(((activeConsentCount / students.length) * 100).toFixed(1)),
    weeklyCheckinVolume: 3240,
    pendingCorrectionRequests: pendingCorrections,
    flaggedDemographicDisparities: fairnessMetrics.filter((f) => f.parityStatus === 'flagged').length,
    averageRhythmIndex: 81.5,
    systemUptime: 99.98,
  };
}

export function getDemandSummary() {
  return demandTrends.map((d) => ({
    department: d.department || 'General',
    totalRequests: (d.undergradRequests || 0) + (d.gradRequests || 0),
    highNeedRequests: d.high,
    peakHour: d.peakHour || '14:00 - 16:00',
  }));
}

export function getConsentBreakdown() {
  const total = students.length;
  return {
    full: students.filter((s) => s.consentLevel === 'full').length,
    academicOnly: students.filter((s) => s.consentLevel === 'academic-only').length,
    wellbeingOnly: students.filter((s) => s.consentLevel === 'wellbeing-only').length,
    revoked: students.filter((s) => s.consentLevel === 'revoked').length,
    total,
  };
}

// ==========================================
// BACKWARDS-COMPATIBLE NAMED CONSTANTS
// ==========================================
export const campusStats: CampusStats = getCampusStats();
export const mockAdminStats = campusStats;
export const mockCampusWellnessTrends = wellnessTrend;
export const mockDemandTrendData = demandTrends;
export const mockFairnessMetrics = fairnessMetrics;
export const mockAdminResources = resources;
export const mockSupportPrograms = supportPrograms;
export const mockAdminCounsellors = counsellors;
export const mockAdminStudents = students;
export const mockCorrectionRequests = correctionRequests;
export const mockConsentLogs = consentAuditLogs;
export const mockSystemHealthNodes = systemHealthNodes;
