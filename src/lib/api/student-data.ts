import { 
  INITIAL_STUDENT_DATA, 
  INITIAL_CORRECTIONS, 
  INITIAL_AUDIT_LOGS, 
  StudentDataField, 
  CorrectionRequest, 
  AuditLogEntry 
} from '../data/student-data';
import { pause } from './mock-latency';

let studentDataStore = [...INITIAL_STUDENT_DATA];
let correctionsStore = [...INITIAL_CORRECTIONS];
let auditLogsStore = [...INITIAL_AUDIT_LOGS];

export async function getStudentDataFields(): Promise<StudentDataField[]> {
  await pause();
  return [...studentDataStore];
}

export async function getCorrectionRequests(): Promise<CorrectionRequest[]> {
  await pause();
  return [...correctionsStore];
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  await pause();
  return [...auditLogsStore];
}

export async function submitCorrectionRequest(
  fieldId: string,
  fieldName: string,
  currentValue: string,
  requestedValue: string,
  explanation: string
): Promise<CorrectionRequest> {
  await pause();
  const newCorrection: CorrectionRequest = {
    id: `corr-${Date.now()}`,
    fieldId,
    fieldName,
    currentValue,
    requestedValue,
    explanation,
    status: 'Pending Review',
    submittedAt: 'Just now',
  };

  correctionsStore = [newCorrection, ...correctionsStore];

  // Record audit log entry
  const newAuditLog: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: 'Just now',
    action: 'Correction Request Submitted',
    actor: 'You',
    details: `Submitted correction for ${fieldName}.`,
  };
  auditLogsStore = [newAuditLog, ...auditLogsStore];

  return { ...newCorrection };
}
