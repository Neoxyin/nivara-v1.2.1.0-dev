'use client';

import React from 'react';
import { AdminCounsellor } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Users, Clock, Award, ShieldAlert } from 'lucide-react';

interface CounsellorWorkloadCardProps {
  counsellors: AdminCounsellor[];
}

export function CounsellorWorkloadCard({ counsellors }: CounsellorWorkloadCardProps) {
  const totalCapacity = counsellors.reduce((sum, c) => sum + c.capacity, 0);
  const totalActive = counsellors.reduce((sum, c) => sum + c.activeStudents, 0);
  const avgLoad = totalCapacity > 0 ? Math.round((totalActive / totalCapacity) * 100) : 0;
  const highLoadCount = counsellors.filter(c => (c.activeStudents / c.capacity) >= 0.85).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3f340]/10 text-[#c3f340]">
            <Users size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Total Staff</span>
            <p className="text-xl font-bold font-display text-white">{counsellors.length} Active</p>
          </div>
        </div>
      </TiltCard>

      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Capacity Utilization</span>
            <p className="text-xl font-bold font-display text-white">{avgLoad}%</p>
          </div>
        </div>
      </TiltCard>

      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">High Workload (&gt;85%)</span>
            <p className="text-xl font-bold font-display text-amber-400">{highLoadCount} Counsellors</p>
          </div>
        </div>
      </TiltCard>

      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3f340]/10 text-[#c3f340]">
            <Award size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Avg Rating</span>
            <p className="text-xl font-bold font-display text-[#c3f340]">4.9 / 5.0</p>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
