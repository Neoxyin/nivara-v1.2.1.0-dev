'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { StudentRosterTable } from '@/components/admin/students/student-roster-table';
import { students } from '@/lib/data/admin';

export default function AdminStudentsPage() {
  return (
    <AdminShell
      title="Student Directory"
      subtitle="Privacy-preserving cohort management, consent visibility, and active program allocation."
    >
      <StudentRosterTable students={students} />
    </AdminShell>
  );
}
