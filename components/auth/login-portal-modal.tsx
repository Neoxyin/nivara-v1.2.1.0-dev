'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  LockKeyhole,
  Sparkles,
  X,
  ShieldCheck,
  Check,
  KeyRound,
  Mail,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';
import { setUserRole } from '@/lib/auth';
import { loginApi } from '@/lib/api/client';

interface LoginPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'student' | 'counsellor';
  lockedRole?: 'student' | 'counsellor' | null;
}

export function LoginPortalModal({
  isOpen,
  onClose,
  defaultRole = 'student',
  lockedRole = null,
}: LoginPortalModalProps) {
  const router = useRouter();
  const effectiveRole = lockedRole || defaultRole;
  const [selectedRole, setSelectedRole] = useState<'student' | 'counsellor'>(effectiveRole);
  const [email, setEmail] = useState(
    effectiveRole === 'student' ? 'aria.chen@university.edu' : 'a.ross@wellbeing.university.edu'
  );
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    const roleToUse = lockedRole || defaultRole;
    if (roleToUse) {
      setSelectedRole(roleToUse);
      setErrorMsg('');
      if (roleToUse === 'student') {
        setEmail('aria.chen@university.edu');
      } else {
        setEmail('a.ross@wellbeing.university.edu');
      }
    }
  }, [lockedRole, defaultRole, isOpen]);

  const handleRoleSelect = (role: 'student' | 'counsellor') => {
    if (lockedRole) return;
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'student') {
      setEmail('aria.chen@university.edu');
      setPassword('••••••••••••');
    } else {
      setEmail('a.ross@wellbeing.university.edu');
      setPassword('••••••••••••');
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your institutional email');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // Simulate crisp institutional SSO authentication
    try {
      await loginApi(selectedRole, email, password);
      setUserRole(selectedRole);
      setIsLoading(false);
      onClose();

      const targetPath = selectedRole === 'counsellor' ? '/counsellor' : '/dashboard';
      router.push(targetPath);
    } catch (err) {
      setErrorMsg('Login failed. Please verify your credentials.');
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'student' | 'counsellor') => {
    setSelectedRole(role);
    const demoEmail = role === 'student' ? 'aria.chen@university.edu' : 'a.ross@wellbeing.university.edu';
    
    setIsLoading(true);
    try {
      await loginApi(role, demoEmail);
      setUserRole(role);
      setIsLoading(false);
      onClose();
      const targetPath = role === 'counsellor' ? '/counsellor' : '/dashboard';
      router.push(targetPath);
    } catch (err) {
      setErrorMsg('Quick login failed');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 text-white shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_30px_rgba(195,243,64,0.06)] backdrop-blur-2xl my-auto"
          >
            {/* Ambient inner glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#c3f340]/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#275a43]/[0.18] blur-3xl" />

            {/* Header with Close */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.4)]">
                  <Sparkles size={14} strokeWidth={2.7} />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-white">
                  Nivara Portal
                </span>
              </div>
              <button
                onClick={onClose}
                className="grid h-7 w-7 place-items-center rounded-full text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            </div>

            {/* Title & Introduction */}
            <div className="mt-5">
              <Pill tone="accent" className="mb-2.5">
                <LockKeyhole size={11} className="mr-1 inline text-[#c3f340]" /> Secure SSO & Workspace Entry
              </Pill>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                {lockedRole === 'student'
                  ? 'Sign in to Student Space'
                  : lockedRole === 'counsellor'
                  ? 'Sign in to Counsellor Portal'
                  : 'Sign in to your space'}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-white/55">
                {lockedRole === 'student'
                  ? 'Access your private student sanctuary, check-ins, and coursework rhythm.'
                  : lockedRole === 'counsellor'
                  ? 'Access clinical caseload triage, student appointments, and notes.'
                  : 'Select your institutional workspace to load your authenticated environment.'}
              </p>
            </div>

            {/* Role Display / Selector */}
            {lockedRole === 'student' ? (
              <div className="mt-5 flex items-center gap-3 p-3.5 rounded-xl border border-[#c3f340]/40 bg-[#c3f340]/[0.08] shadow-[0_0_16px_rgba(195,243,64,0.12)]">
                <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#c3f340]/40 bg-[#c3f340]/20 text-[#c3f340]">
                  <GraduationCap size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Student Space</p>
                    <span className="text-[9px] font-bold uppercase tracking-[.1em] text-[#c3f340] border border-[#c3f340]/30 bg-[#c3f340]/10 px-2 py-0.5 rounded-full">
                      Selected Role
                    </span>
                  </div>
                  <p className="text-[11px] leading-tight text-white/55 mt-0.5">
                    Academic rhythm, energy & private check-ins
                  </p>
                </div>
              </div>
            ) : lockedRole === 'counsellor' ? (
              <div className="mt-5 flex items-center gap-3 p-3.5 rounded-xl border border-[#c3f340]/40 bg-[#c3f340]/[0.08] shadow-[0_0_16px_rgba(195,243,64,0.12)]">
                <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#c3f340]/40 bg-[#c3f340]/20 text-[#c3f340]">
                  <HeartHandshake size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Counsellor Space</p>
                    <span className="text-[9px] font-bold uppercase tracking-[.1em] text-[#c3f340] border border-[#c3f340]/30 bg-[#c3f340]/10 px-2 py-0.5 rounded-full">
                      Selected Role
                    </span>
                  </div>
                  <p className="text-[11px] leading-tight text-white/55 mt-0.5">
                    Caseload triage, cohort alerts & clinical notes
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {/* Student Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('student')}
                  className={`relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-200 ${
                    selectedRole === 'student'
                      ? 'border-[#c3f340] bg-[#c3f340]/[0.08] shadow-[0_0_16px_rgba(195,243,64,0.12)]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg border ${
                        selectedRole === 'student'
                          ? 'border-[#c3f340]/40 bg-[#c3f340]/20 text-[#c3f340]'
                          : 'border-white/10 bg-white/5 text-white/50'
                      }`}
                    >
                      <GraduationCap size={16} />
                    </div>
                    {selectedRole === 'student' && (
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-[#c3f340] text-[#0d1408]">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-xs font-bold text-white">Student Space</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-white/45">
                    Academic rhythm, energy & private check-ins
                  </p>
                </button>

                {/* Counsellor Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('counsellor')}
                  className={`relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-200 ${
                    selectedRole === 'counsellor'
                      ? 'border-[#c3f340] bg-[#c3f340]/[0.08] shadow-[0_0_16px_rgba(195,243,64,0.12)]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg border ${
                        selectedRole === 'counsellor'
                          ? 'border-[#c3f340]/40 bg-[#c3f340]/20 text-[#c3f340]'
                          : 'border-white/10 bg-white/5 text-white/50'
                      }`}
                    >
                      <HeartHandshake size={16} />
                    </div>
                    {selectedRole === 'counsellor' && (
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-[#c3f340] text-[#0d1408]">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-xs font-bold text-white">Counsellor Space</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-white/45">
                    Caseload triage, cohort alerts & clinical notes
                  </p>
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-white/50">
                  Institutional Email / Campus ID
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={
                      selectedRole === 'student'
                        ? 'student.id@university.edu'
                        : 'counsellor.staff@university.edu'
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-xs text-white placeholder-white/25 outline-none transition focus:border-[#c3f340] focus:bg-white/[0.07]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[.14em] text-white/50">
                    Security Passkey / SSO
                  </label>
                  <span className="text-[10px] text-[#c3f340]/80">Campus SSO Verified</span>
                </div>
                <div className="relative">
                  <KeyRound
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-xs text-white placeholder-white/25 outline-none transition focus:border-[#c3f340] focus:bg-white/[0.07]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-sweep relative flex w-full items-center justify-center gap-2 rounded-lg border border-[#c3f340] bg-[#c3f340] py-3 text-xs font-bold uppercase tracking-[.14em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.35)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0d1408] border-t-transparent" />
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        Sign In to {selectedRole === 'student' ? 'Student Space' : 'Counsellor Space'}
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-5 border-t border-white/[0.08] pt-4">
              <div className="mb-2.5 flex items-center justify-between text-[10px] uppercase tracking-[.12em] text-white/40">
                <span>
                  {lockedRole ? 'Instant 1-Click Demo Profile' : 'Instant 1-Click Demo Profiles'}
                </span>
                <span className="flex items-center gap-1 text-[#c3f340]/80">
                  <ShieldCheck size={11} /> Sandboxed
                </span>
              </div>

              {lockedRole === 'student' ? (
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  className="group flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-left transition hover:border-[#c3f340]/40 hover:bg-[#c3f340]/[0.05]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white group-hover:text-[#c3f340]">
                      Aria Chen
                    </p>
                    <p className="text-[10px] text-white/40">Student Demo Profile · Engineering</p>
                  </div>
                  <ArrowRight size={13} className="text-white/30 group-hover:text-[#c3f340]" />
                </button>
              ) : lockedRole === 'counsellor' ? (
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('counsellor')}
                  className="group flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-left transition hover:border-[#c3f340]/40 hover:bg-[#c3f340]/[0.05]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white group-hover:text-[#c3f340]">
                      Dr. A. Ross
                    </p>
                    <p className="text-[10px] text-white/40">Counsellor Demo Profile · Wellbeing Lead</p>
                  </div>
                  <ArrowRight size={13} className="text-white/30 group-hover:text-[#c3f340]" />
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('student')}
                    className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-left transition hover:border-[#c3f340]/40 hover:bg-[#c3f340]/[0.05]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-white group-hover:text-[#c3f340]">
                        Aria Chen
                      </p>
                      <p className="text-[9px] text-white/40">Student Demo</p>
                    </div>
                    <ArrowRight size={12} className="text-white/30 group-hover:text-[#c3f340]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('counsellor')}
                    className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-left transition hover:border-[#c3f340]/40 hover:bg-[#c3f340]/[0.05]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-white group-hover:text-[#c3f340]">
                        Dr. A. Ross
                      </p>
                      <p className="text-[9px] text-white/40">Counsellor Demo</p>
                    </div>
                    <ArrowRight size={12} className="text-white/30 group-hover:text-[#c3f340]" />
                  </button>
                </div>
              )}
            </div>

            {/* Privacy footer guarantee */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-white/35">
              <Building2 size={11} />
              <span>Campus Federated Identity • Zero Student Surveillance</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
