'use client';

import React from 'react';
import { AdminCounsellor } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import { Mail, Phone, Calendar } from 'lucide-react';

interface CounsellorTableProps {
  counsellors: AdminCounsellor[];
}

export function CounsellorTable({ counsellors }: CounsellorTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-5 py-3.5">Counsellor</th>
              <th className="px-5 py-3.5">Specialization</th>
              <th className="px-5 py-3.5">Assigned / Capacity</th>
              <th className="px-5 py-3.5">Completed Sessions</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-white/80">
            {counsellors.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-[#1c1c1c] text-[10px] font-bold text-[#c3f340] border border-[#c3f340]/30">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{c.name}</p>
                      <p className="text-[10px] text-white/40">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-white/70">{c.specialization}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#c3f340] h-full"
                        style={{ width: `${Math.min(100, (c.activeStudents / c.capacity) * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-white/90">{c.activeStudents} / {c.capacity}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono">{c.completedSessions}</td>
                <td className="px-5 py-3.5">
                  <Pill tone={c.status === 'active' ? 'accent' : c.status === 'pending' ? 'warm' : 'default'}>
                    {c.status}
                  </Pill>
                </td>
                <td className="px-5 py-3.5 font-mono text-[#c3f340]">
                  ★ {c.avgSatisfactionRating.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
