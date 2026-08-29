'use client';

import React, { useState } from 'react';
import { CorrectionRequest } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react';

interface CorrectionRequestCardProps {
  requests: CorrectionRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function CorrectionRequestCard({ requests: initialRequests, onApprove, onReject }: CorrectionRequestCardProps) {
  const [requests, setRequests] = useState<CorrectionRequest[]>(initialRequests);

  const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (newStatus === 'approved') onApprove?.(id);
    if (newStatus === 'rejected') onReject?.(id);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((r) => (
          <TiltCard
            key={r.id}
            maxTilt={2}
            className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#c3f340] uppercase">{r.dataType}</span>
                  <Pill tone={r.status === 'approved' ? 'accent' : r.status === 'pending' ? 'warm' : 'default'}>
                    {r.status}
                  </Pill>
                </div>
                <span className="text-[11px] font-mono text-white/40">{r.submittedAt}</span>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold text-white">Student: {r.studentName} <span className="text-white/40 font-mono text-xs">({r.studentId})</span></p>
                <div className="rounded-lg bg-white/[0.03] p-3 text-xs border border-white/[0.04] space-y-1.5 mt-2">
                  <div>
                    <span className="text-white/40 uppercase text-[10px] block">Current Recorded Value:</span>
                    <span className="text-rose-300/90 font-mono">{r.currentValue}</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase text-[10px] block">Requested Correction:</span>
                    <span className="text-[#c3f340] font-mono">{r.requestedValue}</span>
                  </div>
                </div>
                <p className="text-xs text-white/70 mt-2">
                  <span className="text-white/40">Reason: </span>
                  {r.reason}
                </p>
              </div>
            </div>

            {r.status === 'pending' && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-end gap-2">
                <button
                  onClick={() => handleAction(r.id, 'rejected')}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-xs text-white/70 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 transition-all"
                >
                  <XCircle size={13} /> Reject
                </button>
                <button
                  onClick={() => handleAction(r.id, 'approved')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#c3f340] px-3 py-1.5 text-xs font-bold text-black hover:shadow-[0_0_12px_rgba(195,243,64,0.3)] transition-all"
                >
                  <CheckCircle size={13} /> Approve Correction
                </button>
              </div>
            )}
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
