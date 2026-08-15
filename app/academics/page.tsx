'use client';

import dynamicImport from 'next/dynamic';
import { useState } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { RingProgress } from '@/components/dashboard/ring-progress';
import { getTrendData, getAcademicMetrics, getDeadlines } from '@/lib/api/academics';
import { useQuery } from '@tanstack/react-query';

const TrendChart = dynamicImport(
  () => import('@/components/dashboard/trend-chart').then((mod) => mod.TrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-md bg-white/[0.025]" aria-hidden="true" />
    ),
  }
);

export default function AcademicsPage() {
  const [range, setRange] = useState('6 weeks');
  const { data: trendData } = useQuery({ queryKey: ['trendData'], queryFn: getTrendData });
  const { data: deadlines } = useQuery({ queryKey: ['deadlines'], queryFn: getDeadlines });

  return (
    <AppShell>
      <div className="rise-in">
        <SectionHeading
          eyebrow="Academic rhythm"
          title="See the shape of your work."
          description="A practical view of marks, attendance, workload, and deadlines — without reducing you to a score."
          action={
            <div className="flex border border-white/[0.09] p-1">
              {['6 weeks', 'This term'].map((x) => (
                <button
                  key={x}
                  onClick={() => setRange(x)}
                  data-testid={`button-academic-range-${x}`}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[.08em] transition-[background-color,color] duration-150 ${
                    range === x
                      ? 'bg-[#c3f340] text-[#0d1408]'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {x}
                </button>
              ))}
            </div>
          }
        />

        <div className="grid grid-cols-[1.35fr_.65fr] gap-3">
          <section className="border border-white/[0.09] bg-[hsl(var(--card))] p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="serenity-label text-white/40">Academic + well-being</p>
                <h2 className="mt-2 font-display text-3xl">{range} in context</h2>
              </div>
              <Pill tone="accent">Not a grade</Pill>
            </div>
            <div className="mt-8 h-[290px]">
              <TrendChart data={trendData || []} height={290} showYAxis filled />
            </div>
          </section>

          <section className="bg-[#141414] p-7 text-white">
            <p className="serenity-label text-[#9eaa9f]">At a glance</p>
            <div className="mt-10 flex items-center gap-5">
              <RingProgress value={78} label="rhythm" />
              <div>
                <p className="font-display text-3xl">Good footing</p>
                <p className="mt-2 text-sm leading-5 text-white/55">
                  Your academic rhythm is steady across most subjects.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Deadlines */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <p className="serenity-label text-white/40">Upcoming deadlines</p>
            <span className="h-px flex-1 bg-white/[0.07]" />
          </div>
          <div className="space-y-2">
            {deadlines?.map((deadline, i) => (
              <div
                key={i}
                className="flex items-center justify-between border border-white/[0.09] bg-[hsl(var(--card))] px-6 py-4"
                data-testid={`row-deadline-${i}`}
              >
                <div>
                  <p className="text-sm font-semibold">{deadline.title}</p>
                  <p className="mt-0.5 text-xs text-white/40">{deadline.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="serenity-label text-white/40">{deadline.date}</p>
                  <Pill tone={deadline.priority === 'high' ? 'warm' : 'default'}>
                    {deadline.priority}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
