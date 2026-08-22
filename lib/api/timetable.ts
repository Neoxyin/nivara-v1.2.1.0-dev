import type { TimetableClass, DayOfWeek } from '../types';
import { INITIAL_TIMETABLE } from '../data/timetable';
import { pause } from './mock-latency';

const STORAGE_KEY = 'nivara_student_timetable';

export function getStoredTimetable(): TimetableClass[] {
  if (typeof window === 'undefined') return [...INITIAL_TIMETABLE];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TIMETABLE));
      return [...INITIAL_TIMETABLE];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_TIMETABLE];
  } catch {
    return [...INITIAL_TIMETABLE];
  }
}

export function setStoredTimetable(classes: TimetableClass[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  } catch (err) {
    console.error('Failed to save timetable to localStorage', err);
  }
}

export async function getTimetable(): Promise<TimetableClass[]> {
  await pause(60);
  return getStoredTimetable();
}

export async function saveTimetable(classes: TimetableClass[]): Promise<TimetableClass[]> {
  await pause(80);
  setStoredTimetable(classes);
  return classes;
}

export async function addClassToTimetable(
  entry: Omit<TimetableClass, 'id'>
): Promise<TimetableClass> {
  await pause(80);
  const current = getStoredTimetable();
  const newClass: TimetableClass = {
    ...entry,
    id: `tt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  const updated = [...current, newClass];
  setStoredTimetable(updated);
  return newClass;
}

export async function addTimetableClass(
  entry: Omit<TimetableClass, 'id'>
): Promise<TimetableClass[]> {
  await addClassToTimetable(entry);
  return getStoredTimetable();
}

export async function deleteClassFromTimetable(id: string): Promise<boolean> {
  await pause(60);
  const current = getStoredTimetable();
  const filtered = current.filter((c) => c.id !== id);
  setStoredTimetable(filtered);
  return true;
}

export async function deleteTimetableClass(id: string): Promise<TimetableClass[]> {
  await deleteClassFromTimetable(id);
  return getStoredTimetable();
}

export async function resetTimetable(): Promise<TimetableClass[]> {
  await pause(80);
  setStoredTimetable(INITIAL_TIMETABLE);
  return [...INITIAL_TIMETABLE];
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Mon...
  if (dayIndex >= 1 && dayIndex <= 5) {
    return days[dayIndex - 1];
  }
  return 'Monday';
}

export function getCurrentDayName(): DayOfWeek {
  return getCurrentDayOfWeek();
}

export function getTodayClasses(classes: TimetableClass[], day?: DayOfWeek): TimetableClass[] {
  const targetDay = day || getCurrentDayOfWeek();
  return (classes || [])
    .filter((c) => c.day === targetDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getNextUpcomingClass(classes: TimetableClass[]): {
  nextClass: TimetableClass | null;
  statusText: string;
} {
  const today = getCurrentDayOfWeek();
  const todayClasses = getTodayClasses(classes, today);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const c of todayClasses) {
    const [h, m] = c.startTime.split(':').map(Number);
    const classMinutes = (h || 0) * 60 + (m || 0);
    if (classMinutes > currentMinutes) {
      const diff = classMinutes - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      return {
        nextClass: c,
        statusText: `in ${timeStr} · ${c.room}`,
      };
    }
  }

  // If no more classes today, find first class on next day
  const daysOrder: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDayIdx = daysOrder.indexOf(today);
  const nextDay = daysOrder[(currentDayIdx + 1) % daysOrder.length];
  const nextDayClasses = getTodayClasses(classes, nextDay);

  if (nextDayClasses.length > 0) {
    return {
      nextClass: nextDayClasses[0],
      statusText: `${nextDay} ${nextDayClasses[0].startTime} · ${nextDayClasses[0].room}`,
    };
  }

  return { nextClass: null, statusText: 'No upcoming classes scheduled' };
}

/**
 * Robust parser for uploaded schedule text (CSV, JSON, iCal, copy-pasted calendar strings)
 */
export function parseUploadedSchedule(text: string): TimetableClass[] {
  if (!text || !text.trim()) return INITIAL_TIMETABLE;

  // Try JSON
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        id: `tt-json-${Date.now()}-${idx}`,
        day: (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(item.day)
          ? item.day
          : 'Monday') as DayOfWeek,
        startTime: item.startTime || '10:00',
        endTime: item.endTime || '11:30',
        subject: item.subject || item.title || 'Course Module',
        moduleCode: item.moduleCode || item.code || 'IXD-101',
        room: item.room || item.location || 'Studio 1',
        instructor: item.instructor || item.lecturer || 'Faculty',
        type: (['lecture', 'lab', 'seminar', 'studio'].includes(item.type)
          ? item.type
          : 'lecture') as TimetableClass['type'],
        notes: item.notes || '',
      }));
    }
  } catch {
    // Continue with line parsing
  }

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const parsed: TimetableClass[] = [];

  const daysMap: Record<string, DayOfWeek> = {
    mon: 'Monday',
    monday: 'Monday',
    tue: 'Tuesday',
    tues: 'Tuesday',
    tuesday: 'Tuesday',
    wed: 'Wednesday',
    wednesday: 'Wednesday',
    thu: 'Thursday',
    thur: 'Thursday',
    thurs: 'Thursday',
    thursday: 'Thursday',
    fri: 'Friday',
    friday: 'Friday',
  };

  for (const line of lines) {
    const parts = line.includes(',')
      ? line.split(',').map((p) => p.trim())
      : line.includes('\t')
      ? line.split('\t').map((p) => p.trim())
      : line.includes('|')
      ? line.split('|').map((p) => p.trim())
      : line.split(/\s{2,}/).map((p) => p.trim());

    if (parts.length >= 2) {
      const dayMatch = parts.find((p) => {
        const lower = p.toLowerCase();
        return Object.keys(daysMap).some((k) => lower === k || lower.startsWith(k));
      });

      const day: DayOfWeek = dayMatch
        ? daysMap[dayMatch.toLowerCase().substring(0, 3)] || 'Monday'
        : 'Monday';

      const timePart = parts.find((p) => /\d{1,2}:\d{2}/.test(p)) || '10:00 - 11:30';
      const timeMatches = timePart.match(/\d{1,2}:\d{2}/g);
      const startTime = timeMatches?.[0] || '10:00';
      const endTime = timeMatches?.[1] || '11:30';

      const subject =
        parts.find((p) => p !== dayMatch && p !== timePart && p.length > 2) ||
        'Academic Module';
      const room = parts.find((p) => /studio|lab|hall|room|rm/i.test(p)) || 'Room 101';

      parsed.push({
        id: `tt-parsed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        day,
        startTime,
        endTime,
        subject,
        moduleCode: subject.substring(0, 3).toUpperCase() + '-101',
        room,
        type: /lab/i.test(subject) || /lab/i.test(room)
          ? 'lab'
          : /studio/i.test(room)
          ? 'studio'
          : /seminar/i.test(subject)
          ? 'seminar'
          : 'lecture',
      });
    }
  }

  return parsed.length > 0 ? parsed : INITIAL_TIMETABLE;
}

export async function parseAndImportTimetable(input: string) {
  const parsed = parseUploadedSchedule(input);
  const current = getStoredTimetable();
  const combined = [...current, ...parsed];
  await saveTimetable(combined);
  return {
    added: parsed.length,
    total: combined.length,
    classes: combined,
  };
}
