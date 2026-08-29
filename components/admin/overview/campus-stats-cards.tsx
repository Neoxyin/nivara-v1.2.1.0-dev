'use client';

import React from 'react';
import { CampusStats } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Users, Users2, FolderHeart, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface CampusStatsCardsProps {
  stats: CampusStats;
}

export function CampusStatsCards({ stats }: CampusStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Total Students */}
      <TiltCard
        maxTilt={2}
        className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50 block">
              Total Students
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-white tracking-tight">
                {stats.totalStudents.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3f340]/10 text-[#c3f340]">
            <Users size={20} />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <p className="text-white/60 leading-tight">
            Consenting enrolled students across campus
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-medium shrink-0 ml-2">
            <TrendingUp size={12} />
            +3.2%
          </span>
        </div>
      </TiltCard>

      {/* 2. Active Counsellors */}
      <TiltCard
        maxTilt={2}
        className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50 block">
              Active Counsellors
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-white tracking-tight">
                {stats.activeCounsellors}
              </span>
              <span className="text-xs font-mono text-white/40">practitioners on duty</span>
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3f340]/10 text-[#c3f340]">
            <Users2 size={20} />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <p className="text-white/60 leading-tight">
            Mental health & rhythm support practitioners
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#c3f340] font-medium shrink-0 ml-2">
            <CheckCircle2 size={12} />
            Full Roster
          </span>
        </div>
      </TiltCard>

      {/* 3. Open Cases */}
      <TiltCard
        maxTilt={2}
        className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50 block">
              Open Cases
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-white tracking-tight">
                {stats.openCases}
              </span>
              <span className="text-xs font-mono text-white/40">active care plans</span>
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3f340]/10 text-[#c3f340]">
            <FolderHeart size={20} />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <p className="text-white/60 leading-tight">
            Guided support plans & monitoring cohorts
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-sky-400 font-medium shrink-0 ml-2">
            <Sparkles size={12} />
            Structured
          </span>
        </div>
      </TiltCard>
    </div>
  );
}
