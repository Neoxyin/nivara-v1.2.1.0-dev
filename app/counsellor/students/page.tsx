'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  AlertTriangle,
  FileText,
  Clock3,
  CheckCircle2,
  Calendar,
  X,
  GraduationCap,
} from 'lucide-react';
import { getAppointedSessions, updateSessionStatus, addSessionNote } from '@/lib/api/counsellors';
import { getSupportNeedProfile } from '@/lib/api/support-needs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppointedSession } from '@/lib/types';

export default function CounsellorStudentsPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [inspectedSession, setInspectedSession] = useState<AppointedSession | null>(null);
  const { data: supportNeedProfile, isLoading: isSupportLoading, isError: isSupportError } = useQuery({
    queryKey: ['supportNeedProfile', inspectedSession?.id],
    queryFn: () => getSupportNeedProfile(inspectedSession?.id),
    enabled: !!inspectedSession
  });
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

  const filteredStudents = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = courseFilter === 'all' || s.course.includes(courseFilter);
      return matchesSearch && matchesCourse;
    });
  }, [sessions, searchQuery, courseFilter]);

  return (
    <div className="rise-in">
      <SectionHeading
        eyebrow="Student directory & dossiers"
        title="Students & academic insights."
        description="Review appointed students, analyze real-time course marks and attendance velocity, and inspect explainable wellbeing signals."
        action={
          <div className="flex items-center gap-2">
            <Pill tone="accent">
              <UsersRound size={12} className="mr-1 inline" /> {sessions?.length || 0} Appointed Students
            </Pill>
          </div>
        }
      />

      {/* Filter toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-white/[0.08] py-3.5">
        <div className="relative min-w-[280px] max-w-md flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, course, email..."
            className="w-full rounded-lg border border-white/[0.09] bg-white/[0.02] py-2 pl-9 pr-4 text-xs text-white/85 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="serenity-label text-[9px] text-white/35 mr-1">Discipline:</span>
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'Design', label: 'Design' },
            { id: 'Engineering', label: 'Engineering' },
            { id: 'Data Science', label: 'Data Science' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCourseFilter(item.id)}
              className={`rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                courseFilter === item.id
                  ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_10px_rgba(195,243,64,0.3)]'
                  : 'border border-white/[0.08] text-white/40 hover:text-white/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      {isLoading ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#141414]/90 p-12 text-center animate-pulse">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-[#c3f340] border-t-transparent animate-spin" />
          <p className="mt-4 text-xs font-mono-ui uppercase tracking-widest text-white/40">
            Loading student academic records...
          </p>
        </div>
      ) : (
        <TiltCard maxTilt={1} className="overflow-hidden border border-white/[0.09] bg-[hsl(var(--card))]/90 backdrop-blur-xl">
          <Table>
            <TableHeader className="border-b border-white/[0.08] bg-white/[0.01]">
              <TableRow className="border-white/[0.08] hover:bg-transparent">
                <TableHead className="py-3.5 pl-6 text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Student
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Appointed Time
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Academic Rhythm & Marks
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Wellbeing / Sleep
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Active Signals
                </TableHead>
                <TableHead className="pr-6 text-right text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                  Dossier
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/[0.06]">
              {filteredStudents.map((session, index) => {
                const watchInsight = session.academics.insights.find((i) => i.tone === 'watch');
                const positiveInsight = session.academics.insights.find((i) => i.tone === 'positive');

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
                          <p className="font-semibold text-white text-sm">{session.studentName}</p>
                          <p className="text-[11px] text-white/40">
                            Year {session.year} · {session.course}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Appointed Time */}
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-white/80">
                          <Clock3 size={12} className="text-[#c3f340]" />
                          <span className="font-medium">{session.sessionTime}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/40">with {session.counsellorName}</p>
                        <div className="mt-1">
                          <Pill tone={session.status === 'upcoming' ? 'accent' : 'default'}>
                            {session.status}
                          </Pill>
                        </div>
                      </div>
                    </TableCell>

                    {/* Academic Rhythm */}
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-base text-white">
                            {session.academics.overallRhythm}%
                          </span>
                          <span className="text-[10px] font-mono-ui uppercase text-white/40">rhythm</span>
                          <span className="text-[10px] text-white/40">· {session.academics.attendance}% att.</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {session.academics.activeSubjects.slice(0, 2).map((subj) => (
                            <span
                              key={subj.subject}
                              className="inline-flex items-center gap-1 rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/70 border border-white/[0.05]"
                            >
                              {subj.subject.split(' ')[0]}: <strong className="text-white">{subj.score}%</strong>
                              {subj.trend === 'up' && <TrendingUp size={10} className="text-[#c3f340]" />}
                              {subj.trend === 'down' && <TrendingDown size={10} className="text-[#e5a27d]" />}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>

                    {/* Wellbeing */}
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-display text-base text-[#dff77d]">
                            {session.academics.wellbeingScore}/100
                          </span>
                          <span className="serenity-label text-[8px] text-white/35">Score</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-white/45">
                          <span>Stress: {session.academics.recentCheckIn.stress}/5</span>
                          <span>·</span>
                          <span>Sleep: {session.academics.recentCheckIn.sleep}/5</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Active Signals */}
                    <TableCell>
                      <div className="max-w-[200px]">
                        {watchInsight ? (
                          <div className="flex items-start gap-1.5 text-[11px] text-[#e5a27d]">
                            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{watchInsight.title}</span>
                          </div>
                        ) : positiveInsight ? (
                          <div className="flex items-start gap-1.5 text-[11px] text-[#c3f340]">
                            <Sparkles size={12} className="shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{positiveInsight.title}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-white/40">Steady rhythm</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 text-right">
                      <Magnetic>
                        <button
                          onClick={() => setInspectedSession(session)}
                          data-testid={`button-view-student-dossier-${index}`}
                          className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340]/40 bg-[#141414] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:text-[#0d1408] hover:border-[#c3f340]"
                        >
                          <FileText size={13} /> View Dossier
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

      {/* FULL STUDENT DOSSIER MODAL */}
      {mounted && inspectedSession && createPortal(
        <div
          onClick={() => setInspectedSession(null)}
          data-testid="modal-backdrop-students-dossier"
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

              {/* Session appointment details */}
              <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#161616] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Calendar size={13} className="text-[#c3f340]" />
                    <strong>{inspectedSession.sessionTime}</strong>
                    <span className="text-white/40">with {inspectedSession.counsellorName}</span>
                  </div>
                  <span className="serenity-label text-[9px] text-[#c3f340]">{inspectedSession.sessionType}</span>
                </div>
                <p className="mt-2.5 text-xs leading-5 text-white/70">
                  <strong className="text-white/40 font-mono-ui uppercase text-[9px] mr-1">Focus:</strong>
                  {inspectedSession.reason}
                </p>
              </div>

              {/* Support Need Profile */}
              <div className="mt-6">
                <SupportNeedProfile data={supportNeedProfile} isLoading={isSupportLoading} isError={isSupportError} />
              </div>

              {/* Metrics Grid */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                  <p className="serenity-label text-white/40 text-[9px]">Academic Rhythm</p>
                  <p className="mt-2 font-display text-3xl text-white">{inspectedSession.academics.overallRhythm}%</p>
                  <p className="mt-1 text-[10px] text-white/40">Course baseline</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                  <p className="serenity-label text-white/40 text-[9px]">Attendance Rate</p>
                  <p className="mt-2 font-display text-3xl text-[#c3f340]">{inspectedSession.academics.attendance}%</p>
                  <p className="mt-1 text-[10px] text-white/40">Sessions & workshops</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                  <p className="serenity-label text-white/40 text-[9px]">Well-Being Score</p>
                  <p className="mt-2 font-display text-3xl text-[#dff77d]">{inspectedSession.academics.wellbeingScore}/100</p>
                  <p className="mt-1 text-[10px] text-white/40">Check-in synthesis</p>
                </div>
              </div>

              {/* Module Marks */}
              <div className="mt-6">
                <p className="serenity-label text-white/40 text-[9px] mb-3">Active Subjects & Scores</p>
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
                          {subj.trend === 'steady' && <span className="text-white/40 flex items-center"><Minus size={11} className="mr-0.5" /> Steady</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signals */}
              <div className="mt-6">
                <p className="serenity-label text-[#c3f340] text-[9px] mb-3">Explainable Signals</p>
                <div className="space-y-2.5">
                  {inspectedSession.academics.insights.map((ins, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-4 ${
                        ins.tone === 'watch'
                          ? 'border-[rgba(229,162,125,.3)] bg-[rgba(229,162,125,.04)]'
                          : 'border-white/[0.08] bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {ins.tone === 'watch' ? (
                            <AlertTriangle size={14} className="text-[#e5a27d]" />
                          ) : (
                            <Sparkles size={14} className="text-[#c3f340]" />
                          )}
                          <h4 className="text-sm font-semibold text-white">{ins.title}</h4>
                        </div>
                        <span className="serenity-label text-[8px] text-white/35">{ins.certainty}</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-white/60">{ins.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {ins.contributingFactors.map((f, fi) => (
                          <span
                            key={fi}
                            className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/50 border border-white/[0.05]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student reflection */}
              {inspectedSession.academics.recentCheckIn.reflection && (
                <div className="mt-6 rounded-lg border border-white/[0.08] bg-[#141414] p-4">
                  <p className="serenity-label text-white/40 text-[9px] mb-1.5">
                    Student Reflection ({inspectedSession.academics.recentCheckIn.date})
                  </p>
                  <p className="text-xs italic leading-relaxed text-white/75">
                    &ldquo;{inspectedSession.academics.recentCheckIn.reflection}&rdquo;
                  </p>
                </div>
              )}

              {/* Counsellor notes */}
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <p className="serenity-label text-[#c3f340] text-[9px] mb-3">Confidential Counsellor Notes</p>
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
                    placeholder="Add follow-up notes..."
                    className="flex-1 rounded border border-white/[0.09] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#c3f340]/50"
                  />
                  <button
                    type="submit"
                    disabled={addNoteMutation.isPending || !newNoteText.trim()}
                    className="btn-sweep rounded border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0d1408] disabled:opacity-40"
                  >
                    {addNoteMutation.isPending ? 'Saving...' : 'Add note'}
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


