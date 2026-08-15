'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import { AppShell } from '@/components/layout/nivara-shell';
import { Pill } from '@/components/shared/pill';
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

  const submit = async () => {
    await submitCheckIn(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppShell>
        <div className="rise-in mx-auto max-w-2xl">
          <div className="border border-[rgba(195,243,64,.22)] bg-[#151515] p-12">
            <Pill tone="accent">Check-in saved</Pill>
            <h1 className="mt-8 max-w-lg font-display text-6xl leading-[.88]">
              You made space<br />to notice.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              That is useful information, not a grade. Based on this snapshot, a smaller plan and an earlier support option may help this week.
            </p>
            <div className="mt-10 flex gap-3">
              <Link
                href="/dashboard"
                data-testid="link-checkin-summary-dashboard"
                className="btn-sweep inline-flex items-center gap-2 border border-[#c3f340]/30 bg-[#141414] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408]"
              >
                See my overview <ArrowUpRight size={13} />
              </Link>
              <Link
                href="/support"
                data-testid="link-checkin-summary-support"
                className="inline-flex items-center gap-2 border border-white/[0.14] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-white/70 transition-colors hover:border-white/30 hover:text-white/90"
              >
                Make a small plan
              </Link>
            </div>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-white/35">
            <LockKeyhole size={13} /> Your check-in is private to your Nivara space.
          </p>
        </div>
      </AppShell>
    );
  }

  const current = prompts[step];
  const value = form[current.key];
  const progress = ((step + 1) / prompts.length) * 100;

  return (
    <AppShell>
      <div className="rise-in mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="serenity-label text-white/40">One-minute check-in</p>
            <p className="mt-1.5 text-xs text-white/40">A private snapshot of today</p>
          </div>
          <span className="serenity-label text-white/35">{step + 1} / {prompts.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-px bg-white/[0.08]">
          <div
            className="h-full bg-[#c3f340] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <section className="mt-10 border border-white/[0.09] bg-[hsl(var(--card))] p-12">
          <h1 className="max-w-lg font-display text-6xl leading-[.9]">{current.title}</h1>
          <p className="mt-5 text-sm text-white/45">{current.hint}</p>

          <div className="mt-12 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = value === n;
              const labelText = labels[n]?.[current.key] || '';
              return (
                <button
                  key={n}
                  onClick={() => setForm((f) => ({ ...f, [current.key]: n }))}
                  data-testid={`button-checkin-${current.key}-${n}`}
                  className={`flex flex-col items-center gap-3 border px-3 py-5 transition-[border-color,background-color] duration-150 ease-out ${
                    selected
                      ? 'border-[#c3f340] bg-[rgba(195,243,64,.08)]'
                      : 'border-white/[0.09] hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full font-display text-xl transition-colors duration-150 ${
                      selected ? 'bg-[#c3f340] text-[#0d1408]' : 'bg-white/[0.07] text-white/60'
                    }`}
                  >
                    {n}
                  </span>
                  <span className="serenity-label text-[8px] text-center text-white/35">
                    {labelText}
                  </span>
                </button>
              );
            })}
          </div>

          {step === prompts.length - 1 && (
            <textarea
              value={form.reflection}
              onChange={(e) => setForm((f) => ({ ...f, reflection: e.target.value }))}
              data-testid="input-checkin-reflection"
              placeholder="Anything you want to remember about today? (optional)"
              className="mt-8 min-h-[100px] w-full resize-none border border-white/[0.09] bg-transparent p-4 text-sm leading-6 text-white/80 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors duration-150"
            />
          )}
        </section>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-white/35 transition-colors hover:text-white/70"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < prompts.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-sweep border border-[#c3f340]/30 bg-[#141414] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408]"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              className="btn-sweep border border-[#c3f340] bg-[#c3f340] px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#0d1408]"
            >
              Save check-in
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
