import React from 'react';
import { TiltCard } from '@/components/ui/tilt-card';
import { GraduationCap, Landmark, HeartPulse, AlertCircle, HelpCircle, Lock, ShieldAlert } from 'lucide-react';
import type { SupportNeedProfileData, SupportNeedIndicator, SupportNeedLevel, SupportDimension } from '@/lib/types';
import { ExplainabilityDialog } from './explainability-dialog';

interface SupportNeedBadgeProps {
  indicator?: SupportNeedIndicator;
  isLoading?: boolean;
  isError?: boolean;
  hideContributingFactors?: boolean;
}

const DIMENSION_ICONS = {
  'Academic': GraduationCap,
  'Financial': Landmark,
  'Well-being': HeartPulse,
};

const LEVEL_STYLES: Record<SupportNeedLevel, { text: string; bg: string; border: string }> = {
  'LOW': { text: 'text-[#c3f340]', bg: 'bg-[rgba(195,243,64,.1)]', border: 'border-[#c3f340]/20' },
  'MILD': { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  'MODERATE': { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  'HIGH': { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
};

function SupportNeedBadge({ indicator, isLoading, isError, hideContributingFactors = false }: SupportNeedBadgeProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.05] bg-white/[0.02] animate-pulse">
        <div className="h-4 w-20 bg-white/10 rounded" />
        <div className="h-4 w-12 bg-white/10 rounded" />
      </div>
    );
  }

  if (isError || !indicator) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.05] bg-white/[0.01]">
        <div className="flex items-center gap-2 text-white/40">
          <AlertCircle size={14} />
          <span className="text-xs font-medium">Data Error</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-white/20">Assessment unavailable</span>
      </div>
    );
  }

  const Icon = DIMENSION_ICONS[indicator.dimension] || HelpCircle;
  const isAvailable = indicator.available;
  const isStale = Boolean(indicator.stale);
  const styles = isAvailable && indicator.level
    ? (isStale 
        ? { text: 'text-amber-300', bg: 'bg-amber-400/[0.04]', border: 'border-amber-400/25' } 
        : LEVEL_STYLES[indicator.level]) 
    : { text: 'text-white/40', bg: 'bg-white/[0.03]', border: 'border-white/[0.05]' };

  return (
    <div className={`flex flex-col p-3.5 rounded-lg border transition-colors ${styles.border} ${styles.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className={styles.text} />
          <span className="text-xs font-medium text-white/80">{indicator.dimension} Support Need</span>
        </div>
        <div className="flex items-center gap-2">
          {isAvailable && indicator.level ? (
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.bg} ${styles.text} border ${styles.border}`}>
              {indicator.level}
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-white/30">Assessment unavailable</span>
          )}
        </div>
      </div>
      {isAvailable && isStale && (
        <p className="mt-2 text-[10px] leading-4 text-amber-200/80">
          Generated while permission was enabled. This earlier assessment is no longer updated using new data after withdrawal.
        </p>
      )}
      {isAvailable && !hideContributingFactors && (
        <div className="mt-2.5 pt-2 border-t border-white/[0.06]">
          <span className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5 block">Relevant Consented Contributing Factors:</span>
          <ul className="flex flex-col gap-1">
            {indicator.signals && indicator.signals.length > 0 ? (
              indicator.signals.map((signal, idx) => (
                <li key={idx} className="text-[11px] text-white/70 flex items-start gap-1.5 leading-snug">
                  <span className={`mt-[4px] h-1 w-1 shrink-0 rounded-full bg-current ${styles.text}`} />
                  <span>{signal}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] text-white/50 italic">No elevated support indicators detected in permitted records</li>
            )}
          </ul>
          
          {indicator.explainability && (
            <div className="mt-2 flex justify-start">
              <ExplainabilityDialog 
                title={`${indicator.dimension} Support Details`}
                isStale={isStale}
                description={
                  isStale 
                    ? "This earlier assessment was generated while permission was enabled and is retained based on your choice. It is no longer updated using new data."
                    : undefined
                }
                contributingFactors={indicator.explainability.contributingFactors}
                timeWindow={indicator.explainability.timeWindow}
                dataUsed={indicator.explainability.dataUsed}
                dataNotUsed={indicator.explainability.dataNotUsed}
              />
            </div>
          )}
        </div>
      )}
      {isAvailable && hideContributingFactors && (
        <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center gap-1.5 text-[10px] text-white/40">
          <Lock size={11} className="text-amber-400/80 shrink-0" />
          <span className="italic">Contributing factors locked pending appointment acceptance by assigned counsellor</span>
        </div>
      )}
    </div>
  );
}

interface SupportNeedProfileProps {
  data?: SupportNeedProfileData;
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
  hideContributingFactors?: boolean;
  isAssignedCounsellor?: boolean;
  assignedCounsellorName?: string;
  privacyNotice?: React.ReactNode;
}

export function SupportNeedProfile({
  data,
  isLoading,
  isError,
  className = '',
  hideContributingFactors = false,
  isAssignedCounsellor = true,
  assignedCounsellorName,
  privacyNotice,
}: SupportNeedProfileProps) {
  if (isAssignedCounsellor === false) {
    return (
      <TiltCard maxTilt={1} className={`border border-white/[0.08] bg-[#141414]/90 p-5 rounded-xl backdrop-blur-xl ${className}`}>
        <div className="flex items-center gap-2 mb-3 text-amber-400">
          <ShieldAlert size={16} />
          <h3 className="text-sm font-semibold text-white">Support Assessment Restricted</h3>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-3.5 text-xs leading-relaxed text-white/70">
          <p>
            You are not the assigned counsellor for this student. Detailed support need assessments and contributing factors are strictly confidential to <strong>{assignedCounsellorName || 'the assigned counsellor'}</strong>.
          </p>
          <p className="mt-2 text-[10px] text-white/40">
            Basic student identity and course information are permitted for directory navigation.
          </p>
        </div>
      </TiltCard>
    );
  }

  return (
    <TiltCard maxTilt={1} className={`border border-white/[0.08] bg-[#141414]/90 p-5 rounded-xl backdrop-blur-xl ${className}`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Support Need Dimensions</h3>
          <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
            Three independent dimensions of student support. These are not disciplinary classifications or risk scores.
          </p>
        </div>
      </div>

      {privacyNotice && (
        <div className="mb-3">
          {privacyNotice}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <SupportNeedBadge 
          indicator={data?.academic ?? { dimension: 'Academic', available: false }} 
          isLoading={isLoading} 
          isError={isError}
          hideContributingFactors={hideContributingFactors}
        />
        <SupportNeedBadge 
          indicator={data?.financial ?? { dimension: 'Financial', available: false }} 
          isLoading={isLoading} 
          isError={isError} 
          hideContributingFactors={hideContributingFactors}
        />
        <SupportNeedBadge 
          indicator={data?.wellbeing ?? { dimension: 'Well-being', available: false }} 
          isLoading={isLoading} 
          isError={isError} 
          hideContributingFactors={hideContributingFactors}
        />
      </div>
    </TiltCard>
  );
}
