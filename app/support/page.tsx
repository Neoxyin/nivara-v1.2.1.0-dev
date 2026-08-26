'use client';

import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { Magnetic } from '@/components/ui/magnetic';
import Link from 'next/link';
import { 
  UsersRound, 
  Compass, 
  Users, 
  Clock, 
  ArrowUpRight,
  LockKeyhole,
  HeartPulse
} from 'lucide-react';
import { SupportMatching } from '@/components/shared/support-matching';
import { SupportRecommendations } from '@/components/shared/support-recommendations';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getPreferences } from '@/lib/api/preferences';
import { getCheckIns } from '@/lib/api/checkins';
import { getSupportNeedProfile } from '@/lib/api/support-needs';
import { SupportNeedProfile } from '@/components/shared/support-need-profile';

export default function SupportPage() {
  const { data: preferences, isLoading: prefsLoading } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const hasConsent = preferences?.find((p) => p.key === 'wellbeing_checkins')?.enabled ?? false;

  const { data: checkIns, isLoading: checkInsLoading } = useQuery({ 
    queryKey: ['checkIns'], 
    queryFn: getCheckIns,
    enabled: hasConsent
  });

  const latestCheckIn = checkIns?.[0];
  const { data: supportNeeds, isLoading: needsLoading } = useQuery({ 
    queryKey: ['support-needs', preferences], 
    queryFn: () => getSupportNeedProfile('default') 
  });
  const consentCount = preferences?.filter((p) => p.enabled).length ?? 0;
  const availability = consentCount === 0 ? 'ZERO_DATA' : consentCount < 3 ? 'LIMITED' : 'FULL';

  const [dismissedStaleNotice, setDismissedStaleNotice] = useState(false);
  const [permanentlyDismissed, setPermanentlyDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('nivara_dismiss_stale_notice') === 'true') {
        setPermanentlyDismissed(true);
      }
    } catch {}
  }, []);

  const hasStaleDimension = Boolean(
    supportNeeds && (
      supportNeeds.academic?.stale ||
      supportNeeds.financial?.stale ||
      supportNeeds.wellbeing?.stale
    )
  );

  const showStaleNotice = hasStaleDimension && !dismissedStaleNotice && !permanentlyDismissed;

  useEffect(() => { 
    if (!supportNeeds || typeof window === 'undefined') return; 
    try { 
      const key = 'nivara_assessment_history'; 
      const existing = JSON.parse(localStorage.getItem(key) || '[]'); 
      const signature = JSON.stringify(supportNeeds); 
      const isStale = Boolean(supportNeeds.academic?.stale || supportNeeds.financial?.stale || supportNeeds.wellbeing?.stale);
      if (!existing.some((x: any) => x.signature === signature)) { 
        const item = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          availability,
          dimensions: supportNeeds,
          sourcePermissions: preferences?.filter(p => p.enabled).map(p => p.key) || [],
          stale: isStale,
          signature
        }; 
        localStorage.setItem(key, JSON.stringify([item, ...existing].slice(0, 20))); 
        localStorage.setItem('nivara_current_support_assessment', JSON.stringify(item)); 
      } 
    } catch {} 
  }, [supportNeeds, availability, preferences]);

  const handleDismissStaleNoticePermanently = () => {
    try {
      localStorage.setItem('nivara_dismiss_stale_notice', 'true');
    } catch {}
    setPermanentlyDismissed(true);
  };

  return (
    <AppShell>
      <div className="rise-in space-y-8">
        <SectionHeading
          eyebrow="Support Navigation"
          title="Well-being & Connection"
          description="Explore resources, talk to a counsellor, or find community support. You are in control of how you use these services."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {showStaleNotice && (
            <div className="lg:col-span-3">
              <TiltCard maxTilt={1} className="border border-amber-300/25 bg-amber-400/[0.03] p-5 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.12em] text-amber-200">
                      Earlier assessment notice
                    </p>
                    <h3 className="mt-1 font-display text-lg text-white">
                      Retained historical assessment
                    </h3>
                    <p className="mt-1 max-w-2xl text-xs leading-5 text-white/60">
                      One or more dimensions of your Support Need Profile reflect an earlier assessment kept after permission withdrawal. New data will not be used to update these results.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setDismissedStaleNotice(true)}
                      className="rounded border border-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/70 hover:text-white transition-colors"
                    >
                      Remind me later
                    </button>
                    <button
                      type="button"
                      onClick={handleDismissStaleNoticePermanently}
                      className="rounded border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold text-amber-100 hover:bg-amber-300/20 transition-colors"
                    >
                      Don’t ask again
                    </button>
                  </div>
                </div>
              </TiltCard>
            </div>
          )}

          <div className="lg:col-span-3">
            {availability === 'ZERO_DATA' ? (
              <TiltCard maxTilt={1} className="border border-white/[0.08] bg-[#141414]/90 p-6 rounded-xl"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#c3f340]">Support Need Profile</p><h2 className="mt-2 font-display text-3xl text-white">NIVARA is here when you need it.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Without permitted optional data, NIVARA cannot assess individual support needs. You can still explore general support without sharing anything.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/settings" className="rounded border border-[#c3f340]/30 bg-[#c3f340]/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#dff77d]">Choose what I’d like to share</Link><a href="#support-options" className="rounded border border-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-white/60">Explore all support</a></div></TiltCard>
            ) : availability === 'LIMITED' ? (
              <TiltCard maxTilt={1} className="border border-amber-300/15 bg-[#141414]/90 p-6 rounded-xl"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-amber-200">Limited assessment</p><h2 className="mt-2 font-display text-3xl text-white">Your assessment uses only the information you’ve chosen to share.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">You can evaluate with available data or allow more data for a fuller assessment. Sharing more is optional.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/support/history" className="rounded border border-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-white/60">Assessment History</Link><button className="rounded border border-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-white/70">Evaluate using available data</button><Link href="/settings" className="rounded border border-[#c3f340]/30 bg-[#c3f340]/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#dff77d]">Improve this assessment</Link></div></TiltCard>
            ) : null}
          </div>
          <div className="lg:col-span-3">{!needsLoading && <SupportNeedProfile data={supportNeeds} />}</div>
          <div className="lg:col-span-2 space-y-6">
            
            {/* The main grid of Support Options */}
            <StaggerContainer stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Counsellors */}
              <div className="stagger-item">
                <TiltCard maxTilt={2} className="h-full flex flex-col border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl transition-all hover:border-white/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-[rgba(195,243,64,.1)] text-[#c3f340] border border-[#c3f340]/20">
                      <UsersRound size={18} />
                    </div>
                    <h4 className="font-semibold text-white">Counsellors</h4>
                  </div>
                  <p className="flex-1 text-sm text-white/70 leading-relaxed">
                    Book a confidential 1-on-1 session with a campus counsellor. Available for academic pacing, well-being, or general support.
                  </p>
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <Magnetic>
                      <Link href="/counsellors" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#c3f340] hover:text-[#dff77d] transition-colors">
                        View Counsellors <ArrowUpRight size={13} />
                      </Link>
                    </Magnetic>
                  </div>
                </TiltCard>
              </div>

              {/* Resources */}
              <div className="stagger-item">
                <TiltCard maxTilt={2} className="h-full flex flex-col border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl transition-all hover:border-white/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-[rgba(195,243,64,.1)] text-[#c3f340] border border-[#c3f340]/20">
                      <Compass size={18} />
                    </div>
                    <h4 className="font-semibold text-white">Well-being Resources</h4>
                  </div>
                  <p className="flex-1 text-sm text-white/70 leading-relaxed">
                    Self-guided reading, interactive guides, and tools designed to help you manage stress and build academic resilience.
                  </p>
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <Magnetic>
                      <Link href="/resources" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#c3f340] hover:text-[#dff77d] transition-colors">
                        Browse Resources <ArrowUpRight size={13} />
                      </Link>
                    </Magnetic>
                  </div>
                </TiltCard>
              </div>

            </StaggerContainer>
          </div>

          <div className="space-y-6">
            {/* Sidebar Context */}
            {prefsLoading || checkInsLoading ? (
               <div className="h-48 border border-white/[0.05] bg-white/[0.02] rounded-xl animate-pulse" />
            ) : hasConsent ? (
              <TiltCard maxTilt={2} className="border border-[rgba(195,243,64,0.15)] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <HeartPulse size={16} className="text-[#c3f340]" />
                  <h3 className="font-semibold text-white text-sm">Well-being Context</h3>
                </div>
                {latestCheckIn ? (
                  <div>
                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                      Your recent check-in on <strong className="text-white">{latestCheckIn.date}</strong> can help guide which support you might need today.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                       <div className="bg-white/[0.03] rounded p-2 text-center border border-white/[0.05]">
                         <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Stress</div>
                         <div className="text-sm font-semibold text-white">{latestCheckIn.stress} / 5</div>
                       </div>
                       <div className="bg-white/[0.03] rounded p-2 text-center border border-white/[0.05]">
                         <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Energy</div>
                         <div className="text-sm font-semibold text-white">{latestCheckIn.energy} / 5</div>
                       </div>
                    </div>
                    {latestCheckIn.reflection && (
                       <div className="bg-white/[0.02] p-3 rounded border border-white/[0.04] text-xs text-white/60 italic">
                         &quot;{latestCheckIn.reflection}&quot;
                       </div>
                    )}
                    <div className="mt-5 pt-4 border-t border-white/[0.06]">
                      <Link href="/check-in/history" className="text-[10px] font-bold uppercase tracking-[.08em] text-[#c3f340] hover:underline flex items-center gap-1">
                        View History <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                      You haven&apos;t completed any check-ins yet. Doing so can help you map your well-being over time.
                    </p>
                    <Link href="/check-in" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#0d1408] bg-[#c3f340] px-3 py-1.5 rounded transition-all hover:scale-105">
                      Check in now
                    </Link>
                  </div>
                )}
              </TiltCard>
            ) : (
              <TiltCard maxTilt={1} className="border border-white/[0.05] bg-white/[0.02] p-6 rounded-xl">
                 <div className="flex items-center gap-2 mb-3">
                   <LockKeyhole size={16} className="text-white/40" />
                   <h3 className="font-semibold text-white/60 text-sm">Well-being Context Hidden</h3>
                 </div>
                 <p className="text-xs text-white/40 leading-relaxed mb-4">
                   You have not provided consent for well-being check-ins. Your support choices remain completely private and independent of any metrics.
                 </p>
                 <Link href="/settings" className="text-[10px] font-bold uppercase tracking-[.08em] text-white/50 hover:text-white border border-white/10 px-3 py-1.5 rounded inline-block transition-colors">
                    Update Settings
                 </Link>
              </TiltCard>
            )}

            {/* Follow up card */}
            <TiltCard maxTilt={2} className="border border-white/[0.05] bg-[#141414]/80 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-white/50" />
                <h3 className="font-semibold text-white/80 text-sm">Need Follow-up?</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                If you previously met with a counsellor or used a resource and want to provide feedback or schedule a follow-up, you can manage that here.
              </p>
              <button disabled className="text-[10px] font-bold uppercase tracking-[.08em] text-white/30 border border-white/5 px-3 py-1.5 rounded cursor-not-allowed">
                No active follow-ups
              </button>
            </TiltCard>
          </div>
        </div>

        <div id="support-options" />
        {/* Modular Support Matching Section */}
        <div className="pt-6 border-t border-white/[0.08] space-y-12">
          <SupportMatching />
          <SupportRecommendations />
        </div>
      </div>
    </AppShell>
  );
}
