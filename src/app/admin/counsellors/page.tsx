'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { CounsellorTable } from '@/components/admin/counsellors/counsellor-table';
import { CounsellorWorkloadCard } from '@/components/admin/counsellors/counsellor-workload-card';
import { counsellors } from '@/lib/data/admin';

export default function AdminCounsellorsPage() {
  return (
    <AdminShell
      title="Counsellors & Staff"
      subtitle="Monitor caseload balance, availability windows, and student feedback to prevent practitioner burnout."
    >
      <div className="space-y-6">
        <CounsellorWorkloadCard counsellors={counsellors} />
        <CounsellorTable counsellors={counsellors} />
      </div>
    </AdminShell>
  );
}
