'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  UsersRound,
  AlertTriangle,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Clock3,
  FileText,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';

interface CounsellorWalkthroughProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const COUNSELLOR_STEPS = [
  {
    step: 1,
    badge: 'Clinical Overview · Triage Radar',
    tone: 'accent' as const,
    title: 'Proactive Caseload Triage & Rhythm Monitoring',
    description:
      'Welcome, Dr. Ross. The Counsellor Portal provides early triage visibility into student cohorts, highlighting academic rhythm shifts and well-being dips before acute crisis arises.',
    features: [
      {
        icon: UsersRound,
        label: 'Real-Time Cohort Triage',
        desc: 'Filter by cohort, attendance risk, and academic rhythm volatility across departments.',
      },
      {
        icon: ShieldCheck,
        label: 'FERPA & Privacy Guard',
        desc: 'All data is anonymized until student consent or triage threshold is triggered.',
      },
      {
        icon: AlertTriangle,
        label: 'Early Attention Radar',
        desc: 'Immediate highlights of students facing multi-module workload friction.',
      },
    ],
  },
  {
    step: 2,
    badge: 'Caseload Management',
    tone: 'warm' as const,
    title: 'Individual Academic Records & Trend Analysis',
    description:
      'Inspect detailed student records including module-by-module attendance, study workload forecasts, and past confidential meeting notes to prepare for appointments.',
    features: [
      {
        icon: TrendingDown,
        label: 'Early Dip Detection',
        desc: 'Identifies sudden rhythm dips over 7-day and 14-day rolling windows.',
      },
      {
        icon: FileText,
        label: 'Confidential Notes',
        desc: 'Write structured progress notes and action items encrypted on university servers.',
      },
      {
        icon: Clock3,
        label: 'Session Status Controls',
        desc: 'Mark appointments as upcoming, completed, or requiring follow-up in one click.',
      },
    ],
  },
  {
    step: 3,
    badge: 'Appointments & Availability',
    tone: 'plum' as const,
    title: 'Seamless Scheduling & 20-Min Availability',
    description:
      'Students can self-book into your published time slots. View your daily agenda, reschedule sessions, and adjust your weekly capacity on the fly.',
    features: [
      {
        icon: CalendarCheck,
        label: 'Self-Service Booking Slots',
        desc: 'Publish 20-minute support windows that synchronize directly with student portals.',
      },
      {
        icon: Sparkles,
        label: 'Direct Caseload Filter',
        desc: 'Pin high-priority students needing follow-up consultations this week.',
      },
      {
        icon: ShieldCheck,
        label: 'Zero Friction Handoff',
        desc: 'Seamless escalation paths for academic accommodations or faculty advising.',
      },
    ],
  },
];

const COUNSELLOR_SESSION_GREETED_KEY = 'nivara_counsellor_greeted_session';
const COUNSELLOR_ONBOARDING_COMPLETED_KEY = 'nivara_counsellor_onboarding_completed';

export function CounsellorWalkthrough({ forceOpen = false, onClose }: CounsellorWalkthroughProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
      return;
    }

    try {
      const hasGreetedThisSession = sessionStorage.getItem(COUNSELLOR_SESSION_GREETED_KEY);
      if (!hasGreetedThisSession) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 350);
        return () => clearTimeout(timer);
      }
    } catch {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleClose = () => {
    try {
      sessionStorage.setItem(COUNSELLOR_SESSION_GREETED_KEY, 'true');
      localStorage.setItem(COUNSELLOR_ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // ignore
    }
    setIsOpen(false);
    onClose?.();
  };

  const handleNext = () => {
    if (currentStep < COUNSELLOR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = COUNSELLOR_STEPS[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[620px] rounded-xl border border-white/[0.12] bg-[#111]/95 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-[#f0f0f0]"
          >
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-44 w-96 rounded-full bg-[#c3f340]/[0.08] blur-3xl" />

            {/* Header: Badge & Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill tone={step.tone}>{step.badge}</Pill>
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                  Step {step.step} of {COUNSELLOR_STEPS.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors"
                title="Close Briefing"
              >
                <X size={18} />
              </button>
            </div>

            {/* Step Content */}
            <div className="mt-5">
              <h2 className="font-display text-2xl sm:text-3xl text-white leading-snug">
                {step.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/60">
                {step.description}
              </p>
            </div>

            {/* Key Features / Highlights */}
            <div className="mt-6 space-y-2.5">
              {step.features.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.label}
                    className="flex items-start gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3.5 transition-colors hover:border-white/[0.12]"
                  >
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#c3f340]/10 text-[#c3f340] border border-[#c3f340]/20">
                      <IconComponent size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{feat.label}</h4>
                      <p className="mt-0.5 text-[11px] leading-4 text-white/50">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer: Progress Indicators & Navigation */}
            <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-5">
              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {COUNSELLOR_STEPS.map((s, idx) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCurrentStep(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-6 bg-[#c3f340]'
                        : idx < currentStep
                        ? 'w-2.5 bg-white/40'
                        : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {currentStep > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1 rounded border border-white/15 bg-white/[0.03] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/80 hover:bg-white/[0.08] transition-colors"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/40 hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                )}

                <Magnetic>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.3)] transition hover:border-[#c3f340]"
                  >
                    {currentStep === COUNSELLOR_STEPS.length - 1 ? (
                      <>
                        Get Started <Check size={13} />
                      </>
                    ) : (
                      <>
                        Next <ArrowRight size={13} />
                      </>
                    )}
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
