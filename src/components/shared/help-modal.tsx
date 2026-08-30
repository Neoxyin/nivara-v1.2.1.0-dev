'use client';

import React, { useEffect, useState } from 'react';
import { X, HelpCircle, ShieldCheck, HeartHandshake, Sparkles, BookOpen, Clock, MessageSquare } from 'lucide-react';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    icon: Sparkles,
    q: 'What is NIVARA?',
    a: 'NIVARA connects academic milestones, self-reported well-being check-ins, and institutional support options so students can navigate workload spikes with full privacy and agency.',
  },
  {
    icon: Clock,
    q: 'How does the 30-Second Daily Check-In work?',
    a: 'Each morning, a 1-minute check-in records 1–5 ratings for mood, stress, sleep, and workload to help you notice multiday trends and flag high-strain periods.',
  },
  {
    icon: ShieldCheck,
    q: 'Is my student data confidential and secure?',
    a: 'Yes. NIVARA operates under strict zero-surveillance principles and FERPA compliance. Coursework pacing, personal notes, and subjective reflections remain private on your device unless you explicitly request a counsellor consultation.',
  },
  {
    icon: HeartHandshake,
    q: 'How do I book or connect with a campus counsellor?',
    a: 'Students can request appointments or drop into confidential support spaces via the Counsellors tab. Counsellors receive explainable context to provide compassionate, targeted care.',
  },
  {
    icon: BookOpen,
    q: 'How do I switch roles between Student and Counsellor?',
    a: 'To maintain institutional access separation and session integrity, each browser session is single-role. Click "Sign Out" in the header or Settings to choose another workspace.',
  },
];

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) setSelectedIdx(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl">
        <TiltCard
          maxTilt={2}
          className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_30px_rgba(195,243,64,0.1)] backdrop-blur-2xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c3f340]/10 blur-[70px]" />

          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#c3f340]/30 bg-[#c3f340]/10 text-[#c3f340] shadow-[0_0_15px_rgba(195,243,64,0.2)]">
                <HelpCircle size={20} strokeWidth={2.4} />
              </div>
              <div>
                <h2 id="help-modal-title" className="font-display text-2xl font-bold tracking-tight text-white">
                  Help & Frequently Asked Questions
                </h2>
                <p className="text-xs text-white/50">
                  Quick answers about NIVARA&apos;s privacy, pacing, and support architecture.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close help modal"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* FAQ Accordion List */}
          <div className="my-5 max-h-[60vh] space-y-2.5 overflow-y-auto pr-1 no-scrollbar">
            {faqs.map((faq, idx) => {
              const Icon = faq.icon;
              const isExpanded = selectedIdx === idx;
              return (
                <div
                  key={faq.q}
                  className={`rounded-xl border transition-all duration-200 ${
                    isExpanded
                      ? 'border-[#c3f340]/30 bg-white/[0.04] shadow-[0_0_20px_rgba(195,243,64,0.05)]'
                      : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.03]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIdx(isExpanded ? null : idx)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-colors ${
                          isExpanded
                            ? 'border-[#c3f340]/40 bg-[#c3f340]/15 text-[#c3f340]'
                            : 'border-white/[0.08] bg-white/[0.02] text-white/40'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] font-semibold text-white/90">{faq.q}</span>
                    </div>
                    <span
                      className={`text-xs transition-transform duration-200 ${
                        isExpanded ? 'rotate-90 text-[#c3f340]' : 'text-white/30'
                      }`}
                    >
                      ▶
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 text-xs leading-relaxed text-white/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Emergency Support Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4 text-[11px] text-white/45">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c3f340] animate-pulse" />
              <span>Campus Crisis Support: <strong>24/7 Helpline</strong> (1-800-273-8255)</span>
            </div>

            <Magnetic>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#c3f340]/30 bg-[#c3f340]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition hover:bg-[#c3f340]/20"
              >
                Got It
              </button>
            </Magnetic>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
