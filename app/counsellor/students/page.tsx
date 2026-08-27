'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SectionHeading } from '@/components/shared/section-heading';
import { SupportNeedProfile } from '@/components/shared/support-need-profile';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  UsersRound,
  Clock3,
  Calendar,
  X,
  GraduationCap,
  Landmark,
  HeartPulse,
  Lock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  Eye,
  Info,
} from 'lucide-react';
import {
  getAppointedSessions,
  updateSessionStatus,
  getActiveCounsellorName,
  setActiveCounsellorName,
} from '@/lib/api/counsellors';
import { mockCounsellors } from '@/lib/data/counsellors';
import { getSupportNeedProfile } from '@/lib/api/support-needs';
import { scoreAcademic, scoreFinancial, scoreWellbeing } from '@/lib/data/support-engine';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession, SupportNeedLevel } from '@/lib/types';

const LEVEL_PILL_STYLES: Record<SupportNeedLevel, { text: string; bg: string; border: string }> = {
  LOW: { text: 'text-[#c3f340]', bg: 'bg-[rgba(195,243,64,.1)]', border: 'border-[#c3f340]/20' },
  MILD: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  MODERATE: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  HIGH: { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
};

export default function CounsellorStudentsPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [activeCounsellor, setActiveCounsellor] = useState<string>('Aisha Rahman');
  const [viewMode, setViewMode] = useState<'my-caseload' | 'all-students' | 'assessments-matrix'>('my-caseload');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);

  useEffect(() => {
    setMounted(true);
    setActiveCounsellor(getActiveCounsellorName());

    const handleCounsellorChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string }>;
      if (customEvent.detail?.name) {
        setActiveCounsellor(customEvent.detail.name);
      }
    };

    window.addEventListener('nivara-active-counsellor-changed', handleCounsellorChange);
    return () => {
      window.removeEventListener('nivara-active-counsellor-changed', handleCounsellorChange);
    };
  }, []);

  const handleSwitchCounsellor = (name: string) => {
    setActiveCounsellor(name);
    setActiveCounsellorName(name);
  };

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['appointedSessions'],
    queryFn: getAppointedSessions,
  });

  const isAssignedToActive = useCallback(
    (session: AppointedSession) => {
      return session.counsellorName.toLowerCase() === activeCounsellor.toLowerCase();
    },
    [activeCounsellor]
  );

  const inspectedIsAssigned = inspectedSession ? isAssignedToActive(inspectedSession) : false;
  const inspectedIsAccepted = inspectedSession?.status === 'accepted';
  const inspectedIsPendingOrRequested = inspectedSession?.status === 'requested' || inspectedSession?.status === 'pending';

  // Fetch support need profile for inspected session only when counsellor is authorized
  const { data: supportNeedProfile, isLoading: isSupportLoading, isError: isSupportError } = useQuery({
    queryKey: ['supportNeedProfile', inspectedSession?.id, activeCounsellor],
    queryFn: () => getSupportNeedProfile(inspectedSession?.id, activeCounsellor),
    enabled: !!inspectedSession && inspectedIsAssigned,
  });

  const acceptAppointmentMutation = useMutation({
    mutationFn: (id: string) => updateSessionStatus(id, 'accepted'),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      queryClient.invalidateQueries({ queryKey: ['supportNeedProfile', updated.id] });
      if (inspectedSession && inspectedSession.id === updated.id) {
        setInspectedSession(updated);
      }
    },
  });

  const filteredStudents = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((s) => {
      // Caseload view filter
      if (viewMode === 'my-caseload' && !isAssignedToActive(s)) {
        return false;
      }

      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.counsellorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.reason.toLowerCase().includes(searchQuery.toLowerCase());

      // Course filter
      const matchesCourse = courseFilter === 'all' || s.course.includes(courseFilter);

      // Status filter
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [sessions, viewMode, isAssignedToActive, searchQuery, courseFilter, statusFilter]);

  const assignedCount = useMemo(() => {
    if (!sessions) return 0;
    return sessions.filter((s) => isAssignedToActive(s)).length;
  }, [sessions, isAssignedToActive]);

  const acceptedCount = useMemo(() => {
    if (!sessions) return 0;
    return sessions.filter((s) => isAssignedToActive(s) && s.status === 'accepted').length;
  }, [sessions, isAssignedToActive]);

  // Helper to compute support indicators using the standard support engine
  const getSessionSupportLevels = useCallback((session: AppointedSession) => {
    const hasDownTrend = session.academics.activeSubjects.some((s) => s.trend === 'down');
    const hasAttendanceWatch = session.academics.insights.some(
      (i) => i.title.toLowerCase().includes('attendance') || i.summary.toLowerCase().includes('attendance')
    );

    const acad = scoreAcademic({
      attendance: session.academics.attendance,
      attendanceDeclining: hasAttendanceWatch || session.academics.attendance < 88,
      marksDeclining: hasDownTrend,
      overdueAssignments: session.academics.upcomingDeadlines.filter((d) => d.priority === 'high').length > 1 ? 1 : 0,
      academicStress: session.academics.recentCheckIn.stress,
      requestedHelp: session.status === 'requested' || session.status === 'pending' || session.status === 'accepted',
    });

    const fin = scoreFinancial({
      feeStatus: session.id === 'ses-2' || session.studentName.toLowerCase().includes('liam') ? 'NOT_PAID' : 'PAID',
    });

    const well = scoreWellbeing({
      mood: session.academics.recentCheckIn.mood,
      energy: session.academics.recentCheckIn.energy,
      stress: session.academics.recentCheckIn.stress,
      sleep: session.academics.recentCheckIn.sleep,
    });

    return {
      academicLevel: acad.level || 'LOW',
      financialLevel: fin.level || 'LOW',
      wellbeingLevel: well.level || 'LOW',
    };
  }, []);

  return (
    <div className="rise-in space-y-6">
      <SectionHeading
        eyebrow="Counsellor Caseload & Authorized Support"
        title="Students & Support Assessments."
        description="Review authorized student support context, inspect tri-dimensional support needs (Academic, Financial, Well-being), and examine relevant consented contributing factors upon appointment acceptance."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-[#161616] px-3 py-1.5 text-xs text-white">
              <span className="text-[10px] uppercase font-mono-ui text-white/40">[Demo Persona]:</span>
              <select
                value={activeCounsellor}
                onChange={(e) => handleSwitchCounsellor(e.target.value)}
                className="bg-transparent font-semibold text-[#c3f340] outline-none cursor-pointer"
                title="Prototype persona switcher to test assigned vs. other counsellor access boundaries"
              >
                {mockCounsellors.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#1a1a1a] text-white">
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </div>
            <Pill tone="accent">
              <UserCheck size={12} className="mr-1 inline" /> {assignedCount} Assigned to You
            </Pill>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TiltCard maxTilt={1.5} className="border border-white/[0.08] bg-[#141414]/90 p-4 rounded-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="serenity-label text-white/40 text-[10px]">Your Authorized Caseload</p>
            <UsersRound size={16} className="text-[#c3f340]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="font-display text-2xl font-bold text-white">{assignedCount}</p>
            <span className="text-[10px] text-white/40">Students Appointed</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={1.5} className="border border-white/[0.08] bg-[#141414]/90 p-4 rounded-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="serenity-label text-[#c3f340] text-[10px]">Accepted Consultations</p>
            <CheckCircle2 size={16} className="text-[#c3f340]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="font-display text-2xl font-bold text-[#c3f340]">{acceptedCount}</p>
            <span className="text-[10px] text-[#c3f340]/70">Factors Unlocked</span>
          </div>
        </TiltCard>

        <TiltCard maxTilt={1.5} className="border border-white/[0.08] bg-[#141414]/90 p-4 rounded-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="serenity-label text-white/40 text-[10px]">Institutional Directory</p>
            <ShieldCheck size={16} className="text-white/50" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="font-display text-2xl font-bold text-white/80">{sessions?.length || 0}</p>
            <span className="text-[10px] text-white/40">Total Enrolled</span>
          </div>
        </TiltCard>
      </div>

      {/* Navigation Tabs & Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#121212]/80 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('my-caseload')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'my-caseload'
                  ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.3)]'
                  : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              My Authorized Students ({assignedCount})
            </button>
            <button
              onClick={() => setViewMode('all-students')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'all-students'
                  ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.3)]'
                  : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              All Enrolled Students ({sessions?.length || 0})
            </button>
            <button
              onClick={() => setViewMode('assessments-matrix')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'assessments-matrix'
                  ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.3)]'
                  : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              Support Needs Matrix
            </button>
          </div>

          <div className="text-[11px] text-white/40">
            {viewMode === 'my-caseload' ? (
              <span className="flex items-center gap-1 text-[#c3f340]/90">
                <ShieldCheck size={13} /> Showing students authorized for <strong>{activeCounsellor}</strong>
              </span>
            ) : viewMode === 'all-students' ? (
              <span className="flex items-center gap-1 text-white/50">
                <Info size={13} /> Other counsellors&apos; students have restricted support details
              </span>
            ) : (
              <span className="flex items-center gap-1 text-white/50">
                <Info size={13} /> Tri-dimensional support overview (Academic, Financial, Well-being)
              </span>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-[260px] max-w-md flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, course, email, or topic..."
              className="w-full rounded-lg border border-white/[0.09] bg-white/[0.02] py-2 pl-9 pr-4 text-xs text-white/85 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-mono-ui text-white/40 mr-1">Discipline:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'Design', label: 'Design' },
                { id: 'Engineering', label: 'Engineering' },
                { id: 'Data Science', label: 'Data Science' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCourseFilter(item.id)}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.06em] transition-colors ${
                    courseFilter === item.id
                      ? 'bg-[#c3f340] text-[#0d1408]'
                      : 'border border-white/[0.08] text-white/40 hover:text-white/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 ml-2">
              <span className="text-[10px] uppercase font-mono-ui text-white/40 mr-1">Status:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'accepted', label: 'Accepted' },
                { id: 'requested', label: 'Requested' },
                { id: 'pending', label: 'Pending' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStatusFilter(item.id)}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.06em] transition-colors ${
                    statusFilter === item.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'border border-white/[0.08] text-white/40 hover:text-white/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#141414]/90 p-12 text-center animate-pulse">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-[#c3f340] border-t-transparent animate-spin" />
          <p className="mt-4 text-xs font-mono-ui uppercase tracking-widest text-white/40">
            Loading student records & authorized caseload...
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#141414]/90 p-12 text-center">
          <UsersRound size={32} className="mx-auto text-white/20 mb-3" />
          <h4 className="text-sm font-semibold text-white">No matching students found</h4>
          <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
            {viewMode === 'my-caseload'
              ? `No students currently appointed to ${activeCounsellor} match your filters.`
              : 'Try adjusting your search query or discipline filter.'}
          </p>
        </div>
      ) : viewMode === 'assessments-matrix' ? (
        /* ASSESSMENTS MATRIX VIEW */
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredStudents.map((session) => {
            const isAssigned = isAssignedToActive(session);
            const isAccepted = session.status === 'accepted';
            const { academicLevel, financialLevel, wellbeingLevel } = getSessionSupportLevels(session);

            return (
              <TiltCard
                key={session.id}
                maxTilt={1}
                className="flex flex-col justify-between border border-white/[0.08] bg-[#141414]/90 p-5 rounded-xl backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1c1c1c] font-display text-sm font-bold text-white border border-white/10">
                        {session.studentAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{session.studentName}</h4>
                          {isAssigned ? (
                            <span className="rounded bg-[#c3f340]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#c3f340] border border-[#c3f340]/20">
                              Assigned to You
                            </span>
                          ) : (
                            <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-white/50 border border-white/[0.06]">
                              Assigned: {session.counsellorName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/40 mt-0.5">
                          Year {session.year} · {session.course} · {session.studentEmail}
                        </p>
                      </div>
                    </div>

                    <Pill tone={isAccepted ? 'accent' : 'warm'}>
                      {session.status}
                    </Pill>
                  </div>

                  {/* Appointment focus */}
                  <div className="mt-3 text-xs text-white/70">
                    <span className="text-[10px] uppercase font-mono-ui text-white/40 mr-1.5">Stated Focus:</span>
                    <span className="italic">{session.reason}</span>
                  </div>

                  {/* Tri-dimensional Support Needs */}
                  <div className="mt-4">
                    <p className="text-[10px] uppercase font-mono-ui tracking-wider text-white/40 mb-2">
                      Independent Support Dimensions:
                    </p>

                    {isAssigned ? (
                      <div className="grid grid-cols-3 gap-2">
                        {/* Academic */}
                        <div className={`rounded-lg border p-2.5 ${LEVEL_PILL_STYLES[academicLevel].bg} ${LEVEL_PILL_STYLES[academicLevel].border}`}>
                          <div className="flex items-center gap-1.5 text-white/80 mb-1">
                            <GraduationCap size={12} className={LEVEL_PILL_STYLES[academicLevel].text} />
                            <span className="text-[11px] font-medium">Academic</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${LEVEL_PILL_STYLES[academicLevel].text}`}>
                            {academicLevel}
                          </span>
                        </div>

                        {/* Financial */}
                        <div className={`rounded-lg border p-2.5 ${LEVEL_PILL_STYLES[financialLevel].bg} ${LEVEL_PILL_STYLES[financialLevel].border}`}>
                          <div className="flex items-center gap-1.5 text-white/80 mb-1">
                            <Landmark size={12} className={LEVEL_PILL_STYLES[financialLevel].text} />
                            <span className="text-[11px] font-medium">Financial</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${LEVEL_PILL_STYLES[financialLevel].text}`}>
                            {financialLevel}
                          </span>
                        </div>

                        {/* Well-being */}
                        <div className={`rounded-lg border p-2.5 ${LEVEL_PILL_STYLES[wellbeingLevel].bg} ${LEVEL_PILL_STYLES[wellbeingLevel].border}`}>
                          <div className="flex items-center gap-1.5 text-white/80 mb-1">
                            <HeartPulse size={12} className={LEVEL_PILL_STYLES[wellbeingLevel].text} />
                            <span className="text-[11px] font-medium">Well-being</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${LEVEL_PILL_STYLES[wellbeingLevel].text}`}>
                            {wellbeingLevel}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-3 text-xs text-white/60 flex items-center gap-2">
                        <Lock size={13} className="text-amber-400 shrink-0" />
                        <span>Support assessment confidential to assigned counsellor ({session.counsellorName})</span>
                      </div>
                    )}
                  </div>

                  {/* Privacy state indicator */}
                  {isAssigned && !isAccepted && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-300/80 bg-amber-500/[0.06] border border-amber-500/15 rounded-md px-2.5 py-1.5">
                      <Lock size={11} className="shrink-0" />
                      <span>Pre-acceptance: Contributing factors unlock once appointment is accepted.</span>
                    </div>
                  )}

                  {isAssigned && isAccepted && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#c3f340]/90 bg-[#c3f340]/[0.06] border border-[#c3f340]/15 rounded-md px-2.5 py-1.5">
                      <CheckCircle2 size={11} className="shrink-0" />
                      <span>Authorized access: Relevant consented contributing factors unlocked.</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <Clock3 size={12} className="text-[#c3f340]" />
                    <span>{session.sessionTime}</span>
                  </div>

                  <button
                    onClick={() => setInspectedSession(session)}
                    className="inline-flex items-center gap-1.5 rounded border border-[#c3f340]/40 bg-[#181818] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:bg-[#c3f340] hover:text-[#0d1408] transition-all"
                  >
                    <Eye size={12} /> View Dossier
                  </button>
                </div>
              </TiltCard>
            );
          })}
        </div>
      ) : (
        /* TABLE DIRECTORY VIEW */
        <TiltCard maxTilt={1} className="overflow-hidden border border-white/[0.09] bg-[hsl(var(--card))]/90 backdrop-blur-xl rounded-xl">
          <Table>
            <TableHeader className="border-b border-white/[0.08] bg-white/[0.01]">
              <TableRow className="border-white/[0.08] hover:bg-transparent">
                <TableHead className="py-3.5 pl-6 text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Student Identity
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Assignment & Status
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Appointment Context
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Support Dimensions
                </TableHead>
                <TableHead className="pr-6 text-right text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Support Context
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/[0.06]">
              {filteredStudents.map((session, index) => {
                const isAssigned = isAssignedToActive(session);
                const isAccepted = session.status === 'accepted';
                const { academicLevel, wellbeingLevel } = getSessionSupportLevels(session);

                return (
                  <TableRow
                    key={session.id}
                    className="border-white/[0.06] transition-colors hover:bg-white/[0.03]"
                  >
                    {/* Student Identity */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1c1c1c] font-display text-sm font-bold text-white border border-white/10">
                          {session.studentAvatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white text-sm">{session.studentName}</p>
                            {isAssigned && (
                              <span className="rounded bg-[#c3f340]/10 px-1.5 py-0.2 text-[9px] font-bold text-[#c3f340] border border-[#c3f340]/20">
                                Yours
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/40">
                            Year {session.year} · {session.course} · {session.studentEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Assignment & Status */}
                    <TableCell>
                      <div>
                        <div className="text-xs text-white/80 font-medium">
                          {isAssigned ? (
                            <span className="text-[#c3f340]">Assigned to You</span>
                          ) : (
                            <span className="text-white/60">{session.counsellorName}</span>
                          )}
                        </div>
                        <div className="mt-1">
                          <Pill tone={isAccepted ? 'accent' : session.status === 'requested' || session.status === 'pending' ? 'warm' : 'default'}>
                            {session.status}
                          </Pill>
                        </div>
                      </div>
                    </TableCell>

                    {/* Appointment Context */}
                    <TableCell>
                      <div className="max-w-[240px]">
                        <div className="flex items-center gap-1.5 text-xs text-white/80">
                          <Clock3 size={12} className="text-[#c3f340]" />
                          <span className="font-medium">{session.sessionTime}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-white/60 line-clamp-1 italic">
                          &ldquo;{session.reason}&rdquo;
                        </p>
                      </div>
                    </TableCell>

                    {/* Support Need Dimensions */}
                    <TableCell>
                      {isAssigned ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LEVEL_PILL_STYLES[academicLevel].bg} ${LEVEL_PILL_STYLES[academicLevel].text} border ${LEVEL_PILL_STYLES[academicLevel].border}`}>
                            <GraduationCap size={10} /> Acad: {academicLevel}
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LEVEL_PILL_STYLES[wellbeingLevel].bg} ${LEVEL_PILL_STYLES[wellbeingLevel].text} border ${LEVEL_PILL_STYLES[wellbeingLevel].border}`}>
                            <HeartPulse size={10} /> Well: {wellbeingLevel}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                          <Lock size={12} className="text-amber-400/80" />
                          <span>Confidential</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 text-right">
                      <Magnetic>
                        <button
                          onClick={() => setInspectedSession(session)}
                          data-testid={`button-view-student-dossier-${index}`}
                          className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340]/40 bg-[#141414] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:text-[#0d1408] hover:border-[#c3f340]"
                        >
                          <Eye size={13} /> View Dossier
                        </button>
                      </Magnetic>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TiltCard>
      )}

      {/* FULL STUDENT SUPPORT DOSSIER MODAL */}
      {mounted && inspectedSession && createPortal(
        <div
          onClick={() => setInspectedSession(null)}
          data-testid="modal-backdrop-students-dossier"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto"
          >
            <TiltCard maxTilt={1} className="border border-white/[0.14] bg-[#111]/95 p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,.95)] backdrop-blur-2xl rounded-2xl">
              {/* Header: Basic Student Identity */}
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#c3f340] font-display text-2xl font-bold text-[#0d1408]">
                    {inspectedSession.studentAvatar}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display text-2xl sm:text-3xl text-white">{inspectedSession.studentName}</h2>
                      <Pill tone={inspectedIsAccepted ? 'accent' : inspectedIsPendingOrRequested ? 'warm' : 'default'}>
                        {inspectedSession.status}
                      </Pill>
                      {inspectedIsAssigned ? (
                        <span className="rounded bg-[#c3f340]/15 px-2 py-0.5 text-[10px] font-bold text-[#c3f340] border border-[#c3f340]/30">
                          Assigned to You ({activeCounsellor})
                        </span>
                      ) : (
                        <span className="rounded bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/50 border border-white/10">
                          Assigned: {inspectedSession.counsellorName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      Year {inspectedSession.year} · {inspectedSession.course} · {inspectedSession.studentEmail}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectedSession(null)}
                  className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.07] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Appointment Context Details */}
              <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#161616] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Calendar size={13} className="text-[#c3f340]" />
                    <strong>{inspectedSession.sessionTime}</strong>
                    <span className="text-white/40">with {inspectedSession.counsellorName}</span>
                  </div>
                  <span className="serenity-label text-[9px] text-[#c3f340]">{inspectedSession.sessionType}</span>
                </div>
                
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs leading-5 text-white/80">
                      <strong className="text-white/40 font-mono-ui uppercase text-[9px] mr-1.5">Stated Consultation Focus:</strong>
                      {inspectedSession.reason}
                    </p>
                  </div>

                  {/* Accept action for requested/pending appointments */}
                  {inspectedIsAssigned && inspectedIsPendingOrRequested && (
                    <button
                      onClick={() => acceptAppointmentMutation.mutate(inspectedSession.id)}
                      disabled={acceptAppointmentMutation.isPending}
                      className="btn-sweep shrink-0 rounded-lg border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-[#0d1408] hover:shadow-[0_0_15px_rgba(195,243,64,0.4)] disabled:opacity-50"
                    >
                      {acceptAppointmentMutation.isPending ? 'Accepting...' : 'Accept Appointment'}
                    </button>
                  )}
                </div>
              </div>

              {/* ACCESS CONTROLLED SECTION */}
              {!inspectedIsAssigned ? (
                /* OTHER COUNSELLOR: RESTRICTED ACCESS */
                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5 text-left">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <ShieldAlert size={18} />
                    <h3 className="text-sm font-semibold text-white">Confidential Support Assessment</h3>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    You are viewing a student appointed to <strong>{inspectedSession.counsellorName}</strong>.
                    In accordance with NIVARA privacy safeguards, detailed support need assessments, contributing factors, and wellbeing indicators are restricted to the assigned counsellor.
                  </p>
                  <div className="mt-3 pt-3 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-white/40">
                    <span>Only basic directory contact details are displayed.</span>
                    <button
                      onClick={() => handleSwitchCounsellor(inspectedSession.counsellorName)}
                      className="text-[#c3f340] hover:underline"
                    >
                      Switch demo persona to {inspectedSession.counsellorName}
                    </button>
                  </div>
                </div>
              ) : (
                /* ASSIGNED COUNSELLOR: SUPPORT NEEDS & ASSESSMENTS */
                <div className="mt-6 space-y-6">
                  {/* Privacy Banner */}
                  {!inspectedIsAccepted ? (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs text-white/80">
                      <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                        <Lock size={14} />
                        <span>Pre-Acceptance Privacy Guard</span>
                      </div>
                      <p className="text-white/70 leading-relaxed">
                        This appointment is currently <strong>{inspectedSession.status}</strong>. Support need levels (Academic, Financial, Well-being) are summarized below. Contributing factors and deeper support context remain locked until you officially accept the appointment request.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#c3f340]/25 bg-[#c3f340]/[0.05] p-4 text-xs text-white/80">
                      <div className="flex items-center gap-2 text-[#c3f340] font-semibold mb-1">
                        <ShieldCheck size={14} />
                        <span>Authorized Support Context</span>
                      </div>
                      <p className="text-white/70 leading-relaxed">
                        Appointment accepted. Permitted support dimensions and relevant consented contributing factors are unlocked below for consultation preparation.
                      </p>
                    </div>
                  )}

                  {/* Support Need Dimensions Component */}
                  <SupportNeedProfile
                    data={supportNeedProfile}
                    isLoading={isSupportLoading}
                    isError={isSupportError}
                    hideContributingFactors={!inspectedIsAccepted}
                    isAssignedCounsellor={true}
                    assignedCounsellorName={inspectedSession.counsellorName}
                  />

                  {/* Privacy Safeguard Footnote */}
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.01] p-3.5 text-[11px] text-white/40 leading-relaxed">
                    <strong className="text-white/60 font-medium">Privacy & Support Safeguards:</strong> Support need levels are objective triage indicators derived deterministically from consented student records. No single overall risk score is calculated, and no disciplinary classifications or diagnostic labels are applied.
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
