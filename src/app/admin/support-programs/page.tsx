'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { ProgramEditor } from '@/components/admin/support-programs/program-editor';
import { supportPrograms } from '@/lib/data/admin';

export default function AdminSupportProgramsPage() {
  return (
    <AdminShell
      title="Support Programs"
      subtitle="Cohort-based transition workshops, peer support circles, and group rhythm coaching."
    >
      <ProgramEditor programs={supportPrograms} />
    </AdminShell>
  );
}
