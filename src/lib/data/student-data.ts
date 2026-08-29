export interface StudentDataField {
  id: string;
  category: 'Academic Profile' | 'Well-being & Support' | 'Engagement & Activity' | 'Institutional Records';
  fieldName: string;
  currentValue: string;
  source: string;
  purpose: string;
  consentStatus: 'Active Consent' | 'Institutional Mandate' | 'Optional';
  lastUpdated: string;
}

export interface CorrectionRequest {
  id: string;
  fieldId: string;
  fieldName: string;
  currentValue: string;
  requestedValue: string;
  explanation: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Updated';
  submittedAt: string;
  reviewerNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export const INITIAL_STUDENT_DATA: StudentDataField[] = [
  {
    id: 'field-1',
    category: 'Academic Profile',
    fieldName: 'Current Term & Major',
    currentValue: 'Term 4 · B.Sc. Computer Science',
    source: 'University Registrar Sync',
    purpose: 'Used for academic pacing recommendations and workload alignment.',
    consentStatus: 'Institutional Mandate',
    lastUpdated: '3 days ago'
  },
  {
    id: 'field-2',
    category: 'Academic Profile',
    fieldName: 'Active Course Enrollments',
    currentValue: 'CS201, MATH302, PHY204, ENG101',
    source: 'LMS Integration (Canvas)',
    purpose: 'Enables assignment deadline tracking and stress pacing assistance.',
    consentStatus: 'Active Consent',
    lastUpdated: '12 hours ago'
  },
  {
    id: 'field-3',
    category: 'Well-being & Support',
    fieldName: 'Counsellor Session History',
    currentValue: '1 Completed Session (Dr. Priya Nair)',
    source: 'Campus Well-being Portal',
    purpose: 'Maintains continuity of support and care coordination.',
    consentStatus: 'Active Consent',
    lastUpdated: '5 days ago'
  },
  {
    id: 'field-4',
    category: 'Engagement & Activity',
    fieldName: 'Support Circle Memberships',
    currentValue: 'Exam Stress & Pacing Circle (Active)',
    source: 'Nivara Peer Support Service',
    purpose: 'Facilitates peer community matching and moderation access.',
    consentStatus: 'Active Consent',
    lastUpdated: '2 days ago'
  },
  {
    id: 'field-5',
    category: 'Institutional Records',
    fieldName: 'Emergency Contact & Housing',
    currentValue: 'Campus Hostel Block B, Room 402',
    source: 'Student Affairs Office',
    purpose: 'Safety verification and wellbeing emergency escalation.',
    consentStatus: 'Institutional Mandate',
    lastUpdated: '1 month ago'
  }
];

export const INITIAL_CORRECTIONS: CorrectionRequest[] = [
  {
    id: 'corr-1',
    fieldId: 'field-2',
    fieldName: 'Active Course Enrollments',
    currentValue: 'CS201, MATH302, PHY204, ENG101',
    requestedValue: 'CS201, MATH302, PHY204 (Dropped ENG101)',
    explanation: 'I officially dropped English 101 during the add/drop week extension.',
    status: 'Pending Review',
    submittedAt: 'Yesterday'
  },
  {
    id: 'corr-2',
    fieldId: 'field-5',
    fieldName: 'Emergency Contact & Housing',
    currentValue: 'Campus Hostel Block B, Room 402',
    requestedValue: 'Campus Hostel Block B, Room 410',
    explanation: 'I shifted rooms during the mid-semester hostel reallocation.',
    status: 'Approved',
    submittedAt: '5 days ago',
    reviewerNotes: 'Verified against Student Affairs hostel roster update.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: 'Today, 10:45 AM',
    action: 'Data Transparency View',
    actor: 'You',
    details: 'Accessed personal data transparency dashboard.'
  },
  {
    id: 'audit-2',
    timestamp: 'Yesterday, 3:20 PM',
    action: 'Correction Request Submitted',
    actor: 'You',
    details: 'Submitted correction request for Active Course Enrollments.'
  },
  {
    id: 'audit-3',
    timestamp: '3 days ago',
    action: 'LMS Sync Completed',
    actor: 'Automated System',
    details: 'Refreshed course enrollment metadata from Canvas API.'
  },
  {
    id: 'audit-4',
    timestamp: '5 days ago',
    action: 'Consent Updated',
    actor: 'You',
    details: 'Renewed active consent for Well-being & Support telemetry.'
  }
];
