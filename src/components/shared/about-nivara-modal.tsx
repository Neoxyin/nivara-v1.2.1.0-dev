'use client';

import React from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  UsersRound,
  BookOpen,
  Lock,
  Heart,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { NivaraLogoIcon } from './nivara-logo';

interface AboutNivaraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutNivaraModal({ isOpen, onClose }: AboutNivaraModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <TiltCard
          maxTilt={2}
          className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_30px_rgba(195,243,64,0.1)] backdrop-blur-2xl"
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c3f340]/12 blur-[75px]" />

          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center rounded-xl overflow-hidden shadow-[0_0_15px_rgba(195,243,64,0.35)]">
                <NivaraLogoIcon size={40} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="serenity-label text-[#c3f340]">Official Vision</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c3f340] animate-pulse" />
                </div>
                <h2 id="about-modal-title" className="font-display text-2xl font-bold tracking-tight text-white mt-0.5">
                  About Nivara
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close about modal"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content Area */}
          <div className="my-5 max-h-[62vh] space-y-4 overflow-y-auto pr-1 text-left no-scrollbar">
            {/* Core Mission Banner */}
            <div className="rounded-xl border border-[#c3f340]/30 bg-[#c3f340]/[0.05] p-6 sm:p-7 shadow-[0_0_20px_rgba(195,243,64,0.04)]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#c3f340]">
                Core Mission
              </p>
              <p className="mt-2.5 text-[14px] font-medium leading-[1.65] text-white/95 sm:text-[15px]">
                Nivara is a student support platform connecting academic progress, financial aid, and well-being resources.
              </p>
              <p className="mt-3 text-[12px] leading-[1.65] text-white/65">
                Students receive transparent early signals on deadline clustering and sleep patterns, while campus counsellors receive consented triage context to offer timely support.
              </p>
            </div>

            {/* Key Platform Pillars */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40 mb-2.5">
                Key Platform Pillars
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={15} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">1-Minute Daily Check-ins</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-[1.6] text-white/60">
                    1-minute daily check-ins logging self-reported mood, stress, sleep, and workload on a 1–5 scale.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <UsersRound size={15} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">Counsellor Connectivity</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-[1.6] text-white/60">
                    Direct, confidential booking and drop-in spaces connecting students with licensed campus care teams.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <BrainCircuit size={15} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">Actionable AI Support</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-[1.6] text-white/60">
                    Privacy-first empathetic guidance, grounding exercises, and personalized workload adjustment plans.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-white">
                    <BookOpen size={15} className="text-[#c3f340]" />
                    <span className="text-xs font-bold">Academic Tracking</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-[1.6] text-white/60">
                    Coursework deadline tracking, attendance threshold monitoring, and milestone pacing alerts.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & Security Architecture */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck size={16} className="text-[#c3f340]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Privacy & Institutional Security
                </span>
              </div>
              <ul className="mt-3 space-y-2.5 text-[11px] text-white/65 leading-[1.6]">
                <li className="flex items-start gap-2">
                  <Lock size={12} className="shrink-0 text-[#c3f340] mt-0.5" />
                  <span><strong>Zero Surveillance:</strong> Personal logs, mood entries, and subjective notes remain strictly confidential.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock size={12} className="shrink-0 text-[#c3f340] mt-0.5" />
                  <span><strong>End-to-End Encryption:</strong> Sensitive student records and session notes are encrypted at rest and in transit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock size={12} className="shrink-0 text-[#c3f340] mt-0.5" />
                  <span><strong>Role-Based Access Control (RBAC):</strong> Strict institutional separation guarantees independent student and counsellor environments.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
            <div className="flex items-center gap-2 text-[11px] text-white/45">
              <Heart size={12} className="text-[#c3f340]" />
              <span>Designed for student resilience & compassionate campus care</span>
            </div>

            <Magnetic>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#c3f340]/30 bg-[#c3f340]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition hover:bg-[#c3f340]/20"
              >
                Close
              </button>
            </Magnetic>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
