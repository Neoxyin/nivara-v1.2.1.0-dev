'use client';

import React from 'react';
import { WellnessTrendPoint } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Info, Sparkles } from 'lucide-react';
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

interface WellnessTrendlineCardProps {
  data: WellnessTrendPoint[];
}

export function WellnessTrendlineCard({ data }: WellnessTrendlineCardProps) {
  if (!data || data.length === 0) {
    return (
      <TiltCard
        maxTilt={1}
        className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-8 text-center backdrop-blur-xl"
      >
        <Sparkles size={32} className="mx-auto text-white/20 mb-2" />
        <h3 className="text-sm font-semibold text-white">No wellness trend data yet</h3>
        <p className="text-xs text-white/40 max-w-md mx-auto mt-1">
          Aggregate check-in trends will appear once enough consented data is available.
        </p>
      </TiltCard>
    );
  }

  return (
    <TiltCard
      maxTilt={1}
      className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-6 backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Campus Longitudinal Wellness Trendline</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#c3f340]/10 px-2 py-0.5 text-[10px] font-mono text-[#c3f340]">
              <Sparkles size={10} />
              Aggregate Check-ins
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/50">
            Four core self-reported dimensions aggregated across consenting student cohorts (1.0 - 5.0 scale)
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/40 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.05]">
          <span>Scale:</span>
          <span className="text-[#c3f340] font-semibold">1.0 – 5.0</span>
        </div>
      </div>

      {/* Chart container with horizontal scroll support for mobile to prevent crushing */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:overflow-x-visible">
        <div className="h-[300px] min-w-[500px] sm:min-w-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="period"
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(val) => `${val}.0`}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(value: any, name: string) => [
                  `${Number(value).toFixed(1)} / 5.0`,
                  name,
                ]}
                labelStyle={{ color: '#c3f340', fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: '12px',
                  paddingTop: '16px',
                  color: 'rgba(255,255,255,0.7)',
                }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="mood"
                name="Mood"
                stroke="#c3f340"
                strokeWidth={2.5}
                dot={{ fill: '#c3f340', r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: '#141414', strokeWidth: 2 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="stress"
                name="Stress"
                stroke="#fb7185"
                strokeWidth={2.5}
                dot={{ fill: '#fb7185', r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: '#141414', strokeWidth: 2 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="sleep"
                name="Sleep"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: '#141414', strokeWidth: 2 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="energy"
                name="Energy"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ fill: '#fbbf24', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: '#141414', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Neutral interpretation text as explicitly required */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-start gap-2.5 text-xs text-white/60">
        <Info size={15} className="text-white/40 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Aggregate check-in trends across consenting students. These trends are informational and are not medical assessments.
        </p>
      </div>
    </TiltCard>
  );
}
