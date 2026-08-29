import { mockCounsellors } from '../data/counsellors';
import { mockAppointedSessions } from '../data/sessions';
import { pause } from './mock-latency';
import { getPreferences } from './preferences';
import type { Counsellor, AppointedSession, ConsultationRecord, CounsellorFollowUp, SupportAlert, DataPermissionKey } from '../types';

const SESSIONS_STORAGE_KEY = 'nivara_appointed_sessions';
const ACTIVE_COUNSELLOR_KEY = 'nivara_active_counsellor_name';
const FOLLOWUPS_STORAGE_KEY = 'nivara_counsellor_followups';
const REVIEWED_ALERTS_STORAGE_KEY = 'nivara_reviewed_alerts';

export function getActiveCounsellorName(): string {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(ACTIVE_COUNSELLOR_KEY);
      if (stored) return stored;
    } catch {}
  }
  return 'Aisha Rahman';
}

export function setActiveCounsellorName(name: string): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ACTIVE_COUNSELLOR_KEY, name);
      window.dispatchEvent(new CustomEvent('nivara-active-counsellor-changed', { detail: { name } }));
    } catch {}
  }
}

let counsellorsStore = [...mockCounsellors];

function loadSessionsFromStorage(): AppointedSession[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }
  return [...mockAppointedSessions];
}

function saveSessionsToStorage(sessions: AppointedSession[]): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      window.dispatchEvent(new CustomEvent('nivara-sessions-changed'));
    } catch {}
  }
}

let appointedSessionsStore: AppointedSession[] = loadSessionsFromStorage();

export async function getCounsellors(): Promise<Counsellor[]> {
  await pause();
  return [...counsellorsStore];
}

export async function getCounsellorById(id: string): Promise<Counsellor | undefined> {
  await pause();
  return counsellorsStore.find((c) => c.id === id);
}

export async function getAppointedSessions(): Promise<AppointedSession[]> {
  await pause();
  appointedSessionsStore = loadSessionsFromStorage();
  return [...appointedSessionsStore];
}

export async function updateSessionStatus(
  id: string,
  status: AppointedSession['status'],
  notes?: string
): Promise<AppointedSession> {
  await pause();
  appointedSessionsStore = loadSessionsFromStorage();
  const idx = appointedSessionsStore.findIndex((s) => s.id === id);
  if (idx === -1) {
    throw new Error(`Session with id ${id} not found`);
  }
  const updated: AppointedSession = {
    ...appointedSessionsStore[idx],
    status,
    notes: notes !== undefined ? notes : appointedSessionsStore[idx].notes,
  };
  appointedSessionsStore[idx] = updated;
  saveSessionsToStorage(appointedSessionsStore);
  return { ...updated };
}

