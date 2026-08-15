'use client';

import dynamicImport from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock3, HeartHandshake, MoreHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/layout/nivara-shell';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RingProgress } from '@/components/dashboard/ring-progress';
import { Pill } from '@/components/shared/pill';
import { getCurrentUser } from '@/lib/auth';
import { getRecommendations, toggleRecommendation } from '@/lib/api/support';
import { getTrendData } from '@/lib/api/academics';
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

export default function DashboardPage() {
  const student = getCurrentUser();
  const { data: recommendations } = useQuery({ queryKey: ['recommendations'], queryFn: getRecommendations });
  const { data: trendData } = useQuery({ queryKey: ['trendData'], queryFn: getTrendData });

  // Initialise done state only once recommendations load
  const [done, setDone] = useState<boolean[]>([]);
  useEffect(() => {
    if (recommendations && done.length === 0) {
      setDone(recommendations.map((r) => r.completed ?? false));
    }
  }, [recommendations]);

  const toggle = async (i: number) => {
    await toggleRecommendation(i);
    setDone((state) => state.map((v, index) => (index === i ? !v : v)));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppShell>
      <div className="rise-in">
        {/* Page header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="serenity-label text-white/40">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h1 className="mt-3 font-display text-7xl leading-[.87] tracking-[-.04em]">
              {greeting},<br />
              <em>{student?.name?.split(' ')[0] || 'Student'}.</em>
            </h1>
          </div>
          <Link
            href="/check-in"
            data-testid="link-dashboard-checkin"
            className="btn-sweep inline-flex items-center gap-2 border border-[#c3f340]/30 bg-[#141414] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408]"
          >
            Take today's check-in <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Metric row */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard label="Well-being" value="64" detail="A little below your usual range" tone="warm" icon={<HeartHandshake size={17} />} />
          <MetricCard label="Academic rhythm" value="78%" detail="On track across 4 subjects" tone="accent" icon={<TrendingUp size={17} />} />
          <MetricCard label="Next deadline" value="18h" detail="Prototype walkthrough · high priority" icon={<Clock3 size={17} />} />
          <MetricCard label="Support" value="3" detail="Practical suggestions waiting" icon={<Sparkles size={17} />} />
        </div>

        {/* Chart + signal row */}
        <div className="mt-3 grid grid-cols-[1.4fr_.6fr] gap-3">
          <section className="border border-white/[0.09] bg-[hsl(var(--card))] p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="serenity-label text-white/40">Your week at a glance</p>
                <h2 className="mt-2 font-display text-3xl">The shape of things</h2>
              </div>
              <Link
                href="/academics"
                data-testid="link-dashboard-chart"
                className="rounded-lg p-2 text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                aria-label="View academics"
              >
                <MoreHorizontal size={18} />
              </Link>
            </div>
            <div className="mt-7 h-[220px] w-full">
              <TrendChart data={trendData || []} height={220} filled={false} />
            </div>
            <div className="mt-4 flex gap-5 text-[10px] text-white/35">
              <span>
                <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#c3f340]" />
                academic rhythm
              </span>
              <span>
                <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#e5a27d]" />
                well-being
              </span>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[#141414] p-7">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-[20px] border-[#c3f340]/15" />
            <p className="serenity-label text-[#9eaa9f]">Early signal</p>
            <h2 className="mt-12 max-w-[260px] font-display text-4xl leading-[.95]">
              Your workload is concentrating
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Two high-effort submissions land within the next 48 hours. Your check-ins also show lower sleep and energy this week.
            </p>
            <Link
              href="/support"
              className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.08em] text-[#dff77d] transition-opacity hover:opacity-75"
            >
              Plan it with support <ArrowUpRight size={13} />
            </Link>
          </section>
        </div>

        {/* Plan + suggestions row */}
        <div className="mt-3 grid grid-cols-[.75fr_1.25fr] gap-3">
          <section className="border border-white/[0.09] bg-[#151515] p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="serenity-label text-white/40">Next up</p>
                <h2 className="mt-2 font-display text-3xl">Keep it small</h2>
              </div>
              <RingProgress value={64} label="steady" />
            </div>
            <div className="mt-5 border-t border-white/[0.08] pt-5">
              <p className="text-sm leading-6 text-white/55">
                A 45-minute prototype plan is enough for today. Momentum comes from knowing the next move.
              </p>
              <Link
                href="/support"
                data-testid="link-dashboard-support"
                className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.08em] text-[#dff77d] transition-opacity hover:opacity-75"
              >
                Plan it with support <ArrowUpRight size={13} />
              </Link>
            </div>
          </section>

          <section className="border border-white/[0.09] bg-[hsl(var(--card))] p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="serenity-label text-white/40">Suggestions</p>
                <h2 className="mt-2 font-display text-3xl">For this week</h2>
              </div>
              <Pill tone="accent">3 actions</Pill>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {recommendations?.map((item, i) => (
                <button
                  key={item.title}
                  onClick={() => toggle(i)}
                  data-testid={`button-recommendation-${i}`}
                  className={`group border p-4 text-left transition-[border-color,background-color] duration-150 ease-out ${
                    done[i]
                      ? 'border-[rgba(195,243,64,.35)] bg-[rgba(195,243,64,.07)]'
                      : 'border-white/[0.09] hover:border-[rgba(195,243,64,.35)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <Pill tone={item.type === 'Well-being' ? 'warm' : item.type === 'Support' ? 'plum' : 'default'}>
                      {item.type}
                    </Pill>
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border text-[11px] transition-colors duration-150 ${
                        done[i]
                          ? 'border-[#c3f340] bg-[#c3f340] text-[#0d1408]'
                          : 'border-white/[0.18] text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                  <p className="mt-7 text-xs font-extrabold">{item.title}</p>
                  <p className="mt-2 text-[11px] leading-4 text-white/45">{item.description}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
