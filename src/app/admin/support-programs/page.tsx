'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { ProgramEditor } from '@/components/admin/support-programs/program-editor';
import { supportPrograms } from '@/lib/data/admin';

export default function AdminSupportProgramsPage() {
  return (
    <AdminShell
      title="Support Programs"
      subtitle="Manage student peer circles, transition workshops, and department academic support sessions."
    >
      <ProgramEditor programs={supportPrograms} />
    </AdminShell>
  );
}
