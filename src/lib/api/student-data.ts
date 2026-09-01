import { 
  INITIAL_STUDENT_DATA, 
  INITIAL_AUDIT_LOGS, 
  StudentDataField, 
  AuditLogEntry 
} from '../data/student-data';
import { pause } from './mock-latency';

let studentDataStore = [...INITIAL_STUDENT_DATA];
let auditLogsStore = [...INITIAL_AUDIT_LOGS];

export async function getStudentDataFields(): Promise<StudentDataField[]> {
  await pause();
  return [...studentDataStore];
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  await pause();
  return [...auditLogsStore];
}
