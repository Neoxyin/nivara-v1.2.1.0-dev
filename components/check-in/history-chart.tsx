'use client';

import { ResponsiveContainer, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { CheckIn } from '@/lib/types';

const chartTooltip = {
  contentStyle: { background: '#141414', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', color: '#f0f0f0', fontSize: 11 },
  itemStyle: { fontSize: 11 },
};

interface HistoryChartProps {
  data: CheckIn[];
  height?: number;
}

export function HistoryChart({ data, height = 280 }: HistoryChartProps) {
  // Data is newest-first in the mock array, we need oldest-first for the chart
  const chartData = [...data].reverse();

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,.05)" />
          <XAxis 
            dataKey="date" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 10, fill: '#88948a' }} 
            dy={10}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 10, fill: '#88948a' }} 
          />
          <Tooltip {...chartTooltip} />
          <Legend 
            wrapperStyle={{ fontSize: 10, paddingTop: '20px' }} 
            iconType="circle"
            iconSize={6}
          />
          <Line type="monotone" dataKey="mood" name="Mood" stroke="#c3f340" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="energy" name="Energy" stroke="#e5a27d" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#a3b8cc" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="stress" name="Stress" stroke="#eb5e5e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="workload" name="Academic Pressure" stroke="#b080e6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
