'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, LockKeyhole, HeartPulse } from 'lucide-react';
import gsap from 'gsap';
import { AppShell } from '@/components/layout/nivara-shell';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { TextReveal } from '@/components/ui/text-reveal';
import { submitCheckIn } from '@/lib/api/checkins';
import { getPreferences } from '@/lib/api/preferences';
import { useQuery } from '@tanstack/react-query';

const prompts = [
  { key: 'mood',      title: 'How are you arriving today?',           hint: 'No right answer. Just a snapshot.' },
  { key: 'energy',    title: 'How much energy do you have?',          hint: 'Think about what feels available, not what you wish you had.' },
  { key: 'stress',    title: 'How loud is your stress right now?',    hint: 'This helps us keep suggestions realistic.' },
  { key: 'sleep',     title: 'How did sleep feel recently?',          hint: 'A rough estimate is plenty.' },
  { key: 'workload',  title: 'How high is your academic pressure?',   hint: 'Include the things you are carrying in your head.' },
] as const;

type FormKey = typeof prompts[number]['key'];

const labels: Record<number, Record<FormKey, string>> = {
  1: { mood: 'Rough', energy: 'Drained', stress: 'Quiet', sleep: 'Poor', workload: 'Light' },
  3: { mood: 'Okay', energy: 'Moderate', stress: 'Present', sleep: 'Okay', workload: 'Manageable' },
  5: { mood: 'Great', energy: 'High', stress: 'Loud', sleep: 'Good', workload: 'Heavy' },
};