export async function getConsultationRecord(
  sessionId: string,
  requestingCounsellorName?: string
): Promise<ConsultationRecord | null> {
  await pause();
  appointedSessionsStore = loadSessionsFromStorage();
  const session = appointedSessionsStore.find((s) => s.id === sessionId);
  if (!session) return null;

  // Pre-acceptance privacy guard: No consultation records or private notes exist for requested/pending appointments
  if (session.status === 'requested' || session.status === 'pending') {
    return null;
  }

  // Authorization check: Only assigned counsellor may view private consultation records
  if (requestingCounsellorName) {
    const isAssigned = session.counsellorName.trim().toLowerCase() === requestingCounsellorName.trim().toLowerCase();
    if (!isAssigned) {
      return null;
    }
  }

  if (session.consultationRecord) {
    return { ...session.consultationRecord };
  }

  // If notes exist on session, synthesize standard ConsultationRecord
  if (session.notes) {
    return {
      sessionId: session.id,
      studentName: session.studentName,
      studentEmail: session.studentEmail,
      course: session.course,
      year: session.year,
      counsellorName: session.counsellorName,
      sessionTime: session.sessionTime,
      sessionDate: session.sessionDate,
      sessionType: session.sessionType,
      reason: session.reason,
      status: session.status,
      notes: session.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
  }

  return null;
}

export async function saveConsultationRecord(
  sessionId: string,
  data: {
    notes: string;
    outcomeSummary?: string;
    agreedActionPlan?: string[];
  },
  requestingCounsellorName: string
): Promise<ConsultationRecord> {
  await pause();
  appointedSessionsStore = loadSessionsFromStorage();
  const idx = appointedSessionsStore.findIndex((s) => s.id === sessionId);
  if (idx === -1) {
    throw new Error(`Session with id ${sessionId} not found`);
  }

  const session = appointedSessionsStore[idx];

  // Authorization check
  const isAssigned = session.counsellorName.trim().toLowerCase() === requestingCounsellorName.trim().toLowerCase();
  if (!isAssigned) {
    throw new Error(`Access restricted: Only the assigned counsellor (${session.counsellorName}) can record session notes.`);
  }

  // Lifecycle check
  if (session.status === 'requested' || session.status === 'pending') {
    throw new Error('Cannot add private notes to a pending or requested appointment. Please accept the appointment first.');
  }

  // Validation: Note cannot be empty
  const trimmedNotes = data.notes.trim();
  if (!trimmedNotes) {
    throw new Error('Session note cannot be empty.');
  }

  const now = new Date().toISOString();
  const existingRecord = session.consultationRecord;

  const updatedRecord: ConsultationRecord = {
    sessionId: session.id,
    studentName: session.studentName,
    studentEmail: session.studentEmail,
    course: session.course,
    year: session.year,
    counsellorName: session.counsellorName,
    sessionTime: session.sessionTime,
    sessionDate: session.sessionDate,
    sessionType: session.sessionType,
    reason: session.reason,
    status: session.status,
    notes: trimmedNotes,
    outcomeSummary: data.outcomeSummary?.trim() || undefined,
    agreedActionPlan: data.agreedActionPlan?.filter((a) => a.trim().length > 0),
    createdAt: existingRecord?.createdAt || now,
    updatedAt: now,
    version: (existingRecord?.version || 0) + 1,
  };

  const updatedSession: AppointedSession = {
    ...session,
    notes: trimmedNotes,
    consultationRecord: updatedRecord,
  };

  appointedSessionsStore[idx] = updatedSession;
  saveSessionsToStorage(appointedSessionsStore);

  return { ...updatedRecord };
}

export async function addSessionNote(
  id: string,
  note: string,
  requestingCounsellorName?: string
): Promise<AppointedSession> {
  await pause();
  appointedSessionsStore = loadSessionsFromStorage();
  const idx = appointedSessionsStore.findIndex((s) => s.id === id);
  if (idx === -1) {
    throw new Error(`Session with id ${id} not found`);
  }

  const session = appointedSessionsStore[idx];

  // Authorization check if counsellor specified
  if (requestingCounsellorName) {
    const isAssigned = session.counsellorName.trim().toLowerCase() === requestingCounsellorName.trim().toLowerCase();
    if (!isAssigned) {
      throw new Error(`Access restricted: Only the assigned counsellor (${session.counsellorName}) can record session notes.`);
    }
  }

  if (session.status === 'requested' || session.status === 'pending') {
    throw new Error('Cannot add private notes to a pending appointment. Please accept the appointment first.');
  }

  const trimmedNote = note.trim();
  if (!trimmedNote) {
    throw new Error('Note content cannot be empty.');
  }

  const currentNotes = session.notes || '';
  const newNotes = currentNotes ? `${currentNotes}\n• ${trimmedNote}` : `• ${trimmedNote}`;

  const now = new Date().toISOString();
  const updatedRecord: ConsultationRecord = {
    sessionId: session.id,
    studentName: session.studentName,
    studentEmail: session.studentEmail,
    course: session.course,
    year: session.year,
    counsellorName: session.counsellorName,
    sessionTime: session.sessionTime,
    sessionDate: session.sessionDate,
    sessionType: session.sessionType,
    reason: session.reason,
    status: session.status,
    notes: newNotes,
    createdAt: session.consultationRecord?.createdAt || now,
    updatedAt: now,
    version: (session.consultationRecord?.version || 0) + 1,
  };

  const updated: AppointedSession = {
    ...session,
    notes: newNotes,
    consultationRecord: updatedRecord,
  };
  appointedSessionsStore[idx] = updated;
  saveSessionsToStorage(appointedSessionsStore);
  return { ...updated };
}

export async function updateSessionNotes(
  id: string,
  notes: string,
  requestingCounsellorName?: string
): Promise<AppointedSession> {
  await pause();
  appointedSessionsStore = loadSessionsFromStorage();
  const idx = appointedSessionsStore.findIndex((s) => s.id === id);
  if (idx === -1) {
    throw new Error(`Session with id ${id} not found`);
  }

  const session = appointedSessionsStore[idx];

  if (requestingCounsellorName) {
    const isAssigned = session.counsellorName.trim().toLowerCase() === requestingCounsellorName.trim().toLowerCase();
    if (!isAssigned) {
      throw new Error(`Access restricted: Only the assigned counsellor (${session.counsellorName}) can record session notes.`);
    }
  }

  if (session.status === 'requested' || session.status === 'pending') {
    throw new Error('Cannot edit notes for a pending appointment.');
  }

  const trimmedNotes = notes.trim();
  if (!trimmedNotes) {
    throw new Error('Session notes cannot be empty.');
  }

  const now = new Date().toISOString();
  const updatedRecord: ConsultationRecord = {
    sessionId: session.id,
    studentName: session.studentName,
    studentEmail: session.studentEmail,
    course: session.course,
    year: session.year,
    counsellorName: session.counsellorName,
    sessionTime: session.sessionTime,
    sessionDate: session.sessionDate,
    sessionType: session.sessionType,
    reason: session.reason,
    status: session.status,
    notes: trimmedNotes,
    createdAt: session.consultationRecord?.createdAt || now,
    updatedAt: now,
    version: (session.consultationRecord?.version || 0) + 1,
  };

  const updated: AppointedSession = {
    ...session,
    notes: trimmedNotes,
    consultationRecord: updatedRecord,
  };
  appointedSessionsStore[idx] = updated;
  saveSessionsToStorage(appointedSessionsStore);
  return { ...updated };
}

export async function addCounsellor(data: {
  name: string;
  role: string;
  specializations: string[];
  availability: string;
  status: 'available' | 'next' | 'away';
  email?: string;
  phone?: string;
  activeCaseload?: number;
  location?: string;
  bio?: string;
}): Promise<Counsellor> {
  await pause();
  const initials = data.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const newCounsellor: Counsellor = {
    id: `c-${Date.now()}`,
    ...data,
    initials: initials || 'CS',
    activeCaseload: data.activeCaseload ?? Math.floor(Math.random() * 10) + 5,
  };

  counsellorsStore = [newCounsellor, ...counsellorsStore];
  return { ...newCounsellor };
}

export async function updateCounsellor(
  id: string,
  updates: Partial<Counsellor>
): Promise<Counsellor> {
  await pause();
  const idx = counsellorsStore.findIndex((c) => c.id === id);
  if (idx === -1) {
    throw new Error(`Counsellor with id ${id} not found`);
  }

  let initials = updates.name
    ? updates.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : counsellorsStore[idx].initials;

  const updated: Counsellor = {
    ...counsellorsStore[idx],
    ...updates,
    initials,
  };

  counsellorsStore[idx] = updated;
  return { ...updated };
}

export async function deleteCounsellor(id: string): Promise<{ success: boolean; id: string }> {
  await pause();
  const initialLen = counsellorsStore.length;
  counsellorsStore = counsellorsStore.filter((c) => c.id !== id);
  if (counsellorsStore.length === initialLen) {
    throw new Error(`Counsellor with id ${id} not found`);
  }
  return { success: true, id };
}

export type AppointmentRequestPayload = {
  counsellorName: string;
  sessionTime?: string;
  sessionDate?: string;
  dayChoice?: 'today' | 'tomorrow';
  slot?: string;
  reason?: string;
  sessionType?: string;
  studentName?: string;
  studentEmail?: string;
  course?: string;
  year?: number;
};

export async function requestAppointment(
  payloadOrName: AppointmentRequestPayload | string,
  legacyTime?: string
): Promise<AppointedSession> {
  await pause();
  appointedSessionsStore = loadSessionsFromStorage();

  const isString = typeof payloadOrName === 'string';
  const counsellorName = isString ? payloadOrName : payloadOrName.counsellorName;
  const dayChoice = !isString && payloadOrName.dayChoice ? payloadOrName.dayChoice : 'today';
  const slot = !isString && payloadOrName.slot ? payloadOrName.slot : '14:30';
  const sessionDate = !isString && payloadOrName.sessionDate
    ? payloadOrName.sessionDate
    : (dayChoice === 'today' ? 'Today' : 'Tomorrow');
  const sessionTime = !isString && payloadOrName.sessionTime
    ? payloadOrName.sessionTime
    : (legacyTime || `${sessionDate} · ${slot}`);
  const reason = !isString && payloadOrName.reason
    ? payloadOrName.reason
    : 'Course pacing and deadline management consultation.';
  const sessionType = !isString && payloadOrName.sessionType
    ? payloadOrName.sessionType
    : '1-on-1 Confidential Guidance';
  const studentName = (!isString && payloadOrName.studentName) ? payloadOrName.studentName : 'Aria Chen';
  const studentEmail = (!isString && payloadOrName.studentEmail) ? payloadOrName.studentEmail : 'aria.chen@university.edu';
  const course = (!isString && payloadOrName.course) ? payloadOrName.course : 'BSc Computer Science';
  const year = (!isString && payloadOrName.year) ? payloadOrName.year : 2;

  const initials = studentName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const newSession: AppointedSession = {
    id: `ses-${Date.now()}`,
    studentName,
    studentAvatar: initials || 'AC',
    studentEmail,
    course,
    year,
    counsellorName,
    sessionTime,
    sessionDate,
    status: 'requested',
    sessionType,
    reason,
    notes: '',
    academics: {
      overallRhythm: 76,
      wellbeingScore: 68,
      attendance: 92,
      activeSubjects: [
        { subject: 'Algorithms & Data Structures', score: 78, attendance: 92, workload: 70, trend: 'steady' },
        { subject: 'Computer Systems', score: 74, attendance: 90, workload: 75, trend: 'steady' },
      ],
      upcomingDeadlines: [
        { title: 'Coursework Sprint 2', subject: 'Algorithms & Data Structures', date: 'Next week', priority: 'medium' },
      ],
      recentCheckIn: {
        date: 'Today',
        mood: 3,
        energy: 3,
        stress: 3,
        sleep: 3,
        workload: 4,
        reflection: 'Managing workload sprints and requested guidance on study pacing.',
      },
      insights: [
        {
          title: 'Scheduled consultation check-in',
          summary: 'Student initiated guidance request for term workload management.',
          contributingFactors: ['Self-initiated appointment', 'Pacing support requested'],
          certainty: 'Student-verified',
          tone: 'watch',
          actions: ['Conduct initial 1-on-1 intake review'],
        },
      ],
    },
  };

  appointedSessionsStore = [newSession, ...appointedSessionsStore];
  saveSessionsToStorage(appointedSessionsStore);
  return { ...newSession };
}

// -------------------------------------------------------------
// ROUND 4: FOLLOW-UPS & SUPPORT ALERTS (PERSISTENCE & PRIVACY)
// -------------------------------------------------------------

const defaultFollowUps: CounsellorFollowUp[] = [
  {
    id: 'flw-1',
    sessionId: 'ses-5',
    studentName: 'Elena Rostova',
    studentEmail: 'elena.rostova@student.nivara.edu',
    course: 'BArch Architecture',
    year: 4,
    counsellorName: 'Aisha Rahman',
    dueDate: 'Tomorrow · 15:00',
    reason: 'Follow-up on structural consultant feedback & portfolio pacing plan',
    notes: 'Confirm advisor recommendations and review weekly studio workload distribution.',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'flw-2',
    sessionId: 'ses-6',
    studentName: 'Marcus Vance',
    studentEmail: 'marcus.vance@student.nivara.edu',
    course: 'BA Economics',
    year: 3,
    counsellorName: 'Jon Bell',
    dueDate: 'Last Week',
    reason: 'Check-in on part-time work schedule balance',
    notes: 'Student successfully adjusted hours. Routine stabilized.',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

function loadFollowUpsFromStorage(): CounsellorFollowUp[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(FOLLOWUPS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
  }
  return [...defaultFollowUps];
}

function saveFollowUpsToStorage(list: CounsellorFollowUp[]): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(FOLLOWUPS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('nivara-followups-changed'));
    } catch {}
  }
}

