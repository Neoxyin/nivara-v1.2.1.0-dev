import { mockStudent } from '../data/student';
import { pause } from './mock-latency';
import type { Student } from '../types';


export async function getCurrentUser(): Promise<Student> {
  await pause();
  return { ...mockStudent };
}

export async function updateStudent(data: Partial<Student>): Promise<Student> {
  await pause();
  Object.assign(mockStudent, data);
  return { ...mockStudent };
}