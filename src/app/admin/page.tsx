'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { CampusStatsCards } from '@/components/admin/overview/campus-stats-cards';
import { WellnessTrendlineCard } from '@/components/admin/overview/wellness-trendline-card';
import { SystemHealthCard } from '@/components/admin/overview/system-health-card';
import { campusStats, wellnessTrend, systemServices } from '@/lib/data/admin';

export default function AdminOverviewPage() {
  return (
    <AdminShell
      title="Campus Support Overview"
      subtitle="Institute-wide check-in participation rates, support demand by dimension, and system service health."
    >
      <div className="space-y-6">
        {/* Campus Stats (Total Students, Active Counsellors, Open Cases) */}
        <section aria-labelledby="campus-stats-heading">
          <h2 id="campus-stats-heading" className="sr-only">
            Campus Support Statistics
          </h2>
          <CampusStatsCards stats={campusStats} />
        </section>

        {/* Longitudinal Wellness Trendline & Infrastructure System Health */}
        <section
          aria-labelledby="overview-analytics-heading"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          <h2 id="overview-analytics-heading" className="sr-only">
            Wellness Trendline and System Health
          </h2>
          <div className="lg:col-span-2">
            <WellnessTrendlineCard data={wellnessTrend} />
          </div>
          <div>
            <SystemHealthCard services={systemServices} />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
