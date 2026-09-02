'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  LockKeyhole,
  Sparkles,
  ShieldCheck,
  Activity,
  BookOpen,
  UsersRound,
  Clock3,
  Lock,
} from 'lucide-react';
import gsap from 'gsap';
import { TextReveal } from '@/components/ui/text-reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { FluidBackground } from '@/components/ui/fluid-background';
import { RoleSelectionPopin } from '@/components/auth/role-selection-popin';
import { LoginPortalModal } from '@/components/auth/login-portal-modal';
import { HelpModal } from '@/components/shared/help-modal';
import { AboutNivaraModal } from '@/components/shared/about-nivara-modal';
import { Pill } from '@/components/shared/pill';
import { NivaraLogoIcon } from '@/components/shared/nivara-logo';
import { SiteFooter } from '@/components/shared/site-footer';

export function LandingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [isPopinOpen, setIsPopinOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState<'student' | 'counsellor' | 'admin' | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [savedRole, setSavedRole] = useState<'student' | 'counsellor' | 'admin' | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const authenticated = window.localStorage.getItem('nivara_authenticated') === 'true';
    const role = window.localStorage.getItem('nivara_user_role') as 'student' | 'counsellor' | 'admin' | null;
    setIsAuth(authenticated);
    setSavedRole(authenticated && (role === 'student' || role === 'counsellor' || role === 'admin') ? role : null);

    // React to client-side redirects as well as a full page load. This is
    // important for buttons such as "Try 1-Min Check-in": middleware can
    // redirect to "/?auth=required&role=student" without remounting Home.
    if (searchParams.get('auth') === 'required') {
      const requestedRole = searchParams.get('role');
      if (requestedRole === 'student' || requestedRole === 'counsellor' || requestedRole === 'admin') {
        setLoginModalRole(requestedRole);
        setIsLoginModalOpen(true);
      }
    }
  }, [searchParams]);

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
          { opacity: 0, x: 30, rotateY: 10, scale: 0.96 },
          { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.9 },
          '-=0.7'
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="page-grain relative min-h-[100dvh] overflow-hidden bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Interactive Fluid Mesh Background */}
      <FluidBackground />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-80" />
        <div className="ambient-ring-1 absolute right-[-10%] top-[16%] h-[560px] w-[760px] rounded-full border border-[#c3f340]/15" />
        <div className="ambient-ring-2 absolute right-[-12%] top-[25%] h-[440px] w-[640px] rounded-full border border-white/[0.06]" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <Magnetic>
          <Link href="/" className="group inline-flex items-center gap-3" aria-label="Nivara Home">
            <span className="relative grid h-8 w-8 place-items-center rounded-[10px] overflow-hidden shadow-[0_0_15px_rgba(195,243,64,0.4)] transition-transform duration-200 ease-out group-hover:rotate-6 group-hover:scale-105">
              <NivaraLogoIcon size={32} />
            </span>
            <img
              src="/nivara-wordmark-white.png"
              alt="Nivara"
              width={193}
              height={50}
              className="h-6 w-auto sm:h-7 select-none"
            />
          </Link>
        </Magnetic>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-bold uppercase tracking-[.1em]">
            <button
              id="header-student-space-btn"
              type="button"
              onClick={() => {
                setLoginModalRole('student');
                setIsLoginModalOpen(true);
              }}
              className="text-white/60 hover:text-[#c3f340] transition-colors"
            >
              Student Space
            </button>

            <span className="h-3 w-px bg-white/25" aria-hidden="true" />

            <button
              id="header-counsellor-portal-btn"
              type="button"
              onClick={() => {
                setLoginModalRole('counsellor');
                setIsLoginModalOpen(true);
              }}
              className="text-white/60 hover:text-[#c3f340] transition-colors"
            >
              Counsellor Portal
            </button>

            <span className="h-3 w-px bg-white/25" aria-hidden="true" />

            <button
              id="header-admin-portal-btn"
              type="button"
              onClick={() => {
                setLoginModalRole('admin');
                setIsLoginModalOpen(true);
              }}
              className="text-white/60 hover:text-[#c3f340] transition-colors"
            >
              Admin Portal
            </button>
          </div>

          <button
            id="header-about-btn"
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[11px] font-bold uppercase tracking-[.1em] text-white/70 hover:border-[#c3f340]/40 hover:bg-[#c3f340]/10 hover:text-[#dff77d] transition-all"
          >
            About Nivara
          </button>

          <button
            id="header-help-btn"
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[11px] font-bold uppercase tracking-[.1em] text-white/70 hover:border-white/25 hover:bg-white/[0.06] hover:text-white transition-all"
          >
            Help
          </button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-14 pt-4 sm:pt-6 md:px-12 md:pb-20 md:pt-6 lg:grid-cols-[1.15fr_.85fr] lg:pt-8"
        >
          <div className="relative z-10 text-left">
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

            <p className="hero-desc mt-4 max-w-[540px] text-[14px] leading-6 text-white/65 md:text-[15px]">
              Nivara connects academic schedules, self-reported well-being check-ins, and institutional support options — helping you flag workload spikes and get support before deadline crunch.
            </p>

            {/* Direct Role Entry Points */}
            <div className="hero-actions mt-7 flex flex-wrap items-center gap-3.5">
              <Magnetic>
                <button
                  id="hero-get-started-btn"
                  type="button"
                  onClick={() => setIsPopinOpen(true)}
                  className="pressable btn-sweep inline-flex items-center gap-2 border border-[#c3f340] bg-[#c3f340] px-6 py-3.5 text-xs font-extrabold uppercase tracking-[.12em] text-[#0d1408] shadow-[0_0_25px_rgba(195,243,64,0.35)] transition hover:border-[#c3f340] hover:scale-105"
                >
                  Get Started <ArrowRight size={14} />
                </button>
              </Magnetic>

              <Magnetic>
                <button
                  id="hero-check-in-btn"
                  type="button"
                  onClick={() => {
                    const authenticated = window.localStorage.getItem('nivara_authenticated') === 'true';
                    const role = window.localStorage.getItem('nivara_user_role');
                    if (authenticated && role === 'student') {
                      router.push('/check-in');
                    } else {
                      setLoginModalRole('student');
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-6 py-3.5 text-xs font-extrabold uppercase tracking-[.12em] text-white/85 backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Try 1-Min Check-in
                </button>
              </Magnetic>
            </div>

            <div className="hero-trust mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[10px] uppercase tracking-[.18em] text-white/40">
              <span className="inline-flex items-center gap-2">
                <Check size={12} className="text-[#c3f340]" /> private by design
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={12} className="text-[#c3f340]" /> role-based access
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={12} className="text-[#c3f340]" /> zero surveillance
              </span>
            </div>
          </div>

          {/* 3D Showcase Card */}
          <div ref={showcaseRef} className="relative flex justify-center w-full min-h-[440px] lg:min-h-[480px]">
            <div className="ambient-ring-1 absolute right-[2%] top-[4%] h-[380px] w-[88%] rotate-[5deg] border border-[#c3f340]/20 bg-[#c3f340]/[0.03] shadow-[0_0_90px_rgba(195,243,64,.08)] md:h-[430px]" />
            <TiltCard
              maxTilt={2.5}
              spotlightColor="rgba(195, 243, 64, 0.18)"
              className="relative z-10 flex flex-col justify-between h-full min-h-[400px] md:min-h-[440px] w-full max-w-[460px] border border-white/[0.12] bg-[#111]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,.75)] backdrop-blur-2xl text-left"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="serenity-label text-white/45">Nivara / Early Signal</span>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#c3f340] shadow-[0_0_14px_rgba(195,243,64,1)]" />
                </div>
                <p className="mt-7 font-display text-3xl sm:text-4xl leading-[1.0] text-white">
                  Workload & Pacing Early Warning
                </p>
                <p className="mt-3 text-xs sm:text-sm text-white/55 leading-relaxed">
                  Course deadlines, submission density, and self-reported sleep/stress ratings are scored locally to surface pacing risks.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Evaluation Model</p>
                    <p className="text-sm font-bold text-[#c3f340] mt-0.5">Deterministic Signal Rules</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Check-in Status</p>
                    <p className="text-xl font-bold text-white mt-0.5">1-Min Logged</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#c3f340]">
                  <LockKeyhole size={12} /> your personal context stays yours
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* Core Pillars & Mission Section */}
        <section id="pillars" className="scroll-mt-12 border-y border-white/[0.08] bg-[#0d0d0d]/90 px-6 py-16 backdrop-blur-md md:px-12 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 text-left">
              <p className="serenity-label text-[#c3f340]/80">Core Pillars & Mission</p>
              <h2 className="mt-2 max-w-2xl font-display text-4xl leading-[.94] md:text-5xl text-white">
                Integrated support across academics, finances, and well-being.
              </h2>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-white/55 leading-relaxed">
                Connecting academic performance and personal well-being through proactive, private, and explainable tools.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 text-left">
              <TiltCard
                maxTilt={2}
                spotlightColor="rgba(195, 243, 64, 0.12)"
                className="border border-white/[0.08] bg-[#121212]/95 p-7 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-3xl text-[#c3f340]">01</p>
                  <Clock3 size={20} className="text-[#c3f340]/70" />
                </div>
                <h3 className="mt-8 text-base font-bold text-white">Daily Well-being Check-ins</h3>
                <p className="mt-2 text-xs leading-5 text-white/50">
                  A 1-minute daily check-in capturing 1–5 ratings for mood, stress, sleep, and energy without lengthy surveys.
                </p>
              </TiltCard>

              <TiltCard
                maxTilt={2}
                spotlightColor="rgba(195, 243, 64, 0.12)"
                className="border border-white/[0.08] bg-[#121212]/95 p-7 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-3xl text-[#c3f340]">02</p>
                  <UsersRound size={20} className="text-[#c3f340]/70" />
                </div>
                <h3 className="mt-8 text-base font-bold text-white">Counsellor Connectivity</h3>
                <p className="mt-2 text-xs leading-5 text-white/50">
                  Direct booking for 20-minute confidential consultations and student support circles with campus advisors.
                </p>
              </TiltCard>

              <TiltCard
                maxTilt={2}
                spotlightColor="rgba(195, 243, 64, 0.12)"
                className="border border-white/[0.08] bg-[#121212]/95 p-7 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-3xl text-[#c3f340]">03</p>
                  <BookOpen size={20} className="text-[#c3f340]/70" />
                </div>
                <h3 className="mt-8 text-base font-bold text-white">Academic Tracking</h3>
                <p className="mt-2 text-xs leading-5 text-white/50">
                  Tracks coursework deadlines, exam schedules, and attendance thresholds (such as 75% minimums) to identify submission clusters early.
                </p>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Privacy & Security Commitments Highlight */}
        <section className="px-6 py-14 md:px-12 md:py-16">
          <div className="mx-auto max-w-[1440px]">
            <TiltCard
              maxTilt={1.5}
              spotlightColor="rgba(195, 243, 64, 0.1)"
              className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#121212]/90 p-8 md:p-10 backdrop-blur-2xl text-left"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#c3f340]" />
                    <span className="serenity-label text-[#c3f340]">Data Privacy & Security Guarantee</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl text-white">
                    Confidential by Design. Zero Surveillance.
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed">
                    Check-in reflections, course notes, and support requests remain student-controlled. Role-Based Access Control (RBAC) ensures staff cannot access individual logs without explicit student consent.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 shrink-0">
                  <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2">
                    <p className="text-[10px] font-mono text-white/40 uppercase">Access Model</p>
                    <p className="text-xs font-bold text-white mt-0.5">Strict RBAC Segregation</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2">
                    <p className="text-[10px] font-mono text-white/40 uppercase">Privacy Policy</p>
                    <p className="text-xs font-bold text-[#c3f340] mt-0.5">Zero Algorithmic Surveillance</p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* Site Footer */}
        <SiteFooter />
      </main>

      {/* Workspace Selection — opened only by the explicit Get Started action */}
      <RoleSelectionPopin
        forceOpen={isPopinOpen}
        onClose={() => setIsPopinOpen(false)}
        onSelectRole={(role) => {
          setIsPopinOpen(false);
          setLoginModalRole(role);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Role-Specific / Direct Login Portal Modal */}
      <LoginPortalModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginModalRole(null);
        }}
        defaultRole={loginModalRole || 'student'}
        lockedRole={loginModalRole}
      />

      {/* Lightweight Help & FAQ Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Official Vision & Mission About Modal */}
      <AboutNivaraModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
