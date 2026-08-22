'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import {
  Calendar,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  X,
  Search,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Check,
} from 'lucide-react';
import { getAppointedSessions, updateSessionStatus, addSessionNote, updateSessionNotes } from '@/lib/api/counsellors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession } from '@/lib/types';

export default function CounsellorAppointmentsPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'Today' | 'Tomorrow' | 'Past'>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'requested' | 'pending' | 'accepted' | 'completed' | 'follow-up' | 'closed'
  >('all');
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [noteSuccess, setNoteSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: sessions, isLoading, isError, refetch } = useQuery({
    queryKey: ['appointedSessions'],
    queryFn: getAppointedSessions,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: AppointedSession['status']; notes?: string }) =>
      updateSessionStatus(id, status, notes),
    onSuccess: (updated) => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
    },
    onError: (err: any) => {
      setActionError(err?.message || 'Failed to update session status.');
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => addSessionNote(id, note),
    onSuccess: (updated) => {
      setActionError(null);
      setNoteSuccess('Note saved successfully ✓');
      setTimeout(() => setNoteSuccess(null), 3500);
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
      setNewNoteText('');
    },
    onError: (err: any) => {
      setActionError(err?.message || 'Failed to add confidential note.');
    },
  });

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((s) => {
      const matchDate =
        dateFilter === 'all' ||
        (dateFilter === 'Today' && s.sessionDate === 'Today') ||
        (dateFilter === 'Tomorrow' && s.sessionDate === 'Tomorrow') ||
        (dateFilter === 'Past' && (s.sessionDate === 'Past' || s.sessionDate === 'Last Week' || s.sessionDate.includes('Days Ago')));
      
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchDate && matchStatus;
    });
  }, [sessions, dateFilter, statusFilter]);

  const renderStatusBadge = (status: AppointedSession['status']) => {
    const map: Record<string, { label: string; className: string }> = {
      requested: { label: 'Requested', className: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
      pending: { label: 'Pending', className: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
      accepted: { label: 'Accepted', className: 'border-[#c3f340]/40 bg-[#c3f340]/10 text-[#c3f340]' },
      completed: { label: 'Completed', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
      'follow-up': { label: 'Follow-Up', className: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
      closed: { label: 'Closed', className: 'border-white/20 bg-white/5 text-white/50' },
      upcoming: { label: 'Upcoming', className: 'border-[#c3f340]/40 bg-[#c3f340]/10 text-[#c3f340]' },
      'in-progress': { label: 'In Progress', className: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
    };
    const config = map[status] || { label: status, className: 'border-white/20 bg-white/5 text-white/75' };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const lifecycleStages: AppointedSession['status'][] = ['requested', 'pending', 'accepted', 'completed', 'follow-up', 'closed'];

  return (
    <div className="rise-in pb-16">
      <SectionHeading
        eyebrow="PRD Lifecycle & Consultations"
        title="Appointments & consultations."
        description="Full lifecycle support tracking: REQUESTED → PENDING → ACCEPTED → COMPLETED → FOLLOW-UP → CLOSED."
        action={
          <div className="flex items-center gap-2">
            <Pill tone="accent">
              <Calendar size={12} className="mr-1 inline" /> {sessions?.length || 0} Total Sessions
            </Pill>
          </div>
        }
      />

      {/* Lifecycle Flow Legend */}
      <div className="mb-6 rounded-xl border border-white/[0.08] bg-[#121212]/90 p-4 backdrop-blur-xl">
        <p className="serenity-label text-[9px] text-[#c3f340] mb-2 font-mono-ui uppercase tracking-[.1em]">
          PRD Required Appointment Lifecycle Progression
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {lifecycleStages.map((stage, idx) => (
            <div
              key={stage}
              className={`rounded-lg border px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[.08em] flex items-center justify-center gap-1.5 ${
                statusFilter === stage
                  ? 'border-[#c3f340] bg-[#c3f340]/20 text-[#c3f340]'
                  : 'border-white/[0.08] bg-white/[0.02] text-white/60'
              }`}
            >
              <span className="text-[9px] text-white/35 font-mono">{idx + 1}.</span>
              {stage.replace('-', ' ')}
            </div>
          ))}
        </div>
      </div>

      {/* Date and Status Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-white/[0.08] py-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="serenity-label text-[9px] text-white/35 mr-1">Day:</span>
          {(['all', 'Today', 'Tomorrow', 'Past'] as const).map((df) => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              className={`rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                dateFilter === df
                  ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_10px_rgba(195,243,64,0.3)]'
                  : 'border border-white/[0.08] text-white/40 hover:text-white/70'
              }`}
            >
              {df === 'all' ? 'All Dates' : df}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="serenity-label text-[9px] text-white/35 mr-1">Lifecycle State:</span>
          {(['all', 'requested', 'pending', 'accepted', 'completed', 'follow-up', 'closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.08em] transition-colors ${
                statusFilter === st
                  ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_10px_rgba(195,243,64,0.3)]'
                  : 'border border-white/[0.08] text-white/40 hover:text-white/70'
              }`}
            >
              {st === 'all' ? 'All States' : st}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300 flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-300 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-3 w-24 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="h-16 w-full bg-white/5 rounded" />
              </div>
              <div className="h-8 w-28 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredSessions.length === 0 && (
        <div className="rounded-2xl border border-white/[0.09] bg-[#141414]/90 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 mb-4">
            <Calendar size={28} />
          </div>
          <h3 className="font-display text-xl text-white">No appointments found</h3>
          <p className="mt-1.5 text-xs text-white/45 max-w-sm mx-auto">
            No consultations match the selected date or PRD lifecycle status filter. Try resetting filters to review all records.
          </p>
          <button
            onClick={() => {
              setDateFilter('all');
              setStatusFilter('all');
            }}
            className="mt-5 btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340]/40 bg-[#c3f340]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:bg-[#c3f340] hover:text-[#0d1408]"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Sessions Grid */}
      {!isLoading && filteredSessions.length > 0 && (
        <StaggerContainer stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="stagger-item">
              <TiltCard
                maxTilt={2}
                className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-6 backdrop-blur-xl rounded-xl flex flex-col justify-between min-h-[280px] transition-all hover:border-[#c3f340]/40"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1c1c1c] font-display text-base font-bold text-white border border-white/10">
                        {session.studentAvatar}
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-white">{session.studentName}</h3>
                        <p className="text-xs text-white/40">
                          Year {session.year} · {session.course}
                        </p>
                      </div>
                    </div>

                    {renderStatusBadge(session.status)}
                  </div>

                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-2 text-xs text-[#c3f340] font-medium">
                      <Clock3 size={13} /> {session.sessionTime} ({session.sessionDate})
                    </div>
                    <p className="mt-1.5 text-xs text-white/70 leading-relaxed line-clamp-2">
                      {session.reason}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Status-dependent actions adhering to valid lifecycle transitions */}
                    {(session.status === 'requested' || session.status === 'pending') && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'accepted' })}
                        className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340]/40 bg-[#c3f340]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:bg-[#c3f340] hover:text-[#0d1408]"
                      >
                        <Check size={11} /> Accept Request
                      </button>
                    )}

                    {(session.status === 'accepted' || session.status === 'upcoming') && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'in-progress' })}
                        className="btn-sweep inline-flex items-center gap-1.5 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-amber-300 hover:bg-amber-500 hover:text-[#0d1408]"
                      >
                        <Play size={11} /> Start Session
                      </button>
                    )}

                    {session.status === 'in-progress' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'completed' })}
                        className="btn-sweep inline-flex items-center gap-1.5 rounded border border-emerald-500/50 bg-emerald-500/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-emerald-300 hover:bg-emerald-500 hover:text-[#0d1408]"
                      >
                        <CheckCircle2 size={12} /> Mark Complete
                      </button>
                    )}

                    {session.status === 'completed' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'follow-up' })}
                        className="btn-sweep inline-flex items-center gap-1.5 rounded border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-purple-300 hover:bg-purple-500 hover:text-white"
                      >
                        <RefreshCw size={11} /> Trigger Follow-Up
                      </button>
                    )}

                    {session.status === 'follow-up' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'closed' })}
                        className="btn-sweep inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white/70 hover:bg-white/20 hover:text-white"
                      >
                        <ShieldCheck size={11} /> Close Cycle
                      </button>
                    )}

                    {session.status === 'closed' && (
                      <span className="text-[10px] font-bold uppercase tracking-[.08em] text-white/40 inline-flex items-center gap-1">
                        <ShieldCheck size={12} /> Cycle Closed
                      </span>
                    )}
                  </div>

                  <Magnetic>
                    <button
                      onClick={() => setInspectedSession(session)}
                      className="btn-sweep inline-flex items-center gap-1.5 rounded border border-white/[0.12] bg-[#141414] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white/70 hover:border-[#c3f340]/40 hover:text-[#c3f340]"
                    >
                      <FileText size={12} /> Dossier & Notes
                    </button>
                  </Magnetic>
                </div>
              </TiltCard>
            </div>
          ))}
        </StaggerContainer>
      )}

      {/* FULL STUDENT DOSSIER & NOTES MODAL */}
      {mounted && inspectedSession && createPortal(
        <div
          onClick={() => setInspectedSession(null)}
          data-testid="modal-backdrop-appointments-dossier"
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
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="font-display text-3xl text-white">{inspectedSession.studentName}</h2>
                      {renderStatusBadge(inspectedSession.status)}
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

              {/* Session Details */}
              <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#161616] p-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Calendar size={13} className="text-[#c3f340]" />
                    <strong>{inspectedSession.sessionTime}</strong>
                    <span className="text-white/40">with {inspectedSession.counsellorName}</span>
                  </div>
                  <span className="serenity-label text-[9px] text-[#c3f340]">{inspectedSession.sessionType}</span>
                </div>
                <p className="mt-2.5 text-xs text-white/70">
                  <strong className="text-white/40 font-mono-ui uppercase text-[9px] mr-1">Topic / Reason:</strong>
                  {inspectedSession.reason}
                </p>
              </div>

              {/* Academic & Wellbeing Signals */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-center">
                  <p className="serenity-label text-white/40 text-[9px]">Overall Rhythm</p>
                  <p className="font-display text-xl text-white mt-1">{inspectedSession.academics.overallRhythm}%</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-center">
                  <p className="serenity-label text-white/40 text-[9px]">Wellbeing Score</p>
                  <p className="font-display text-xl text-[#c3f340] mt-1">{inspectedSession.academics.wellbeingScore}/100</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-center">
                  <p className="serenity-label text-white/40 text-[9px]">Attendance</p>
                  <p className="font-display text-xl text-white mt-1">{inspectedSession.academics.attendance}%</p>
                </div>
              </div>

              {/* Confidential Session Notes */}
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="serenity-label text-[#c3f340] text-[9px] flex items-center gap-1.5">
                    <span>🔒</span> Private Confidential Counselling Notes — Encrypted & FERPA Protected (Counsellor Access Only)
                  </p>
                  <span className="text-[9px] font-mono text-white/30">Zero Surveillance / No Student Access</span>
                </div>
                <p className="text-[11px] text-white/45 mb-3">
                  Frontend privacy ensures UI isolation. Institutional FERPA compliance governs secure backend data retention.
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
