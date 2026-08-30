'use client';

import { useQuery } from '@tanstack/react-query';
import { getFinancialSupportOptions } from '@/lib/api/financial-support';
import { getPreferences } from '@/lib/api/preferences';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { Magnetic } from '@/components/ui/magnetic';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  LockKeyhole,
  GraduationCap,
  Receipt,
  Calendar,
  AlertCircle,
  Home,
  Coffee,
  Bus,
  BookOpen,
  Briefcase,
  Landmark,
  ShieldAlert
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'graduation-cap': <GraduationCap size={18} className="text-[#c3f340]" />,
  'receipt': <Receipt size={18} className="text-[#c3f340]" />,
  'calendar': <Calendar size={18} className="text-[#c3f340]" />,
  'alert-circle': <AlertCircle size={18} className="text-[#c3f340]" />,
  'home': <Home size={18} className="text-[#c3f340]" />,
  'coffee': <Coffee size={18} className="text-[#c3f340]" />,
  'bus': <Bus size={18} className="text-[#c3f340]" />,
  'book-open': <BookOpen size={18} className="text-[#c3f340]" />,
  'briefcase': <Briefcase size={18} className="text-[#c3f340]" />,
  'landmark': <Landmark size={18} className="text-[#c3f340]" />,
};

export default function FinancialSupportPage() {
  const { data: preferences, isLoading: prefsLoading, error: prefsError } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  
  // Use 'financial_support' matching the preference key in the system
  const hasConsent = (preferences?.find((p) => p.key === 'financial_support')?.status === 'CONSENTED');

  const { data: options, isLoading: optionsLoading, error: optionsError } = useQuery({ 
    queryKey: ['financialSupport', hasConsent], 
    queryFn: () => getFinancialSupportOptions()
  });

  const isLoading = prefsLoading || optionsLoading;
  const error = prefsError || optionsError;

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c3f340]" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="rise-in mx-auto max-w-4xl mt-12 text-center text-rose-400">
          <p>Failed to load financial support options. Please try again later.</p>
        </div>
      </AppShell>
    );
  }

  const isEmpty = !options || options.length === 0;

  return (
    <AppShell>
      <div className="rise-in">
        <SectionHeading
          eyebrow="Financial Navigator"
          title="Explore Support Options"
          description="NIVARA provides a directory of available financial resources. We do not determine your final eligibility, and exploring these options does not guarantee approval."
        />

        {!hasConsent && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-white/10 bg-[#151515] p-5 backdrop-blur-md">
            <LockKeyhole className="text-white/40 mt-0.5 shrink-0" size={18} />
            <div>
              <h4 className="text-sm font-semibold text-white">Personalized Matching Disabled</h4>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                Showing all general financial options. Personalized financial matching is paused in your settings.
              </p>
              <div className="mt-3">
                <Link href="/settings" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-white/70 transition-colors underline underline-offset-2">
                  Update Settings
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Explicit Non-eligibility Disclaimer */}
        <div className="mt-6 mb-8 flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.05] p-5 backdrop-blur-md">
          <ShieldAlert className="text-amber-400 mt-0.5 shrink-0" size={18} />
          <div>
            <h4 className="text-sm font-semibold text-white">Eligibility Notice</h4>
            <p className="mt-1 text-xs text-white/70 leading-relaxed">
              This navigator helps you discover institutional and external resources that you may want to explore. 
              <strong> Nivara does not determine final eligibility, and this is not a financial judgment or approval system.</strong>
            </p>
          </div>
        </div>

        {isEmpty ? (
          <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[#151515]/95 p-12 text-center mt-8">
            <h3 className="text-xl font-display text-white mb-2">No support options found</h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
              Financial support resources are currently unavailable. Please check back later or contact your institution&apos;s financial aid office.
            </p>
          </TiltCard>
        ) : (
          <StaggerContainer stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {options.map((option) => (
              <div key={option.id} className="stagger-item">
                <TiltCard
                  maxTilt={2}
                  className="h-full flex flex-col border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl transition-all hover:border-white/20 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.04] border border-white/[0.08]">
                      {iconMap[option.iconType] || <Landmark size={18} className="text-[#c3f340]" />}
                    </div>
                    <h4 className="font-semibold text-white">{option.type}</h4>
                  </div>
                  
                  <div className="flex-1 space-y-3 text-sm">
                    <p className="text-white/70">{option.shortExplanation}</p>
                    <div className="p-3 bg-white/[0.02] rounded border border-white/[0.04] text-white/50 text-xs leading-relaxed">
                      <strong className="text-white/70 font-medium">Why it may help:</strong> {option.whyItMayHelp}
                    </div>
                    <p className="text-[10px] text-white/40 italic mt-2">
                      {option.eligibilityNote || "Eligibility is determined by the provider, not Nivara."}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <Magnetic>
                      <Link
                        href={option.actionHref}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#c3f340] hover:text-[#dff77d] transition-colors"
                      >
                        {option.actionText} <ArrowUpRight size={13} />
                      </Link>
                    </Magnetic>
                  </div>
                </TiltCard>
              </div>
            ))}
          </StaggerContainer>
        )}
      </div>
    </AppShell>
  );
}
