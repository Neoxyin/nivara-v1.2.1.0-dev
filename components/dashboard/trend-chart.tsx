'use client';

import { ResponsiveContainer, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export type TrendPoint = { week: string; academic: number; wellbeing: number };

const chartTooltip = {
  contentStyle: { background: '#141414', border: '0', borderRadius: '8px', color: '#f0f0f0', fontSize: 11 },
  itemStyle: { color: '#dff77d' },
};

interface TrendChartProps {
  data: TrendPoint[];
  height?: number;
  showYAxis?: boolean;
  filled?: boolean;
}

export function TrendChart({ data, height = 240, showYAxis = false, filled = false }: TrendChartProps) {
  return (
    <div className="h-full w-full" style={{ minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          {filled && (
            <defs>
              <linearGradient id="academicFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8d36c" stopOpacity=".36" />
                <stop offset="100%" stopColor="#b8d36c" stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,.09)" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#88948a' }} />
          <YAxis hide={!showYAxis} domain={[40, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#88948a' }} />
          <Tooltip {...chartTooltip} />
          <Area type="monotone" dataKey="academic" stroke="#c3f340" strokeWidth={2.5} fill={filled ? 'url(#academicFill)' : 'rgba(195,243,64,.14)'} />
          <Area type="monotone" dataKey="wellbeing" stroke="#e5a27d" strokeWidth={2} fill={filled ? 'rgba(229,162,125,.10)' : 'none'} fillOpacity={filled ? 0.28 : 1} strokeDasharray={filled ? undefined : '4 4'} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
