'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, Info, ShieldCheck, Database, Calendar } from 'lucide-react';

export interface ExplainabilityProps {
  title?: string;
  trigger?: React.ReactNode;
  contributingFactors: string[];
  timeWindow?: string;
  dataUsed: string[];
  dataNotUsed?: string[];
}

export function ExplainabilityDialog({
  title = "Why am I seeing this?",
  trigger,
  contributingFactors,
  timeWindow,
  dataUsed,
  dataNotUsed,
}: ExplainabilityProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium text-white/40 hover:text-white/80 transition-colors mt-2">
            <HelpCircle size={12} />
            <span>Why am I seeing this?</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="border-white/[0.08] bg-[#141414] text-white p-6 sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-white">
            <HelpCircle size={20} className="text-white/60" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-white/60 mt-1.5 text-sm">
            Based on your consented information, this indicator was generated to help connect you with relevant support.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contributing Factors */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
              <Info size={16} className="text-white/60" />
              Contributing factors
            </h4>
            <ul className="space-y-1.5 ml-6 list-disc text-sm text-white/70 marker:text-white/30">
              {contributingFactors.map((factor, idx) => (
                <li key={idx} className="pl-1">{factor}</li>
              ))}
            </ul>
          </div>

          {/* Time Window */}
          {timeWindow && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
                <Calendar size={16} className="text-white/60" />
                Relevant time period
              </h4>
              <p className="text-sm text-white/70 ml-6">{timeWindow}</p>
            </div>
          )}

          {/* Data Used */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
                <Database size={16} className="text-[#c3f340]/80" />
                Data used
              </h4>
              <ul className="space-y-1.5 ml-6 list-disc text-sm text-white/70 marker:text-white/30">
                {dataUsed.map((item, idx) => (
                  <li key={idx} className="pl-1">{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Data Not Used */}
            {dataNotUsed && dataNotUsed.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
                  <ShieldCheck size={16} className="text-rose-400/80" />
                  Data not used
                </h4>
                <ul className="space-y-1.5 ml-6 list-disc text-sm text-white/50 marker:text-white/20">
                  {dataNotUsed.map((item, idx) => (
                    <li key={idx} className="pl-1">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Non-punitive Statement */}
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4 mt-2">
            <h4 className="flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
              <ShieldCheck size={14} className="text-[#c3f340]" />
              Non-Punitive Assurance
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              This support indicator is intended to help connect you with support. It does not affect your grades, benefits, attendance penalties, discipline, or institutional eligibility.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
