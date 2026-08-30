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
  onSelectRole?: (role: 'student' | 'counsellor' | 'admin') => void;
}


export function RoleSelectionPopin({
  forceOpen = false,
  onClose,
  onSelectRole,
}: RoleSelectionPopinProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<'student' | 'counsellor' | 'admin' | null>(null);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [forceOpen]);

  // Intentionally do not auto-open this modal. Workspace selection is an
  // explicit action from the landing page (Get Started). Logging out must
  // return to the landing page without reopening the selector.

  const handleSelectRole = (role: 'student' | 'counsellor' | 'admin') => {
    setIsOpen(false);
    if (onClose) onClose();

    if (onSelectRole) {
      onSelectRole(role);
      return;
    }

    setUserRole(role);

    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'counsellor') {
      router.push('/counsellor');
    } else {
      router.push('/dashboard');
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const isModalOpen = forceOpen || isOpen;

  return (
    <AnimatePresence>
      {isModalOpen && (
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
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(195,243,64,0.06)] backdrop-blur-2xl my-auto"
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
              <p className="mt-2 text-xs sm:text-sm text-white/55 max-w-2xl leading-relaxed">
                Nivara provides distinct, independent environments for students, university wellbeing teams, and administrative leadership. Select your role to open your dedicated workspace.
              </p>
            </div>

            {/* Three Distinct Workspace Cards */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
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
                    Your private workspace to track coursework deadlines, complete daily 1-minute check-ins, and access academic and financial support resources.
                  </p>

                  <ul className="mt-4 space-y-2 text-[11px] text-white/50">
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Daily mood & energy check-ins</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Assignment deadlines & attendance tracking</span>
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
                      className="btn-sweep w-full flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-[.12em] text-white/90 hover:border-[#c3f340] hover:bg-[#c3f340] hover:text-[#0d1408] hover:shadow-[0_0_18px_rgba(195,243,64,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
                    >
                      <span>Enter Student</span>
                      <ArrowRight size={13} strokeWidth={2.5} className="shrink-0 ml-0.5" />
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
                      className="btn-sweep w-full flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-[.12em] text-white/90 hover:border-[#c3f340] hover:bg-[#c3f340] hover:text-[#0d1408] hover:shadow-[0_0_18px_rgba(195,243,64,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
                    >
                      <span>Enter Counsellor</span>
                      <ArrowRight size={13} strokeWidth={2.5} className="shrink-0 ml-0.5" />
                    </button>
                  </Magnetic>
                </div>
              </div>

              {/* Administrator Workspace Card */}
              <div
                onMouseEnter={() => setHoveredRole('admin')}
                onMouseLeave={() => setHoveredRole(null)}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.1] bg-[#161616]/90 p-5 transition-all duration-200 hover:border-[#c3f340] hover:bg-[#c3f340]/[0.04] hover:shadow-[0_0_24px_rgba(195,243,64,0.12)] text-left"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#40b0f3]/40 bg-[#40b0f3]/10 text-[#7dd3f7] shadow-[0_0_12px_rgba(64,176,243,0.2)]">
                      <Building2 size={20} />
                    </div>
                    <span className="rounded-full border border-[#40b0f3]/30 bg-[#40b0f3]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.1em] text-[#7dd3f7]">
                      Administration
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#c3f340] transition-colors">
                    Administrator Portal
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                    Campus-wide governance and oversight. Monitor aggregate wellness trends, service uptime, capacity planning, and DPDP/FERPA consent audits.
                  </p>

                  <ul className="mt-4 space-y-2 text-[11px] text-white/50">
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Campus Support Overview</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>System service uptime & telemetry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[#c3f340] shrink-0" />
                      <span>Fairness & Consent audit log</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.06]">
                  <Magnetic className="w-full block">
                    <button
                      type="button"
                      onClick={() => handleSelectRole('admin')}
                      className="btn-sweep w-full flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-[.12em] text-white/90 hover:border-[#c3f340] hover:bg-[#c3f340] hover:text-[#0d1408] hover:shadow-[0_0_18px_rgba(195,243,64,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
                    >
                      <span>Enter Admin</span>
                      <ArrowRight size={13} strokeWidth={2.5} className="shrink-0 ml-0.5" />
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
