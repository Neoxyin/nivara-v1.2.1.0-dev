import { mockCounsellors } from '../data/counsellors';
import { mockAppointedSessions } from '../data/sessions';
import { pause } from './mock-latency';
import type { Counsellor, AppointedSession } from '../types';

let counsellorsStore = [...mockCounsellors];
let appointedSessionsStore = [...mockAppointedSessions];

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
  return [...appointedSessionsStore];
}

export async function updateSessionStatus(
  id: string,
  status: AppointedSession['status'],
  notes?: string
): Promise<AppointedSession> {
  await pause();
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
  return { ...updated };
}

export async function addSessionNote(id: string, note: string): Promise<AppointedSession> {
  await pause();
  const idx = appointedSessionsStore.findIndex((s) => s.id === id);
  if (idx === -1) {
    throw new Error(`Session with id ${id} not found`);
  }
  const currentNotes = appointedSessionsStore[idx].notes || '';
  const newNotes = currentNotes ? `${currentNotes}\n• ${note}` : `• ${note}`;
  const updated: AppointedSession = {
    ...appointedSessionsStore[idx],
    notes: newNotes,
  };
  appointedSessionsStore[idx] = updated;
  return { ...updated };
}

export async function updateSessionNotes(id: string, notes: string): Promise<AppointedSession> {
  await pause();
  const idx = appointedSessionsStore.findIndex((s) => s.id === id);
  if (idx === -1) {
    throw new Error(`Session with id ${id} not found`);
  }
  const updated: AppointedSession = {
    ...appointedSessionsStore[idx],
    notes,
  };
  appointedSessionsStore[idx] = updated;
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

export async function requestAppointment(
  name: string,
  time: string
): Promise<{ name: string; time: string; status: string }> {
  await pause();
  return { name, time, status: 'Request sent' };
}