export async function getFollowUps(
  requestingCounsellorName?: string
): Promise<CounsellorFollowUp[]> {
  await pause();
  const allFollowUps = loadFollowUpsFromStorage();
  const activeCounsellor = (requestingCounsellorName || getActiveCounsellorName()).trim().toLowerCase();

  return allFollowUps.filter(
    (f) => f.counsellorName.trim().toLowerCase() === activeCounsellor
  );
}

export async function createFollowUp(
  data: {
    sessionId?: string;
    studentName: string;
    studentEmail?: string;
    course?: string;
    year?: number;
    dueDate: string;
    dueTime?: string;
    reason: string;
    notes?: string;
    counsellorName?: string;
  },
  requestingCounsellorName?: string
): Promise<CounsellorFollowUp> {
  await pause();
  const activeCounsellor = requestingCounsellorName || getActiveCounsellorName();
  const assignedCounsellor = data.counsellorName || activeCounsellor;

  if (assignedCounsellor.trim().toLowerCase() !== activeCounsellor.trim().toLowerCase()) {
    throw new Error(`Access restricted: You can only schedule follow-ups for your assigned caseload (${activeCounsellor}).`);
  }

  const trimmedReason = data.reason.trim();
  const trimmedDueDate = data.dueDate.trim();
  const trimmedStudentName = data.studentName.trim();

  if (!trimmedReason) {
    throw new Error('Follow-up reason cannot be empty.');
  }
  if (!trimmedDueDate) {
    throw new Error('Due date / window is required.');
  }
  if (!trimmedStudentName) {
    throw new Error('Student name is required.');
  }

  const newFollowUp: CounsellorFollowUp = {
    id: `flw-${Date.now()}`,
    sessionId: data.sessionId,
    studentName: trimmedStudentName,
    studentEmail: data.studentEmail || `${trimmedStudentName.toLowerCase().replace(/\s+/g, '.')}@student.nivara.edu`,
    course: data.course || 'Undergraduate Degree',
    year: data.year || 2,
    counsellorName: assignedCounsellor,
    dueDate: trimmedDueDate,
    dueTime: data.dueTime,
    reason: trimmedReason,
    notes: data.notes?.trim() || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const current = loadFollowUpsFromStorage();
  const updated = [newFollowUp, ...current];
  saveFollowUpsToStorage(updated);
  return { ...newFollowUp };
}

export async function completeFollowUp(
  id: string,
  requestingCounsellorName?: string
): Promise<CounsellorFollowUp> {
  await pause();
  const activeCounsellor = requestingCounsellorName || getActiveCounsellorName();
  const current = loadFollowUpsFromStorage();
  const idx = current.findIndex((f) => f.id === id);

  if (idx === -1) {
    throw new Error(`Follow-up with id ${id} not found.`);
  }

  const item = current[idx];
  if (item.counsellorName.trim().toLowerCase() !== activeCounsellor.trim().toLowerCase()) {
    throw new Error(`Access restricted: Only the assigned counsellor (${item.counsellorName}) can update this follow-up.`);
  }

  const updatedItem: CounsellorFollowUp = {
    ...item,
    status: 'completed',
    completedAt: new Date().toISOString(),
  };

  current[idx] = updatedItem;
  saveFollowUpsToStorage(current);
  return { ...updatedItem };
}

export async function reopenFollowUp(
  id: string,
  requestingCounsellorName?: string
): Promise<CounsellorFollowUp> {
  await pause();
  const activeCounsellor = requestingCounsellorName || getActiveCounsellorName();
  const current = loadFollowUpsFromStorage();
  const idx = current.findIndex((f) => f.id === id);

  if (idx === -1) {
    throw new Error(`Follow-up with id ${id} not found.`);
  }

  const item = current[idx];
  if (item.counsellorName.trim().toLowerCase() !== activeCounsellor.trim().toLowerCase()) {
    throw new Error(`Access restricted: Only the assigned counsellor (${item.counsellorName}) can update this follow-up.`);
  }

  const updatedItem: CounsellorFollowUp = {
    ...item,
    status: 'pending',
    completedAt: undefined,
  };

  current[idx] = updatedItem;
  saveFollowUpsToStorage(current);
  return { ...updatedItem };
}

function loadReviewedAlertIds(): string[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(REVIEWED_ALERTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
  }
  return [];
}

function saveReviewedAlertIds(ids: string[]): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(REVIEWED_ALERTS_STORAGE_KEY, JSON.stringify(ids));
      window.dispatchEvent(new CustomEvent('nivara-reviewed-alerts-changed'));
    } catch {}
  }
}

