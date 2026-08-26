import React from 'react';
import { TiltCard } from '@/components/ui/tilt-card';
import { GraduationCap, Landmark, HeartPulse, AlertCircle, HelpCircle } from 'lucide-react';
import type { SupportNeedProfileData, SupportNeedIndicator, SupportNeedLevel, SupportDimension } from '@/lib/types';
import { ExplainabilityDialog } from './explainability-dialog';

interface SupportNeedBadgeProps {
  indicator?: SupportNeedIndicator;
  isLoading?: boolean;
  isError?: boolean;
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
  'UNAVAILABLE': { text: 'text-white/40', bg: 'bg-white/[0.03]', border: 'border-white/[0.05]' },
};

function SupportNeedBadge({ indicator, isLoading, isError }: SupportNeedBadgeProps) {
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
        <span className="text-[10px] uppercase tracking-wider text-white/20">Unavailable</span>
      </div>
    );
  }

  const Icon = DIMENSION_ICONS[indicator.dimension] || HelpCircle;
  const isAvailable = indicator.available;
  const isStale = Boolean(indicator.stale);
  const styles = isAvailable 
    ? (isStale 
        ? { text: 'text-amber-300', bg: 'bg-amber-400/[0.04]', border: 'border-amber-400/25' } 
        : LEVEL_STYLES[indicator.level]) 
    : { text: 'text-white/40', bg: 'bg-white/[0.03]', border: 'border-white/[0.05]' };

  return (
    <div className={`flex flex-col p-3.5 rounded-lg border transition-colors ${styles.border} ${styles.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className={styles.text} />
          <span className="text-xs font-medium text-white/80">{indicator.dimension}</span>
        </div>
        <div className="flex flex-col items-end">
          {isAvailable ? (
            <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.text}`}>
              {isStale ? 'Previous assessment' : 'Personalized result'}
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-white/30">No Data</span>
          )}
        </div>
      </div>
      {isAvailable && isStale && (
        <p className="mt-2 text-[10px] leading-4 text-amber-200/80">
          Generated while permission was enabled. This earlier assessment is no longer updated using new data after withdrawal.
        </p>
      )}
      {isAvailable && (
        <div className="mt-2 pt-2 border-t border-white/[0.05]">
          <span className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5 block">Contributing Signals:</span>
          <ul className="flex flex-col gap-1">
            {indicator.signals && indicator.signals.length > 0 ? (
              indicator.signals.map((signal, idx) => (
                <li key={idx} className="text-[11px] text-white/70 flex items-start gap-1.5 leading-snug">
                  <span className={`mt-[4px] h-1 w-1 shrink-0 rounded-full bg-current ${styles.text}`} />
                  <span>{signal}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] text-white/50 italic">No elevated risk signals detected in permitted records</li>
            )}
          </ul>
          
          {indicator.explainability && (
            <div className="mt-1.5 flex justify-start">
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
    </div>
  );
}

interface SupportNeedProfileProps {
  data?: SupportNeedProfileData;
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
}

export function SupportNeedProfile({ data, isLoading, isError, className = '' }: SupportNeedProfileProps) {
  return (
    <TiltCard maxTilt={1} className={`border border-white/[0.08] bg-[#141414]/90 p-5 rounded-xl backdrop-blur-xl ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Support Need Profile</h3>
        <p className="text-xs text-white/50 mt-1 leading-relaxed">
          Independent dimensions of student support needs. These are not disciplinary metrics.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <SupportNeedBadge 
          indicator={data?.academic ?? { dimension: 'Academic', level: 'UNAVAILABLE', available: false }} 
          isLoading={isLoading} 
          isError={isError} 
        />
        <SupportNeedBadge 
          indicator={data?.financial ?? { dimension: 'Financial', level: 'UNAVAILABLE', available: false }} 
          isLoading={isLoading} 
          isError={isError} 
        />
        <SupportNeedBadge 
          indicator={data?.wellbeing ?? { dimension: 'Well-being', level: 'UNAVAILABLE', available: false }} 
          isLoading={isLoading} 
          isError={isError} 
        />
      </div>
    </TiltCard>
  );
}
