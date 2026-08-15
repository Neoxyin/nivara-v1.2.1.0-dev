'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, LockKeyhole, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { TextReveal } from '@/components/ui/text-reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { FluidBackground } from '@/components/ui/fluid-background';

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation on ambient rings
      gsap.to('.ambient-ring-1', {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: 'none',
      });
      gsap.to('.ambient-ring-2', {
        rotation: -360,
        duration: 55,
        repeat: -1,
        ease: 'none',
      });

      // Hero timeline entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '.hero-desc',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.3'
        )
        .fromTo(
          '.hero-actions',
          { opacity: 0, scale: 0.96, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.hero-trust',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          '-=0.2'
        )
        .fromTo(
          showcaseRef.current,
          { opacity: 0, x: 40, rotateY: 15, scale: 0.95 },
          { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 1 },
          '-=0.8'
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="page-grain relative min-h-[100dvh] overflow-hidden bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Interactive Unlumen Fluid Mesh Background */}
      <FluidBackground />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-80" />
        <div className="ambient-ring-1 absolute right-[-10%] top-[16%] h-[560px] w-[760px] rounded-full border border-[#c3f340]/15" />
        <div className="ambient-ring-2 absolute right-[-12%] top-[25%] h-[440px] w-[640px] rounded-full border border-white/[0.06]" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <Magnetic>
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#c3f340] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.4)] transition-transform duration-200 ease-out group-hover:rotate-12 group-hover:scale-110">
              <Sparkles size={15} strokeWidth={2.7} />
            </span>
            <span className="text-sm font-extrabold uppercase tracking-[0.3em]">
              Nivara
            </span>
          </Link>
        </Magnetic>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/55 transition hover:text-white md:block"
          >
            Open student space
          </Link>
          <Magnetic>
            <Link
              href="/dashboard"
              className="pressable btn-sweep inline-flex items-center gap-2 border border-[#c3f340]/30 bg-[#141414] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#eff7dd] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition hover:text-[#0d1408] hover:border-[#c3f340]"
            >
              Get started <ArrowUpRight size={13} />
            </Link>
          </Magnetic>
        </div>
      </header>

      <main className="relative z-10">
        <section
          ref={heroRef}
          className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-14 pt-4 sm:pt-6 md:px-12 md:pb-20 md:pt-6 lg:grid-cols-[1.1fr_.9fr] lg:pt-8"
        >
          <div className="relative z-10">
            <div className="hero-badge">
              <p className="serenity-label inline-flex items-center gap-2 rounded-full border border-[#c3f340]/20 bg-[#c3f340]/[0.05] px-3.5 py-1 text-[#c3f340]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c3f340] animate-pulse" />
                A clearer way through student life
              </p>
            </div>

            <h1 className="serenity-display mt-4 max-w-[760px] text-[3.4rem] sm:text-[4.4rem] lg:text-[5.4rem] leading-[0.92] tracking-[-0.03em]">
              <TextReveal type="words" duration={0.8} stagger={0.06}>
                Make sense
              </TextReveal>
              <br />
              <em className="text-[#c3f340]">
                <TextReveal type="words" delay={0.3} duration={0.8} stagger={0.06}>
                  of the week.
                </TextReveal>
              </em>
            </h1>

            <p className="hero-desc mt-4 max-w-[540px] text-[14px] leading-6 text-white/60 md:text-[15px]">
              Nivara brings your well-being, academic signals, and support options into one private space — so you can notice what is changing before it becomes too much.
            </p>

            <div className="hero-actions mt-6 flex flex-wrap gap-3.5">
              <Magnetic>
                <Link
                  href="/dashboard"
                  className="pressable btn-sweep inline-flex items-center gap-2 border border-[#c3f340] bg-[#c3f340] px-6 py-3 text-xs font-extrabold uppercase tracking-[.12em] text-[#0d1408] shadow-[0_0_25px_rgba(195,243,64,0.35)] transition hover:border-[#c3f340] hover:scale-105"
                >
                  Enter your space <ArrowUpRight size={14} />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  href="/check-in"
                  className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-6 py-3 text-xs font-extrabold uppercase tracking-[.12em] text-white/85 backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Try a one-minute check-in
                </Link>
              </Magnetic>
            </div>

            <div className="hero-trust mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[10px] uppercase tracking-[.18em] text-white/35">
              <span className="inline-flex items-center gap-2">
                <Check size={12} className="text-[#c3f340]" /> private by design
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={12} className="text-[#c3f340]" /> signals, not verdicts
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={12} className="text-[#c3f340]" /> human support
              </span>
            </div>
          </div>

          {/* 3D Interactive Tilt Showcase */}
          <div ref={showcaseRef} className="relative flex justify-center w-full min-h-[460px] lg:min-h-[500px]">
            <div className="ambient-ring-1 absolute right-[2%] top-[4%] h-[400px] w-[88%] rotate-[5deg] border border-[#c3f340]/20 bg-[#c3f340]/[0.03] shadow-[0_0_100px_rgba(195,243,64,.08)] md:h-[460px]" />
            <TiltCard
              maxTilt={2.5}
              spotlightColor="rgba(195, 243, 64, 0.18)"
              className="relative z-10 flex flex-col justify-between h-full min-h-[420px] md:min-h-[460px] w-full max-w-[480px] border border-white/[0.12] bg-[#111]/90 p-8 shadow-[0_30px_100px_rgba(0,0,0,.7)] backdrop-blur-2xl md:p-9"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="serenity-label text-white/45">Nivara / today</span>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#c3f340] shadow-[0_0_14px_rgba(195,243,64,1)]" />
                </div>
                <p className="mt-8 font-display text-4xl leading-[.95] md:text-5xl text-white">
                  A small plan is still a plan.
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="serenity-label text-white/35">Early signal</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Your workload is concentrating. Nivara helps you see why, then choose what to do next.
                </p>
                <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#c3f340]">
                  <LockKeyhole size={13} /> your context stays yours
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* 3 Steps section */}
        <section className="border-y border-white/[0.08] bg-[#0e0e0e]/90 px-6 py-16 backdrop-blur-md md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[.62fr_1.38fr]">
            <div>
              <p className="serenity-label text-[#c3f340]/70">One place, many signals</p>
              <h2 className="mt-4 max-w-xl font-display text-5xl leading-[.92] md:text-6xl">
                Support that sees the whole picture.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-white/45">
                Notice patterns, understand what may be contributing, and move before the week becomes overwhelming.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['01', 'Notice patterns', 'Daily check-ins make the invisible parts of your week easier to name.'],
                ['02', 'Understand signals', 'See what may be contributing, with certainty language that never overclaims.'],
                ['03', 'Choose your next move', 'A plan, a resource, or a person — support stays in your hands.'],
              ].map(([num, title, text]) => (
                <TiltCard
                  key={num}
                  maxTilt={2}
                  spotlightColor="rgba(195, 243, 64, 0.12)"
                  className="border border-white/[0.08] bg-[#121212]/95 p-7 backdrop-blur-xl"
                >
                  <p className="font-display text-4xl text-white/30">{num}</p>
                  <h3 className="mt-14 text-sm font-extrabold text-white">{title}</h3>
                  <p className="mt-3 text-xs leading-5 text-white/45">{text}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars section */}
        <section className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
          <div className="grid items-end gap-10 md:grid-cols-[1fr_.72fr]">
            <div>
              <p className="serenity-label text-[#c3f340]/70">Built around the student</p>
              <h2 className="mt-5 max-w-3xl font-display text-6xl leading-[.88] md:text-8xl">
                You do not have to wait until it is a crisis.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/45">
              Nivara is not here to diagnose you or replace people. It is a practical, private companion for noticing, planning, and reaching out sooner.
            </p>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-3">
            <TiltCard maxTilt={2} className="border border-white/[0.08] bg-[#121212]/90 p-8 backdrop-blur-xl">
              <p className="serenity-label text-[#c3f340]">01 / check-in</p>
              <p className="mt-10 font-display text-3xl text-white">One minute. Every day.</p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                A low-friction snapshot of mood, energy, sleep, stress, and workload.
              </p>
            </TiltCard>

            <TiltCard maxTilt={2} className="border border-white/[0.08] bg-[#121212]/90 p-8 backdrop-blur-xl">
              <p className="serenity-label text-[#c3f340]">02 / insights</p>
              <p className="mt-10 font-display text-3xl text-white">Signals, explained simply.</p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Context-rich trends that show what changed and what might help next.
              </p>
            </TiltCard>

            <TiltCard maxTilt={2} className="border border-white/[0.08] bg-[#121212]/90 p-8 backdrop-blur-xl">
              <p className="serenity-label text-[#c3f340]">03 / support</p>
              <p className="mt-10 font-display text-3xl text-white">Human when you need it.</p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Resources, practical guidance, and a direct path to institutional counsellors.
              </p>
            </TiltCard>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.08] pt-6 text-[10px] uppercase tracking-[.16em] text-white/35">
            <span>Built for students, with students.</span>
            <span>Private · explainable · human</span>
            <Magnetic>
              <Link href="/dashboard" className="font-extrabold text-[#c3f340] hover:underline">
                Open Nivara <ArrowUpRight className="ml-1 inline" size={13} />
              </Link>
            </Magnetic>
          </div>
        </section>
      </main>
    </div>
  );
}
