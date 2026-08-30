'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import {
  Clock3,
  Calendar,
  AlertTriangle,
  UsersRound,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X,
  GraduationCap,
  Check,
  Lock,
  Inbox,
  Play,
} from 'lucide-react';
import { getAppointedSessions, updateSessionStatus, getActiveCounsellorName, getSupportAlerts, getFollowUps } from '@/lib/api/counsellors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession, SupportAlert, CounsellorFollowUp } from '@/lib/types';
import { SessionNotesEditor } from '@/components/counsellor/session-notes-editor';

export default function CounsellorOverviewPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [activeCounsellor, setActiveCounsellor] = useState<string>('Aisha Rahman');
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
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

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['appointedSessions'],
    queryFn: getAppointedSessions,
  });

  const { data: alerts = [] } = useQuery<SupportAlert[]>({
    queryKey: ['supportAlerts', activeCounsellor],
    queryFn: () => getSupportAlerts(activeCounsellor),
  });

  const { data: followUps = [] } = useQuery<CounsellorFollowUp[]>({
    queryKey: ['counsellorFollowUps', activeCounsellor],
    queryFn: () => getFollowUps(activeCounsellor),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: AppointedSession['status']; notes?: string }) =>
      updateSessionStatus(id, status, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (updated.status === 'accepted') {
        setActionSuccess(`Accepted appointment for ${updated.studentName} ✓`);
        setTimeout(() => setActionSuccess(null), 3500);
      }
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
    },
  });

  // Feature 1: Today's Accepted / Confirmed Sessions
  const todaySessions = sessions?.filter(
    (s) => s.sessionDate === 'Today' && s.status !== 'requested' && s.status !== 'pending'
  ) || [];

  // Feature 2: Pending Incoming Appointment Requests
  const pendingRequests = sessions?.filter(
    (s) => s.status === 'requested' || s.status === 'pending'
  ) || [];

  const attentionCount = alerts.length;

  const avgRhythm = sessions && sessions.length > 0
    ? Math.round(sessions.reduce((acc, curr) => acc + curr.academics.overallRhythm, 0) / sessions.length)
    : 74;

  const isPending = (status: AppointedSession['status']) =>
    status === 'requested' || status === 'pending';

  return (
    <div className="rise-in">
      <SectionHeading
        eyebrow="Counsellor workspace"
        title="Caseload triage and appointment overview"
        description="Monitor confirmed consultations, incoming appointment requests, and early support alerts across your assigned student caseload."
        action={
          <div className="flex items-center gap-2">
            <Pill tone="accent">
              <ShieldCheck size={12} className="mr-1 inline" /> Duty Status: On Shift
            </Pill>
            <Link
              href="/counsellor/appointments"
              className="btn-sweep rounded border border-white/[0.12] bg-[#141414] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white/70 hover:border-[#c3f340]/40 hover:text-[#c3f340] transition-colors"
            >
              Full Calendar
            </Link>
          </div>
        }
      />

      {actionSuccess && (
        <div className="mb-6 rounded-lg border border-[#c3f340]/40 bg-[#c3f340]/10 p-3 text-xs text-[#dff77d] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#c3f340]" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-white/40 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <StaggerContainer stagger={0.06} className="mb-8 grid grid-cols-4 gap-3">
        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Today&apos;s Sessions</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-white">{todaySessions.length}</p>
              <Pill tone="accent">Confirmed</Pill>
            </div>
            <p className="mt-2 text-xs text-white/45">
              {todaySessions.length > 0
                ? `Next: ${todaySessions[0].sessionTime.split('·')[1]?.trim() || todaySessions[0].sessionTime} · ${todaySessions[0].studentName}`
                : 'No more sessions scheduled today'}
            </p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Pending Requests</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-[#c3f340]">{pendingRequests.length}</p>
              <Pill tone={pendingRequests.length > 0 ? 'accent' : 'default'}>
                {pendingRequests.length > 0 ? 'Action Needed' : 'Clear'}
              </Pill>
            </div>
            <p className="mt-2 text-xs text-white/45">Incoming student appointment bookings</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <Link href="/counsellor/attention" className="block">
            <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl hover:border-[#e5a27d]/40 transition-colors">
              <p className="serenity-label text-white/40">Attention Required</p>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="font-display text-4xl text-[#e5a27d]">{attentionCount}</p>
                <AlertTriangle size={17} className="text-[#e5a27d]" />
              </div>
              <p className="mt-2 text-xs text-white/45">Support watch alerts for your caseload</p>
            </TiltCard>
          </Link>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Caseload Rhythm</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-[#c3f340]">{avgRhythm}%</p>
              <TrendingUp size={17} className="text-[#c3f340]" />
            </div>
            <p className="mt-2 text-xs text-white/45">Average academic baseline</p>
          </TiltCard>
        </div>
      </StaggerContainer>

      {/* FEATURE 2: PENDING APPOINTMENT REQUESTS QUEUE */}
      {pendingRequests.length > 0 && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-[#c3f340]" />
              <h3 className="font-display text-xl text-white">
                Pending Appointment Requests
              </h3>
              <span className="rounded-full bg-[#c3f340]/20 px-2 py-0.5 text-[10px] font-bold text-[#c3f340]">
                {pendingRequests.length} to review
              </span>
            </div>
            <p className="text-[11px] text-white/45 hidden sm:block">
              Limited visibility enforced — full records unlock after acceptance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingRequests.map((request) => (
              <TiltCard
                key={request.id}
                maxTilt={2}
                className="border border-[#c3f340]/30 bg-[#151a10]/80 p-5 backdrop-blur-xl rounded-xl relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1c1c1c] font-display text-sm font-bold text-white border border-white/10">
                      {request.studentAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm">{request.studentName}</h4>
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300 uppercase tracking-wider">
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/45 mt-0.5">
                        Year {request.year} · {request.course}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono-ui text-xs font-bold text-[#c3f340]">
                      {request.sessionTime}
                    </span>
                    <p className="text-[9px] text-white/40 mt-0.5">{request.sessionType}</p>
                  </div>
                </div>

                {/* Stated Topic */}
                <div className="mt-3 rounded-lg border border-white/[0.06] bg-black/30 p-2.5">
                  <p className="text-[10px] text-white/40 uppercase font-mono-ui font-semibold">Student Stated Focus:</p>
                  <p className="mt-1 text-xs text-white/80 leading-relaxed">
                    {request.reason}
                  </p>
                </div>

                {/* Limited Visibility Privacy Notice & Actions */}
                <div className="mt-3.5 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <Lock size={11} className="text-[#c3f340]" />
                    <span>Confidential dossier locked until accepted</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectedSession(request)}
                      className="rounded border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'accepted' })}
                      disabled={updateStatusMutation.isPending}
                      className="btn-sweep inline-flex items-center gap-1 rounded border border-[#c3f340] bg-[#c3f340] px-3 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.3)] hover:scale-102 transition-all disabled:opacity-50"
                    >
                      <Check size={11} /> Accept Request
                    </button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      )}

      {/* Main Dual Grid: Feature 1 (Today's Appointments) & Attention Queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left: FEATURE 1 — Today's Accepted Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 size={15} className="text-[#c3f340]" />
              <h3 className="font-display text-xl text-white">Today&apos;s Sessions</h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                {todaySessions.length} confirmed
              </span>
            </div>
            <Link
              href="/counsellor/appointments"
              className="text-[10px] font-bold uppercase tracking-[.1em] text-white/40 hover:text-[#c3f340] transition-colors inline-flex items-center gap-1"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {todaySessions.length === 0 ? (
              <div className="rounded-xl border border-white/[0.08] bg-[#141414]/90 p-8 text-center backdrop-blur-xl">
                <Calendar size={24} className="mx-auto text-white/30 mb-2" />
                <p className="text-sm font-semibold text-white">No confirmed sessions scheduled for today</p>
                <p className="mt-1 text-xs text-white/40">
                  {pendingRequests.length > 0
                    ? `You have ${pendingRequests.length} pending request(s) above awaiting your review and acceptance.`
                    : 'All consultations for today have been completed or scheduled for upcoming dates.'}
                </p>
              </div>
            ) : (
              todaySessions.map((session, i) => (
                <TiltCard
                  key={session.id}
                  maxTilt={2}
                  className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-5 backdrop-blur-xl rounded-xl transition-all hover:border-[#c3f340]/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3.5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1c1c1c] font-display text-sm font-bold text-white border border-white/10">
                        {session.studentAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{session.studentName}</h4>
                          <Pill
                            tone={
                              session.status === 'accepted' || session.status === 'upcoming'
                                ? 'accent'
                                : session.status === 'in-progress'
                                ? 'warm'
                                : 'default'
                            }
                          >
                            {session.status}
                          </Pill>
                        </div>
                        <p className="text-xs text-white/45 mt-0.5">
                          Year {session.year} · {session.course}
                        </p>
                        <p className="mt-2 text-xs text-white/70 line-clamp-2">
                          {session.reason}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <span className="font-mono-ui text-xs font-bold text-[#c3f340]">
                        {session.sessionTime.split('·')[1]?.trim() || session.sessionTime}
                      </span>
                      <div className="mt-3 flex items-center justify-end gap-1.5">
                        {session.status === 'accepted' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'in-progress' })}
                            className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-amber-300 hover:bg-amber-500 hover:text-[#0d1408]"
                          >
                            <Play size={10} className="inline mr-1" /> Start
                          </button>
                        )}
                        <button
                          onClick={() => setInspectedSession(session)}
                          data-testid={`button-view-dossier-${i}`}
                          className="btn-sweep rounded border border-[#c3f340]/40 bg-[#141414] px-3 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:text-[#0d1408] hover:border-[#c3f340]"
                        >
                          Dossier & Notes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Academic Highlights row */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-3">
                      <span>Rhythm: <strong className="text-white">{session.academics.overallRhythm}%</strong></span>
                      <span>Attendance: <strong className="text-white">{session.academics.attendance}%</strong></span>
                      <span>Stress: <strong className="text-[#e5a27d]">{session.academics.recentCheckIn.stress}/5</strong></span>
                    </div>
                    <span className="text-[10px] text-white/35">1-on-1 Confidential</span>
                  </div>
                </TiltCard>
              ))
            )}
          </div>
        </div>

        {/* Right: Urgent Signals & Attention Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-[#e5a27d]" />
              <h3 className="font-display text-xl text-white">Attention Queue</h3>
            </div>
            <Link
              href="/counsellor/attention"
              className="text-[10px] font-bold uppercase tracking-[.1em] text-white/40 hover:text-[#e5a27d] transition-colors inline-flex items-center gap-1"
            >
              Full queue <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="rounded-xl border border-white/[0.08] bg-[#141414] p-6 text-center text-xs text-white/40">
                No active watch alerts for your assigned students.
              </div>
            ) : (
              alerts.slice(0, 3).map((alert) => {
                const matchedSession = sessions?.find((s) => s.id === alert.sessionId);
                return (
                  <TiltCard
                    key={alert.id}
                    maxTilt={2}
                    className="border border-[rgba(229,162,125,.25)] bg-[rgba(229,162,125,.03)] p-5 backdrop-blur-xl rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{alert.studentName}</span>
                          <span className="rounded bg-[rgba(229,162,125,.15)] px-1.5 py-0.5 text-[9px] font-bold text-[#e5a27d]">
                            {alert.dimension} Alert
                          </span>
                        </div>
                        <p className="text-[11px] text-white/45 mt-0.5">{alert.course}</p>
                      </div>

                      {matchedSession && (
                        <button
                          onClick={() => setInspectedSession(matchedSession)}
                          className="text-[10px] font-bold uppercase tracking-[.08em] text-[#e5a27d] hover:underline"
                        >
                          Inspect
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-white/70">
                      {alert.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {alert.contributingFactors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-black/40 px-2 py-0.5 text-[10px] text-white/60 border border-white/[0.06]"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </TiltCard>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL: FULL STUDENT ACADEMIC DOSSIER OR LIMITED PREVIEW (IF PENDING) */}
      {mounted && inspectedSession && createPortal(
        <div
          onClick={() => setInspectedSession(null)}
          data-testid="modal-backdrop-overview-dossier"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto"
          >
            <TiltCard maxTilt={1.5} className="border border-white/[0.14] bg-[#111]/95 p-8 shadow-[0_30px_100px_rgba(0,0,0,.95)] backdrop-blur-2xl rounded-2xl">
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#c3f340] font-display text-2xl font-bold text-[#0d1408]">
                    {inspectedSession.studentAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-display text-3xl text-white">{inspectedSession.studentName}</h2>
                      <Pill tone={isPending(inspectedSession.status) ? 'warm' : 'accent'}>
                        {inspectedSession.status}
                      </Pill>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Year {inspectedSession.year} · {inspectedSession.course} · {inspectedSession.studentEmail}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectedSession(null)}
                  className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.07] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Limited Visibility Notice for Pending Requests */}
              {isPending(inspectedSession.status) ? (
                <div className="mt-6 space-y-6">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                      <Lock size={14} />
                      <span>Limited Pre-Acceptance View</span>
                    </div>
                    <p className="mt-1 text-xs text-white/70 leading-relaxed">
                      Detailed academic signals, module grades, and confidential session notes are protected by student consent and privacy policy until this appointment request is officially accepted.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-[#161616] p-5">
                    <p className="serenity-label text-[9px] text-[#c3f340] mb-2 font-mono-ui uppercase">
                      Appointment Request Details
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-white/80">
                      <div>
                        <span className="text-white/40 block text-[10px]">Requested Slot</span>
                        <strong className="text-white">{inspectedSession.sessionTime} ({inspectedSession.sessionDate})</strong>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Session Format</span>
                        <strong className="text-white">{inspectedSession.sessionType}</strong>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                      <span className="text-white/40 block text-[10px]">Student Stated Reason / Focus</span>
                      <p className="mt-1 text-xs text-white/90 leading-relaxed">{inspectedSession.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setInspectedSession(null)}
                      className="rounded border border-white/15 px-4 py-2 text-xs font-bold text-white/60 hover:text-white"
                    >
                      Close Review
                    </button>
                    <button
                      onClick={() => {
                        updateStatusMutation.mutate({ id: inspectedSession.id, status: 'accepted' });
                      }}
                      className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340] bg-[#c3f340] px-5 py-2.5 text-xs font-bold uppercase tracking-[.08em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.3)] hover:scale-102 transition-all"
                    >
                      <Check size={13} /> Accept Appointment Request
                    </button>
                  </div>
                </div>
              ) : (
                /* Full Dossier & Notes for Accepted / Active Sessions */
                <div>
                  {/* Metrics Grid */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                      <p className="serenity-label text-white/40 text-[9px]">Academic Rhythm</p>
                      <p className="mt-2 font-display text-3xl text-white">{inspectedSession.academics.overallRhythm}%</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                      <p className="serenity-label text-white/40 text-[9px]">Attendance Rate</p>
                      <p className="mt-2 font-display text-3xl text-[#c3f340]">{inspectedSession.academics.attendance}%</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                      <p className="serenity-label text-white/40 text-[9px]">Well-Being Score</p>
                      <p className="mt-2 font-display text-3xl text-[#dff77d]">{inspectedSession.academics.wellbeingScore}/100</p>
                    </div>
                  </div>

                  {/* Subject Breakdown */}
                  <div className="mt-6">
                    <p className="serenity-label text-white/40 text-[9px] mb-3">Module Marks & Trends</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {inspectedSession.academics.activeSubjects.map((subj) => (
                        <div
                          key={subj.subject}
                          className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-semibold text-white">{subj.subject}</p>
                            <p className="text-[10px] text-white/40 mt-0.5">
                              Att: {subj.attendance}% · Workload: {subj.workload}%
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-display text-lg text-white">{subj.score}%</span>
                            <div className="flex items-center justify-end gap-1 text-[10px]">
                              {subj.trend === 'up' && <span className="text-[#c3f340] flex items-center"><TrendingUp size={11} className="mr-0.5" /> Up</span>}
                              {subj.trend === 'down' && <span className="text-[#e5a27d] flex items-center"><TrendingDown size={11} className="mr-0.5" /> Down</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Private Consultation Record & Session Notes */}
                  <div className="mt-6">
                    <SessionNotesEditor
                      session={inspectedSession}
                      activeCounsellorName={activeCounsellor}
                      onSessionUpdated={(updated) => {
                        setInspectedSession(updated);
                        queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
                      }}
                    />
                  </div>
                </div>
              )}
            </TiltCard>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


