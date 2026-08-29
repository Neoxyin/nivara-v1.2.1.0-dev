'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { DemandTrendChart } from '@/components/admin/demand-trends/demand-trend-chart';
import { demandTrends } from '@/lib/data/admin';

export default function AdminDemandTrendsPage() {
  return (
    <AdminShell
      title="Demand Trends"
      subtitle="Examine booking volume spikes, peak demand hours, and projected counselling needs across departments."
    >
      <DemandTrendChart data={demandTrends} />
    </AdminShell>
  );
}
