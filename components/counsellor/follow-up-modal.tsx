'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';
import {
  Calendar,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFollowUp } from '@/lib/api/counsellors';
import type { CounsellorFollowUp } from '@/lib/types';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentEmail?: string;
  course?: string;
  year?: number;
  sessionId?: string;
  activeCounsellorName: string;
  defaultReason?: string;
  onCreated?: (followUp: CounsellorFollowUp) => void;
}

export function FollowUpModal({
  isOpen,
  onClose,
  studentName,
  studentEmail,
  course,
  year,
  sessionId,
  activeCounsellorName,
  defaultReason = '',
  onCreated,
}: FollowUpModalProps) {
  const queryClient = useQueryClient();
  const [dueDate, setDueDate] = useState('Next Week');
  const [customDate, setCustomDate] = useState('');
  const [reason, setReason] = useState(defaultReason);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => {
      const finalDueDate = dueDate === 'Custom' ? customDate.trim() : dueDate;
      if (!finalDueDate) {
        throw new Error('Please select or specify a follow-up due date.');
      }
      if (!reason.trim()) {
        throw new Error('Please provide a reason for the follow-up.');
      }

      return createFollowUp(
        {
          sessionId,
          studentName,
          studentEmail,
          course,
          year,
          dueDate: finalDueDate,
          reason: reason.trim(),
          notes: notes.trim(),
          counsellorName: activeCounsellorName,
        },
        activeCounsellorName
      );
    },
    onSuccess: (newFollowUp) => {
      setSuccessMsg('Follow-up scheduled successfully ✓');
      queryClient.invalidateQueries({ queryKey: ['counsellorFollowUps'] });
      queryClient.invalidateQueries({ queryKey: ['appointedSessions'] });
      if (onCreated) onCreated(newFollowUp);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || 'Failed to schedule follow-up.');
    },
  });

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      data-testid="modal-backdrop-follow-up"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden"
      >
        <TiltCard
          maxTilt={1.5}
          className="rounded-2xl border border-white/[0.14] bg-[#111111]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,.95)] backdrop-blur-2xl text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#c3f340]" />
                <h3 className="font-display text-xl text-white">Schedule Support Follow-Up</h3>
              </div>
              <p className="mt-1 text-xs text-white/50">
                Create a confidential follow-up reminder for <strong className="text-white">{studentName}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={createMutation.isPending}
              className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.07] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-[#c3f340]/20 bg-[#c3f340]/[0.04] p-3 text-[11px] text-white/70">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#c3f340]" />
              <span>
                Assigned Counsellor: <strong className="text-[#c3f340]">{activeCounsellorName}</strong> (Private)
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/35">Counsellor Access Only</span>
          </div>

          {/* Feedback states */}
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

          {/* Form Content */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setErrorMsg(null);
              createMutation.mutate();
            }}
            className="mt-5 space-y-4"
          >
            {/* Target Window Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-white/50 mb-2">
                Follow-Up Timeframe / Due Window
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Tomorrow', 'In 3 Days', 'Next Week', 'Custom'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setDueDate(option);
                      setErrorMsg(null);
                    }}
                    className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all ${
                      dueDate === option
                        ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#c3f340]'
                        : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {dueDate === 'Custom' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    placeholder="e.g. 24 March · 14:00 or In 2 weeks"
                    className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#c3f340]/50"
                  />
                </div>
              )}
            </div>

            {/* Follow-Up Reason */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-white/50 mb-1.5">
                Support Reason / Focus <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="e.g. Review coursework sprint pacing, check-in on lab milestone"
                className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#c3f340]/50"
              />
            </div>

            {/* Action Plan / Confidential Notes */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-white/50 mb-1.5">
                Private Consultation Context / Action Steps (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Document any agreed milestones, pacing targets, or check-in questions..."
                className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] p-3 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#c3f340]/50 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={createMutation.isPending}
                className="rounded-lg border border-white/[0.1] px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-sweep inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340] bg-[#c3f340] px-5 py-2 text-xs font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_16px_rgba(195,243,64,0.25)] disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" /> Saving...
                  </>
                ) : (
                  'Schedule Follow-Up'
                )}
              </button>
            </div>
          </form>
        </TiltCard>
      </div>
    </div>,
    document.body
  );
}
