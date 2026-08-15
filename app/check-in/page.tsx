'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import gsap from 'gsap';
import { AppShell } from '@/components/layout/nivara-shell';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { TextReveal } from '@/components/ui/text-reveal';
import { submitCheckIn } from '@/lib/api/checkins';

const prompts = [
  { key: 'mood',      title: 'How are you arriving today?',           hint: 'No right answer. Just a snapshot.' },
  { key: 'energy',    title: 'How much energy do you have?',          hint: 'Think about what feels available, not what you wish you had.' },
  { key: 'stress',    title: 'How loud is your stress right now?',    hint: 'This helps us keep suggestions realistic.' },
  { key: 'sleep',     title: 'How did sleep feel recently?',          hint: 'A rough estimate is plenty.' },
  { key: 'workload',  title: 'How full does your academic plate feel?', hint: 'Include the things you are carrying in your head.' },
] as const;

type FormKey = typeof prompts[number]['key'];

const labels: Record<number, Record<FormKey, string>> = {
  1: { mood: 'Rough', energy: 'Drained', stress: 'Quiet', sleep: 'Poor', workload: 'Light' },
  3: { mood: 'Okay', energy: 'Moderate', stress: 'Present', sleep: 'Okay', workload: 'Manageable' },
  5: { mood: 'Great', energy: 'High', stress: 'Loud', sleep: 'Good', workload: 'Heavy' },
};

export default function CheckInPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Record<FormKey, number> & { reflection: string }>({
    mood: 3, energy: 2, stress: 3, sleep: 2, workload: 4, reflection: '',
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const submit = async () => {
    await submitCheckIn(form);
    setSubmitted(true);
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
            <div className="mt-10 flex gap-4">
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
                className="btn-sweep border border-[#c3f340]/30 bg-[#141414] px-6 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors hover:text-[#0d1408] hover:border-[#c3f340]"
              >
                Next →
              </button>
            </Magnetic>
          ) : (
            <Magnetic>
              <button
                onClick={submit}
                className="btn-sweep border border-[#c3f340] bg-[#c3f340] px-6 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.4)] transition-all hover:scale-105"
              >
                Save check-in
              </button>
            </Magnetic>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
