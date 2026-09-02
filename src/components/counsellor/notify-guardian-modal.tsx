'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { TiltCard } from '@/components/ui/tilt-card';
import {
  ShieldAlert,
  X,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifyGuardian } from '@/lib/api/counsellors';
import type { GuardianNotification } from '@/lib/types';

interface NotifyGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  sessionId: string;
  activeCounsellorName: string;
  onNotified?: (entry: GuardianNotification) => void;
}

export function NotifyGuardianModal({
  isOpen,
  onClose,
  studentName,
  sessionId,
  activeCounsellorName,
  onNotified,
}: NotifyGuardianModalProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!reason.trim()) {
        throw new Error('Please document the clinical reasoning for this decision.');
      }
      if (!confirmed) {
        throw new Error('Please confirm this is your professional judgement following consultation.');
      }
      return notifyGuardian({ sessionId, requestingCounsellorName: activeCounsellorName, reason });
    },
    onSuccess: (entry) => {
      setSuccessMsg('Parent / guardian notification recorded ✓');
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      queryClient.invalidateQueries({ queryKey: ['guardianNotification', sessionId] });
      if (onNotified) onNotified(entry);
      setTimeout(() => {
        setSuccessMsg(null);
        setReason('');
        setConfirmed(false);
        onClose();
      }, 1400);
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || 'Failed to record notification.');
    },
  });

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      data-testid="modal-backdrop-notify-guardian"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg overflow-hidden">
        <TiltCard
          maxTilt={1.5}
          className="rounded-2xl border border-amber-400/[0.25] bg-[#111111]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,.95)] backdrop-blur-2xl text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-300" />
                <h3 className="font-display text-xl text-white">Notify Parent / Guardian</h3>
              </div>
              <p className="mt-1 text-xs text-white/50">
                For <strong className="text-white">{studentName}</strong> — a serious, human clinical decision, made after direct consultation.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.07] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Explainer */}
          <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-3 text-[11px] leading-relaxed text-white/70">
            Nivara never contacts a parent or guardian automatically. This action is only available to the
            counsellor who has directly consulted with the student, and is logged as your own professional
            judgement — as disclosed in the Privacy Policy's Severe Risk & Parental Notification section.
          </div>

          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle size={14} />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 size={14} />
              {successMsg}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setErrorMsg(null);
              mutation.mutate();
            }}
            className="mt-5 space-y-4"
          >
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-white/50 mb-2">
                Clinical Reasoning *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={mutation.isPending}
                rows={4}
                placeholder="Document why, following your consultation, you have assessed this as a serious risk requiring parental involvement..."
                className="w-full rounded-lg border border-white/[0.12] bg-[#181818] p-3.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400/60 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <label className="flex items-start gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-xs text-white/70">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={mutation.isPending}
                className="mt-0.5 h-3.5 w-3.5 accent-amber-400"
              />
              <span>
                I confirm this reflects my own professional judgement following direct consultation with the
                student, not an automated system decision.
              </span>
            </label>

            <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
              <div className="flex items-center gap-1.5 text-[10px] text-white/35">
                <ShieldCheck size={12} className="text-white/30" />
                Action is permanently logged for audit
              </div>
              <button
                type="submit"
                disabled={mutation.isPending || !reason.trim() || !confirmed}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-400 px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-[#241a04] shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {mutation.isPending ? 'Recording...' : 'Confirm & Notify'}
              </button>
            </div>
          </form>
        </TiltCard>
      </div>
    </div>,
    document.body
  );
}
