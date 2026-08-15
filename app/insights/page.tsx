'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { Button } from '@/components/shared/button';
import { Info, ChevronDown } from 'lucide-react';
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

        <div className="grid grid-cols-[1.35fr_.65fr] gap-3">
          <div className="space-y-3">
            {insights?.map((insight, i) => (
              <article
                key={insight.title}
                className={`border bg-[hsl(var(--card))] p-8 ${
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
                <h2 className="mt-8 max-w-xl font-display text-4xl leading-[.95]">{insight.title}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">{insight.summary}</p>

                {/* Expand toggle — fixed: uses transition classes not a duration token */}
                <button
                  onClick={() => toggleExpand(i)}
                  data-testid={`button-insight-factors-${i}`}
                  className="mt-7 flex w-full items-center justify-between border-t border-white/[0.08] pt-4 text-left text-[11px] font-bold uppercase tracking-[.08em] text-white/50 transition-colors hover:text-white/80"
                >
                  <span>What contributed to this</span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200 ease-out"
                    style={{ transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {expanded === i && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {insight.contributingFactors.map((factor) => (
                      <div
                        key={factor}
                        className="bg-white/[0.04] border border-white/[0.07] p-3 text-xs leading-5 text-white/45"
                      >
                        {factor}
                      </div>
                    ))}
                  </div>
                )}

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
              </article>
            ))}
          </div>

          {/* Right column — summary callout */}
          <aside className="space-y-3">
            <div className="border border-white/[0.09] bg-[#141414] p-7">
              <p className="serenity-label text-white/40">How to read this</p>
              <p className="mt-4 text-sm leading-6 text-white/55">
                Certainty language matters. "May be contributing" is not a diagnosis — it is a signal worth noticing.
              </p>
            </div>
            <div className="border border-white/[0.09] bg-[hsl(var(--card))] p-7">
              <p className="serenity-label text-white/40">Your data</p>
              <p className="mt-4 text-sm leading-6 text-white/55">
                Signals are based only on the check-ins you have submitted. Nothing external is included.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
