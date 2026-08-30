'use client';

import React, { useState } from 'react';
import { DemandDimension, DemandTrendPoint } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  BookOpen,
  DollarSign,
  HeartPulse,
  TrendingUp,
  Info,
  Layers,
  Filter,
} from 'lucide-react';

interface DemandTrendChartProps {
  data: {
    academic: DemandTrendPoint[];
    financial: DemandTrendPoint[];
    wellbeing: DemandTrendPoint[];
  };
}

export function DemandTrendChart({ data }: DemandTrendChartProps) {
  const [activeDimension, setActiveDimension] = useState<DemandDimension>('academic');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  const dimensionSeries = data?.[activeDimension] || [];

  // If a cohort multiplier or subset applies in aggregate, apply scaling
  const chartData = dimensionSeries.map((item) => {
    let multiplier = 1.0;
    if (selectedCohort === 'undergraduate') multiplier = 0.72;
    if (selectedCohort === 'postgraduate') multiplier = 0.28;

    return {
      period: item.period,
      low: Math.round(item.low * multiplier),
      mild: Math.round(item.mild * multiplier),
      moderate: Math.round(item.moderate * multiplier),
      high: Math.round(item.high * multiplier),
    };
  });

  const totalAggLow = chartData.reduce((acc, curr) => acc + curr.low, 0);
  const totalAggMild = chartData.reduce((acc, curr) => acc + curr.mild, 0);
  const totalAggMod = chartData.reduce((acc, curr) => acc + curr.moderate, 0);
  const totalAggHigh = chartData.reduce((acc, curr) => acc + curr.high, 0);
  const totalVolume = totalAggLow + totalAggMild + totalAggMod + totalAggHigh;

  const highRatio = totalVolume > 0 ? ((totalAggHigh / totalVolume) * 100).toFixed(1) : '0';

  const dimensionTabs: { id: DemandDimension; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'academic', label: 'Academic', icon: BookOpen, color: '#38bdf8' },
    { id: 'financial', label: 'Financial', icon: DollarSign, color: '#c3f340' },
    { id: 'wellbeing', label: 'Well-being', icon: HeartPulse, color: '#f472b6' },
  ];

  return (
    <div className="space-y-6">
      {/* Dimension Selector & Aggregate Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Toggle / Tabs: Academic | Financial | Well-being */}
        <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          {dimensionTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeDimension === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDimension(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-white/[0.12] text-white shadow-[0_0_12px_rgba(195,243,64,0.08)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-[#c3f340]' : 'text-white/40'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Aggregate Cohort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50 flex items-center gap-1">
            <Filter size={12} /> Aggregate Cohort:
          </span>
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="bg-[#141414] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white/80 focus:border-[#c3f340] focus:outline-none transition-colors"
          >
            <option value="all">All Students (Campus-wide)</option>
            <option value="undergraduate">Undergraduate Cohorts</option>
            <option value="postgraduate">Postgraduate & Research</option>
          </select>
        </div>
      </div>

      {/* Aggregate Overview Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#121212]/80 p-4">
          <div className="flex items-center justify-between text-white/40 text-[11px]">
            <span>Aggregate Volume</span>
            <Layers size={13} className="text-[#38bdf8]" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-white">{totalVolume}</p>
          <p className="text-[10px] text-white/40 mt-0.5">Total support requests logged</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#121212]/80 p-4">
          <div className="flex items-center justify-between text-white/40 text-[11px]">
            <span>Low & Mild Need</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-emerald-400">
            {totalAggLow + totalAggMild}
          </p>
          <p className="text-[10px] text-white/40 mt-0.5">
            {totalVolume > 0 ? (((totalAggLow + totalAggMild) / totalVolume) * 100).toFixed(0) : 0}% of aggregate requests
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#121212]/80 p-4">
          <div className="flex items-center justify-between text-white/40 text-[11px]">
            <span>Moderate & High Need</span>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-amber-300">
            {totalAggMod + totalAggHigh}
          </p>
          <p className="text-[10px] text-white/40 mt-0.5">Requires proactive resource staffing</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#121212]/80 p-4">
          <div className="flex items-center justify-between text-white/40 text-[11px]">
            <span>High-Demand Surge Ratio</span>
            <TrendingUp size={13} className="text-rose-400" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-rose-400">{highRatio}%</p>
          <p className="text-[10px] text-white/40 mt-0.5">Aggregated high tier requests</p>
        </div>
      </div>

      {/* Main Trend Line Chart Card */}
      <TiltCard
        maxTilt={1.2}
        className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-6 backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">
                {activeDimension === 'academic' && 'Academic Support Demand Trajectory'}
                {activeDimension === 'financial' && 'Financial Support Demand Trajectory'}
                {activeDimension === 'wellbeing' && 'Well-being Support Demand Trajectory'}
              </h3>
              <Pill tone="default" className="capitalize text-[10px]">
                {activeDimension} Dimension
              </Pill>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Longitudinal distribution across 4 support-need classifications
            </p>
          </div>
          <span className="font-mono text-[11px] text-white/40">
            Aggregate Temporal Distribution
          </span>
        </div>

        {chartData.length === 0 ? (
          <div className="h-[340px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
            <Info size={28} className="text-white/30 mb-2" />
            <p className="text-sm font-semibold text-white/80">No support-demand data available</p>
            <p className="text-xs text-white/40 max-w-sm mt-1">
              There isn&apos;t enough aggregate data for this period.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:overflow-x-visible">
            <div className="h-[340px] min-w-[500px] sm:min-w-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="period"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickMargin={8}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    paddingTop: '16px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  name="LOW"
                  stroke="#4ade80"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#4ade80', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#4ade80' }}
                />
                <Line
                  type="monotone"
                  dataKey="mild"
                  name="MILD"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#38bdf8', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#38bdf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="moderate"
                  name="MODERATE"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#fbbf24', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fbbf24' }}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  name="HIGH"
                  stroke="#f87171"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#f87171', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#f87171' }}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Mandatory Governance Explanatory Copy */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-start gap-2.5 bg-white/[0.01] p-3 rounded-xl">
          <Info size={15} className="text-[#c3f340] shrink-0 mt-0.5" />
          <p className="text-xs text-white/60 leading-relaxed font-sans">
            Support-need levels are indicators used to understand demand for support. They are not permanent labels or punitive classifications.
          </p>
        </div>
      </TiltCard>
    </div>
  );
}
