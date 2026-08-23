'use client';

import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { useQuery } from '@tanstack/react-query';
import { getCheckIns } from '@/lib/api/checkins';
import { getPreferences } from '@/lib/api/preferences';
import { HistoryChart } from '@/components/check-in/history-chart';
import { LockKeyhole, HeartPulse, FileText, Activity } from 'lucide-react';
import Link from 'next/link';
import { Magnetic } from '@/components/ui/magnetic';

import { ContextualSubtabs } from '@/components/shared/contextual-subtabs';

const checkInSubtabs = [
  { labelKey: 'subtab.daily_checkin', defaultLabel: 'Daily Check-in', href: '/check-in', exact: true },
  { labelKey: 'subtab.history', defaultLabel: 'Check-in History', href: '/check-in/history' },
];

export default function CheckInHistoryPage() {
  const { data: preferences, isLoading: prefsLoading, error: prefsError } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const hasConsent = preferences?.find((p) => p.key === 'wellbeing_checkins')?.enabled ?? false;

  const { data: checkIns, isLoading: checkInsLoading, error: checkInsError } = useQuery({ 
    queryKey: ['checkIns'], 
    queryFn: getCheckIns,
    enabled: hasConsent // only fetch if we have consent
  });

  const isLoading = prefsLoading || (hasConsent && checkInsLoading);
  const error = prefsError || checkInsError;

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c3f340]" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="rise-in mx-auto max-w-4xl mt-12 text-center text-rose-400">
          <p>Failed to load data. Please try again later.</p>
        </div>
      </AppShell>
    );
  }

  if (!hasConsent) {
    return (
      <AppShell>
        <div className="rise-in space-y-8">
          <ContextualSubtabs items={checkInSubtabs} />
          <div className="mx-auto max-w-2xl mt-4">
            <TiltCard maxTilt={4} className="border border-[rgba(255,255,255,.09)] bg-[#151515]/95 p-12 backdrop-blur-2xl text-center">
              <LockKeyhole size={32} className="mx-auto text-white/30" />
              <h2 className="mt-6 font-display text-3xl text-white">Check-in History is disabled</h2>
              <p className="mt-4 text-sm text-white/55 max-w-md mx-auto">
                You have chosen not to share well-being check-in data. Nivara respects this boundary. You can change this anytime in your privacy settings.
              </p>
              <div className="mt-8">
                <Link href="/settings" className="inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors rounded">
                  Update Settings
                </Link>
              </div>
            </TiltCard>
          </div>
        </div>
      </AppShell>
    );
  }

  const isEmpty = !checkIns || checkIns.length === 0;

  return (
    <AppShell>
      <div className="rise-in space-y-8">
        <ContextualSubtabs items={checkInSubtabs} />
        <SectionHeading
          eyebrow="History & Trends"
          title="Your well-being over time."
          description="A self-awareness tool to help you reflect on your academic pacing."
          action={
            <Link href="/check-in" className="btn-sweep inline-flex items-center border border-[#c3f340]/30 bg-[#141414] px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408] hover:border-[#c3f340] rounded">
              + New Check-in
            </Link>
          }
        />

        {isEmpty ? (
          <TiltCard maxTilt={2} className="mt-8 border border-white/[0.09] bg-[#151515]/95 p-12 text-center">
            <Activity size={32} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-display text-white mb-2">No check-ins yet</h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
              Start logging your daily check-ins to see your trends over time. This helps you build self-awareness and pacing strategies.
            </p>
            <Magnetic>
              <Link href="/check-in" className="inline-flex items-center gap-2 border border-[#c3f340] bg-[#c3f340] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.1em] text-[#0d1408] transition-all hover:scale-105 rounded shadow-[0_0_15px_rgba(195,243,64,0.3)]">
                Take your first check-in
              </Link>
            </Magnetic>
          </TiltCard>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TiltCard maxTilt={1} className="border border-white/[0.09] bg-[hsl(var(--card))]/95 p-6 backdrop-blur-2xl rounded-lg">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Trend Visualization</h3>
                    <p className="text-xs text-white/50 mt-1 max-w-md">
                      These charts map your self-reported inputs. They are support indicators to help you reflect, not a medical or clinical assessment.
                    </p>
                  </div>
                  <HeartPulse size={18} className="text-[#c3f340]/70" />
                </div>
                <HistoryChart data={checkIns} />
              </TiltCard>
            </div>

            <div className="space-y-4 h-full max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              <h3 className="text-sm font-semibold text-white/80 mb-2 sticky top-0 bg-[hsl(var(--background))] py-2 z-10">
                Previous Logs
              </h3>
              {checkIns.map((entry, i) => (
                <TiltCard key={i} maxTilt={2} className="border border-white/[0.06] bg-white/[0.015] p-5 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-white/90">{entry.date}</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-[10px] text-white/40 mb-1">Mood</div>
                      <div className="text-sm font-semibold text-[#c3f340]">{entry.mood}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-white/40 mb-1">Energy</div>
                      <div className="text-sm font-semibold text-[#e5a27d]">{entry.energy}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-white/40 mb-1">Sleep</div>
                      <div className="text-sm font-semibold text-[#a3b8cc]">{entry.sleep}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-white/40 mb-1">Stress</div>
                      <div className="text-sm font-semibold text-[#eb5e5e]">{entry.stress}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-white/40 mb-1" title="Academic Pressure">Acad.</div>
                      <div className="text-sm font-semibold text-[#b080e6]">{entry.workload}</div>
                    </div>
                  </div>

                  {entry.reflection && (
                    <div className="mt-3 p-3 bg-white/[0.03] rounded border border-white/[0.04]">
                      <div className="flex items-start gap-2 text-xs text-white/70">
                        <FileText size={12} className="mt-0.5 opacity-50 shrink-0" />
                        <span className="leading-relaxed">{entry.reflection}</span>
                      </div>
                    </div>
                  )}
                </TiltCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
