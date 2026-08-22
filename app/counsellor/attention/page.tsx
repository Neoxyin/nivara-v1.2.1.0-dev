'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import {
  AlertTriangle,
  Clock3,
  Calendar,
  Sparkles,
  TrendingDown,
  FileText,
  CheckCircle2,
  X,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { getAppointedSessions, updateSessionStatus, addSessionNote } from '@/lib/api/counsellors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession } from '@/lib/types';

export default function CounsellorAttentionPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [newNoteText, setNewNoteText] = useState('');

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
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
      setNewNoteText('');
    },
  });

  const attentionList = sessions?.filter((s) =>
    s.academics.insights.some((i) => i.tone === 'watch') ||
    s.academics.recentCheckIn.stress >= 4 ||
    s.academics.recentCheckIn.sleep <= 2 ||
    s.academics.attendance < 90
  ) || [];

  const toggleReviewed = (id: string) => {
    setReviewedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="rise-in">
      <SectionHeading
        eyebrow="Triage & early intervention"
        title="Students requiring attention."
        description="Students flagged through explainable pattern shifts — deadline concentration, sharp attendance declines, or sustained low sleep check-ins."
        action={
          <div className="flex items-center gap-2">
            <Pill tone="warm">
              <AlertTriangle size={12} className="mr-1 inline" /> {attentionList.length} Active Triggers
            </Pill>
          </div>
        }
      />

      {/* Overview Cards */}
      <StaggerContainer stagger={0.06} className="mb-8 grid grid-cols-3 gap-3">
        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-[rgba(229,162,125,.3)] bg-[rgba(229,162,125,.04)] p-5 backdrop-blur-xl">
            <p className="serenity-label text-[#e5a27d]">Critical Signals</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-white">{attentionList.length}</p>
              <AlertTriangle size={17} className="text-[#e5a27d]" />
            </div>
            <p className="mt-2 text-xs text-white/45">Multi-signal watch triggers</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Reviewed This Shift</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-[#c3f340]">{reviewedIds.length}</p>
              <CheckCircle2 size={17} className="text-[#c3f340]" />
            </div>
            <p className="mt-2 text-xs text-white/45">Triage status updated</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Follow-up Sessions</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-white">2</p>
              <Clock3 size={17} className="text-white/40" />
            </div>
            <p className="mt-2 text-xs text-white/45">Already booked for today</p>
          </TiltCard>
        </div>
      </StaggerContainer>

      {/* Attention Cards List */}
      <div className="space-y-4">
        {attentionList.map((session, index) => {
          const isReviewed = reviewedIds.includes(session.id);
          const watchInsight = session.academics.insights.find((i) => i.tone === 'watch');

          return (
            <TiltCard
              key={session.id}
              maxTilt={1.5}
              className={`border p-6 backdrop-blur-xl rounded-xl transition-all ${
                isReviewed
                  ? 'border-white/[0.08] bg-[#111]/70 opacity-60'
                  : 'border-[rgba(229,162,125,.3)] bg-[rgba(229,162,125,.03)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Student Info */}
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1e1e1e] font-display text-lg font-bold text-white border border-white/10">
                    {session.studentAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-2xl text-white">{session.studentName}</h3>
                      <Pill tone="warm">Watch Signal</Pill>
                      {isReviewed && <Pill tone="accent">Reviewed</Pill>}
                    </div>
                    <p className="text-xs text-white/45 mt-0.5">
                      Year {session.year} · {session.course} · Session: {session.sessionTime}
                    </p>
                  </div>
                </div>

                {/* Quick triage actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReviewed(session.id)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] rounded border transition-colors ${
                      isReviewed
                        ? 'border-white/20 text-white/40 hover:text-white'
                        : 'border-[#c3f340]/40 bg-[#c3f340]/10 text-[#dff77d] hover:bg-[#c3f340] hover:text-[#0d1408]'
                    }`}
                  >
                    {isReviewed ? 'Mark Unreviewed' : 'Mark Reviewed'}
                  </button>

                  <Magnetic>
                    <button
                      onClick={() => setInspectedSession(session)}
                      className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340] bg-[#c3f340] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-[#0d1408]"
                    >
                      <FileText size={12} /> Full Dossier
                    </button>
                  </Magnetic>
                </div>
              </div>

              {/* Signal details */}
              <div className="mt-5 rounded-lg border border-white/[0.08] bg-[#141414] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#e5a27d]" />
                    <span className="font-semibold text-white text-xs">{watchInsight?.title || 'Academic rhythm stress'}</span>
                  </div>
                  <span className="serenity-label text-[8px] text-white/35">{watchInsight?.certainty}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-white/70">
                  {watchInsight?.summary}
                </p>

                {/* Factors */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {watchInsight?.contributingFactors.map((f, fi) => (
                    <span
                      key={fi}
                      className="rounded bg-black/50 px-2 py-0.5 text-[10px] text-white/60 border border-white/[0.06]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics summary */}
              <div className="mt-4 grid grid-cols-4 gap-2 pt-3 border-t border-white/[0.06] text-xs text-white/50">
                <div>Rhythm: <strong className="text-white">{session.academics.overallRhythm}%</strong></div>
                <div>Attendance: <strong className="text-white">{session.academics.attendance}%</strong></div>
                <div>Stress: <strong className="text-[#e5a27d]">{session.academics.recentCheckIn.stress}/5</strong></div>
                <div>Sleep: <strong className="text-[#e5a27d]">{session.academics.recentCheckIn.sleep}/5</strong></div>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* FULL STUDENT DOSSIER MODAL */}
      {mounted && inspectedSession && createPortal(
        <div
          onClick={() => setInspectedSession(null)}
          data-testid="modal-backdrop-attention-dossier"
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
                      <Pill tone="warm">Attention Case</Pill>
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

              {/* Module Marks */}
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
                          {subj.trend === 'up' && <span className="text-[#c3f340]">▲ Up</span>}
                          {subj.trend === 'down' && <span className="text-[#e5a27d]">▼ Down</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <p className="serenity-label text-[#c3f340] text-[9px] mb-3">Confidential Session Notes</p>
                {inspectedSession.notes && (
                  <div className="mb-3 rounded border border-white/[0.07] bg-white/[0.02] p-3 text-xs text-white/70 whitespace-pre-line leading-relaxed">
                    {inspectedSession.notes}
                  </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newNoteText.trim()) return;
                    addNoteMutation.mutate({ id: inspectedSession.id, note: newNoteText.trim() });
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add follow-up notes or action plan..."
                    className="flex-1 rounded border border-white/[0.09] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#c3f340]/50"
                  />
                  <button
                    type="submit"
                    className="btn-sweep rounded border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0d1408]"
                  >
                    Add note
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


