'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  X,
  ShieldCheck,
  Check,
  Building2,
  Lock,
} from 'lucide-react';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';
import { setUserRole } from '@/lib/auth';

interface RoleSelectionPopinProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const POPIN_STORAGE_KEY = 'nivara_initial_role_selected';

export function RoleSelectionPopin({
  forceOpen = false,
  onClose,
}: RoleSelectionPopinProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<'student' | 'counsellor' | null>(null);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Auto-popin on first landing visit immediately (250ms)
    if (typeof window !== 'undefined') {
      const alreadyChosen = window.localStorage.getItem(POPIN_STORAGE_KEY);
      if (!alreadyChosen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [forceOpen]);

  const handleSelectRole = async (role: 'student' | 'counsellor') => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(POPIN_STORAGE_KEY, 'true');
    }
    
    // Call the mock adapter to set cookies for middleware.ts
    const demoEmail = role === 'student' ? 'aria.chen@university.edu' : 'a.ross@wellbeing.university.edu';
    try {
      const { loginApi } = await import('@/lib/api/client');
      await loginApi(role, demoEmail);
    } catch (e) {
      console.error(e);
    }
    
    setUserRole(role);
    setIsOpen(false);
    if (onClose) onClose();

    if (role === 'counsellor') {
      router.push('/counsellor');
    } else {
      router.push('/dashboard');
    }
  };

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(POPIN_STORAGE_KEY, 'dismissed');
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Pop-in Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(195,243,64,0.06)] backdrop-blur-2xl my-auto"
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#c3f340]/[0.09] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#275a43]/[0.2] blur-3xl" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.4)]">
                  <Sparkles size={14} strokeWidth={2.7} />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-white">
                  Nivara · Workspace Selection
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="grid h-7 w-7 place-items-center rounded-full text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Headline and Description */}
            <div className="mt-6 text-left">
              <Pill tone="accent" className="mb-2.5">
                <ShieldCheck size={11} className="mr-1 inline text-[#c3f340]" /> Dedicated & Isolated Workspaces
              </Pill>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Choose your Nivara space
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-white/55 max-w-lg leading-relaxed">
                Nivara provides distinct, independent environments for students and university wellbeing teams. Select your role to open your dedicated workspace.
              </p>
            </div>

            {/* Two Distinct Workspace Cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Student Workspace Card */}
              <div
                onMouseEnter={() => setHoveredRole('student')}
                onMouseLeave={() => setHoveredRole(null)}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.1] bg-[#161616]/90 p-5 transition-all duration-200 hover:border-[#c3f340] hover:bg-[#c3f340]/[0.04] hover:shadow-[0_0_24px_rgba(195,243,64,0.12)] text-left"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#c3f340]/40 bg-[#c3f340]/10 text-[#c3f340] shadow-[0_0_12px_rgba(195,243,64,0.2)]">
                      <GraduationCap size={20} />
                    </div>
                    <span className="rounded-full border border-[#c3f340]/30 bg-[#c3f340]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.1em] text-[#c3f340]">
                      Student
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#c3f340] transition-colors">
                    Student Workspace
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                    Your private sanctuary to track academic rhythm, complete daily 30-sec check-ins, and view explainable pacing signals with zero surveillance.
                  </p>

                  <ul className="mt-4 space-y-2 text-[11px] text-white/50">
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Daily mood & energy check-ins</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Coursework velocity & signals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>1-click confidential counsellor chat</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.06]">
                  <Magnetic className="w-full block">
                    <button
                      type="button"
                      onClick={() => handleSelectRole('student')}
                      className="btn-sweep w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/20 bg-white/[0.04] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white/90 hover:border-[#c3f340] hover:bg-[#c3f340] hover:text-[#0d1408] hover:shadow-[0_0_18px_rgba(195,243,64,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
                    >
                      <span>I am a Student</span>
                      <ArrowRight size={14} strokeWidth={2.5} className="shrink-0 ml-0.5" />
                    </button>
                  </Magnetic>
                </div>
              </div>

              {/* Counsellor Workspace Card */}
              <div
                onMouseEnter={() => setHoveredRole('counsellor')}
                onMouseLeave={() => setHoveredRole(null)}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.1] bg-[#161616]/90 p-5 transition-all duration-200 hover:border-[#c3f340] hover:bg-[#c3f340]/[0.04] hover:shadow-[0_0_24px_rgba(195,243,64,0.12)] text-left"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#9b7cc7]/40 bg-[#9b7cc7]/10 text-[#c9b8df] shadow-[0_0_12px_rgba(155,124,199,0.2)]">
                      <HeartHandshake size={20} />
                    </div>
                    <span className="rounded-full border border-[#9b7cc7]/30 bg-[#9b7cc7]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.1em] text-[#c9b8df]">
                      Staff / Specialist
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#c3f340] transition-colors">
                    Counsellor Portal
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                    Institutional workspace for triage coordinators and counsellors to review flagged cohorts, schedule appointments, and manage clinical notes.
                  </p>

                  <ul className="mt-4 space-y-2 text-[11px] text-white/50">
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>High-priority attention triage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Student appointment manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Cohort aggregate health trends</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.06]">
                  <Magnetic className="w-full block">
                    <button
                      type="button"
                      onClick={() => handleSelectRole('counsellor')}
                      className="btn-sweep w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/20 bg-white/[0.04] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white/90 hover:border-[#c3f340] hover:bg-[#c3f340] hover:text-[#0d1408] hover:shadow-[0_0_18px_rgba(195,243,64,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
                    >
                      <span>I am a Counsellor</span>
                      <ArrowRight size={14} strokeWidth={2.5} className="shrink-0 ml-0.5" />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>

            {/* Bottom Dismiss Bar */}
            <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[10px] text-white/40">
              <span className="flex items-center gap-1.5">
                <Lock size={10} /> Architecture isolation guaranteed
              </span>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-white/50 hover:text-white underline transition-colors"
              >
                Continue exploring landing page
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
