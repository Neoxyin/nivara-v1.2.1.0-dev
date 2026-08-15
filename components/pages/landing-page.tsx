'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, LockKeyhole, Sparkles } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="page-grain min-h-[100dvh] overflow-hidden bg-[#0a0a0a] text-[#f0f0f0]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-80" />
        <div className="absolute left-[6%] top-[8%] h-64 w-64 rounded-full bg-[#c3f340]/[0.045] blur-3xl" />
        <div className="absolute right-[-10%] top-[16%] h-[560px] w-[760px] rounded-full border border-[#c3f340]/10 rotate-[-13deg]" />
        <div className="absolute right-[-12%] top-[25%] h-[440px] w-[640px] rounded-full border border-white/[0.06] rotate-[-11deg]" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#c3f340] text-[#0d1408] transition-transform duration-180 ease-out group-hover:rotate-6">
            <Sparkles size={15} strokeWidth={2.7} />
          </span>
          <span className="text-sm font-extrabold uppercase tracking-[0.3em]">Nivara</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/55 transition hover:text-white md:block">Open student space</Link>
          <Link href="/dashboard" className="pressable btn-sweep inline-flex items-center gap-2 border border-[#c3f340]/25 bg-[#141414] px-4 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#eff7dd] transition hover:text-[#0d1408]">Get started <ArrowUpRight size={13} /></Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 pb-28 pt-20 md:grid-cols-[1.02fr_.98fr] md:px-12 md:pb-36 md:pt-28">
          <div className="relative z-10 animate-rise-in">
            <p className="serenity-label text-[#c3f340]/70">A clearer way through student life</p>
            <h1 className="serenity-display mt-7 max-w-[760px] text-[5rem] md:text-[8.8rem]">
              Make sense
              <br />
              <em className="text-[#c3f340]">of the week.</em>
            </h1>
            <p className="mt-8 max-w-[540px] text-[15px] leading-7 text-white/60 md:text-[17px]">
              Nivara brings your well-being, academic signals, and support options into one private space — so you can notice what is changing before it becomes too much.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/dashboard" className="pressable btn-sweep inline-flex items-center gap-2 border border-[#c3f340] bg-[#c3f340] px-5 py-3 text-xs font-extrabold uppercase tracking-[.12em] text-[#0d1408] transition hover:border-[#c3f340]">Enter your space <ArrowUpRight size={14} /></Link>
              <Link href="/check-in" className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.025] px-5 py-3 text-xs font-extrabold uppercase tracking-[.12em] text-white/80 transition hover:border-white/30 hover:bg-white/[0.06]">Try a one-minute check-in</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[.18em] text-white/35">
              <span className="inline-flex items-center gap-2"><Check size={12} className="text-[#c3f340]" /> private by design</span>
              <span className="inline-flex items-center gap-2"><Check size={12} className="text-[#c3f340]" /> signals, not verdicts</span>
              <span className="inline-flex items-center gap-2"><Check size={12} className="text-[#c3f340]" /> human support</span>
            </div>
          </div>

          <div className="relative min-h-[560px] animate-rise-in delay-2">
            <div className="absolute right-[6%] top-[8%] h-[430px] w-[74%] rotate-[5deg] border border-[#c3f340]/15 bg-[#c3f340]/[0.05] shadow-[0_0_100px_rgba(195,243,64,.05)] md:h-[520px]" />
            <div className="absolute left-[4%] top-[16%] h-[390px] w-[82%] border border-white/[0.12] bg-[#111]/88 p-7 shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl md:h-[460px] md:p-10">
              <div className="flex items-center justify-between">
                <span className="serenity-label text-white/45">Nivara / today</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#c3f340] shadow-[0_0_14px_rgba(195,243,64,.9)]" />
              </div>
              <p className="mt-20 max-w-[310px] font-display text-5xl leading-[.92] md:text-6xl">A small plan is still a plan.</p>
              <div className="mt-16 border-t border-white/10 pt-5">
                <p className="serenity-label text-white/35">Early signal</p>
                <p className="mt-3 max-w-[330px] text-sm leading-6 text-white/55">Your workload is concentrating. Nivara helps you see why, then choose what to do next.</p>
              </div>
              <div className="mt-9 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#c3f340]"><LockKeyhole size={13} /> your context stays yours</div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.08] bg-[#0e0e0e] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[.62fr_1.38fr]">
            <div>
              <p className="serenity-label text-[#c3f340]/70">One place, many signals</p>
              <h2 className="mt-4 max-w-xl font-display text-5xl leading-[.92] md:text-6xl">Support that sees the whole picture.</h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-white/45">Notice patterns, understand what may be contributing, and move before the week becomes overwhelming.</p>
            </div>
            <div className="grid gap-px bg-white/[0.08] sm:grid-cols-3">
              {[
                ['01', 'Notice patterns', 'Daily check-ins make the invisible parts of your week easier to name.'],
                ['02', 'Understand signals', 'See what may be contributing, with certainty language that never overclaims.'],
                ['03', 'Choose your next move', 'A plan, a resource, or a person — support stays in your hands.'],
              ].map(([num, title, text]) => (
                <div key={num} className="glass-card bg-[#111] p-6 md:p-7">
                  <p className="font-display text-4xl text-white/30">{num}</p>
                  <h3 className="mt-14 text-sm font-extrabold">{title}</h3>
                  <p className="mt-3 text-xs leading-5 text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
          <div className="grid items-end gap-10 md:grid-cols-[1fr_.72fr]">
            <div>
              <p className="serenity-label text-[#c3f340]/70">Built around the student</p>
              <h2 className="mt-5 max-w-3xl font-display text-6xl leading-[.88] md:text-8xl">You do not have to wait until it is a crisis.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/45">Nivara is not here to diagnose you or replace people. It is a practical, private companion for noticing, planning, and reaching out sooner.</p>
          </div>

          <div className="mt-20 grid gap-3 md:grid-cols-3">
            <div className="glass-card p-7"><p className="serenity-label text-[#c3f340]/70">01 / check-in</p><p className="mt-10 font-display text-3xl">One minute. Every day.</p><p className="mt-3 text-sm leading-6 text-white/45">A low-friction snapshot of mood, energy, sleep, stress, and workload.</p></div>
            <div className="glass-card p-7"><p className="serenity-label text-[#c3f340]/70">02 / insights</p><p className="mt-10 font-display text-3xl">Signals, explained simply.</p><p className="mt-3 text-sm leading-6 text-white/45">Context-rich trends that show what changed and what might help next.</p></div>
            <div className="glass-card p-7"><p className="serenity-label text-[#c3f340]/70">03 / support</p><p className="mt-10 font-display text-3xl">Human when you need it.</p><p className="mt-3 text-sm leading-6 text-white/45">Resources, practical guidance, and a direct path to institutional counsellors.</p></div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.08] pt-5 text-[10px] uppercase tracking-[.16em] text-white/35">
            <span>Built for students, with students.</span>
            <span>Private · explainable · human</span>
            <Link href="/dashboard" className="font-extrabold text-[#c3f340]">Open Nivara <ArrowUpRight className="ml-1 inline" size={13} /></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
