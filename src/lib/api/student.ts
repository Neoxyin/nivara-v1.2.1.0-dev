import { getStudentProfileApi, updateStudentProfileApi, getStudentTransparencyApi } from './client';
import type { Student } from '../types';

export async function getCurrentUser(): Promise<Student> {
  return getStudentProfileApi();
}

export async function updateStudent(data: Partial<Student>): Promise<Student> {
  return updateStudentProfileApi(data);
}

export async function getStudentTransparency(): Promise<any> {
  return getStudentTransparencyApi();
}

