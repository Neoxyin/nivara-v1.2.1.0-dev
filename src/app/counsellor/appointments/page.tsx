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
  Lock,
  Inbox,
  Filter,
} from 'lucide-react';
import { getAppointedSessions, updateSessionStatus, getActiveCounsellorName, setActiveCounsellorName } from '@/lib/api/counsellors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession } from '@/lib/types';
import { SessionNotesEditor } from '@/components/counsellor/session-notes-editor';

export default function CounsellorAppointmentsPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [activeCounsellor, setActiveCounsellor] = useState<string>('Aisha Rahman');
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'pending'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'Today' | 'Tomorrow' | 'Past'>('all');
  const [statusFilter, setStatusFilter] = useState<AppointedSession['status'] | 'all'>('all');
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
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

  const { data: sessions, isLoading, isError, refetch } = useQuery({
    queryKey: ['appointedSessions'],
    queryFn: getAppointedSessions,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: AppointedSession['status']; notes?: string }) =>
      updateSessionStatus(id, status, notes),
    onSuccess: (updated) => {
      setActionError(null);
      if (updated.status === 'accepted') {
        setActionSuccess(`Accepted request for ${updated.studentName} ✓`);
      } else {
        setActionSuccess(`Status updated to ${updated.status} ✓`);
      }
      setTimeout(() => setActionSuccess(null), 3500);
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
    },
    onError: (err: any) => {
      setActionError(err?.message || 'Failed to update session status.');
    },
  });

  const isPending = (status: AppointedSession['status']) =>
    status === 'requested' || status === 'pending';

  const pendingCount = sessions?.filter((s) => isPending(s.status)).length || 0;
  const todayCount = sessions?.filter((s) => s.sessionDate === 'Today' && !isPending(s.status)).length || 0;

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((s) => {
      // Quick view mode filter
      if (viewMode === 'today') {
        if (s.sessionDate !== 'Today' || isPending(s.status)) return false;
      } else if (viewMode === 'pending') {
        if (!isPending(s.status)) return false;
      }

      // Detailed date filter
      const matchDate =
        dateFilter === 'all' ||
        (dateFilter === 'Today' && s.sessionDate === 'Today') ||
        (dateFilter === 'Tomorrow' && s.sessionDate === 'Tomorrow') ||
        (dateFilter === 'Past' && (s.sessionDate === 'Past' || s.sessionDate === 'Last Week' || s.sessionDate.includes('Days Ago')));
      
      // Detailed status filter
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchDate && matchStatus;
    });
  }, [sessions, viewMode, dateFilter, statusFilter]);

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

      {/* Top Quick Focus Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setViewMode('all');
            setDateFilter('all');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[.08em] border transition-colors ${
            viewMode === 'all'
              ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d]'
              : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white'
          }`}
        >
          <Filter size={13} /> All Consultations ({sessions?.length || 0})
        </button>

        <button
          onClick={() => {
            setViewMode('today');
            setDateFilter('all');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[.08em] border transition-colors ${
            viewMode === 'today'
              ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d]'
              : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white'
          }`}
        >
          <Clock3 size={13} /> Today&apos;s Sessions ({todayCount})
        </button>

        <button
          onClick={() => {
            setViewMode('pending');
            setDateFilter('all');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[.08em] border transition-colors ${
            viewMode === 'pending'
              ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d]'
              : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white'
          }`}
        >
          <Inbox size={13} /> Pending Requests ({pendingCount})
        </button>
      </div>

      {/* Lifecycle Flow Legend */}
      <div className="mb-6 rounded-xl border border-white/[0.08] bg-[#121212]/90 p-4 backdrop-blur-xl">
        <p className="serenity-label text-[9px] text-[#c3f340] mb-2 font-mono-ui uppercase tracking-[.1em]">
          PRD Required Appointment Lifecycle Progression
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {lifecycleStages.map((stage, idx) => (
            <div
              key={stage}
              onClick={() => setStatusFilter(statusFilter === stage ? 'all' : stage)}
              className={`rounded-lg border px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[.08em] flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                statusFilter === stage
                  ? 'border-[#c3f340] bg-[#c3f340]/20 text-[#c3f340]'
                  : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20'
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
              onClick={() => {
                setDateFilter(df);
                if (viewMode !== 'all') setViewMode('all');
              }}
              className={`rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                dateFilter === df && viewMode === 'all'
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
              onClick={() => {
                setStatusFilter(st);
                if (viewMode !== 'all') setViewMode('all');
              }}
              className={`rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.08em] transition-colors ${
                statusFilter === st && viewMode === 'all'
                  ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_10px_rgba(195,243,64,0.3)]'
                  : 'border border-white/[0.08] text-white/40 hover:text-white/70'
              }`}
            >
              {st === 'all' ? 'All States' : st}
            </button>
          ))}
        </div>
      </div>

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
            {viewMode === 'pending'
              ? 'No incoming appointment requests awaiting review.'
              : viewMode === 'today'
              ? 'No accepted sessions scheduled for today.'
              : 'No consultations match the selected date or PRD lifecycle status filter. Try resetting filters to review all records.'}
          </p>
          <button
            onClick={() => {
              setViewMode('all');
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
                className={`border bg-[hsl(var(--card))]/90 p-6 backdrop-blur-xl rounded-xl flex flex-col justify-between min-h-[280px] transition-all ${
                  isPending(session.status)
                    ? 'border-[#c3f340]/30 hover:border-[#c3f340]/60'
                    : 'border-white/[0.09] hover:border-[#c3f340]/40'
                }`}
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
                    <div className="flex items-center justify-between text-xs text-[#c3f340] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock3 size={13} /> {session.sessionTime} ({session.sessionDate})
                      </div>
                      <span className="text-[10px] text-white/40">{session.sessionType}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-white/70 leading-relaxed line-clamp-2">
                      {session.reason}
                    </p>
                  </div>

                  {/* Pre-acceptance limited visibility notice */}
                  {isPending(session.status) && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-300/80">
                      <Lock size={11} />
                      <span>Limited Preview: Full dossier & private notes unlock after acceptance</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Status-dependent actions adhering to valid lifecycle transitions */}
                    {isPending(session.status) && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'accepted' })}
                        disabled={updateStatusMutation.isPending}
                        className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340] bg-[#c3f340] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.3)] hover:scale-102 transition-all disabled:opacity-50"
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
                      <FileText size={12} /> {isPending(session.status) ? 'Review Request' : 'Dossier & Notes'}
                    </button>
                  </Magnetic>
                </div>
              </TiltCard>
            </div>
          ))}
        </StaggerContainer>
      )}

      {/* FULL STUDENT DOSSIER & NOTES MODAL OR LIMITED PREVIEW (IF PENDING) */}
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

              {/* Pre-acceptance limited visibility view */}
              {isPending(inspectedSession.status) ? (
                <div className="mt-6 space-y-6">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                      <Lock size={14} />
                      <span>Limited Pre-Acceptance Preview</span>
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
                /* Full Dossier & Notes View for Accepted / Active Sessions */
                <div>
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
