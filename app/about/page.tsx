'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  UsersRound,
  BookOpen,
  Lock,
  Clock,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { FluidBackground } from '@/components/ui/fluid-background';

export default function AboutPage() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0c0c0c] px-6 py-12 text-[#f0f0f0]">
      <FluidBackground />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Top bar navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs font-bold uppercase tracking-[.1em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={14} /> Return to Nivara
          </Link>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#c3f340] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c3f340]">
              Official Vision
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <TiltCard
          maxTilt={1.5}
          className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_30px_rgba(195,243,64,0.08)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c3f340]/10 blur-[80px]" />

          {/* Header */}
          <div className="flex items-center gap-3.5 border-b border-white/[0.08] pb-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#c3f340]/30 bg-[#c3f340]/10 text-[#c3f340] shadow-[0_0_20px_rgba(195,243,64,0.2)]">
              <Sparkles size={24} strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                About Nivara
              </h1>
              <p className="text-xs text-white/50 mt-1">
                A holistic student success platform bridging academic performance and mental well-being.
              </p>
            </div>
          </div>

          <div className="my-6 space-y-5 text-left">
            {/* Core Mission */}
            <div className="rounded-xl border border-[#c3f340]/30 bg-[#c3f340]/[0.05] p-6 sm:p-7 shadow-[0_0_20px_rgba(195,243,64,0.04)]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#c3f340]">
                Our Mission
              </p>
              <p className="mt-2.5 text-[14px] font-medium leading-[1.65] text-white/95 sm:text-[15px]">
                Nivara is dedicated to transforming student care from reactive crisis management into proactive, self-calibrating balance.
              </p>
              <p className="mt-3 text-[12px] leading-[1.65] text-white/65">
                We empower students to understand their personal stress velocity and workload rhythms while giving institution counsellors actionable, explainable insights to reach out with compassionate, timely support.
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white/40 mb-3">
                Key Features
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">1-Minute Daily Check-ins</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                    Frictionless morning check-ins capturing workload, stress levels, and recovery curves.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <UsersRound size={16} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">Counsellor Connectivity</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                    Direct, confidential appointment booking and drop-in spaces connecting students with licensed care teams.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <BrainCircuit size={16} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">Actionable AI Support</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                    Privacy-first empathetic guidance, grounding exercises, and personalized workload adjustment plans.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <BookOpen size={16} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">Academic Tracking</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                    Real-time assignment velocity, deadline clustering awareness, and pacing risk calibration.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4.5">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck size={16} className="text-[#c3f340]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Privacy & Institutional Security
                </span>
              </div>
              <ul className="mt-3 space-y-2.5 text-xs text-white/65">
                <li className="flex items-start gap-2">
                  <Lock size={13} className="shrink-0 text-[#c3f340] mt-0.5" />
                  <span><strong>Zero Surveillance:</strong> Personal logs, mood entries, and subjective notes remain strictly confidential.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock size={13} className="shrink-0 text-[#c3f340] mt-0.5" />
                  <span><strong>End-to-End Encryption:</strong> Sensitive student records and session notes are encrypted at rest and in transit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock size={13} className="shrink-0 text-[#c3f340] mt-0.5" />
                  <span><strong>Role-Based Access Control (RBAC):</strong> Strict institutional separation guarantees independent student and counsellor environments.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Heart size={13} className="text-[#c3f340]" />
              <span>Nivara · Holistic Student Success Platform</span>
            </div>

            <Magnetic>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-xs font-extrabold uppercase tracking-[.1em] text-[#0d1408] transition hover:scale-105 shadow-[0_0_20px_rgba(195,243,64,0.3)]"
              >
                Get Started
              </Link>
            </Magnetic>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}