export async function markAlertReviewed(alertId: string, reviewed: boolean): Promise<void> {
  await pause();
  const current = loadReviewedAlertIds();
  let updated: string[];
  if (reviewed) {
    updated = current.includes(alertId) ? current : [...current, alertId];
  } else {
    updated = current.filter((id) => id !== alertId);
  }
  saveReviewedAlertIds(updated);
}

export async function getSupportAlerts(
  requestingCounsellorName?: string
): Promise<SupportAlert[]> {
  await pause();
  const activeCounsellor = (requestingCounsellorName || getActiveCounsellorName()).trim().toLowerCase();
  
  // 1. Check Consent status
  const prefs = await getPreferences();
  const hasAcademicConsent = prefs.some((p) => p.key === 'academic_data' && p.status === 'CONSENTED');
  const hasWellbeingConsent = prefs.some((p) => p.key === 'wellbeing_checkins' && p.status === 'CONSENTED');

  // 2. Load appointed sessions assigned to the requesting counsellor
  const sessions = loadSessionsFromStorage();
  const mySessions = sessions.filter(
    (s) => s.counsellorName.trim().toLowerCase() === activeCounsellor
  );

  const reviewedIds = loadReviewedAlertIds();
  const alerts: SupportAlert[] = [];

  for (const session of mySessions) {
    // Check for Academic Alerts (only if consented)
    if (hasAcademicConsent) {
      const watchInsight = session.academics.insights.find((i) => i.tone === 'watch');
      const hasAttendanceDip = session.academics.attendance < 90;
      const downTrendSubject = session.academics.activeSubjects.find((s) => s.trend === 'down');

      if (watchInsight || hasAttendanceDip || downTrendSubject) {
        const alertId = `alt-acad-${session.id}`;
        const isReviewed = reviewedIds.includes(alertId);

        let title = watchInsight?.title || 'Academic rhythm pacing trigger';
        let summary = watchInsight?.summary || `Attendance rate is at ${session.academics.attendance}% with active workload milestones.`;
        let factors = watchInsight?.contributingFactors || [
          `Attendance: ${session.academics.attendance}%`,
          downTrendSubject ? `${downTrendSubject.subject} trend down` : 'Concentrated milestone deadlines',
        ];
        let action = watchInsight?.actions?.[0] || 'Conduct academic pacing consultation and review milestone breakdown.';

        alerts.push({
          id: alertId,
          sessionId: session.id,
          studentName: session.studentName,
          studentAvatar: session.studentAvatar,
          studentEmail: session.studentEmail,
          course: session.course,
          year: session.year,
          counsellorName: session.counsellorName,
          dimension: 'Academic',
          title,
          summary,
          contributingFactors: factors,
          recommendedAction: action,
          severity: 'attention',
          createdAt: new Date().toISOString(),
          reviewed: isReviewed,
          reviewedAt: isReviewed ? new Date().toISOString() : undefined,
        });
      }
    }

    // Check for Wellbeing / Rest Alerts (only if consented)
    if (hasWellbeingConsent) {
      const checkIn = session.academics.recentCheckIn;
      if (checkIn && (checkIn.stress >= 4 || checkIn.sleep <= 2)) {
        const alertId = `alt-well-${session.id}`;
        const isReviewed = reviewedIds.includes(alertId);

        alerts.push({
          id: alertId,
          sessionId: session.id,
          studentName: session.studentName,
          studentAvatar: session.studentAvatar,
          studentEmail: session.studentEmail,
          course: session.course,
          year: session.year,
          counsellorName: session.counsellorName,
          dimension: 'Well-being',
          title: checkIn.stress >= 5 ? 'Elevated voluntary check-in stress' : 'Consecutive low rest rating',
          summary: `Student self-reported stress level of ${checkIn.stress}/5 and sleep rating of ${checkIn.sleep}/5 during recent check-in.`,
          contributingFactors: [
            `Stress rated ${checkIn.stress}/5`,
            `Sleep rated ${checkIn.sleep}/5`,
            `Workload rated ${checkIn.workload}/5`,
          ],
          recommendedAction: 'Schedule restorative 1-on-1 check-in to explore study cadence adjustment.',
          severity: 'watch',
          createdAt: new Date().toISOString(),
          reviewed: isReviewed,
          reviewedAt: isReviewed ? new Date().toISOString() : undefined,
        });
      }
    }
  }

  return alerts;
}
