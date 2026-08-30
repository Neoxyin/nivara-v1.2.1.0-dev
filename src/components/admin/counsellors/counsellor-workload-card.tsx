'use client';

import React from 'react';
import { AdminCounsellor } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Users, Calendar, Inbox, Clock, UserX } from 'lucide-react';

interface CounsellorWorkloadCardProps {
  counsellors: AdminCounsellor[];
}

export function CounsellorWorkloadCard({ counsellors }: CounsellorWorkloadCardProps) {
  if (!counsellors || counsellors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#141414]/60 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.04] text-white/40">
          <UserX size={22} />
        </div>
        <h4 className="mt-3 text-sm font-semibold text-white/80">No counsellors found</h4>
        <p className="mt-1 text-xs text-white/50 max-w-md mx-auto">
          No counsellors found — Add or approve counsellors to begin managing campus support capacity.
        </p>
      </div>
    );
  }

  const activeCount = counsellors.filter((c) => c.status === 'active').length;
  const pendingCount = counsellors.filter((c) => c.status === 'pending').length;
  const totalUpcoming = counsellors.reduce((sum, c) => sum + (c.workload?.upcomingSessions || 0), 0);
  const totalPending = counsellors.reduce((sum, c) => sum + (c.workload?.pendingRequests || 0), 0);
  const totalFollowUps = counsellors.reduce((sum, c) => sum + (c.workload?.openFollowUps || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3f340]/10 text-[#c3f340]">
            <Users size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Counsellor Staff</span>
            <p className="text-xl font-bold font-display text-white">
              {activeCount} <span className="text-xs font-normal text-white/50 font-sans">Active ({counsellors.length} Total)</span>
            </p>
            {pendingCount > 0 && (
              <span className="text-[10px] text-amber-400 font-medium">{pendingCount} pending approval</span>
            )}
          </div>
        </div>
      </TiltCard>

      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Upcoming Sessions</span>
            <p className="text-xl font-bold font-display text-white">{totalUpcoming}</p>
            <span className="text-[10px] text-white/40">Scheduled aggregate caseload</span>
          </div>
        </div>
      </TiltCard>

      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
            <Inbox size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Pending Requests</span>
            <p className="text-xl font-bold font-display text-amber-400">{totalPending}</p>
            <span className="text-[10px] text-white/40">Awaiting practitioner intake</span>
          </div>
        </div>
      </TiltCard>

      <TiltCard maxTilt={2} className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Open Follow-ups</span>
            <p className="text-xl font-bold font-display text-purple-300">{totalFollowUps}</p>
            <span className="text-[10px] text-white/40">Post-session continuity tasks</span>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
