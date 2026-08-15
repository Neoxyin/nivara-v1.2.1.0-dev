'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { Button } from '@/components/shared/button';
import { TiltCard } from '@/components/ui/tilt-card';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { Info, ChevronDown, ArrowUpRight } from 'lucide-react';
import { getInsights } from '@/lib/api/insights';
import { useQuery } from '@tanstack/react-query';

export default function InsightsPage() {
  const [expanded, setExpanded] = useState<number>(0);
  const [acted, setActed] = useState<string[]>([]);
  const { data: insights } = useQuery({ queryKey: ['insights'], queryFn: getInsights });

  const toggleExpand = (i: number) => setExpanded((prev) => (prev === i ? -1 : i));
  const toggleAction = (action: string) =>
    setActed((a) => (a.includes(action) ? a.filter((x) => x !== action) : [...a, action]));

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
                    <Pill tone={insight.tone === 'watch' ? 'warm' : 'accent'}>
                      {insight.tone === 'watch' ? 'Worth noticing' : 'A useful anchor'}
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
                        kind={acted.includes(action) ? 'quiet' : 'outline'}
                        onClick={() => toggleAction(action)}
                        testId={`button-insight-action-${action}`}
                      >
                        {acted.includes(action) ? '✓ ' : ''}{action}
                      </Button>
                    ))}
                  </div>
                </TiltCard>
              </div>
            ))}
          </StaggerContainer>

          {/* Right column — actionable counsellor callout */}
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
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
