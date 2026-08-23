'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { Bell, ShieldCheck, Info, LogOut } from 'lucide-react';
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

  // Sync prefs when data loads
  useEffect(() => {
    if (preferences && prefs.length === 0) {
      setPrefs(preferences.map((p) => ({ ...p })));
    }
  }, [preferences, prefs.length]);

  const toggle = (key: string) => {
    setPrefs((p) => p.map((x) => (x.key === key ? { ...x, enabled: !x.enabled } : x)));
    setSaved(false);
  };

  const saveMutation = useMutation({
    mutationFn: savePreferences,
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <AppShell>
      <div className="rise-in">
        <SectionHeading
          eyebrow="Settings"
          title="Your choices, clearly."
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
                  </div>
                  <button
                    role="switch"
                    aria-checked={p.enabled}
                    disabled={p.required}
                    onClick={() => !p.required && toggle(p.key)}
                    data-testid={`switch-preference-${p.key}`}
                    className={`relative inline-flex h-6 w-11 shrink-0 ${p.required ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} items-center rounded-full transition-colors duration-200 ease-out focus:outline-none ${
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
                      notificationsOn ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <h3 className="font-display text-xl text-white">Notifications</h3>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Gentle reminders about check-ins and upcoming work. Adjust anytime.
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
                    localStorage.removeItem('nivara_student_onboarding_completed');
                    window.location.reload();
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
    </AppShell>
  );
}


