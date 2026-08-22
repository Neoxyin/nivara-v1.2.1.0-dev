'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, ArrowRight, GraduationCap, HeartHandshake, LockKeyhole, Mail, KeyRound, Check, ShieldCheck, Building2 } from 'lucide-react';
import { FluidBackground } from '@/components/ui/fluid-background';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';
import { TiltCard } from '@/components/ui/tilt-card';
import { setUserRole } from '@/lib/auth';
import { loginApi } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'student' | 'counsellor'>('student');
  const [email, setEmail] = useState('aria.chen@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelect = (role: 'student' | 'counsellor') => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your institutional email');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      await loginApi(selectedRole, email, password);
      setUserRole(selectedRole);
      setIsLoading(false);
      if (selectedRole === 'counsellor') {
        router.push('/counsellor');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please verify your credentials.');
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'student' | 'counsellor') => {
    setSelectedRole(role);
    setUserRole(role);
    if (role === 'counsellor') {
      router.push('/counsellor');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="page-grain relative min-h-[100dvh] overflow-hidden bg-[#0a0a0a] text-[#f0f0f0]">
      <FluidBackground />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-80" />
        <div className="absolute right-[-10%] top-[16%] h-[560px] w-[760px] rounded-full border border-[#c3f340]/15" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <Magnetic>
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#c3f340] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.4)] transition-transform duration-200 ease-out group-hover:rotate-12 group-hover:scale-110">
              <Sparkles size={15} strokeWidth={2.7} />
            </span>
            <span className="text-sm font-extrabold uppercase tracking-[0.3em]">
              Nivara
            </span>
          </Link>
        </Magnetic>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/55 transition hover:text-white"
          >
            <ArrowLeft size={13} /> Back to home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex min-h-[calc(100dvh-80px)] items-center justify-center px-4 py-10">
        <TiltCard
          maxTilt={2}
          spotlightColor="rgba(195, 243, 64, 0.15)"
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111111]/95 p-6 sm:p-8 text-white shadow-[0_24px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#c3f340]/[0.08] blur-3xl" />

          <div>
            <Pill tone="accent" className="mb-2.5">
              <LockKeyhole size={11} className="mr-1 inline text-[#c3f340]" /> Secure SSO & Workspace Entry
            </Pill>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
              Sign in to your space
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-white/55">
              Select your institutional workspace to load your authenticated environment.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-3">
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
                Academic rhythm & private check-ins
              </p>
            </button>

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
                Caseload triage & cohort alerts
              </p>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-3.5">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                <LockKeyhole size={14} className="shrink-0" />
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
                  placeholder="student.id@university.edu"
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
          <div className="mt-6 border-t border-white/[0.08] pt-4">
            <div className="mb-2.5 flex items-center justify-between text-[10px] uppercase tracking-[.12em] text-white/40">
              <span>Instant 1-Click Demo Profiles</span>
              <span className="flex items-center gap-1 text-[#c3f340]/80">
                <ShieldCheck size={11} /> Sandboxed
              </span>
            </div>
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
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-white/35">
            <Building2 size={11} />
            <span>Campus Federated Identity • Zero Student Surveillance</span>
          </div>
        </TiltCard>
      </main>
    </div>
  );
}
