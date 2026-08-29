'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Building2,
  Home,
  Sparkles,
  LockKeyhole,
} from 'lucide-react';
import { setUserRole } from '@/lib/auth';
import { Pill } from '@/components/shared/pill';

export default function UnauthorizedPage() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = window.localStorage.getItem('nivara_user_role');
      setCurrentRole(role);
    }
  }, []);

  const handleSwitchWorkspace = (targetRole: 'admin' | 'counsellor' | 'student') => {
    setUserRole(targetRole);
    if (targetRole === 'admin') {
      router.push('/admin');
    } else if (targetRole === 'counsellor') {
      router.push('/counsellor');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white p-4 sm:p-6">
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_30px_rgba(195,243,64,0.06)] backdrop-blur-2xl">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#c3f340]/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-rose-500/[0.1] blur-3xl" />

        {/* Icon */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <ShieldAlert className="h-9 w-9 text-amber-400" />
        </div>

        <Pill tone="accent" className="mb-2">
          <LockKeyhole size={11} className="mr-1 inline text-[#c3f340]" /> Role Permission Boundary
        </Pill>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 font-display">
          Workspace Access Restricted
        </h1>

        <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed max-w-md">
          {currentRole ? (
            <>
              You are currently authenticated as <span className="font-semibold text-[#c3f340] uppercase tracking-wider text-[11px] px-1.5 py-0.5 rounded bg-[#c3f340]/10 border border-[#c3f340]/20">{currentRole}</span>. This specific section requires different role credentials.
            </>
          ) : (
            'You are not currently authenticated or do not have permission to view this specific section.'
          )}
        </p>

        {/* 1-Click Quick Workspace Switchers */}
        <div className="w-full space-y-2.5 mb-6 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-white/45 mb-2 text-center">
            Switch to a permitted workspace:
          </p>

          <button
            type="button"
            onClick={() => handleSwitchWorkspace('admin')}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#c3f340] hover:bg-[#c3f340]/[0.06] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#40b0f3]/40 bg-[#40b0f3]/10 text-[#7dd3f7]">
                <Building2 size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-[#c3f340] transition-colors">
                  Administrator Portal
                </p>
                <p className="text-[10px] text-white/45">Campus overview, trends & system health (/admin)</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-white/30 group-hover:text-[#c3f340] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => handleSwitchWorkspace('counsellor')}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#c3f340] hover:bg-[#c3f340]/[0.06] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#9b7cc7]/40 bg-[#9b7cc7]/10 text-[#c9b8df]">
                <HeartHandshake size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-[#c3f340] transition-colors">
                  Counsellor Space
                </p>
                <p className="text-[10px] text-white/45">Caseload triage & student notes (/counsellor)</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-white/30 group-hover:text-[#c3f340] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => handleSwitchWorkspace('student')}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#c3f340] hover:bg-[#c3f340]/[0.06] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#c3f340]/40 bg-[#c3f340]/10 text-[#c3f340]">
                <GraduationCap size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-[#c3f340] transition-colors">
                  Student Space
                </p>
                <p className="text-[10px] text-white/45">Private dashboard & check-ins (/dashboard)</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-white/30 group-hover:text-[#c3f340] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Return to homepage */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
        >
          <Home size={13} />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
