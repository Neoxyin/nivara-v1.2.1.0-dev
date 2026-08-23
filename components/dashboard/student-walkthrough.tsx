'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Activity,
  Compass,
  CalendarCheck2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Clock3,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';

interface StudentWalkthroughProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const STEPS = [
  {
    step: 1,
    badge: 'Welcome to Nivara',
    tone: 'accent' as const,
    title: 'Your private academic rhythm & wellbeing space',
    description:
      'Nivara is built from the ground up for students. It helps you pace your deadlines, reflect on daily study energy, and prevent burnout before crunch weeks arrive.',
    features: [
      {
        icon: ShieldCheck,
        label: '100% Confidential',
        desc: 'You control what to log. No surveillance, explainable signals only.',
      },
      {
        icon: Activity,
        label: 'Rhythm, Not Just Grades',
        desc: 'Track energy, focus, and sleep patterns alongside coursework.',
      },
      {
        icon: HeartHandshake,
        label: 'Direct Support',
        desc: 'Connect with on-duty university counsellors whenever you want.',
      },
    ],
  },
  {
    step: 2,
    badge: 'Daily Pulse · 30s Check-In',
    tone: 'accent' as const,
    title: 'Quick daily reflection that works for you',
    description:
      'Take 30 seconds each day to log how your studies feel. Nivara calculates your personal rhythm curve to flag overlapping friction points before you feel overwhelmed.',
    features: [
      {
        icon: Clock3,
        label: 'Under 30 Seconds',
        desc: 'Quick mood, energy, and sleep sliders designed for zero cognitive load.',
      },
      {
        icon: Activity,
        label: 'Early Warning Detection',
        desc: 'See upcoming deadline clusters before they collide with low energy dips.',
      },
      {
        icon: Sparkles,
        label: 'Private Journaling',
        desc: 'Add optional notes to look back on what study methods worked best.',
      },
    ],
  },
  {
    step: 3,
    badge: 'Explainable AI Signals',
    tone: 'warm' as const,
    title: 'Transparent insights into your coursework',
    description:
      'No mysterious black-box algorithms. Every suggestion shows exact factors—like tight milestone intervals or late-night revision bursts—with clear, actionable guidance.',
    features: [
      {
        icon: Compass,
        label: 'Clear Reason Trails',
        desc: 'Understand why a module is flagged as high friction or smooth sailing.',
      },
      {
        icon: Activity,
        label: 'Workload Forecast',
        desc: 'Visualize your upcoming 14-day effort trajectory across all modules.',
      },
      {
        icon: ShieldCheck,
        label: 'Student-Authoritative',
        desc: 'Dismiss or tweak insights that don’t align with your real routine.',
      },
    ],
  },
  {
    step: 4,
    badge: 'Confidential Support',
    tone: 'plum' as const,
    title: 'Book a friendly 1-on-1 chat in one click',
    description:
      'Need help with coursework stress, transition to campus, or accessibility accommodations? University specialists are ready for confidential 20-minute chats.',
    features: [
      {
        icon: CalendarCheck2,
        label: 'Instant Scheduling',
        desc: 'Pick an open slot today or tomorrow with no tedious paperwork.',
      },
      {
        icon: ShieldCheck,
        label: 'Zero Commitment',
        desc: 'A chat is just a conversation. Reschedule or cancel anytime.',
      },
      {
        icon: HeartHandshake,
        label: 'Tailored Specializations',
        desc: 'Filter by study pressure, focus, anxiety, or transition support.',
      },
    ],
  },
];

const ONBOARDING_STORAGE_KEY = 'nivara_student_onboarding_completed';

export function StudentWalkthrough({ forceOpen = false, onClose }: StudentWalkthroughProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // This walkthrough is user-triggered by the notification/help action in
  // AppShell. It must never open automatically when the workspace mounts.
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, [forceOpen]);

  const handleComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsOpen(false);
    onClose?.();
  };

  const handleLaunchCheckIn = () => {
    handleComplete();
    router.push('/check-in');
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const stepData = STEPS[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop blur & overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleComplete}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 text-white shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_30px_rgba(195,243,64,0.06)] backdrop-blur-2xl"
          >
            {/* Ambient inner glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#c3f340]/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#275a43]/[0.18] blur-3xl" />

            {/* Header with Step indicator & Close button */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Pill tone={stepData.tone}>
                  <Sparkles size={11} className="mr-1 inline text-[#c3f340]" /> {stepData.badge}
                </Pill>
                <span className="text-[11px] font-mono text-white/40 tracking-wider">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
              </div>
              <button
                onClick={handleComplete}
                className="grid h-7 w-7 place-items-center rounded-full text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors"
                aria-label="Skip walkthrough"
              >
                <X size={15} />
              </button>
            </div>

            {/* Step Content with Animation */}
            <div className="py-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                      {stepData.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/60">
                      {stepData.description}
                    </p>
                  </div>

                  {/* Feature cards list */}
                  <div className="grid gap-2.5 pt-2">
                    {stepData.features.map((feat, idx) => {
                      const Icon = feat.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                        >
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#1a1a1a] text-[#c3f340] border border-white/[0.08]">
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white/90">{feat.label}</p>
                            <p className="text-[11px] leading-normal text-white/50">{feat.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step Dots & Navigation Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? 'w-6 bg-[#c3f340] shadow-[0_0_8px_rgba(195,243,64,0.6)]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleLaunchCheckIn}
                    className="inline-flex items-center gap-1 rounded border border-[#c3f340]/40 bg-[#c3f340]/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#dff77d] hover:bg-[#c3f340]/25 transition-colors"
                  >
                    <Clock3 size={12} className="text-[#c3f340]" /> Do Check-In Now
                  </button>
                ) : null}

                {currentStep > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-[.1em] text-white/50 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-3 py-2 text-[11px] font-bold uppercase tracking-[.1em] text-white/40 hover:text-white/70 transition-colors"
                  >
                    Skip Tour
                  </button>
                )}

                <Magnetic>
                  <button
                    onClick={handleNext}
                    className="btn-sweep inline-flex items-center gap-2 rounded-lg border border-[#c3f340] bg-[#c3f340] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.12em] text-[#0d1408] shadow-[0_0_18px_rgba(195,243,64,0.3)] transition-all hover:scale-102"
                  >
                    {currentStep === STEPS.length - 1 ? (
                      <>
                        Got it, enter Nivara <Check size={13} strokeWidth={3} />
                      </>
                    ) : (
                      <>
                        Next <ArrowRight size={13} strokeWidth={2.5} />
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
