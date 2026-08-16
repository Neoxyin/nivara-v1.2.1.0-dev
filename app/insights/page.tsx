'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { Button } from '@/components/shared/button';
import { TiltCard } from '@/components/ui/tilt-card';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { Info, ChevronDown, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';
import { getInsights } from '@/lib/api/insights';
import { useQuery } from '@tanstack/react-query';

export default function InsightsPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number>(0);
  const {
    data: insights,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['insights'],
    queryFn: getInsights,
    refetchOnMount: 'always',
    retry: false,
  });

  const toggleExpand = (i: number) => setExpanded((prev) => (prev === i ? -1 : i));
  const handleActionClick = (action: string) => {
    router.push(`/support?prompt=${encodeURIComponent(action)}`);
  };

  return (
    <AppShell>
      <div className="rise-in">
        <SectionHeading
          eyebrow="Explainable signals"
          title="Nothing mysterious here."
          description="Nivara shows its working. These are patterns to consider, not labels or predictions about you."
          action={
            <Pill tone="plum">
              <Info size={12} className="mr-1" /> Your data, your context
            </Pill>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-[1.35fr_.65fr] gap-4" data-testid="insights-loading-state">
            <div className="space-y-3">
              <div className="rounded-lg border border-white/[0.08] bg-[hsl(var(--card))]/60 p-8 backdrop-blur-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-28 rounded bg-white/[0.08]" />
                  <div className="h-4 w-44 rounded bg-white/[0.05]" />
                </div>
                <div className="mt-8 h-10 w-3/4 rounded bg-white/[0.08]" />
                <div className="mt-4 h-16 w-full rounded bg-white/[0.04]" />
                <div className="mt-8 flex items-center gap-2 text-xs text-[#c3f340]/80">
                  <Sparkles size={14} className="animate-spin" />
                  <span>Interpreting your check-in signals & context...</span>
                </div>
              </div>
            </div>
            <aside className="space-y-3">
              <div className="h-48 rounded-lg border border-white/[0.08] bg-[hsl(var(--card))]/40 animate-pulse" />
            </aside>
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-[rgba(229,162,125,.3)] bg-[hsl(var(--card))]/90 p-8 text-center backdrop-blur-xl">
            <p className="font-display text-2xl text-white">Unable to load insights</p>
            <p className="mt-2 text-sm text-white/55">
              There was a temporary problem processing your check-in data.
            </p>
            <button
              onClick={() => refetch()}
              className="btn-sweep mt-6 inline-flex items-center gap-2 border border-[#c3f340]/40 bg-[#141414] px-5 py-2.5 text-xs font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408] hover:border-[#c3f340] rounded"
            >
              <RefreshCw size={13} /> Try refreshing signals
            </button>
          </div>
        ) : insights && insights.length === 0 ? (
          <div className="grid grid-cols-[1.35fr_.65fr] gap-4">
            <TiltCard
              maxTilt={2}
              className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-8 backdrop-blur-xl"
            >
              <Pill tone="default">Snapshot saved</Pill>
              <h2 className="mt-6 font-display text-3xl text-white">
                More check-ins will illuminate deeper patterns
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/55">
                We need at least one check-in snapshot to formulate grounded signals and patterns. Taking a 60-second check-in helps Nivara understand your workload and rest rhythm.
              </p>
              <div className="mt-6">
                <Link
                  href="/check-in"
                  className="btn-sweep inline-flex items-center gap-2 border border-[#c3f340] bg-[#c3f340] px-5 py-2.5 text-xs font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.3)] transition-all hover:scale-105 rounded"
                >
                  Take a check-in <ArrowUpRight size={13} />
                </Link>
              </div>
            </TiltCard>
            <aside className="space-y-3">
              <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl">
                <p className="serenity-label text-white/40">Your private data</p>
                <p className="mt-3 text-xs leading-relaxed text-white/55">
                  Signals are based strictly on check-ins you submit. Nothing is shared with faculty unless you choose to export it.
                </p>
              </TiltCard>
            </aside>
          </div>
        ) : (
          <div className="grid grid-cols-[1.35fr_.65fr] gap-4">
            <StaggerContainer stagger={0.08} className="space-y-3">
              {insights?.map((insight, i) => (
                <div key={insight.title} className="stagger-item">
                  <TiltCard
                    maxTilt={2}
                    spotlightColor={insight.tone === 'watch' ? 'rgba(229,162,125,0.15)' : 'rgba(195,243,64,0.15)'}
                    className={`border bg-[hsl(var(--card))]/90 p-8 backdrop-blur-xl transition-all duration-200 ${
                      i === 0 ? 'border-[rgba(229,162,125,.4)]' : 'border-white/[0.09]'
                    }`}
                    data-testid={`card-insight-${i}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <Pill tone={insight.tone === 'watch' ? 'warm' : insight.tone === 'positive' ? 'accent' : 'default'}>
                        {insight.tone === 'watch' ? 'Worth noticing' : insight.tone === 'positive' ? 'A useful anchor' : 'Steady rhythm'}
                      </Pill>
                      <span className="serenity-label text-white/35">{insight.certainty}</span>
                    </div>
                    <h2 className="mt-8 max-w-xl font-display text-4xl leading-[.95] text-white">
                      {insight.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">{insight.summary}</p>

                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleExpand(i)}
                      data-testid={`button-insight-factors-${i}`}
                      className="mt-7 flex w-full items-center justify-between border-t border-white/[0.08] pt-4 text-left text-[11px] font-bold uppercase tracking-[.08em] text-white/50 transition-colors hover:text-white/80"
                    >
                      <span>What contributed to this</span>
                      <ChevronDown
                        size={16}
                        className="shrink-0 transition-transform duration-300 ease-out"
                        style={{ transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        expanded === i ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-3 gap-2 pb-1">
                          {insight.contributingFactors.map((factor) => (
                            <div
                              key={factor}
                              className="bg-white/[0.04] border border-white/[0.07] p-3 text-xs leading-5 text-white/55 rounded"
                            >
                              {factor}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {insight.actions.map((action) => (
                        <Button
                          key={action}
                          kind="outline"
                          onClick={() => handleActionClick(action)}
                          testId={`button-insight-action-${action}`}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </TiltCard>
                </div>
              ))}
            </StaggerContainer>

            {/* Right column â€” actionable counsellor callout */}
            <aside className="space-y-3">
              <TiltCard
                maxTilt={3}
                spotlightColor="rgba(195, 243, 64, 0.15)"
                className="border border-[#c3f340]/25 bg-[#141414]/90 p-7 backdrop-blur-xl"
              >
                <p className="serenity-label text-[#c3f340]">Need another perspective?</p>
                <h3 className="mt-2 font-display text-2xl text-white">Talk with a counsellor</h3>
                <p className="mt-3 text-xs leading-relaxed text-white/60">
                  You can review these exact signals together in a confidential 20-minute session.
                </p>
                <Link
                  href="/counsellors"
                  data-testid="link-insights-counsellors"
                  className="btn-sweep mt-5 inline-flex items-center gap-2 border border-[#c3f340]/40 bg-[#141414] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408] hover:border-[#c3f340] rounded"
                >
                  Browse counsellors <ArrowUpRight size={12} />
                </Link>
              </TiltCard>

              <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl">
                <p className="serenity-label text-white/40">Your private data</p>
                <p className="mt-3 text-xs leading-relaxed text-white/55">
                  Signals are based strictly on check-ins you submit. Nothing is shared with faculty unless you choose to export it.
                </p>
              </TiltCard>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
