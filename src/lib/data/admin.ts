import {
  CampusStats,
  WellnessTrendPoint,
  DemandTrendPoint,
  FairnessMetrics,
  SupportResource,
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
    assignedCounsellor: 'Dr. Aisha Rahman',
    lastActivityDate: '2026-08-28 09:15',
  },
  {
    id: 'STU-2026-104',
    name: 'Elena Rostova',
    department: 'Design & Media',
    year: 2,
    consentLevel: 'full',
    assignedCounsellor: 'Dr. David Chen',
    lastActivityDate: '2026-08-27 16:40',
  },
  {
    id: 'STU-2026-219',
    name: 'Kavita Iyer',
    department: 'Bioengineering',
    year: 4,
    consentLevel: 'academic-only',
    lastActivityDate: '2026-08-28 11:30',
  },
  {
    id: 'STU-2026-302',
    name: 'Liam Zhang',
    department: 'Management',
    year: 1,
    consentLevel: 'full',
    assignedCounsellor: 'Marcus Vance, MA',
    lastActivityDate: '2026-08-28 08:20',
  },
  {
    id: 'STU-2026-411',
    name: 'Sophia Miller',
    department: 'Humanities',
    year: 2,
    consentLevel: 'revoked',
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

// 6. Demand Trends Dataset (Split by Dimension with Low, Mild, Moderate, High counts)
export const demandTrends: {
  academic: DemandTrendPoint[];
  financial: DemandTrendPoint[];
  wellbeing: DemandTrendPoint[];
} = {
  academic: [
    { period: 'Week 1', low: 45, mild: 80, moderate: 65, high: 20 },
    { period: 'Week 2', low: 48, mild: 85, moderate: 70, high: 22 },
    { period: 'Week 3', low: 40, mild: 90, moderate: 78, high: 28 },
    { period: 'Week 4', low: 35, mild: 95, moderate: 85, high: 35 },
    { period: 'Week 5', low: 30, mild: 100, moderate: 92, high: 42 },
    { period: 'Week 6 (Midterms)', low: 22, mild: 110, moderate: 105, high: 58 },
    { period: 'Week 7', low: 38, mild: 92, moderate: 80, high: 32 },
    { period: 'Week 8 (Current)', low: 44, mild: 84, moderate: 68, high: 24 },
  ],
  financial: [
    { period: 'Week 1', low: 60, mild: 40, moderate: 25, high: 8 },
    { period: 'Week 2', low: 58, mild: 42, moderate: 26, high: 9 },
    { period: 'Week 3', low: 55, mild: 45, moderate: 30, high: 12 },
    { period: 'Week 4', low: 50, mild: 48, moderate: 34, high: 15 },
    { period: 'Week 5', low: 48, mild: 50, moderate: 38, high: 18 },
    { period: 'Week 6 (Midterms)', low: 42, mild: 55, moderate: 42, high: 22 },
    { period: 'Week 7', low: 52, mild: 46, moderate: 32, high: 14 },
    { period: 'Week 8 (Current)', low: 56, mild: 44, moderate: 28, high: 10 },
  ],
  wellbeing: [
    { period: 'Week 1', low: 50, mild: 65, moderate: 45, high: 15 },
    { period: 'Week 2', low: 48, mild: 70, moderate: 48, high: 18 },
    { period: 'Week 3', low: 42, mild: 75, moderate: 55, high: 24 },
    { period: 'Week 4', low: 38, mild: 82, moderate: 64, high: 30 },
    { period: 'Week 5', low: 32, mild: 88, moderate: 72, high: 38 },
    { period: 'Week 6 (Midterms)', low: 25, mild: 95, moderate: 85, high: 48 },
    { period: 'Week 7', low: 40, mild: 80, moderate: 60, high: 26 },
    { period: 'Week 8 (Current)', low: 46, mild: 72, moderate: 50, high: 20 },
  ],
};

// 7. Fairness & Parity Dataset
export const fairnessMetrics: FairnessMetrics[] = [
  {
    dimension: 'Academic Support Nudges',
    referenceGroup: 'Department: Computer Science',
    humanReviewRequired: false,
    lastEvaluated: '2026-08-28 14:00',
    groups: [
      {
        group: 'Department: Computer Science',
        sampleSize: 1420,
        selectionRate: 0.28,
        falsePositiveRate: 0.05,
        falseNegativeRate: 0.04,
        truePositiveRate: 0.91,
        disparateImpact: 1.0,
        sufficientData: true,
      },
      {
        group: 'Department: Bioengineering',
        sampleSize: 980,
        selectionRate: 0.25,
        falsePositiveRate: 0.06,
        falseNegativeRate: 0.05,
        truePositiveRate: 0.89,
        disparateImpact: 0.89,
        sufficientData: true,
      },
      {
        group: 'Department: Design & Media',
        sampleSize: 640,
        selectionRate: 0.24,
        falsePositiveRate: 0.04,
        falseNegativeRate: 0.06,
        truePositiveRate: 0.90,
        disparateImpact: 0.86,
        sufficientData: true,
      },
      {
        group: 'Department: Emerging Disciplines (Pilot)',
        sampleSize: 14,
        selectionRate: 0.0,
        sufficientData: false,
      },
    ],
  },
  {
    dimension: 'Financial Aid & Emergency Bursary Prompts',
    referenceGroup: 'Cohort: Year 1 (Freshmen)',
    humanReviewRequired: true,
    lastEvaluated: '2026-08-28 14:00',
    groups: [
      {
        group: 'Cohort: Year 1 (Freshmen)',
        sampleSize: 1650,
        selectionRate: 0.32,
        falsePositiveRate: 0.04,
        falseNegativeRate: 0.03,
        truePositiveRate: 0.93,
        disparateImpact: 1.0,
        sufficientData: true,
      },
      {
        group: 'Cohort: Year 2 (Sophomores)',
        sampleSize: 1420,
        selectionRate: 0.29,
        falsePositiveRate: 0.05,
        falseNegativeRate: 0.04,
        truePositiveRate: 0.91,
        disparateImpact: 0.91,
        sufficientData: true,
      },
      {
        group: 'Cohort: Year 3 (Juniors)',
        sampleSize: 1180,
        selectionRate: 0.23,
        falsePositiveRate: 0.08,
        falseNegativeRate: 0.07,
        truePositiveRate: 0.85,
        disparateImpact: 0.72,
        sufficientData: true,
      },
      {
        group: 'Cohort: Year 4 (Seniors)',
        sampleSize: 950,
        selectionRate: 0.27,
        falsePositiveRate: 0.06,
        falseNegativeRate: 0.05,
        truePositiveRate: 0.88,
        disparateImpact: 0.84,
        sufficientData: true,
      },
    ],
  },
  {
    dimension: 'Well-being Check-in Engagement Prompts',
    referenceGroup: 'Cohort: Undergraduates',
    humanReviewRequired: false,
    lastEvaluated: '2026-08-28 14:00',
    groups: [
      {
        group: 'Cohort: Undergraduates',
        sampleSize: 3850,
        selectionRate: 0.35,
        falsePositiveRate: 0.03,
        falseNegativeRate: 0.04,
        truePositiveRate: 0.93,
        disparateImpact: 1.0,
        sufficientData: true,
      },
      {
        group: 'Cohort: Postgraduate Scholars',
        sampleSize: 1000,
        selectionRate: 0.31,
        falsePositiveRate: 0.05,
        falseNegativeRate: 0.06,
        truePositiveRate: 0.89,
        disparateImpact: 0.89,
        sufficientData: true,
      },
    ],
  },
];

// 8. Verified Resources Dataset
export const resources: SupportResource[] = [
  {
    id: 'res-1',
    title: 'Peer Tutoring & Academic Advising Center',
    description: 'One-on-one subject tutoring, exam preparation strategies, and personalized study pacing with senior peer mentors.',
    category: 'academic',
    provider: 'University Academic Success Center',
    contact: 'tutoring@campus.edu | ext. 4201',
    url: 'https://campus.edu/academic-support/tutoring',
    location: 'Learning Commons, 3rd Floor, Room 310',
    active: true,
    createdAt: '2026-08-01 09:00',
    updatedAt: '2026-08-20 14:30',
  },
  {
    id: 'res-2',
    title: 'Campus Mental Health & Confidential Counselling',
    description: 'Confidential individual therapy sessions, mindfulness workshops, and crisis de-escalation protocols.',
    category: 'wellbeing',
    provider: 'Student Wellness & Counselling Directorate',
    contact: 'wellness@campus.edu | 24/7 Helpline: 1800-CAMPUS-CARE',
    url: 'https://campus.edu/wellness/counselling',
    location: 'Health & Wellness Pavilion, Suite 102',
    active: true,
    createdAt: '2026-08-01 09:00',
    updatedAt: '2026-08-25 11:15',
  },
  {
    id: 'res-3',
    title: 'Student Emergency Micro-Grant Fund',
    description: 'Immediate financial assistance ($50–$300) for unexpected transit, medical, textbook, or essential grocery expenses.',
    category: 'financial',
    provider: 'Dean of Student Welfare Office',
    contact: 'emergency-aid@campus.edu',
    url: 'https://campus.edu/financial-aid/emergency-fund',
    location: 'Student Affairs Center, Building B, Room 104',
    active: true,
    createdAt: '2026-08-05 10:00',
    updatedAt: '2026-08-22 16:45',
  },
  {
    id: 'res-4',
    title: 'Hostel Accommodation & Emergency Food Pantry',
    description: 'Nutritious meal packages, temporary emergency boarding vouchers, and essential toiletries for students in need.',
    category: 'financial',
    provider: 'Campus Community Pantry & Housing Services',
    contact: 'pantry@campus.edu | Mon–Fri 10:00–18:00',
    location: 'North Residential Quad, Basement Wing A',
    active: true,
    createdAt: '2026-08-08 11:30',
    updatedAt: '2026-08-27 10:20',
  },
  {
    id: 'res-5',
    title: 'STEM Lab Protocols & Exam Prep Workshop Series',
    description: 'Structured review modules, past paper walk-throughs, and lab protocol debugging for high-workload STEM courses.',
    category: 'academic',
    provider: 'Faculty of Engineering & Natural Sciences',
    contact: 'stem-support@campus.edu',
    url: 'https://campus.edu/stem/exam-prep',
    location: 'Science Complex, Lab Hall 4',
    active: true,
    createdAt: '2026-08-10 13:00',
    updatedAt: '2026-08-28 09:00',
  },
  {
    id: 'res-6',
    title: 'Circadian Rhythm & Sleep Hygiene Toolkit',
    description: 'Practical sleep entrainment schedules, sensory calm guides, and stress decompression routines for exam crunches.',
    category: 'wellbeing',
    provider: 'Integrative Wellness Committee',
    contact: 'wellness-rhythm@campus.edu',
    url: 'https://campus.edu/wellness/sleep-toolkit',
    active: true,
    createdAt: '2026-08-12 14:00',
    updatedAt: '2026-08-26 15:10',
  },
  {
    id: 'res-7',
    title: 'Subsidized Campus Shuttle & Public Transit Passes',
    description: 'Free campus circulator routes, night transit escort service, and subsidized municipal metro/bus passes for commuters.',
    category: 'general',
    provider: 'Campus Mobility & Transportation Authority',
    contact: 'transit@campus.edu | Shuttle hotline: ext. 3300',
    url: 'https://campus.edu/transit/passes',
    location: 'Central Transit Hub, Main Gate',
    active: true,
    createdAt: '2026-08-14 08:30',
    updatedAt: '2026-08-24 12:00',
  },
  {
    id: 'res-8',
    title: 'Career Placement Prep & Industry Mentorship',
    description: 'Resume review clinics, mock technical interviews, LinkedIn profile audits, and alumni coffee connect chats.',
    category: 'general',
    provider: 'Center for Career Development & Placement',
    contact: 'careers@campus.edu',
    url: 'https://campus.edu/careers/mentorship',
    location: 'Career Center, Alumni Hall, 2nd Floor',
    active: true,
    createdAt: '2026-08-15 10:00',
    updatedAt: '2026-08-28 17:00',
  },
  {
    id: 'res-9',
    title: 'Assistive Tech & Neurodiversity Learning Lab',
    description: 'Screen readers, text-to-speech tools, quiet sensory study cubicles, and alternative format course material requests.',
    category: 'academic',
    provider: 'Office of Accessibility & Inclusive Learning',
    contact: 'accessibility@campus.edu | ext. 5500',
    location: 'Main Library, West Wing, Room 118',
    active: false,
    createdAt: '2026-08-16 11:00',
    updatedAt: '2026-08-27 14:15',
  },
];

// 9. Support Programs Dataset
export const supportPrograms: SupportProgram[] = [
  {
    id: 'prog-1',
    name: 'Merit-Cum-Means Tuition Fee Concession',
    provider: 'University Financial Aid Directorate',
    description: 'Need-based institutional fee waivers covering 25% to 100% of semester tuition fees for eligible students.',
    category: 'fee-assistance',
    eligibilitySummary: 'Enrolled full-time undergraduate students with verified family annual income below designated institutional threshold.',
    applicationUrl: 'https://campus.edu/aid/tuition-waiver',
    deadline: '2026-09-30',
    active: true,
    createdAt: '2026-08-01 10:00',
    updatedAt: '2026-08-20 12:00',
  },
  {
    id: 'prog-2',
    name: 'National Means Scholarship Scheme',
    provider: 'Ministry of Higher Education',
    description: 'Government-funded financial support offering monthly stipend disbursements and annual academic book allowances.',
    category: 'government-scheme',
    eligibilitySummary: 'Undergraduate scholars with consistent minimum 6.5 CGPA and documented domestic socio-economic criteria.',
    applicationUrl: 'https://scholarships.gov.in/scheme-portal',
    deadline: '2026-10-15',
    active: true,
    createdAt: '2026-08-05 11:30',
    updatedAt: '2026-08-22 14:00',
  },
  {
    id: 'prog-3',
    name: 'Campus Work-Study Research Fellowship',
    provider: 'Office of Dean (Research & Innovation)',
    description: 'Paid on-campus part-time research assistantships (10–15 hrs/week) matching students with departmental labs.',
    category: 'work-study',
    eligibilitySummary: 'Undergraduate (Years 2-4) and postgraduate students in good academic standing seeking practical lab research training.',
    applicationUrl: 'https://campus.edu/research/work-study',
    deadline: '2026-09-15',
    active: true,
    createdAt: '2026-08-08 09:00',
    updatedAt: '2026-08-25 16:30',
  },
  {
    id: 'prog-4',
    name: 'Digital Device & Hardware Lending Program',
    provider: 'Campus Information Technology Services',
    description: 'Semester-long loan of certified laptops, graphing calculators, and connectivity hotspots for course work.',
    category: 'equipment',
    eligibilitySummary: 'Enrolled students enrolled in computational or laboratory courses without access to primary computing equipment.',
    applicationUrl: 'https://campus.edu/its/hardware-lending',
    deadline: '2026-09-10',
    active: true,
    createdAt: '2026-08-10 13:00',
    updatedAt: '2026-08-24 10:15',
  },
  {
    id: 'prog-5',
    name: 'Emergency Relief & Subsistence Bursary',
    provider: 'Student Welfare Relief Committee',
    description: 'Fast-tracked discretionary grants for unforeseen family crises, urgent medical treatments, or housing displacement.',
    category: 'emergency-fund',
    eligibilitySummary: 'Open on a continuous basis to any active student experiencing sudden extenuating financial or living hardship.',
    active: true,
    createdAt: '2026-08-12 15:00',
    updatedAt: '2026-08-26 11:45',
  },
  {
    id: 'prog-6',
    name: 'Subsidized Campus Dining Meal Plan Grant',
    provider: 'University Dining & Auxiliary Services',
    description: 'Meal pass credit allocation covering 14 hot meals per week across all campus residential dining cafeterias.',
    category: 'food',
    eligibilitySummary: 'Residential and day-scholar students demonstrating food security gaps through student services consultation.',
    applicationUrl: 'https://campus.edu/dining/meal-aid',
    deadline: '2026-09-20',
    active: true,
    createdAt: '2026-08-15 14:00',
    updatedAt: '2026-08-27 09:30',
  },
  {
    id: 'prog-7',
    name: 'Hostel Accommodation Fee Subsidy',
    provider: 'Campus Residential Life Board',
    description: 'Partial hostel room rent remissions for outstation students residing in campus residential hostels.',
    category: 'hostel',
    eligibilitySummary: 'Full-time outstation students with permanent residence exceeding 50km from campus and verified financial need.',
    applicationUrl: 'https://campus.edu/housing/fee-subsidy',
    deadline: '2026-09-25',
    active: false,
    createdAt: '2026-08-18 10:00',
    updatedAt: '2026-08-28 15:00',
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
  const openCasesCount = counsellors.reduce((acc, c) => acc + c.activeStudents, 0);
  const pendingCorrections = correctionRequests.filter((r) => r.status === 'pending').length;
  const flaggedDemographicCount = fairnessMetrics.filter((m) => m.humanReviewRequired).length;

  return {
    totalStudents: 4850, // Extrapolated institutional population representation
    activeCounsellors: activeCounsellorsCount,
    openCases: openCasesCount,
    activeConsentRate: Number(((activeConsentCount / students.length) * 100).toFixed(1)),
    weeklyCheckinVolume: 3240,
    pendingCorrectionRequests: pendingCorrections,
    flaggedDemographicDisparities: flaggedDemographicCount,
    averageRhythmIndex: 81.5,
    systemUptime: 99.98,
  };
}

export function getDemandSummary() {
  return [
    { department: 'Academic', totalRequests: 210, highNeedRequests: 24, peakHour: '16:00 - 18:00' },
    { department: 'Financial', totalRequests: 110, highNeedRequests: 10, peakHour: '13:00 - 15:00' },
    { department: 'Well-being', totalRequests: 188, highNeedRequests: 20, peakHour: '14:00 - 16:00' },
  ];
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
