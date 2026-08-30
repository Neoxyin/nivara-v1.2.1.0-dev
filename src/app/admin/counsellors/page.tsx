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
      subtitle="Track active caseloads, weekly consultation hours, and duty shifts across campus counselling staff."
    >
      <div className="space-y-6">
        <CounsellorWorkloadCard counsellors={counsellors} />
        <CounsellorTable counsellors={counsellors} />
      </div>
    </AdminShell>
  );
}
