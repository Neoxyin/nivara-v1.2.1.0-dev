'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Users,
  CalendarCheck2,
  Gauge,
  ArrowUpRight,
  Clock3,
} from 'lucide-react';
import { getCounsellors, getAppointedSessions, getActiveCounsellorName } from '@/lib/api/counsellors';
import { useQuery } from '@tanstack/react-query';
import type { Counsellor, AppointedSession } from '@/lib/types';

export default function CounsellorProfilePage() {
  const [activeCounsellor, setActiveCounsellor] = useState<string>('Aisha Rahman');

  useEffect(() => {
    setActiveCounsellor(getActiveCounsellorName());

    const handleCounsellorChange = (e: any) => {
      if (e?.detail?.name) {
        setActiveCounsellor(e.detail.name);
      }
    };
    window.addEventListener('nivara-active-counsellor-changed', handleCounsellorChange);
    return () => {
      window.removeEventListener('nivara-active-counsellor-changed', handleCounsellorChange);
    };
  }, []);

  const { data: counsellors, isLoading: isLoadingCounsellors } = useQuery<Counsellor[]>({
    queryKey: ['counsellors'],
    queryFn: getCounsellors,
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery<AppointedSession[]>({
    queryKey: ['appointedSessions'],
    queryFn: getAppointedSessions,
  });

  const isLoading = isLoadingCounsellors || isLoadingSessions;

  const counsellor: Counsellor | undefined =
    counsellors?.find((c) => c.name.toLowerCase() === activeCounsellor.toLowerCase()) || counsellors?.[0];

  const myCaseload = (sessions || []).filter(
    (s) => s.counsellorName.toLowerCase() === activeCounsellor.toLowerCase()
  );

  const completedSessions = myCaseload.filter((s) => s.status === 'completed' || s.status === 'closed');
  const totalSessions = myCaseload.length;
  const completionRate = totalSessions > 0 ? Math.round((completedSessions.length / totalSessions) * 100) : 0;

  const upcomingSessions = myCaseload
    .filter((s) => s.status === 'accepted' || s.status === 'upcoming' || s.status === 'in-progress')
    .slice(0, 4);

  const recentSessions = myCaseload
    .filter((s) => s.status === 'completed' || s.status === 'follow-up' || s.status === 'closed')
    .slice(0, 4);

  const initials =
    counsellor?.initials ||
    activeCounsellor
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c3f340]" />
      </div>
    );
  }

  return (
    <div className="rise-in space-y-8">
      <SectionHeading
        eyebrow="Your profile"
        title="Manage your counsellor profile."
        description="Your identity, caseload standing, and recent consultation activity across the counsellor portal."
      />

      <div className="grid grid-cols-1 md:grid-cols-[.75fr_1.25fr] gap-4">
        {/* Identity card */}
        <TiltCard maxTilt={4} spotlightColor="rgba(195, 243, 64, 0.15)" className="bg-[#141414]/90 p-9 text-white border border-white/[0.08] backdrop-blur-xl">
          <Magnetic>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#c3f340] font-display text-2xl text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.4)]">
              {initials}
            </div>
          </Magnetic>
          <h2 className="mt-8 font-display text-5xl leading-[.9] text-white">{counsellor?.name || activeCounsellor}</h2>
          <p className="mt-2 text-sm text-white/45">{counsellor?.role || 'Wellbeing Lead'}</p>

          {counsellor?.specializations && counsellor.specializations.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {counsellor.specializations.map((spec) => (
                <Pill key={spec} tone="accent">{spec}</Pill>
              ))}
            </div>
          )}

          <div className="mt-8 space-y-2.5 border-t border-white/[0.08] pt-6 text-xs text-white/55">
            {counsellor?.email && (
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#c3f340]/70 shrink-0" /> {counsellor.email}
              </p>
            )}
            {counsellor?.phone && (
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#c3f340]/70 shrink-0" /> {counsellor.phone}
              </p>
            )}
            {counsellor?.location && (
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-[#c3f340]/70 shrink-0" /> {counsellor.location}
              </p>
            )}
          </div>

          {counsellor?.bio && (
            <div className="mt-6 border-t border-white/[0.08] pt-6">
              <p className="serenity-label text-white/35">Specialisation focus</p>
              <p className="mt-3 text-xs leading-5 text-white/50">{counsellor.bio}</p>
            </div>
          )}
        </TiltCard>

        {/* Stats + Meetings */}
        <div className="space-y-4">
          {/* Stats section */}
          <StaggerContainer stagger={0.06} className="grid grid-cols-3 gap-3">
            <div className="stagger-item">
              <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
                <p className="serenity-label text-white/40">Sessions Held</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="font-display text-4xl text-white">{totalSessions}</p>
                  <CalendarCheck2 size={17} className="text-white/40" />
                </div>
                <p className="mt-2 text-xs text-white/45">Across your assigned caseload</p>
              </TiltCard>
            </div>

            <div className="stagger-item">
              <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
                <p className="serenity-label text-white/40">Active Caseload</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="font-display text-4xl text-[#c3f340]">{counsellor?.activeCaseload ?? '—'}</p>
                  <Users size={17} className="text-[#c3f340]" />
                </div>
                <p className="mt-2 text-xs text-white/45">Students currently assigned</p>
              </TiltCard>
            </div>

            <div className="stagger-item">
              <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
                <p className="serenity-label text-white/40">Completion Rate</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="font-display text-4xl text-[#dff77d]">{completionRate}%</p>
                  <Gauge size={17} className="text-[#dff77d]" />
                </div>
                <p className="mt-2 text-xs text-white/45">Sessions completed or closed</p>
              </TiltCard>
            </div>
          </StaggerContainer>

          {/* Meetings section */}
          <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock3 size={15} className="text-[#c3f340]" />
                <p className="serenity-label text-white/40">Upcoming appointments</p>
              </div>
              <Link
                href="/counsellor/appointments"
                className="text-[10px] font-bold uppercase tracking-[.1em] text-white/40 hover:text-[#c3f340] transition-colors inline-flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {upcomingSessions.length === 0 ? (
                <p className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-center text-xs text-white/40">
                  No upcoming appointments scheduled.
                </p>
              ) : (
                upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1c1c1c] font-display text-xs font-bold text-white border border-white/10">
                        {session.studentAvatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">{session.studentName}</p>
                        <p className="text-[10px] text-white/40">{session.sessionType}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono-ui text-[11px] font-bold text-[#c3f340]">{session.sessionTime}</span>
                      <p className="text-[9px] text-white/40 mt-0.5">{session.sessionDate}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-5">
              <p className="serenity-label text-white/40">Recent sessions</p>
            </div>

            <div className="mt-4 space-y-2.5">
              {recentSessions.length === 0 ? (
                <p className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-center text-xs text-white/40">
                  No completed sessions yet.
                </p>
              ) : (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1c1c1c] font-display text-xs font-bold text-white border border-white/10">
                        {session.studentAvatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">{session.studentName}</p>
                        <p className="text-[10px] text-white/40">{session.sessionType}</p>
                      </div>
                    </div>
                    <Pill tone="default">{session.status}</Pill>
                  </div>
                ))
              )}
            </div>
          </TiltCard>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/35">
            <ShieldCheck size={11} />
            <span>Confidential Caseload & Triage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
