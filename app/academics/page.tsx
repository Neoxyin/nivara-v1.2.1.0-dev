'use client';

import dynamicImport from 'next/dynamic';
import { useState } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { RingProgress } from '@/components/dashboard/ring-progress';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { getTrendData, getDeadlines } from '@/lib/api/academics';
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
            <div className="flex border border-white/[0.09] bg-white/[0.02] p-1 rounded-md backdrop-blur-md">
              {['6 weeks', 'This term'].map((x) => (
                <button
                  key={x}
                  onClick={() => setRange(x)}
                  data-testid={`button-academic-range-${x}`}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[.08em] transition-all duration-200 rounded ${
                    range === x
                      ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.4)]'
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
          <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="serenity-label text-white/40">Academic + well-being</p>
                <h2 className="mt-2 font-display text-3xl text-white">{range} in context</h2>
              </div>
              <Pill tone="accent">Not a grade</Pill>
            </div>
            <div className="mt-8 h-[290px]">
              <TrendChart data={trendData || []} height={290} showYAxis filled />
            </div>
          </TiltCard>

          <TiltCard maxTilt={4} spotlightColor="rgba(195, 243, 64, 0.15)" className="border border-white/[0.08] bg-[#141414]/90 p-7 text-white backdrop-blur-xl flex flex-col justify-between">
            <div>
              <p className="serenity-label text-[#9eaa9f]">At a glance</p>
              <div className="mt-8 flex items-center gap-5">
                <RingProgress value={78} label="rhythm" />
                <div>
                  <p className="font-display text-3xl">Good footing</p>
                  <p className="mt-2 text-sm leading-5 text-white/55">
                    Your academic rhythm is steady across most subjects.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/[0.07] grid grid-cols-2 gap-3 text-left">
              <div>
                <p className="serenity-label text-white/40">Active modules</p>
                <p className="mt-1 font-display text-2xl text-white">4 subjects</p>
              </div>
              <div>
                <p className="serenity-label text-white/40">Next hand-in</p>
                <p className="mt-1 font-display text-2xl text-[#c3f340]">18 hours</p>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Deadlines */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <p className="serenity-label text-white/40">Upcoming deadlines</p>
            <span className="h-px flex-1 bg-white/[0.07]" />
          </div>
          <StaggerContainer stagger={0.05} className="space-y-2">
            {deadlines?.map((deadline, i) => (
              <div key={i} className="stagger-item">
                <TiltCard
                  maxTilt={2}
                  className="flex items-center justify-between border border-white/[0.09] bg-[hsl(var(--card))]/90 px-6 py-4 backdrop-blur-xl transition-all hover:border-white/20"
                  data-testid={`row-deadline-${i}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{deadline.title}</p>
                    <p className="mt-0.5 text-xs text-white/40">{deadline.subject}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="serenity-label text-white/40">{deadline.date}</p>
                    <Pill tone={deadline.priority === 'high' ? 'warm' : 'default'}>
                      {deadline.priority}
                    </Pill>
                  </div>
                </TiltCard>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
