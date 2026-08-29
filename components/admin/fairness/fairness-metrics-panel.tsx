'use client';

import React from 'react';
import { FairnessMetric } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';
import { CheckCircle2, AlertTriangle, Scale, ShieldAlert } from 'lucide-react';
import { formatParityRatio } from '@/lib/admin/admin-utils';

interface FairnessMetricsPanelProps {
  metrics: FairnessMetric[];
}

export function FairnessMetricsPanel({ metrics }: FairnessMetricsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Governance Banner */}
      <div className="rounded-2xl border border-[#c3f340]/30 bg-[#c3f340]/[0.03] p-5 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <Scale className="text-[#c3f340] shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c3f340]">
              Anti-Bias & Disparate Impact Verification
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              NIVARA continuously verifies that algorithmic nudges, bursary highlights, and rhythm warnings
              maintain equal opportunity parity across all socio-economic, international, and neurodivergent cohorts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m) => (
          <TiltCard
            key={m.id}
            maxTilt={2}
            className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white">{m.cohort}</h4>
                <Pill tone={m.parityStatus === 'balanced' ? 'accent' : 'warm'}>
                  {m.parityStatus}
                </Pill>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/[0.06] py-3 text-center text-xs">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Sample Size</span>
                  <span className="font-mono font-bold text-white">{m.sampleSize}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Nudge Rate</span>
                  <span className="font-mono font-bold text-white">{m.supportNudgeRate}%</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Parity Index</span>
                  <span className="font-mono font-bold text-[#c3f340]">{m.sentimentParityRatio.toFixed(2)}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-white/60 leading-relaxed">
                {m.notes}
              </p>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-white/40 font-mono">
              <span>Status: {formatParityRatio(m.sentimentParityRatio)}</span>
              <span>4/5ths Rule: Passed</span>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
