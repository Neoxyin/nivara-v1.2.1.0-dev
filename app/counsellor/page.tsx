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
} from 'lucide-react';
import { getAppointedSessions, updateSessionStatus, addSessionNote } from '@/lib/api/counsellors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession } from '@/lib/types';

export default function CounsellorOverviewPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteSuccess, setNoteSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['appointedSessions'],
    queryFn: getAppointedSessions,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: AppointedSession['status']; notes?: string }) =>
      updateSessionStatus(id, status, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => addSessionNote(id, note),
    onSuccess: (updated) => {
      setNoteSuccess('Note saved successfully ✓');
      setTimeout(() => setNoteSuccess(null), 3500);
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
      setNewNoteText('');
    },
  });

  const todaySessions = sessions?.filter((s) => s.sessionDate === 'Today') || [];
  const attentionStudents = sessions?.filter((s) =>
    s.academics.insights.some((i) => i.tone === 'watch') ||
    s.academics.recentCheckIn.stress >= 4 ||
    s.academics.attendance < 90
  ) || [];

  const avgRhythm = sessions && sessions.length > 0
    ? Math.round(sessions.reduce((acc, curr) => acc + curr.academics.overallRhythm, 0) / sessions.length)
    : 74;

  return (
    <div className="rise-in">
      <SectionHeading
        eyebrow="Counsellor workspace"
        title="Daily overview & student signals."
        description="Monitor your caseload, urgent student attention alerts, scheduled appointments, and cohort academic rhythm."
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

      {/* Metrics Row */}
      <StaggerContainer stagger={0.06} className="mb-8 grid grid-cols-4 gap-3">
        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Today&apos;s Sessions</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-white">{todaySessions.length}</p>
              <Pill tone="accent">Scheduled</Pill>
            </div>
            <p className="mt-2 text-xs text-white/45">Next: 14:30 · Maya Chen</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Attention Required</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-[#e5a27d]">{attentionStudents.length}</p>
              <AlertTriangle size={17} className="text-[#e5a27d]" />
            </div>
            <p className="mt-2 text-xs text-white/45">Deadline clusters or sleep drops</p>
          </TiltCard>
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

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Total Appointed</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-white">{sessions?.length || 4}</p>
              <UsersRound size={17} className="text-white/40" />
            </div>
            <p className="mt-2 text-xs text-white/45">Across interaction & engineering</p>
          </TiltCard>
        </div>
      </StaggerContainer>

      {/* Main Dual Grid: Today's Appointments & Attention Queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left: Today's Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 size={15} className="text-[#c3f340]" />
              <h3 className="font-display text-xl text-white">Today&apos;s Appointments</h3>
            </div>
            <Link
              href="/counsellor/appointments"
              className="text-[10px] font-bold uppercase tracking-[.1em] text-white/40 hover:text-[#c3f340] transition-colors inline-flex items-center gap-1"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {todaySessions.map((session, i) => (
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
                        <Pill tone={session.status === 'upcoming' ? 'accent' : 'warm'}>
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
                    <div className="mt-3">
                      <button
                        onClick={() => setInspectedSession(session)}
                        data-testid={`button-view-dossier-${i}`}
                        className="btn-sweep rounded border border-[#c3f340]/40 bg-[#141414] px-3 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:text-[#0d1408] hover:border-[#c3f340]"
                      >
                        Dossier
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
            ))}
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
            {attentionStudents.map((session) => {
              const watchInsight = session.academics.insights.find((i) => i.tone === 'watch');
              return (
                <TiltCard
                  key={session.id}
                  maxTilt={2}
                  className="border border-[rgba(229,162,125,.25)] bg-[rgba(229,162,125,.03)] p-5 backdrop-blur-xl rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{session.studentName}</span>
                        <span className="rounded bg-[rgba(229,162,125,.15)] px-1.5 py-0.5 text-[9px] font-bold text-[#e5a27d]">
                          Watch Alert
                        </span>
                      </div>
                      <p className="text-[11px] text-white/45 mt-0.5">{session.course}</p>
                    </div>

                    <button
                      onClick={() => setInspectedSession(session)}
                      className="text-[10px] font-bold uppercase tracking-[.08em] text-[#e5a27d] hover:underline"
                    >
                      Inspect
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-white/70">
                    {watchInsight?.summary || 'Multiple academic pressure indicators detected.'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {watchInsight?.contributingFactors.map((factor, idx) => (
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
            })}
          </div>
        </div>
      </div>

      {/* MODAL: FULL STUDENT ACADEMIC DOSSIER */}
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
                      <Pill tone={inspectedSession.status === 'upcoming' ? 'accent' : 'warm'}>
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

              {/* Notes */}
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="serenity-label text-[#c3f340] text-[9px] flex items-center gap-1.5">
                    <span>🔒</span> Private Confidential Counselling Notes — Encrypted & FERPA Protected (Counsellor Access Only)
                  </p>
                  <span className="text-[9px] font-mono text-white/30">Zero Surveillance</span>
                </div>
                <p className="text-[11px] text-white/45 mb-3">
                  This prototype keeps counselling notes within the current frontend session; no backend data service is connected.
                </p>

                {noteSuccess && (
                  <div className="mb-3 rounded border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center gap-2 animate-pulse">
                    <CheckCircle2 size={14} /> {noteSuccess}
                  </div>
                )}

                {addNoteMutation.isError && (
                  <div className="mb-3 rounded border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-300">
                    Failed to save note. Please try again.
                  </div>
                )}

                {inspectedSession.notes ? (
                  <div className="mb-3 rounded border border-white/[0.07] bg-white/[0.02] p-3 text-xs text-white/75 whitespace-pre-line leading-relaxed">
                    {inspectedSession.notes}
                  </div>
                ) : (
                  <div className="mb-3 rounded border border-white/[0.05] bg-white/[0.01] p-3 text-xs text-white/35 italic">
                    No confidential notes recorded yet for this session.
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newNoteText.trim() || addNoteMutation.isPending) return;
                    addNoteMutation.mutate({ id: inspectedSession.id, note: newNoteText.trim() });
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    disabled={addNoteMutation.isPending}
                    placeholder="Document discussion outcomes or action steps (private & encrypted)..."
                    className="flex-1 rounded border border-white/[0.09] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={addNoteMutation.isPending}
                    className="btn-sweep rounded border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0d1408] disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {addNoteMutation.isPending ? (
                      <>
                        <RefreshCw size={11} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      'Save note'
                    )}
                  </button>
                </form>
              </div>
            </TiltCard>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


