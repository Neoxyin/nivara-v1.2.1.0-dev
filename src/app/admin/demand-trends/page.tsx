'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { DemandTrendChart } from '@/components/admin/demand-trends/demand-trend-chart';
import { demandTrends } from '@/lib/data/admin';

export default function AdminDemandTrendsPage() {
  return (
    <AdminShell
      title="Demand Trends"
      subtitle="Aggregate longitudinal support-need volume and capacity trends across Academic, Financial, and Well-being dimensions."
    >
      <DemandTrendChart data={demandTrends} />
    </AdminShell>
  );
}
