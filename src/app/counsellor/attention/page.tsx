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
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Check,
  RotateCcw,
  UserCheck,
  Info,
} from 'lucide-react';
import {
  getAppointedSessions,
  getSupportAlerts,
  markAlertReviewed,
  getFollowUps,
  completeFollowUp,
  reopenFollowUp,
  getActiveCounsellorName,
  setActiveCounsellorName,
} from '@/lib/api/counsellors';
import { mockCounsellors } from '@/lib/data/counsellors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession, SupportAlert, CounsellorFollowUp } from '@/lib/types';
import { FollowUpModal } from '@/components/counsellor/follow-up-modal';

export default function CounsellorAttentionPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [activeCounsellor, setActiveCounsellor] = useState<string>('Aisha Rahman');
  const [activeTab, setActiveTab] = useState<'alerts' | 'followups'>('alerts');
  const [followUpFilter, setFollowUpFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);

  // Follow-up modal state
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [followUpStudent, setFollowUpStudent] = useState<{
    name: string;
    email?: string;
    course?: string;
    year?: number;
    sessionId?: string;
    defaultReason?: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setActiveCounsellor(getActiveCounsellorName());

    const handleCounsellorChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string }>;
      if (customEvent.detail?.name) {
        setActiveCounsellor(customEvent.detail.name);
      }
    };

    const handleStorageChange = () => {
      queryClient.invalidateQueries({ queryKey: ['supportAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['counsellorFollowUps'] });
    };

    window.addEventListener('nivara-active-counsellor-changed', handleCounsellorChange);
    window.addEventListener('nivara-followups-changed', handleStorageChange);
    window.addEventListener('nivara-reviewed-alerts-changed', handleStorageChange);

    return () => {
      window.removeEventListener('nivara-active-counsellor-changed', handleCounsellorChange);
      window.removeEventListener('nivara-followups-changed', handleStorageChange);
      window.removeEventListener('nivara-reviewed-alerts-changed', handleStorageChange);
    };
  }, [queryClient]);

  const handleSwitchCounsellor = (name: string) => {
    setActiveCounsellor(name);
    setActiveCounsellorName(name);
  };

  // Queries
  const { data: alerts = [], isLoading: alertsLoading } = useQuery<SupportAlert[]>({
    queryKey: ['supportAlerts', activeCounsellor],
    queryFn: () => getSupportAlerts(activeCounsellor),
  });

  const { data: followUps = [], isLoading: followUpsLoading } = useQuery<CounsellorFollowUp[]>({
    queryKey: ['counsellorFollowUps', activeCounsellor],
    queryFn: () => getFollowUps(activeCounsellor),
  });

  const { data: sessions = [] } = useQuery<AppointedSession[]>({
    queryKey: ['appointedSessions'],
    queryFn: getAppointedSessions,
  });

  // Mutations
  const toggleReviewMutation = useMutation({
    mutationFn: ({ alertId, reviewed }: { alertId: string; reviewed: boolean }) =>
      markAlertReviewed(alertId, reviewed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportAlerts', activeCounsellor] });
    },
  });

  const completeFollowUpMutation = useMutation({
    mutationFn: (id: string) => completeFollowUp(id, activeCounsellor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellorFollowUps', activeCounsellor] });
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
    },
  });

  const reopenFollowUpMutation = useMutation({
    mutationFn: (id: string) => reopenFollowUp(id, activeCounsellor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellorFollowUps', activeCounsellor] });
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
    },
  });

  const pendingFollowUps = followUps.filter((f) => f.status === 'pending');
  const completedFollowUps = followUps.filter((f) => f.status === 'completed');
  const reviewedAlertsCount = alerts.filter((a) => a.reviewed).length;

  const filteredFollowUps =
    followUpFilter === 'pending'
      ? pendingFollowUps
      : followUpFilter === 'completed'
      ? completedFollowUps
      : followUps;

  const openFollowUpForStudent = (student: {
    name: string;
    email?: string;
    course?: string;
    year?: number;
    sessionId?: string;
    defaultReason?: string;
  }) => {
    setFollowUpStudent(student);
    setFollowUpModalOpen(true);
  };

  return (
    <div className="rise-in">
      <SectionHeading
        eyebrow="Triage & early intervention"
        title="Support Alerts & Follow-Ups."
        description="Confidential support notifications and follow-up management for your assigned student caseload."
        action={
          <div className="flex items-center gap-2">
            <Pill tone="warm">
              <AlertTriangle size={12} className="mr-1 inline" /> {alerts.length} Active Triggers
            </Pill>
            <Pill tone="accent">
              <Clock3 size={12} className="mr-1 inline" /> {pendingFollowUps.length} Pending Follow-Ups
            </Pill>
          </div>
        }
      />

      {/* Active Counsellor Caseload Switcher Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111111]/80 px-4 py-3 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <UserCheck size={16} className="text-[#c3f340]" />
          <span className="text-white/50">Active Caseload:</span>
          <span className="font-bold text-white">{activeCounsellor}</span>
          <span className="rounded border border-[#c3f340]/30 bg-[#c3f340]/10 px-2 py-0.5 text-[10px] font-mono text-[#dff77d]">
            Private Workspace
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/40">Switch Specialist:</span>
          <div className="flex items-center gap-1.5">
            {mockCounsellors.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSwitchCounsellor(c.name)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                  activeCounsellor.toLowerCase() === c.name.toLowerCase()
                    ? 'border border-[#c3f340] bg-[#c3f340] font-bold text-[#0d1408]'
                    : 'border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <StaggerContainer stagger={0.06} className="mb-8 grid grid-cols-3 gap-3">
        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-[rgba(229,162,125,.3)] bg-[rgba(229,162,125,.04)] p-5 backdrop-blur-xl">
            <p className="serenity-label text-[#e5a27d]">Critical Signals</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-white">{alerts.length}</p>
              <AlertTriangle size={17} className="text-[#e5a27d]" />
            </div>
            <p className="mt-2 text-xs text-white/45">Active support attention triggers</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Reviewed Signals</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-[#c3f340]">{reviewedAlertsCount}</p>
              <CheckCircle2 size={17} className="text-[#c3f340]" />
            </div>
            <p className="mt-2 text-xs text-white/45">Triage reviewed this shift</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Scheduled Follow-Ups</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-[#dff77d]">{pendingFollowUps.length}</p>
              <Clock3 size={17} className="text-[#dff77d]" />
            </div>
            <p className="mt-2 text-xs text-white/45">Active follow-up reminders</p>
          </TiltCard>
        </div>
      </StaggerContainer>

      {/* Main Tab Navigation */}
      <div className="mb-6 flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'alerts'
                ? 'border border-white/20 bg-white/[0.1] text-white shadow-sm'
                : 'text-white/45 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            Support Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'followups'
                ? 'border border-[#c3f340]/40 bg-[#c3f340]/10 text-[#dff77d] shadow-sm'
                : 'text-white/45 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            Scheduled Follow-Ups ({pendingFollowUps.length})
          </button>
        </div>

        {activeTab === 'followups' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.02] p-1 text-xs">
              <button
                onClick={() => setFollowUpFilter('pending')}
                className={`rounded px-3 py-1 font-medium transition-all ${
                  followUpFilter === 'pending'
                    ? 'bg-[#c3f340] font-bold text-[#0d1408]'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Pending ({pendingFollowUps.length})
              </button>
              <button
                onClick={() => setFollowUpFilter('completed')}
                className={`rounded px-3 py-1 font-medium transition-all ${
                  followUpFilter === 'completed'
                    ? 'bg-[#c3f340] font-bold text-[#0d1408]'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Completed ({completedFollowUps.length})
              </button>
              <button
                onClick={() => setFollowUpFilter('all')}
                className={`rounded px-3 py-1 font-medium transition-all ${
                  followUpFilter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                All ({followUps.length})
              </button>
            </div>

            <button
              onClick={() =>
                openFollowUpForStudent({
                  name: 'Elena Rostova',
                  email: 'elena.rostova@student.nivara.edu',
                  course: 'BArch Architecture',
                  year: 4,
                  defaultReason: 'Coursework pacing check-in',
                })
              }
              className="btn-sweep inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340] bg-[#c3f340] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#0d1408]"
            >
              <Plus size={13} /> Schedule Follow-Up
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: SUPPORT ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alertsLoading ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-12 text-center text-xs text-white/40">
              Loading support alerts...
            </div>
          ) : alerts.length === 0 ? (
            <TiltCard maxTilt={1} className="rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-12 text-center backdrop-blur-xl">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/40">
                <CheckCircle2 size={24} className="text-[#c3f340]" />
              </div>
              <h3 className="mt-4 font-display text-xl text-white">No Active Support Alerts</h3>
              <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-white/45">
                All students currently assigned to <strong className="text-white">{activeCounsellor}</strong> are within balanced study pacing and check-in parameters.
              </p>
            </TiltCard>
          ) : (
            alerts.map((alert) => {
              const matchedSession = sessions.find((s) => s.id === alert.sessionId);

              return (
                <TiltCard
                  key={alert.id}
                  maxTilt={1.5}
                  className={`rounded-xl border p-6 backdrop-blur-xl transition-all ${
                    alert.reviewed
                      ? 'border-white/[0.08] bg-[#111]/70 opacity-60'
                      : 'border-[rgba(229,162,125,.3)] bg-[rgba(229,162,125,.03)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    {/* Student Info */}
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-[#1e1e1e] font-display text-lg font-bold text-white">
                        {alert.studentAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-display text-2xl text-white">{alert.studentName}</h3>
                          <Pill tone="warm">{alert.dimension} Watch</Pill>
                          {alert.reviewed && <Pill tone="accent">Reviewed</Pill>}
                        </div>
                        <p className="mt-0.5 text-xs text-white/45">
                          Year {alert.year} · {alert.course} · {alert.studentEmail}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toggleReviewMutation.mutate({
                            alertId: alert.id,
                            reviewed: !alert.reviewed,
                          })
                        }
                        className={`rounded border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                          alert.reviewed
                            ? 'border-white/20 text-white/40 hover:text-white'
                            : 'border-[#c3f340]/40 bg-[#c3f340]/10 text-[#dff77d] hover:bg-[#c3f340] hover:text-[#0d1408]'
                        }`}
                      >
                        {alert.reviewed ? 'Mark Unreviewed' : 'Mark Reviewed'}
                      </button>

                      <button
                        onClick={() =>
                          openFollowUpForStudent({
                            name: alert.studentName,
                            email: alert.studentEmail,
                            course: alert.course,
                            year: alert.year,
                            sessionId: alert.sessionId,
                            defaultReason: `Follow-up on ${alert.title.toLowerCase()}`,
                          })
                        }
                        className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340] bg-[#c3f340] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#0d1408]"
                      >
                        <Clock3 size={12} /> Schedule Follow-Up
                      </button>

                      {matchedSession && (
                        <button
                          onClick={() => setInspectedSession(matchedSession)}
                          className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/[0.04] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white hover:bg-white/[0.08]"
                        >
                          <FileText size={12} /> Full Dossier
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Signal details */}
                  <div className="mt-5 rounded-lg border border-white/[0.08] bg-[#141414] p-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-[#e5a27d]" />
                        <span className="text-xs font-semibold text-white">{alert.title}</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/35">Voluntary / Consented Indicator</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/75">{alert.summary}</p>

                    {/* Contributing Factors */}
                    {alert.contributingFactors.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {alert.contributingFactors.map((f, fi) => (
                          <span
                            key={fi}
                            className="rounded border border-white/[0.06] bg-black/50 px-2 py-0.5 text-[10px] text-white/60"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Recommended Support Action */}
                    <div className="mt-3.5 border-t border-white/[0.06] pt-3 text-[11px] text-white/60">
                      <strong className="text-[#dff77d]">Suggested Care Step:</strong> {alert.recommendedAction}
                    </div>
                  </div>
                </TiltCard>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: SCHEDULED FOLLOW-UPS */}
      {activeTab === 'followups' && (
        <div className="space-y-4">
          {followUpsLoading ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-12 text-center text-xs text-white/40">
              Loading follow-ups...
            </div>
          ) : filteredFollowUps.length === 0 ? (
            <TiltCard maxTilt={1} className="rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-12 text-center backdrop-blur-xl">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/40">
                <Clock3 size={24} className="text-[#c3f340]" />
              </div>
              <h3 className="mt-4 font-display text-xl text-white">
                {followUpFilter === 'completed'
                  ? 'No Completed Follow-Ups'
                  : 'No Pending Follow-Ups'}
              </h3>
              <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-white/45">
                {followUpFilter === 'completed'
                  ? 'Completed follow-up check-ins will appear here.'
                  : `You have no pending follow-up reminders recorded under ${activeCounsellor}. Schedule a follow-up after completing a consultation or reviewing a watch alert.`}
              </p>
              {followUpFilter === 'pending' && (
                <button
                  onClick={() =>
                    openFollowUpForStudent({
                      name: 'Elena Rostova',
                      email: 'elena.rostova@student.nivara.edu',
                      course: 'BArch Architecture',
                      year: 4,
                      defaultReason: 'Coursework pacing check-in',
                    })
                  }
                  className="btn-sweep mx-auto mt-5 inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-xs font-bold uppercase tracking-[.1em] text-[#0d1408]"
                >
                  <Plus size={14} /> Schedule First Follow-Up
                </button>
              )}
            </TiltCard>
          ) : (
            filteredFollowUps.map((followUp) => {
              const isCompleted = followUp.status === 'completed';

              return (
                <TiltCard
                  key={followUp.id}
                  maxTilt={1.5}
                  className={`rounded-xl border p-6 backdrop-blur-xl transition-all ${
                    isCompleted
                      ? 'border-white/[0.08] bg-[#111]/70 opacity-65'
                      : 'border-white/[0.12] bg-[#141414]/90 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    {/* Student Info & Due Window */}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-display text-2xl text-white">{followUp.studentName}</h3>
                        <Pill tone={isCompleted ? 'accent' : 'warm'}>
                          <Clock3 size={11} className="mr-1 inline" /> Due: {followUp.dueDate}
                        </Pill>
                        {isCompleted && (
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-white/45">
                        Year {followUp.year} · {followUp.course} · {followUp.studentEmail}
                      </p>
                    </div>

                    {/* Status Toggle Action */}
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <button
                          onClick={() => reopenFollowUpMutation.mutate(followUp.id)}
                          disabled={reopenFollowUpMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/[0.04] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white/60 hover:bg-white/[0.08] hover:text-white"
                        >
                          <RotateCcw size={12} /> Reopen Follow-Up
                        </button>
                      ) : (
                        <button
                          onClick={() => completeFollowUpMutation.mutate(followUp.id)}
                          disabled={completeFollowUpMutation.isPending}
                          className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340] bg-[#c3f340] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.2)]"
                        >
                          <Check size={12} /> Mark Completed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reason & Context */}
                  <div className="mt-4 rounded-lg border border-white/[0.08] bg-[#111111] p-4 text-left">
                    <p className="text-xs font-semibold text-white">
                      <strong className="text-[#c3f340]">Focus / Reason:</strong> {followUp.reason}
                    </p>
                    {followUp.notes && (
                      <p className="mt-2 text-xs leading-relaxed text-white/70 whitespace-pre-line">
                        <strong className="text-white/40">Action Steps:</strong> {followUp.notes}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[10px] text-white/40">
                      <span>
                        Private record · Assigned to <strong className="text-white/60">{followUp.counsellorName}</strong>
                      </span>
                      <span>
                        Created {new Date(followUp.createdAt).toLocaleDateString()}
                        {followUp.completedAt && ` · Completed ${new Date(followUp.completedAt).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              );
            })
          )}
        </div>
      )}

      {/* FULL STUDENT DOSSIER MODAL */}
      {mounted && inspectedSession && createPortal(
        <div
          onClick={() => setInspectedSession(null)}
          data-testid="modal-backdrop-attention-dossier"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto"
          >
            <TiltCard maxTilt={1.5} className="rounded-2xl border border-white/[0.14] bg-[#111]/95 p-8 shadow-[0_30px_100px_rgba(0,0,0,.95)] backdrop-blur-2xl text-left">
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
                    <p className="mt-1 text-xs text-white/50">
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
                  <p className="serenity-label text-[9px] text-white/40">Academic Rhythm</p>
                  <p className="mt-2 font-display text-3xl text-white">{inspectedSession.academics.overallRhythm}%</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                  <p className="serenity-label text-[9px] text-white/40">Attendance Rate</p>
                  <p className="mt-2 font-display text-3xl text-[#c3f340]">{inspectedSession.academics.attendance}%</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                  <p className="serenity-label text-[9px] text-white/40">Well-Being Score</p>
                  <p className="mt-2 font-display text-3xl text-[#dff77d]">{inspectedSession.academics.wellbeingScore}/100</p>
                </div>
              </div>

              {/* Module Marks */}
              <div className="mt-6">
                <p className="serenity-label mb-3 text-[9px] text-white/40">Module Marks & Trends</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {inspectedSession.academics.activeSubjects.map((subj) => (
                    <div
                      key={subj.subject}
                      className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] p-3"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{subj.subject}</p>
                        <p className="mt-0.5 text-[10px] text-white/40">
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

              {/* Follow-Up Quick Action Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-5">
                <p className="text-xs text-white/50">
                  Assigned Specialist: <strong className="text-white">{inspectedSession.counsellorName}</strong>
                </p>
                <button
                  onClick={() => {
                    const s = inspectedSession;
                    setInspectedSession(null);
                    openFollowUpForStudent({
                      name: s.studentName,
                      email: s.studentEmail,
                      course: s.course,
                      year: s.year,
                      sessionId: s.id,
                      defaultReason: `Follow-up consultation for ${s.studentName}`,
                    });
                  }}
                  className="btn-sweep inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-xs font-bold uppercase tracking-[.1em] text-[#0d1408]"
                >
                  <Clock3 size={13} /> Schedule Follow-Up Reminder
                </button>
              </div>
            </TiltCard>
          </div>
        </div>,
        document.body
      )}

      {/* Follow-Up Modal */}
      {followUpStudent && (
        <FollowUpModal
          isOpen={followUpModalOpen}
          onClose={() => {
            setFollowUpModalOpen(false);
            setFollowUpStudent(null);
          }}
          studentName={followUpStudent.name}
          studentEmail={followUpStudent.email}
          course={followUpStudent.course}
          year={followUpStudent.year}
          sessionId={followUpStudent.sessionId}
          activeCounsellorName={activeCounsellor}
          defaultReason={followUpStudent.defaultReason}
        />
      )}
    </div>
  );
}
