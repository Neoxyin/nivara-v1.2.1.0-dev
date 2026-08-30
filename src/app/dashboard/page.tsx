'use client';
import { ExplainabilityDialog } from '@/components/shared/explainability-dialog';

import dynamicImport from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Clock3,
  HeartHandshake,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '@/components/layout/nivara-shell';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RingProgress } from '@/components/dashboard/ring-progress';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { TextReveal } from '@/components/ui/text-reveal';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { getCurrentUser } from '@/lib/auth';
import { getRecommendations, toggleRecommendation } from '@/lib/api/support';
import { getTrendData } from '@/lib/api/academics';
import { getPreferences } from '@/lib/api/preferences';
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
  const { data: preferences } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  
  const hasWellbeingConsent = preferences?.find((p) => p.key === 'wellbeing_checkins')?.enabled !== false;

  // Initialise done state only once recommendations load
  const [done, setDone] = useState<boolean[]>([]);
  useEffect(() => {
    if (recommendations && done.length === 0) {
      setDone(recommendations.map((r) => r.completed ?? false));
    }
  }, [recommendations, done.length]);

  const toggle = async (i: number) => {
    await toggleRecommendation(i);
    setDone((state) => state.map((v, index) => (index === i ? !v : v)));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppShell>
      <div className="rise-in space-y-4">
        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="serenity-label text-[#c3f340]/80">Today / Overview</p>
            <h1 className="mt-2 font-display text-6xl md:text-7xl leading-[.88] tracking-[-.04em]">
              <TextReveal type="words" duration={0.7}>{greeting},</TextReveal>
              <br />
              <em className="text-[#c3f340]">
                <TextReveal type="words" delay={0.2} duration={0.7}>
                  {student?.name?.split(' ')[0] || 'Student'}.
                </TextReveal>
              </em>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {hasWellbeingConsent && (
              <Magnetic>
                <Link
                  href="/check-in"
                  data-testid="link-dashboard-checkin"
                  className="btn-sweep inline-flex items-center gap-2 border border-[#c3f340]/30 bg-[#141414] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors hover:text-[#0d1408] hover:border-[#c3f340]"
                >
                  Take today&apos;s check-in <ArrowUpRight size={14} />
                </Link>
              </Magnetic>
            )}
          </div>
        </div>

        {/* Metric row with GSAP Stagger - all 4 cards fully interactive */}
        <StaggerContainer stagger={0.07} className="grid grid-cols-4 gap-3">
          {hasWellbeingConsent ? (
            <div className="stagger-item">
              <MetricCard
                label="Well-being"
                value="64"
                detail="A little below your usual range"
                tone="warm"
                icon={<HeartHandshake size={17} />}
                href="/check-in"
              />
            </div>
          ) : (
            <div className="stagger-item opacity-40 grayscale pointer-events-none">
              <MetricCard
                label="Well-being"
                value="—"
                detail="Consent paused"
                tone="neutral"
                icon={<HeartHandshake size={17} />}
                href="/settings"
              />
            </div>
          )}
          <div className="stagger-item">
            <MetricCard
              label="Academic rhythm"
              value="78%"
              detail="On track across 4 subjects"
              tone="accent"
              icon={<TrendingUp size={17} />}
              href="/academics"
            />
          </div>
          <div className="stagger-item">
            <MetricCard
              label="Next deadline"
              value="18h"
              detail="Prototype walkthrough · high priority"
              icon={<Clock3 size={17} />}
              href="/academics"
            />
          </div>
          <div className="stagger-item">
            <MetricCard
              label="Support"
              value="3"
              detail="Practical suggestions waiting"
              icon={<Sparkles size={17} />}
              href="/support"
            />
          </div>
        </StaggerContainer>

        {/* Chart + signal row */}
        <div className="mt-3 grid grid-cols-[1.4fr_.6fr] gap-3">
          <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[hsl(var(--card))] p-7 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="serenity-label text-white/40">Your week at a glance</p>
                <h2 className="mt-2 font-display text-3xl">The shape of things</h2>
              </div>
              <Magnetic>
                <Link
                  href="/academics"
                  data-testid="link-dashboard-chart"
                  className="rounded-lg p-2 text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70 block"
                  aria-label="View academics"
                >
                  <MoreHorizontal size={18} />
                </Link>
              </Magnetic>
            </div>
            <div className="mt-7 h-[220px] w-full">
              <TrendChart data={trendData || []} height={220} filled={false} showWellbeing={hasWellbeingConsent} />
            </div>
            <div className="mt-4 flex gap-5 text-[10px] text-white/35">
              <span>
                <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#c3f340] shadow-[0_0_8px_#c3f340]" />
                academic rhythm
              </span>
              {hasWellbeingConsent && (
                <>
                  <span>
                    <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#a3b8cc] shadow-[0_0_8px_#a3b8cc]" />
                    sleep quality
                  </span>
                  <span>
                    <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#e5a27d] shadow-[0_0_8px_#e5a27d]" />
                    stress level
                  </span>
                </>
              )}
            </div>
          </TiltCard>

          <TiltCard
            maxTilt={4}
            spotlightColor="rgba(195, 243, 64, 0.15)"
            className="relative overflow-hidden bg-[#141414] p-7 backdrop-blur-xl border border-white/[0.08]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-[20px] border-[#c3f340]/15 animate-pulse" />
            <p className="serenity-label text-[#9eaa9f]">Early signal</p>
            <h2 className="mt-12 max-w-[260px] font-display text-4xl leading-[.95]">
              Your workload is picking up
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Two high-effort submissions land within the next 48 hours.
              {hasWellbeingConsent && " Your check-ins also show lower sleep and energy this week."}
            </p>
            <Magnetic>
              <Link
                href="/support"
                className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.08em] text-[#dff77d] transition-opacity hover:opacity-75"
              >
                Plan it with support <ArrowUpRight size={13} />
              </Link>
            </Magnetic>
          </TiltCard>
        </div>

        {/* Plan + suggestions row */}
        <div className="mt-3 grid grid-cols-[.75fr_1.25fr] gap-3">
          <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[#151515] p-7 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="serenity-label text-white/40">Next up</p>
                <h2 className="mt-2 font-display text-3xl">Suggested step</h2>
              </div>
              <RingProgress value={64} label="steady" />
            </div>
            <div className="mt-5 border-t border-white/[0.08] pt-5">
              <p className="text-sm leading-6 text-white/55">
                Block 45 minutes for your nearest deadline today. Splitting larger coursework into single focused segments helps prevent last-minute overload.
              </p>
              <Magnetic>
                <Link
                  href="/support"
                  data-testid="link-dashboard-support"
                  className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.08em] text-[#dff77d] transition-opacity hover:opacity-75"
                >
                  Plan it with support <ArrowUpRight size={13} />
                </Link>
              </Magnetic>
            </div>
          </TiltCard>

          <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[hsl(var(--card))] p-7 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="serenity-label text-white/40">Suggestions</p>
                  <h2 className="mt-2 font-display text-3xl">For this week</h2>
                </div>
                <div className="text-right">
                  <span className="serenity-label text-[#c3f340]">
                    {done.filter(Boolean).length} of {recommendations?.length || 3} completed
                  </span>
                  <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full bg-[#c3f340] shadow-[0_0_8px_#c3f340] transition-all duration-300 ease-out"
                      style={{
                        width: `${((done.filter(Boolean).length) / (recommendations?.length || 3)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {recommendations?.map((item, i) => {
                  const isDone = done[i];
                  return (
                    <div
                      key={item.title}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(i)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggle(i);
                        }
                      }}
                      data-testid={`button-recommendation-${i}`}
                      className={`group relative flex flex-col justify-between overflow-hidden border p-4 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 rounded cursor-pointer select-none ${
                        isDone
                          ? 'border-[rgba(195,243,64,.35)] bg-[rgba(195,243,64,.04)] opacity-65'
                          : 'border-white/[0.09] bg-white/[0.01] hover:border-[rgba(195,243,64,.35)] hover:bg-white/[0.03]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <Pill tone={item.type === 'Well-being' ? 'warm' : item.type === 'Support' ? 'plum' : 'default'}>
                            {item.type}
                          </Pill>
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border text-[11px] font-bold transition-all duration-200 ${
                              isDone
                                ? 'border-[#c3f340] bg-[#c3f340] text-[#0d1408] scale-110 shadow-[0_0_8px_#c3f340]'
                                : 'border-white/[0.18] text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                        <p className={`mt-5 text-xs font-extrabold transition-all duration-200 ${
                          isDone ? 'line-through text-white/50' : 'text-white'
                        }`}>
                          {item.title}
                        </p>
                        <p className="mt-1.5 text-[11px] leading-4 text-white/45">{item.description}</p>
                      </div>
                      
                      {item.explainability && (
                        <div className="mt-2 flex justify-start" onClick={(e) => e.stopPropagation()}>
                          <ExplainabilityDialog 
                            title={item.title}
                            contributingFactors={item.explainability.contributingFactors}
                            timeWindow={item.explainability.timeWindow}
                            dataUsed={item.explainability.dataUsed}
                            dataNotUsed={item.explainability.dataNotUsed}
                          />
                        </div>
                      )}

                      {item.why && (
                        <div className="mt-4 border-t border-white/[0.06] pt-2">
                          <p className="serenity-label text-[8px] text-[#c3f340]/70">Why</p>
                          <p className="text-[10px] leading-tight text-white/40">{item.why}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </AppShell>
  );
}


