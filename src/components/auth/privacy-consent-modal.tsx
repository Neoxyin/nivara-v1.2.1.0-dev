'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';
import { privacyPolicySections } from '@/lib/data/privacy-policy';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function PrivacyConsentModal({ isOpen, onAccept, onReject }: PrivacyConsentModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const reachedEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (reachedEnd) setHasScrolledToEnd(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex w-full max-w-xl max-h-[86vh] flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 text-white shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_30px_rgba(195,243,64,0.06)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#c3f340]/[0.08] blur-3xl" />

            {/* Header */}
            <div className="shrink-0 border-b border-white/[0.08] p-6 pb-4 sm:p-8 sm:pb-4">
              <Pill tone="accent" className="mb-2.5">
                <ShieldCheck size={11} className="mr-1 inline text-[#c3f340]" /> Required Before First Sign-In
              </Pill>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Review the Nivara Privacy Policy
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-white/55">
                Please scroll through and read the full policy before continuing. You must accept to enter Student Space.
              </p>
            </div>

            {/* Scrollable Policy Body */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8"
            >
              <div className="space-y-6">
                {privacyPolicySections.map((section) => (
                  <div
                    key={section.id}
                    className={`rounded-xl border p-4 ${
                      section.highlight
                        ? 'border-[#c3f340]/30 bg-[#c3f340]/[0.05]'
                        : 'border-white/[0.07] bg-white/[0.02]'
                    }`}
                  >
                    <h3
                      className={`text-xs font-bold uppercase tracking-[.1em] ${
                        section.highlight ? 'text-[#dff77d]' : 'text-white/70'
                      }`}
                    >
                      {section.title}
                    </h3>
                    <div className="mt-2 space-y-2">
                      {section.body.map((para, i) => (
                        <p key={i} className="text-xs leading-5 text-white/55">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="pb-1 text-center text-[10px] uppercase tracking-[.12em] text-white/30">
                  — End of Policy —
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="shrink-0 border-t border-white/[0.08] p-6 pt-4 sm:p-8 sm:pt-4">
              {!hasScrolledToEnd && (
                <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-white/40">
                  Scroll to the end to enable Accept
                </p>
              )}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onReject}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white/70 transition-colors hover:border-rose-400/40 hover:bg-rose-500/[0.06] hover:text-rose-300"
                >
                  <XCircle size={14} />
                  Reject & Return Home
                </button>
                <Magnetic>
                  <button
                    type="button"
                    onClick={onAccept}
                    disabled={!hasScrolledToEnd}
                    className="btn-sweep flex w-full items-center justify-center gap-2.5 rounded-full border border-[#c3f340] bg-[#c3f340] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100"
                  >
                    <CheckCircle2 size={14} />
                    Accept & Continue
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </Magnetic>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