export default function CheckInPage() {
  const { data: preferences, isLoading: prefsLoading } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const hasConsent = preferences?.find((p) => p.key === 'wellbeing_checkins')?.enabled ?? false;

  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState<Record<FormKey, number | null> & { reflection: string }>({
    mood: null, energy: null, stress: null, sleep: null, workload: null, reflection: '',
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const submit = async () => {
    if (Object.values(prompts).some((p) => form[p.key] === null)) return;
    try {
      setIsSubmitting(true);
      setSubmitError('');
      // @ts-ignore - we've validated that no values are null
      await submitCheckIn(form);
      setSubmitted(true);
    } catch (e) {
      setSubmitError('Failed to save check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP Step transition effect
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
      );
    }
  }, [step]);

  // GSAP Progress Bar tween
  const progress = ((step + 1) / prompts.length) * 100;
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [progress]);

  if (prefsLoading) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c3f340]" />
        </div>
      </AppShell>
    );
  }

  if (!hasConsent) {
    return (
      <AppShell>
        <div className="rise-in mx-auto max-w-2xl mt-12">
          <TiltCard maxTilt={4} className="border border-[rgba(255,255,255,.09)] bg-[#151515]/95 p-12 backdrop-blur-2xl text-center">
            <LockKeyhole size={32} className="mx-auto text-white/30" />
            <h2 className="mt-6 font-display text-3xl text-white">Check-ins are disabled</h2>
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
      </AppShell>
    );
  }

  if (!hasStarted) {
    return (
      <AppShell>
        <div className="rise-in mx-auto max-w-2xl mt-12">
          <TiltCard maxTilt={2} className="border border-[rgba(255,255,255,.09)] bg-[#151515]/95 p-10 md:p-12 backdrop-blur-2xl">
            <h1 className="font-display text-4xl text-white">Well-being Check-in</h1>
            
            <div className="mt-8 space-y-6 text-sm leading-6 text-white/70">
              <section>
                <h3 className="font-bold text-white mb-1">What is this?</h3>
                <p>A one-minute, 5-question snapshot of your mood, stress, sleep, energy, and academic pressure.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">Why do we ask?</h3>
                <p>To help you notice patterns in your own time, and to give Nivara the context it needs to provide realistic academic guidance.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">How does it support you?</h3>
                <p>It shapes your personal overview and allows Nivara to suggest smaller plans or earlier support options when you are stretched.</p>
              </section>

              <div className="p-5 mt-6 rounded-lg border border-[#c3f340]/20 bg-[rgba(195,243,64,.05)] text-xs text-white/80 space-y-3">
                <p className="flex items-start gap-2">
                  <LockKeyhole size={14} className="mt-0.5 text-[#c3f340] shrink-0" />
                  <span><strong>Voluntary & Consent-based:</strong> You are seeing this because you opted in. You can withdraw consent at any time in your privacy settings.</span>
                </p>
                <p className="flex items-start gap-2">
                  <HeartPulse size={14} className="mt-0.5 text-[#c3f340] shrink-0" />
                  <span><strong>Not a medical diagnosis:</strong> This tool is for self-reflection and academic pacing, not a clinical or medical assessment. No medical labels or risk scores are generated.</span>
                </p>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Magnetic>
                <button
                  onClick={() => setHasStarted(true)}
                  className="btn-sweep border border-[#c3f340] bg-[#c3f340] px-6 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.4)] transition-all hover:scale-105 rounded"
                >
                  Start check-in
                </button>
              </Magnetic>
            </div>
          </TiltCard>
        </div>
      </AppShell>
    );
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="rise-in mx-auto max-w-2xl">
          <TiltCard maxTilt={4} className="border border-[rgba(195,243,64,.25)] bg-[#151515]/95 p-12 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <Pill tone="accent">Check-in saved</Pill>
            <h1 className="mt-8 max-w-lg font-display text-6xl leading-[.88] text-white">
              <TextReveal type="words" duration={0.8}>You made space</TextReveal>
              <br />
              <em className="text-[#c3f340]">to notice.</em>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              That is useful information, not a grade. Based on this snapshot, a smaller plan and an earlier support option may help this week.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  href="/check-in/history"
                  data-testid="link-checkin-summary-history"
                  className="btn-sweep inline-flex items-center gap-2 border border-[#c3f340] bg-[#c3f340] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.35)] transition-all hover:scale-105"
                >
                  View check-in history & trends <ArrowUpRight size={13} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/dashboard"
                  data-testid="link-checkin-summary-dashboard"
                  className="btn-sweep inline-flex items-center gap-2 border border-[#c3f340]/30 bg-[#141414] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408] hover:border-[#c3f340]"
                >
                  See my overview <ArrowUpRight size={13} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/support"
                  data-testid="link-checkin-summary-support"
                  className="inline-flex items-center gap-2 border border-white/[0.14] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-white/70 transition-colors hover:border-white/30 hover:text-white/90"
                >
                  Make a small plan
                </Link>
              </Magnetic>
            </div>
          </TiltCard>
          <p className="mt-5 flex items-center gap-2 text-xs text-white/35">
            <LockKeyhole size={13} /> Your check-in is private to your Nivara space.
          </p>
        </div>
      </AppShell>
    );
  }

  const current = prompts[step];
  const value = form[current.key];

  return (
    <AppShell>
      <div className="rise-in mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="serenity-label text-white/40">One-minute check-in</p>
            <p className="mt-1 text-xs text-white/40">A private snapshot of today</p>
          </div>
          <span className="serenity-label text-white/35">{step + 1} / {prompts.length}</span>
        </div>

        {/* GSAP Animated Progress bar */}
        <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-[#c3f340] shadow-[0_0_10px_#c3f340]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div ref={cardRef}>
          <TiltCard maxTilt={3} className="mt-6 border border-white/[0.09] bg-[hsl(var(--card))]/90 p-8 md:p-9 backdrop-blur-2xl">
            <h1 className="max-w-lg font-display text-4xl md:text-5xl leading-[.94] text-white">
              {current.title}
            </h1>
            <p className="mt-3 text-xs md:text-sm text-white/45">{current.hint}</p>

            <div className="mt-8 grid grid-cols-5 gap-2.5">
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = value === n;
                const labelText = labels[n]?.[current.key] || '';
                return (
                  <Magnetic key={n}>
                    <button
                      onClick={() => setForm((f) => ({ ...f, [current.key]: n }))}
                      data-testid={`button-checkin-${current.key}-${n}`}
                      className={`flex w-full flex-col items-center gap-2.5 border px-2 py-4 rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 ${
                        selected
                          ? 'border-[#c3f340] bg-[rgba(195,243,64,.12)] shadow-[0_0_20px_rgba(195,243,64,0.2)]'
                          : 'border-white/[0.09] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full font-sans font-bold text-sm leading-none transition-all duration-200 select-none ${
                          selected
                            ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_#c3f340]'
                            : 'bg-white/[0.07] text-white/70'
                        }`}
                      >
                        {n}
                      </span>
                      <span className="serenity-label text-[8px] text-center text-white/35 leading-tight">
                        {labelText}
                      </span>
                    </button>
                  </Magnetic>
                );
              })}
            </div>

            {step === prompts.length - 1 && (
              <textarea
                value={form.reflection}
                onChange={(e) => setForm((f) => ({ ...f, reflection: e.target.value }))}
                data-testid="input-checkin-reflection"
                placeholder="Anything you want to remember about today? (optional)"
                className="mt-6 min-h-[85px] w-full resize-none border border-white/[0.09] bg-white/[0.02] p-3.5 text-xs md:text-sm leading-5 text-white/80 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors duration-150 rounded-lg"
              />
            )}
          </TiltCard>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <Magnetic>
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-[11px] font-bold uppercase tracking-[.08em] text-white/35 transition-colors hover:text-white/70"
              >
                ← Back
              </button>
            </Magnetic>
          ) : (
            <span />
          )}
          {step < prompts.length - 1 ? (
            <Magnetic>
              <button
                onClick={() => setStep(step + 1)}
                disabled={value === null}
                className="btn-sweep border border-[#c3f340]/30 bg-[#141414] px-6 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors hover:text-[#0d1408] hover:border-[#c3f340] disabled:opacity-50 disabled:pointer-events-none"
              >
                Next →
              </button>
            </Magnetic>
          ) : (
            <div className="flex items-center gap-3">
              {submitError && <span className="text-xs text-rose-400">{submitError}</span>}
              <Magnetic>
                <button
                  onClick={submit}
                  disabled={isSubmitting || value === null}
                  className="btn-sweep border border-[#c3f340] bg-[#c3f340] px-6 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.4)] transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? 'Saving...' : 'Save check-in'}
                </button>
              </Magnetic>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}


