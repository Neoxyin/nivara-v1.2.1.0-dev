'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { CorrectionRequestCard } from '@/components/admin/corrections/correction-request-card';
import { correctionRequests } from '@/lib/data/admin';

export default function AdminCorrectionsPage() {
  return (
    <AdminShell
      title="Correction Audits"
      subtitle="Audit and process student requests to rectify attendance records, check-in data, and consent states."
    >
      <CorrectionRequestCard requests={correctionRequests} />
    </AdminShell>
  );
}
