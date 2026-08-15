'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Bell, ShieldCheck, Info } from 'lucide-react';
import { getPreferences, savePreferences } from '@/lib/api/preferences';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ConsentPreference } from '@/lib/types';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: preferences } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const [prefs, setPrefs] = useState<ConsentPreference[]>([]);
  const [saved, setSaved] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);

  // Sync prefs when data loads
  useEffect(() => {
    if (preferences && prefs.length === 0) {
      setPrefs(preferences.map((p) => ({ ...p })));
    }
  }, [preferences]);

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

        <div className="grid grid-cols-[1.4fr_.6fr] gap-3">
          {/* Privacy panel */}
          <section className="border border-white/[0.09] bg-[hsl(var(--card))]">
            <div className="border-b border-white/[0.08] px-8 py-7">
              <div className="flex items-start gap-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center border border-white/[0.09] text-[#b9d96b]">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h2 className="font-display text-3xl">Privacy & consent</h2>
                  <p className="mt-2 max-w-lg text-xs leading-5 text-white/45">
                    These controls shape your personal Nivara experience. Nothing is shared with counsellors unless you choose to share it.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {prefs.map((p) => (
                <div
                  key={p.key}
                  className="flex items-center justify-between gap-6 px-8 py-5"
                  data-testid={`row-preference-${p.key}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="mt-1 max-w-md text-xs leading-5 text-white/40">{p.description}</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={p.enabled}
                    onClick={() => toggle(p.key)}
                    data-testid={`switch-preference-${p.key}`}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-out ${
                      p.enabled ? 'bg-[#c3f340]' : 'bg-white/[0.12]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                        p.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-white/[0.08] px-8 py-5">
              <button
                onClick={() => saveMutation.mutate(prefs)}
                disabled={saveMutation.isPending}
                data-testid="button-settings-save"
                className="btn-sweep border border-[#c3f340]/30 bg-[#141414] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408] disabled:opacity-40"
              >
                {saveMutation.isPending ? 'Saving...' : 'Save privacy choices'}
              </button>
              {saved && (
                <span className="text-[11px] font-bold text-[#c3f340]">✓ Saved</span>
              )}
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-3">
            <div className="border border-white/[0.09] bg-[#141414] p-7">
              <div className="mb-4 flex items-center justify-between">
                <Bell size={18} className="text-[#b9d96b]" />
                <button
                  onClick={() => setNotificationsOn((v) => !v)}
                  role="switch"
                  aria-checked={notificationsOn}
                  className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                    notificationsOn ? 'bg-[#c3f340]' : 'bg-white/[0.12]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      notificationsOn ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <h3 className="font-display text-xl">Notifications</h3>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Gentle reminders about check-ins and upcoming work. Adjust anytime.
              </p>
              {notificationsOn && (
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[.08em] text-[#b9d96b]">
                  ● Active
                </p>
              )}
            </div>

            <div className="border border-white/[0.09] bg-[hsl(var(--card))] p-7">
              <div className="mb-4 flex items-center gap-2">
                <Info size={16} className="text-white/30" />
                <h3 className="font-display text-xl">About</h3>
              </div>
              <p className="text-xs leading-5 text-white/40">
                This is a frontend prototype demonstrating the Nivara experience. Mock data is used throughout.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
