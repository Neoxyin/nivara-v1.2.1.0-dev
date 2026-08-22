'use client';

import dynamicImport from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { RingProgress } from '@/components/dashboard/ring-progress';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { TimetableSection } from '@/components/academics/timetable-section';
import {
  getTrendData,
  getDeadlines,
  getAcademicMetrics,
  getAttendanceSummary,
  getAcademicSuggestions,
} from '@/lib/api/academics';
import { useQuery } from '@tanstack/react-query';
import { getPreferences } from '@/lib/api/preferences';
import { AcademicSupportSection } from '@/components/academics/academic-support-section';
import { LockKeyhole } from 'lucide-react';

import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock3,
  Sparkles,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  ArrowUpRight,
  GraduationCap,
  Activity,
  Calendar,
} from 'lucide-react';

const TrendChart = dynamicImport(
  () => import('@/components/dashboard/trend-chart').then((mod) => mod.TrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-md bg-white/[0.025]" aria-hidden="true" />
    ),
  }
);

export default function AcademicsPage() {
  const [range, setRange] = useState('6 weeks');
  const [activeTab, setActiveTab] = useState<'all' | 'schedule' | 'modules' | 'deadlines'>('all');

  const { data: preferences } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const hasAcademicConsent = preferences?.find((p) => p.key === 'academic_data')?.enabled ?? false;

  const { data: trendData } = useQuery({ queryKey: ['trendData'], queryFn: getTrendData, enabled: hasAcademicConsent });
  const { data: deadlines } = useQuery({ queryKey: ['deadlines'], queryFn: getDeadlines, enabled: hasAcademicConsent });
  const { data: metrics } = useQuery({ queryKey: ['academicMetrics'], queryFn: getAcademicMetrics, enabled: hasAcademicConsent });
  const { data: attendanceSummary } = useQuery({
    queryKey: ['attendanceSummary'],
    queryFn: getAttendanceSummary,
    enabled: hasAcademicConsent
  });
  const { data: suggestions } = useQuery({
    queryKey: ['academicSuggestions'],
    queryFn: getAcademicSuggestions,
    enabled: hasAcademicConsent
  });

  const overallAttendance = attendanceSummary?.overallPercentage ?? 92.5;

  return (
    <AppShell>
      <div className="rise-in space-y-8">
        {/* Page Header */}
        <SectionHeading
          eyebrow="Academic rhythm · Continuous tracking"
          title="Academics, Schedule & Attendance."
          description="A transparent view of course timetable, verified attendance records, module workload, and actionable pacing suggestions — without stress or surveillance."
          action={
            <div className="flex items-center gap-2">
              <div className="flex border border-white/[0.09] bg-white/[0.02] p-1 rounded-md backdrop-blur-md">
                {['6 weeks', 'This term'].map((x) => (
                  <button
                    key={x}
                    onClick={() => setRange(x)}
                    data-testid={`button-academic-range-${x}`}
                    className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] transition-all duration-200 rounded ${
                      range === x
                        ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.4)]'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
          }
        />

        {hasAcademicConsent ? (
          <>
            {/* Primary Trend & Attendance Summary Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_.7fr]">
              {/* Academic & Well-being Chart */}
              <TiltCard
                maxTilt={2}
                className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-6 sm:p-7 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="serenity-label text-white/40">Continuous record</p>
                    <h2 className="mt-1 font-display text-2xl sm:text-3xl text-white">
                      {range} rhythm curve
                    </h2>
                  </div>
                  <Pill tone="accent">Pacing Signals</Pill>
                </div>
                <div className="mt-6 h-[260px]">
                  <TrendChart data={trendData || []} height={260} showYAxis filled />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/[0.07] pt-3 text-[11px] text-white/50">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#c3f340]" /> Academic velocity
                    <span className="ml-3 h-2 w-2 rounded-full bg-[#e5a27d]" /> Well-being index
                  </span>
                  <span className="text-white/40">Updated after each daily 1-min reflection</span>
                </div>
              </TiltCard>

              {/* Dedicated Attendance Standing Card */}
              <TiltCard
                maxTilt={3}
                spotlightColor="rgba(195, 243, 64, 0.15)"
                className="flex flex-col justify-between border border-white/[0.08] bg-[#141414]/90 p-6 sm:p-7 text-white backdrop-blur-xl rounded-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className="serenity-label text-[#9eaa9f]">Attendance standing</p>
                    <Pill tone={overallAttendance >= 85 ? 'accent' : 'warm'}>
                      {attendanceSummary?.standing ? 'Verified' : 'Active'}
                    </Pill>
                  </div>

                  <div className="mt-6 flex items-center gap-5">
                    <RingProgress value={Math.round(overallAttendance)} label="attend" />
                    <div>
                      <p className="font-display text-3xl sm:text-4xl text-white">
                        {overallAttendance}%
                      </p>
                      <p className="mt-1 text-xs text-[#c3f340] font-semibold">
                        {attendanceSummary?.totalAttended ?? 56} of {attendanceSummary?.totalScheduled ?? 60} sessions
                      </p>
                    </div>
                  </div>

                  {/* Threshold progress indicator */}
                  <div className="mt-6 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-wider">
                      <span>Policy Minimum: 80%</span>
                      <span className="text-[#c3f340] font-bold">+12.5% buffer</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#88d49e] to-[#c3f340]"
                        style={{ width: `${overallAttendance}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.07] pt-4 grid grid-cols-2 gap-3 text-left">
                  <div>
                    <p className="serenity-label text-white/40">Active Modules</p>
                    <p className="mt-0.5 font-display text-xl text-white">4 subjects</p>
                  </div>
                  <div>
                    <p className="serenity-label text-white/40">Timetable Status</p>
                    <p className="mt-0.5 font-display text-xl text-[#c3f340]">Synced & Active</p>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Timetable & Schedule Upload Section */}
            <TimetableSection />

            {/* Actionable Suggestions & Early Pacing Alerts */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#c3f340]" />
                  <h3 className="font-display text-xl text-white">Actionable Pacing & Attendance Suggestions</h3>
                </div>
                <span className="text-[10px] uppercase tracking-[.14em] text-white/40">
                  Continuous Intelligence
                </span>
              </div>

              <StaggerContainer stagger={0.06} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {suggestions?.map((item) => (
                  <div key={item.id} className="stagger-item">
                    <TiltCard
                      maxTilt={2}
                      className={`h-full flex flex-col justify-between border p-5 backdrop-blur-xl rounded-xl transition-all ${
                        item.tone === 'warm'
                          ? 'border-amber-400/30 bg-amber-400/[0.03] hover:border-amber-400/50'
                          : item.tone === 'plum'
                          ? 'border-[#c9b8df]/30 bg-[#c9b8df]/[0.03] hover:border-[#c9b8df]/50'
                          : 'border-[#c3f340]/30 bg-[#c3f340]/[0.03] hover:border-[#c3f340]/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <Pill tone={item.tone}>{item.category}</Pill>
                          <span className="text-[10px] text-white/40 font-mono">{item.impact}</span>
                        </div>

                        <h4 className="mt-3 font-semibold text-white text-sm leading-snug">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed text-white/60">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.08]">
                        <Link
                          href={item.actionHref}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#c3f340] hover:underline"
                        >
                          {item.actionText} <ArrowUpRight size={12} />
                        </Link>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </StaggerContainer>
            </div>

            {/* Module-by-Module Attendance & Academic Records */}
            <div id="modules">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#c3f340]" />
                  <h3 className="font-display text-xl text-white">Module Attendance & Coursework Records</h3>
                </div>
                <span className="text-[10px] uppercase tracking-[.14em] text-white/40">
                  4 Enrolled Courses
                </span>
              </div>

              <StaggerContainer stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metrics?.map((metric, i) => (
                  <div key={metric.subject} className="stagger-item">
                    <TiltCard
                      maxTilt={2}
                      className="h-full flex flex-col justify-between border border-white/[0.09] bg-[hsl(var(--card))]/90 p-5 sm:p-6 backdrop-blur-xl rounded-xl transition-all hover:border-white/20"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono-ui text-[10px] uppercase tracking-wider text-white/40">
                                {metric.moduleCode || `MOD-0${i + 1}`}
                              </span>
                              <Pill tone={metric.attendance >= 90 ? 'accent' : 'warm'}>
                                {metric.attendance}% Attendance
                              </Pill>
                            </div>
                            <h4 className="mt-1 font-semibold text-white text-base">
                              {metric.subject}
                            </h4>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] uppercase tracking-wider text-white/40">Workload</span>
                            <p className={`font-mono-ui text-sm font-bold ${
                              metric.workload > 75 ? 'text-amber-400' : 'text-[#c3f340]'
                            }`}>
                              {metric.workload}%
                            </p>
                          </div>
                        </div>

                        {/* Attendance Bar */}
                        <div className="mt-4 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-white/60">
                            <span>Attended: {metric.attendedSessions ?? Math.round(metric.attendance * 0.16)}/{metric.totalSessions ?? 16} Sessions</span>
                            <span className="font-mono text-[10px] text-white/40">
                              {metric.trend === 'up' ? '↗ Improving' : metric.trend === 'down' ? '↘ Watch' : '→ Stable'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                            <div
                              className={`h-full rounded-full ${
                                metric.attendance >= 90 ? 'bg-[#c3f340]' : 'bg-amber-400'
                              }`}
                              style={{ width: `${metric.attendance}%` }}
                            />
                          </div>
                        </div>

                        {/* Suggestion / Context note */}
                        {metric.suggestion && (
                          <p className="mt-3 text-xs leading-relaxed text-white/55 bg-white/[0.02] p-2.5 rounded border border-white/[0.06]">
                            {metric.suggestion}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-[10px] text-white/45">
                        <span>Next: {metric.nextSession || 'Check schedule'}</span>
                        <span className="font-mono text-[#c3f340]">Score: {metric.score}/100</span>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </StaggerContainer>
            </div>

            {/* Upcoming Deadlines */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Clock3 size={15} className="text-[#c3f340]" />
                <h3 className="font-display text-xl text-white">Upcoming Coursework Milestones</h3>
                <span className="h-px flex-1 bg-white/[0.07]" />
              </div>

              <StaggerContainer stagger={0.05} className="space-y-2.5">
                {deadlines?.map((deadline, i) => (
                  <div key={i} className="stagger-item">
                    <TiltCard
                      maxTilt={2}
                      className="flex items-center justify-between border border-white/[0.09] bg-[hsl(var(--card))]/90 px-6 py-4 backdrop-blur-xl transition-all hover:border-white/20 rounded-xl"
                      data-testid={`row-deadline-${i}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="grid h-8 w-8 place-items-center rounded bg-white/[0.04] border border-white/[0.08] text-white/60">
                          <CalendarCheck size={15} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{deadline.title}</p>
                          <p className="mt-0.5 text-xs text-white/40">{deadline.subject}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="serenity-label text-white/50">{deadline.date}</p>
                        <Pill tone={deadline.priority === 'high' ? 'warm' : 'default'}>
                          {deadline.priority}
                        </Pill>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </>
        ) : (
          <TiltCard maxTilt={2} className="border border-[rgba(255,255,255,.09)] bg-[#151515]/95 p-12 backdrop-blur-2xl text-center">
            <LockKeyhole size={32} className="mx-auto text-white/30" />
            <h2 className="mt-6 font-display text-3xl text-white">Academic Data is Private</h2>
            <p className="mt-4 text-sm text-white/55 max-w-md mx-auto">
              You have chosen not to share academic metrics (attendance, grades, coursework pacing). Nivara respects this boundary.
              <br /><br />
              Institutional academic support resources (below) remain fully accessible to you regardless of your privacy settings.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/settings" className="inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors rounded">
                Update Settings
              </Link>
            </div>
          </TiltCard>
        )}

        <AcademicSupportSection />

      </div>
    </AppShell>
  );
}


