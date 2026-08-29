'use client';

import React from 'react';
import { DemandTrendPoint } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DemandTrendChartProps {
  data: DemandTrendPoint[];
}

export function DemandTrendChart({ data }: DemandTrendChartProps) {
  return (
    <div className="space-y-6">
      <TiltCard
        maxTilt={1.5}
        className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-6 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Departmental Support Demand Load</h3>
            <p className="text-xs text-white/50">Undergraduate vs Postgraduate session requests</p>
          </div>
          <span className="font-mono text-xs text-[#c3f340]">Forecast Accuracy: 94.2%</span>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="department" stroke="rgba(255,255,255,0.3)" fontSize={10} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="undergradRequests" name="Undergraduate Demand" fill="#c3f340" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gradRequests" name="Postgraduate Demand" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TiltCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((d, i) => (
          <TiltCard key={i} maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-4 backdrop-blur-xl">
            <h4 className="text-sm font-semibold text-white truncate">{d.department}</h4>
            <div className="mt-3 space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span className="text-white/40">Peak Booking Window:</span>
                <span className="font-mono text-[#c3f340]">{d.peakHour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Exam Surge Factor:</span>
                <span className="font-mono text-white">{d.examPeriodMultiplier}x</span>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
