'use client';

import React, { useState } from 'react';
import { FairnessMetrics } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import {
  Scale,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileSearch,
  Activity,
  Layers,
  Clock,
} from 'lucide-react';

interface FairnessMetricsPanelProps {
  metrics: FairnessMetrics[];
}

export function FairnessMetricsPanel({ metrics }: FairnessMetricsPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-white/[0.08] bg-[#141414]/90 text-center backdrop-blur-xl">
        <Scale size={36} className="text-white/30 mb-3" />
        <h3 className="text-base font-semibold text-white">Insufficient data for fairness analysis</h3>
        <p className="text-xs text-white/50 max-w-md mt-1">
          Metrics will appear when enough observations are available.
        </p>
      </div>
    );
  }

  const activeMetric = metrics[selectedIndex] || metrics[0];
  const { dimension, referenceGroup, groups, humanReviewRequired, lastEvaluated } = activeMetric;

  // Chart data for selection rates
  const selectionRateChartData = groups.map((g) => ({
    name: g.group.replace('Department: ', '').replace('Cohort: ', ''),
    fullName: g.group,
    rate: g.sufficientData ? Number((g.selectionRate * 100).toFixed(1)) : 0,
    sufficientData: g.sufficientData,
    sampleSize: g.sampleSize,
    isReference: g.group === referenceGroup,
  }));

  // Chart data for error rates (FPR, FNR, TPR)
  const errorRateChartData = groups
    .filter((g) => g.sufficientData)
    .map((g) => ({
      name: g.group.replace('Department: ', '').replace('Cohort: ', ''),
      fullName: g.group,
      fpr: g.falsePositiveRate !== undefined ? Number((g.falsePositiveRate * 100).toFixed(1)) : null,
      fnr: g.falseNegativeRate !== undefined ? Number((g.falseNegativeRate * 100).toFixed(1)) : null,
      tpr: g.truePositiveRate !== undefined ? Number((g.truePositiveRate * 100).toFixed(1)) : null,
    }));

  return (
    <div className="space-y-8">
      {/* Dimension Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        {metrics.map((m, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={m.dimension}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-white/[0.12] text-white shadow-[0_0_12px_rgba(195,243,64,0.08)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Scale size={13} className={isSelected ? 'text-[#c3f340]' : 'text-white/40'} />
              <span>{m.dimension}</span>
              {m.humanReviewRequired && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: FAIRNESS OVERVIEW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-[#c3f340]/10 text-[#c3f340] border border-[#c3f340]/20">
              <Scale size={14} />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              1. Fairness Overview
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
            <Clock size={12} /> Last Evaluated: {lastEvaluated}
          </span>
        </div>

        {/* Overview Banner Card */}
        <TiltCard
          maxTilt={1.2}
          className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">
                Evaluated Dimension
              </span>
              <p className="text-sm font-semibold text-white mt-1 truncate">{dimension}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">
                Reference Baseline Group
              </span>
              <p className="text-sm font-semibold text-[#c3f340] mt-1 truncate">{referenceGroup}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">
                Audited Cohorts / Groups
              </span>
              <p className="text-sm font-semibold text-white mt-1">
                {groups.length} Groups Evaluated
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">
                Human Review Status
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                {humanReviewRequired ? (
                  <Pill tone="warm" className="text-[11px]">
                    <AlertCircle size={11} className="mr-1 inline" /> Human review recommended
                  </Pill>
                ) : (
                  <Pill tone="accent" className="text-[11px]">
                    <CheckCircle2 size={11} className="mr-1 inline" /> Within standard operating variance
                  </Pill>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-white/60 leading-relaxed">
            Institutional algorithmic fairness audit monitors support opportunity distribution across campus groups without storing sensitive protected characteristics or punitive classifications.
          </div>
        </TiltCard>
      </section>

      {/* SECTION 2: SELECTION RATES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
            <Layers size={14} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            2. Selection Rates
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart View */}
          <TiltCard
            maxTilt={1.2}
            className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Support Prompt Selection Rate</h3>
                <p className="text-xs text-white/50">Percentage of group receiving proactive nudges</p>
              </div>
              <span className="text-[11px] font-mono text-white/40">Baseline Comparison</span>
            </div>

            <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:overflow-x-visible">
              <div className="h-[260px] min-w-[420px] sm:min-w-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectionRateChartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                      interval={0}
                      angle={0}
                      textAnchor="middle"
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickMargin={8}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={11}
                      unit="%"
                      domain={[0, 50]}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(195, 243, 64, 0.06)' }}
                      contentStyle={{
                        backgroundColor: '#171717',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                      itemStyle={{ color: '#c3f340', fontWeight: 500 }}
                      labelStyle={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}
                      formatter={(value: any, name: any, props: any) => {
                        if (!props.payload.sufficientData) return ['Insufficient data', 'Selection Rate'];
                        return [`${value}%`, 'Selection Rate'];
                      }}
                    />
                    <Bar dataKey="rate" name="Selection Rate (%)" radius={[4, 4, 0, 0]}>
                      {selectionRateChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            !entry.sufficientData
                              ? 'rgba(255,255,255,0.15)'
                              : entry.isReference
                              ? '#c3f340'
                              : '#38bdf8'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TiltCard>

          {/* Table List View */}
          <TiltCard
            maxTilt={1.2}
            className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Group Breakdown</h3>
              <div className="space-y-2.5">
                {groups.map((g) => (
                  <div
                    key={g.group}
                    className="p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        {g.group.replace('Department: ', '').replace('Cohort: ', '')}
                        {g.group === referenceGroup && (
                          <span className="text-[9px] text-[#c3f340] border border-[#c3f340]/30 bg-[#c3f340]/10 px-1 py-0.2 rounded font-mono">
                            REF
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-white/40">
                        Sample Size: {g.sampleSize.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      {g.sufficientData ? (
                        <span className="font-mono font-bold text-white text-sm">
                          {(g.selectionRate * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-white/40 italic">
                          Insufficient data
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-white/40 mt-3 pt-2 border-t border-white/[0.06]">
              Selection rate represents the proportion of students in the aggregate group receiving proactive guidance nudges.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* SECTION 3: DISPARATE IMPACT */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/20">
            <Scale size={14} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            3. Disparate Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {groups.map((g) => {
            const isRef = g.group === referenceGroup;
            const ratio = g.disparateImpact;
            const isBelowThreshold = ratio !== undefined && ratio < 0.8;

            return (
              <TiltCard
                key={g.group}
                maxTilt={1.5}
                className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-white">
                      {g.group.replace('Department: ', '').replace('Cohort: ', '')}
                    </h4>
                    {isRef ? (
                      <span className="text-[9px] font-mono text-[#c3f340] bg-[#c3f340]/10 px-1.5 py-0.5 rounded border border-[#c3f340]/30">
                        Reference (1.00)
                      </span>
                    ) : g.sufficientData ? (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          isBelowThreshold
                            ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        }`}
                      >
                        {isBelowThreshold ? 'Variance' : 'Passed'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-white/40 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.08]">
                        Unverified
                      </span>
                    )}
                  </div>

                  <div className="my-4">
                    {g.sufficientData && ratio !== undefined ? (
                      <div>
                        <span className="text-2xl font-bold font-mono text-white">
                          {ratio.toFixed(2)}
                        </span>
                        <span className="block text-[10px] text-white/50 mt-1 font-mono">
                          80% rule audit indicator
                        </span>
                      </div>
                    ) : (
                      <div className="py-2">
                        <span className="text-xs font-mono text-white/40 italic">
                          Insufficient data
                        </span>
                        <span className="block text-[10px] text-white/30 mt-1">
                          Requires min observation threshold
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] text-[10px] text-white/40">
                  Sample: {g.sampleSize.toLocaleString()} observations
                </div>
              </TiltCard>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] text-xs text-white/50 leading-relaxed">
          <span className="text-white/70 font-semibold">Note on 80% Rule Audit Indicator:</span> The 80% (4/5ths) ratio benchmark serves strictly as an algorithmic audit indicator to surface potential selection variances for human review. It does not establish a legal or definitive determination of fairness.
        </div>
      </section>

      {/* SECTION 4: ERROR RATES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-[#fb7185]/10 text-[#fb7185] border border-[#fb7185]/20">
            <Activity size={14} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            4. Error Rates
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Grouped Comparative Error Rates Chart */}
          <TiltCard
            maxTilt={1.2}
            className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Parity Error Rate Comparison
                </h3>
                <p className="text-xs text-white/50">
                  False Positive Rate (FPR), False Negative Rate (FNR), and True Positive Rate (TPR)
                </p>
              </div>
              <span className="text-[11px] font-mono text-white/40">Group Parity Audit</span>
            </div>

            <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:overflow-x-visible">
              <div className="h-[260px] min-w-[420px] sm:min-w-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={errorRateChartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                      interval={0}
                      angle={0}
                      textAnchor="middle"
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickMargin={8}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={11}
                      unit="%"
                      domain={[0, 100]}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(195, 243, 64, 0.06)' }}
                      contentStyle={{
                        backgroundColor: '#171717',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                      itemStyle={{ color: '#c3f340', fontWeight: 500 }}
                      labelStyle={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}
                      formatter={(val: any) => [`${val}%`]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="fpr" name="False Positive Rate (FPR)" fill="#fb7185" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="fnr" name="False Negative Rate (FNR)" fill="#fbbf24" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="tpr" name="True Positive Rate (TPR)" fill="#4ade80" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TiltCard>

          {/* Group Metric Cards List */}
          <TiltCard
            maxTilt={1.2}
            className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Group Error Metrics</h3>
              <div className="space-y-3">
                {groups.map((g) => (
                  <div
                    key={g.group}
                    className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white truncate">
                        {g.group.replace('Department: ', '').replace('Cohort: ', '')}
                      </span>
                      {!g.sufficientData && (
                        <span className="text-[10px] text-white/40 italic font-mono">
                          Insufficient data
                        </span>
                      )}
                    </div>

                    {g.sufficientData ? (
                      <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-mono border-t border-white/[0.04]">
                        <div>
                          <span className="text-[9px] text-white/40 block">FPR</span>
                          <span className="text-rose-300 font-bold">
                            {g.falsePositiveRate !== undefined ? `${(g.falsePositiveRate * 100).toFixed(0)}%` : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/40 block">FNR</span>
                          <span className="text-amber-300 font-bold">
                            {g.falseNegativeRate !== undefined ? `${(g.falseNegativeRate * 100).toFixed(0)}%` : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/40 block">TPR</span>
                          <span className="text-emerald-400 font-bold">
                            {g.truePositiveRate !== undefined ? `${(g.truePositiveRate * 100).toFixed(0)}%` : '—'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/40 pt-1">
                        Sample size below statistical evaluation cutoff.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-white/40 mt-3 pt-2 border-t border-white/[0.06]">
              Equal opportunity parity requires balanced True Positive and False Negative rates across all audited academic groups.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* SECTION 5: REVIEW FLAGS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileSearch size={14} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            5. Review Flags
          </h2>
        </div>

        <TiltCard
          maxTilt={1.2}
          className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl"
        >
          {humanReviewRequired ? (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.04]">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertCircle size={18} />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">
                    Human review recommended
                  </h4>
                  <Pill tone="warm" className="text-[10px]">Action Required</Pill>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  A selection rate discrepancy was detected between {referenceGroup} and Junior cohorts (Disparate Impact ratio 0.72). A human institutional review is recommended to inspect whether term calendar clustering or department aid dispatch timing explains the variation.
                </p>
                <div className="pt-2 text-[11px] font-mono text-white/50">
                  Dimension: {dimension} • Recommendation: Convene Oversight Committee for qualitative evaluation
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03]">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-white">
                  No active review flags
                </h4>
                <p className="text-xs text-white/60">
                  All audited groups for {dimension} are operating within acceptable demographic and statistical parity thresholds.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40">
            <span>Governance Standard: Human-in-the-Loop Oversight</span>
            <span className="font-mono">Zero Autonomous Interventions Policy</span>
          </div>
        </TiltCard>
      </section>
    </div>
  );
}
