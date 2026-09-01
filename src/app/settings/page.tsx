'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { Bell, ShieldCheck, Info, LogOut, ChevronRight } from 'lucide-react';
import { getPreferences, savePreferences } from '@/lib/api/preferences';
import { logoutUser } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ConsentPreference } from '@/lib/types';

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: preferences, isLoading, isError } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const [prefs, setPrefs] = useState<ConsentPreference[]>([]);
  const [saved, setSaved] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [pendingOff, setPendingOff] = useState<ConsentPreference | null>(null);
  const [keepStale, setKeepStale] = useState(true);

  // Sync prefs when data loads
  useEffect(() => {
    if (preferences) {
      setPrefs(preferences.map((p) => ({ ...p })));
    }
  }, [preferences]);

  const openWithdrawalModal = (pref: ConsentPreference) => {
    try {
      const withdrawals = JSON.parse(localStorage.getItem('nivara_withdrawals') || '{}');
      const existing = withdrawals[pref.key]?.keepStale;
      setKeepStale(typeof existing === 'boolean' ? existing : true);
    } catch {
      setKeepStale(true);
    }
    setPendingOff(pref);
  };

  const toggle = (key: string) => {
    const current = prefs.find((x) => x.key === key);
    if (!current) return;
    if (current.enabled) {
      openWithdrawalModal(current);
      return;
    }
    const nextPrefs = prefs.map((x) => (x.key === key ? { ...x, enabled: true, status: 'CONSENTED' as const } : x));
    setPrefs(nextPrefs);
    try {
      const withdrawals = JSON.parse(localStorage.getItem('nivara_withdrawals') || '{}');
      delete withdrawals[key];
      localStorage.setItem('nivara_withdrawals', JSON.stringify(withdrawals));
    } catch {}
    setSaved(false);
    saveMutation.mutate(nextPrefs);
  };

  const confirmTurnOff = () => {
    if (!pendingOff) return;
    const key = pendingOff.key;
    const nextPrefs = prefs.map((x) => (x.key === key ? { ...x, enabled: false, status: 'WITHDRAWN' as const } : x));
    setPrefs(nextPrefs);
    try {
      const withdrawals = JSON.parse(localStorage.getItem('nivara_withdrawals') || '{}');
      withdrawals[key] = { keepStale: Boolean(keepStale), at: new Date().toISOString() };
      localStorage.setItem('nivara_withdrawals', JSON.stringify(withdrawals));
      
      if (!keepStale) {
        localStorage.removeItem('nivara_current_support_assessment');
      }
    } catch {}
    setPendingOff(null);
    setSaved(false);
    saveMutation.mutate(nextPrefs);
  };

  const saveMutation = useMutation({
    mutationFn: savePreferences,
    onSuccess: (updatedData) => {
      setSaved(true);
      queryClient.setQueryData(['preferences'], updatedData);
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      queryClient.invalidateQueries({ queryKey: ['support-needs'] });
      queryClient.invalidateQueries({ queryKey: ['financialSupport'] });
      queryClient.invalidateQueries({ queryKey: ['checkIns'] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <AppShell>
      <div className="rise-in space-y-8">
        <SectionHeading
          eyebrow="Settings"
          title="Control your data permissions and privacy preferences."
          description="Nivara should be useful without asking for more than it needs. Change these choices at any time."
        />

        <div className="grid grid-cols-[1.4fr_.6fr] gap-4">
          {/* Privacy panel */}
          <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 backdrop-blur-xl">
            <div className="border-b border-white/[0.08] px-8 py-7">
              <div className="flex items-start gap-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center border border-white/[0.09] text-[#b9d96b] rounded">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-white">Privacy & consent</h2>
                  <p className="mt-2 max-w-lg text-xs leading-5 text-white/45">
                    These controls shape your personal Nivara experience. Nothing is shared with counsellors unless you choose to share it.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c3f340]" />
                </div>
              ) : isError ? (
                <div className="p-8 text-sm text-rose-400">
                  Failed to load preferences.
                </div>
              ) : (
                prefs.map((p) => (
                  <div
                    key={p.key}
                    className="flex items-center justify-between gap-6 px-8 py-5 transition-colors hover:bg-white/[0.01]"
                    data-testid={`row-preference-${p.key}`}
                  >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{p.label}</p>
                    <p className="mt-1 max-w-md text-xs leading-5 text-white/40">{p.description}</p>
                    <div className="mt-2 flex gap-4 text-[10px] font-semibold uppercase tracking-[.08em] text-white/35"><button type="button" className="hover:text-[#c3f340]">Learn more</button><button type="button" onClick={() => p.enabled ? openWithdrawalModal(p) : toggle(p.key)} className="hover:text-[#c3f340]">Manage <ChevronRight size={11} className="inline" /></button></div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={p.enabled}
                    onClick={() => toggle(p.key)}
                    data-testid={`switch-preference-${p.key}`}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-out focus:outline-none ${
                      p.enabled ? 'bg-[#c3f340] shadow-[0_0_12px_rgba(195,243,64,0.4)]' : 'bg-white/[0.12]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                        p.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )))}
            </div>
            
            <div className="px-8 py-4 bg-rose-500/10 border-t border-rose-500/20">
              <p className="text-xs text-rose-300">
                <strong>Note:</strong> This prototype stores preference changes in frontend session state. No backend consent service is connected in this build.
              </p>
            </div>

            <div className="flex items-center gap-4 border-t border-white/[0.08] px-8 py-5">
              <Magnetic>
                <button
                  onClick={() => saveMutation.mutate(prefs)}
                  disabled={saveMutation.isPending}
                  data-testid="button-settings-save"
                  className="btn-sweep border border-[#c3f340]/30 bg-[#141414] px-6 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors hover:text-[#0d1408] hover:border-[#c3f340] disabled:opacity-40 rounded"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save privacy choices'}
                </button>
              </Magnetic>
              {saved && (
                <span className="text-[11px] font-bold text-[#c3f340] drop-shadow-[0_0_8px_#c3f340]">✓ Saved</span>
              )}
              {saveMutation.isError && (
                <span className="text-[11px] font-bold text-rose-400">Failed to save</span>
              )}
            </div>
          </TiltCard>

          {/* Right sidebar */}
          <aside className="space-y-4">
            <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[#141414]/90 p-7 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <Bell size={18} className="text-[#b9d96b]" />
                <button
                  onClick={() => setNotificationsOn((v) => !v)}
                  role="switch"
                  aria-checked={notificationsOn}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-out focus:outline-none ${
                    notificationsOn ? 'bg-[#c3f340] shadow-[0_0_10px_rgba(195,243,64,0.4)]' : 'bg-white/[0.12]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                      notificationsOn ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <h3 className="font-display text-xl text-white">Notifications</h3>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Daily reminder notifications for your 1-minute check-in and upcoming deadlines.
              </p>
              {notificationsOn && (
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[.08em] text-[#b9d96b]">
                  ● Active
                </p>
              )}
            </TiltCard>

            <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-[#c3f340]" />
                  <h3 className="font-display text-xl text-white">Student Tour</h3>
                </div>
              </div>
              <p className="text-xs leading-5 text-white/45">
                Replay the 1-minute guided introduction to Nivara’s privacy, daily check-in, and support tools.
              </p>
              <button
                onClick={() => {
                  try {
                    sessionStorage.setItem('nivara_launch_student_tour', 'true');
                    router.push('/dashboard');
                  } catch {}
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded border border-[#c3f340]/30 bg-[#c3f340]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:bg-[#c3f340]/20 transition-colors"
              >
                Launch 1-Min Tour
              </button>
            </TiltCard>

            <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <LogOut size={16} className="text-[#e5a27d]" />
                <h3 className="font-display text-xl text-white">Session & Role</h3>
              </div>
              <p className="text-xs leading-5 text-white/45">
                Sign out of the Student Workspace to return to the landing page or switch roles.
              </p>
              <button
                onClick={async () => {
                  await logoutUser();
                  router.push('/');
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded border border-[#e5a27d]/30 bg-[#e5a27d]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#f0ba9d] hover:bg-[#e5a27d]/20 transition-colors"
              >
                <LogOut size={12} /> Sign Out
              </button>
            </TiltCard>

            <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <Info size={16} className="text-white/30" />
                <h3 className="font-display text-xl text-white">About</h3>
              </div>
              <p className="text-xs leading-5 text-white/40">
                This is a frontend prototype demonstrating the Nivara experience. Mock data is used throughout.
              </p>
            </TiltCard>
          </aside>
        </div>
      </div>
      {pendingOff && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151515] p-7 shadow-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#c3f340]">Withdraw permission</p>
            <h2 className="mt-2 font-display text-3xl text-white">Turn off {pendingOff.label}?</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">
              {pendingOff.key === 'academic_data' && 'Academic-based personalization will stop using newly withdrawn academic data.'}
              {pendingOff.key === 'financial_support' && 'Financial personalization will stop using the withdrawn fee-status signal.'}
              {pendingOff.key === 'wellbeing_checkins' && 'Well-being-based personalization will stop using newly withdrawn check-in data.'}
              {' '}You can choose what happens to your existing personalized assessment:
            </p>

            <div className="mt-6 space-y-3">
              <div 
                data-testid="option-keep-stale"
                onClick={() => setKeepStale(true)}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  keepStale ? 'border-[#c3f340]/40 bg-[#c3f340]/[0.04]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <input 
                  type="radio" 
                  id="choice-keep-stale"
                  name="withdrawalChoice" 
                  checked={keepStale} 
                  onChange={() => setKeepStale(true)} 
                  className="mt-1 accent-[#c3f340]" 
                />
                <div>
                  <label htmlFor="choice-keep-stale" className="block text-sm font-semibold text-white cursor-pointer">
                    Keep previous result as historical/stale
                  </label>
                  <span className="mt-1 block text-xs leading-5 text-white/45">
                    Your previous assessment remains visible in your Support Need Profile and Assessment History, marked as an earlier assessment that is no longer updated using new data.
                  </span>
                </div>
              </div>

              <div 
                data-testid="option-remove-recalculate"
                onClick={() => setKeepStale(false)}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  !keepStale ? 'border-rose-400/40 bg-rose-400/[0.04]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <input 
                  type="radio" 
                  id="choice-remove-recalculate"
                  name="withdrawalChoice" 
                  checked={!keepStale} 
                  onChange={() => setKeepStale(false)} 
                  className="mt-1 accent-rose-400" 
                />
                <div>
                  <label htmlFor="choice-remove-recalculate" className="block text-sm font-semibold text-white cursor-pointer">
                    Remove / recalculate
                  </label>
                  <span className="mt-1 block text-xs leading-5 text-white/45">
                    Removes the current personalized result. This dimension becomes unavailable in future assessments. Other permitted dimensions continue to evaluate normally.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setPendingOff(null)} 
                data-testid="button-cancel-withdrawal"
                className="rounded border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmTurnOff} 
                data-testid="button-confirm-withdrawal"
                className="rounded border border-[#c3f340] bg-[#c3f340] px-4 py-2.5 text-xs font-bold text-[#0d1408] hover:bg-[#dff77d] transition-colors"
              >
                Confirm withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}


