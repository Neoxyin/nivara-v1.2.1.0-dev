'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { FairnessMetricsPanel } from '@/components/admin/fairness/fairness-metrics-panel';
import { fairnessMetrics } from '@/lib/data/admin';

export default function AdminFairnessPage() {
  return (
    <AdminShell
      title="Fairness & Parity"
      subtitle="Institutional anti-bias oversight, demographic parity verification, and algorithmic nudge audit."
    >
      <FairnessMetricsPanel metrics={fairnessMetrics} />
    </AdminShell>
  );
}
