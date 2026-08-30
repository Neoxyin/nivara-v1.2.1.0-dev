'use client';

import React, { useState } from 'react';
import { CorrectionRequest, CorrectionAuditRecord } from '@/lib/types/admin';
import { correctionAuditTrail as initialAuditTrail } from '@/lib/data/admin';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import {
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Filter,
  FileCheck,
  History,
  Info,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CorrectionRequestCardProps {
  requests: CorrectionRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

export function CorrectionRequestCard({
  requests: initialRequests,
  onApprove,
  onReject,
}: CorrectionRequestCardProps) {
  const [requests, setRequests] = useState<CorrectionRequest[]>(initialRequests);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [auditLogs, setAuditLogs] = useState(initialAuditTrail);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);

  // Modal States
  const [activeApproveModal, setActiveApproveModal] = useState<CorrectionRequest | null>(null);
  const [activeRejectModal, setActiveRejectModal] = useState<CorrectionRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  // Handle Approve
  const handleConfirmApprove = () => {
    if (!activeApproveModal) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updatedId = activeApproveModal.id;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === updatedId
          ? {
              ...r,
              status: 'approved',
              reviewedAt: now,
              reviewedBy: 'Admin',
              reviewNote: 'Verified and approved institutional record update.',
              reviewNotes: 'Verified and approved institutional record update.',
            }
          : r
      )
    );

    const auditRecord: CorrectionAuditRecord = {
      requestId: updatedId,
      action: 'approved',
      timestamp: now,
      reviewedBy: 'Admin',
      reviewNote: 'Verified and approved institutional record update.',
    };

    setAuditLogs((prev) => [
      {
        requestId: updatedId,
        studentId: activeApproveModal.studentId,
        action: 'approved',
        timestamp: now,
        reviewedBy: 'Admin',
        reviewNote: 'Verified and approved institutional record update.',
      },
      ...prev,
    ]);

    onApprove?.(updatedId);
    setActiveApproveModal(null);
  };

  // Handle Reject
  const handleConfirmReject = () => {
    if (!activeRejectModal) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setRejectError('A formal reason is required to reject a student correction appeal.');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updatedId = activeRejectModal.id;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === updatedId
          ? {
              ...r,
              status: 'rejected',
              reviewedAt: now,
              reviewedBy: 'Admin',
              reviewNote: trimmed,
              reviewNotes: trimmed,
            }
          : r
      )
    );

    setAuditLogs((prev) => [
      {
        requestId: updatedId,
        studentId: activeRejectModal.studentId,
        action: 'rejected',
        timestamp: now,
        reviewedBy: 'Admin',
        reviewNote: trimmed,
      },
      ...prev,
    ]);

    onReject?.(updatedId, trimmed);
    setActiveRejectModal(null);
    setRejectReason('');
    setRejectError('');
  };

  // Priority sorting: pending first, then approved/rejected by submission date
  const sortedRequests = [...requests].sort((a, b) => {
    const statusScore = (s: string) => (s === 'pending' ? 0 : s === 'approved' ? 1 : 2);
    const scoreA = statusScore(a.status);
    const scoreB = statusScore(b.status);
    if (scoreA !== scoreB) return scoreA - scoreB;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  const filteredRequests = sortedRequests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  return (
    <div id="correction-requests-container" className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#141414] p-1">
          <button
            id="filter-all"
            onClick={() => setStatusFilter('all')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-white/[0.12] text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            All Requests <span className="font-mono text-[11px] opacity-70">({requests.length})</span>
          </button>
          <button
            id="filter-pending"
            onClick={() => setStatusFilter('pending')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === 'pending'
                ? 'bg-[#c3f340]/20 text-[#c3f340] border border-[#c3f340]/30 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Pending <span className="rounded-full bg-[#c3f340]/20 px-1.5 py-0.2 font-mono text-[10px] text-[#c3f340] font-bold">{pendingCount}</span>
          </button>
          <button
            id="filter-approved"
            onClick={() => setStatusFilter('approved')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Approved <span className="font-mono text-[11px] opacity-70">({approvedCount})</span>
          </button>
          <button
            id="filter-rejected"
            onClick={() => setStatusFilter('rejected')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === 'rejected'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Rejected <span className="font-mono text-[11px] opacity-70">({rejectedCount})</span>
          </button>
        </div>

        {/* Audit Log Drawer Toggle */}
        <button
          id="toggle-audit-trail"
          onClick={() => setShowAuditDrawer(!showAuditDrawer)}
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
            showAuditDrawer
              ? 'border-[#c3f340]/40 bg-[#c3f340]/10 text-[#c3f340]'
              : 'border-white/[0.08] bg-[#141414] text-white/70 hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          <History size={14} />
          <span>Review Audit Ledger ({auditLogs.length})</span>
        </button>
      </div>

      {/* In-Memory Audit Ledger Panel (Collapsible) */}
      {showAuditDrawer && (
        <div className="rounded-2xl border border-[#c3f340]/20 bg-[#141414]/95 p-5 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#c3f340]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                In-Memory Right-to-Rectification Audit Trail
              </h3>
            </div>
            <span className="text-[11px] font-mono text-white/40">Real-time ledger events</span>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-white/40 py-2">No review actions recorded in this session.</p>
            ) : (
              auditLogs.map((log, index) => (
                <div
                  key={`${log.requestId}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        log.action === 'approved' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-mono text-[11px] text-white/90 font-semibold">{log.requestId}</span>
                    <span className="font-mono text-[10px] text-white/40">({log.studentId})</span>
                    <span className="text-white/60 text-[11px]">
                      Action: <strong className={log.action === 'approved' ? 'text-emerald-300' : 'text-rose-300'}>{log.action.toUpperCase()}</strong> by {log.reviewedBy}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {log.reviewNote && (
                      <span className="text-white/50 text-[11px] italic max-w-xs truncate" title={log.reviewNote}>
                        &ldquo;{log.reviewNote}&rdquo;
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-white/40">{log.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Correction Requests Cards Grid */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-12 text-center backdrop-blur-xl">
          <FileCheck size={36} className="mx-auto text-white/20 mb-3" />
          <h3 className="text-sm font-semibold text-white">
            No pending correction requests — All submitted requests have been reviewed.
          </h3>
          <p className="text-xs text-white/40 mt-1 max-w-md mx-auto">
            All student data rectification appeals under institutional privacy policy have been evaluated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((r) => {
            const isPending = r.status === 'pending';
            const isApproved = r.status === 'approved';
            const isRejected = r.status === 'rejected';

            return (
              <TiltCard
                key={r.id}
                maxTilt={1.5}
                className={`rounded-2xl border bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between transition-all ${
                  isPending
                    ? 'border-white/[0.12] hover:border-[#c3f340]/40'
                    : isApproved
                    ? 'border-emerald-500/20'
                    : 'border-rose-500/20'
                }`}
              >
                <div>
                  {/* Card Header: Request ID, Field, Status, Timestamp */}
                  <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-white/90">{r.id}</span>
                        <Pill
                          tone={
                            isApproved
                              ? 'accent'
                              : isPending
                              ? 'warm'
                              : 'default'
                          }
                        >
                          {r.status.toUpperCase()}
                        </Pill>
                      </div>
                      <h4 className="text-xs font-semibold text-[#c3f340] mt-1.5 flex items-center gap-1.5">
                        <span>{r.field}</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-white/40 block">{r.submittedAt}</span>
                      <span className="text-[10px] text-white/30">Submitted</span>
                    </div>
                  </div>

                  {/* Student Reference Section (Name/ID only — strictly no wellbeing/risk info) */}
                  <div className="mt-3.5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Student Reference:</span>
                      <div className="font-mono text-xs text-white/90">
                        {r.studentName ? <span className="font-sans font-semibold text-white mr-1.5">{r.studentName}</span> : null}
                        <span className="text-white/50 text-[11px]">({r.studentId})</span>
                      </div>
                    </div>

                    {/* Current vs Requested Value Comparison Box */}
                    <div className="rounded-xl bg-black/40 p-3 text-xs border border-white/[0.04] space-y-2">
                      <div>
                        <span className="text-white/40 uppercase tracking-wider text-[9px] font-bold block mb-0.5">
                          Current Recorded Value
                        </span>
                        <div className="text-rose-300 font-mono text-xs bg-rose-500/[0.08] border border-rose-500/20 rounded-md px-2.5 py-1.5">
                          {r.currentValue}
                        </div>
                      </div>

                      <div className="flex items-center justify-center py-0.5">
                        <ArrowRight size={12} className="text-white/20 rotate-90 md:rotate-0" />
                      </div>

                      <div>
                        <span className="text-white/40 uppercase tracking-wider text-[9px] font-bold block mb-0.5">
                          Requested Rectification
                        </span>
                        <div className="text-[#c3f340] font-mono text-xs bg-[#c3f340]/[0.08] border border-[#c3f340]/20 rounded-md px-2.5 py-1.5">
                          {r.requestedValue}
                        </div>
                      </div>
                    </div>

                    {/* Student Stated Reason */}
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 text-xs">
                      <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold mb-1">
                        Reason Provided by Student
                      </span>
                      <p className="text-white/80 leading-relaxed text-xs">{r.reason}</p>
                    </div>

                    {/* Compact Read-Only Audit Block for Approved / Rejected */}
                    {(isApproved || isRejected) && (
                      <div
                        className={`rounded-xl p-3 text-xs border ${
                          isApproved
                            ? 'bg-emerald-500/[0.04] border-emerald-500/20 text-emerald-200/90'
                            : 'bg-rose-500/[0.04] border-rose-500/20 text-rose-200/90'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-white/50 mb-1 font-mono">
                          <span>Reviewed by: <strong className="text-white/80">{r.reviewedBy || 'Admin'}</strong></span>
                          <span>{r.reviewedAt || 'Recorded'}</span>
                        </div>
                        {(r.reviewNote || r.reviewNotes) && (
                          <div className="mt-1 text-xs">
                            <span className="text-white/40 text-[10px] block uppercase font-medium">Review Note:</span>
                            <p className="italic text-white/80 mt-0.5">&ldquo;{r.reviewNote || r.reviewNotes}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons (Pending Only) */}
                {isPending && (
                  <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-end gap-2.5">
                    <button
                      id={`btn-reject-${r.id}`}
                      onClick={() => {
                        setActiveRejectModal(r);
                        setRejectReason('');
                        setRejectError('');
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer"
                    >
                      <XCircle size={14} /> Reject Appeal
                    </button>
                    <button
                      id={`btn-approve-${r.id}`}
                      onClick={() => setActiveApproveModal(r)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#c3f340] px-4 py-2 text-xs font-bold text-black hover:bg-[#d4f860] hover:shadow-[0_0_14px_rgba(195,243,64,0.35)] transition-all cursor-pointer"
                    >
                      <CheckCircle size={14} /> Approve Correction
                    </button>
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* APPROVE CONFIRMATION MODAL */}
      {activeApproveModal && (
        <div
          id="approve-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
        >
          <div
            id="approve-modal-dialog"
            className="w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#161616] p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirm Correction Approval</h3>
                <p className="text-xs text-white/50">
                  Request <span className="font-mono text-white/80">{activeApproveModal.id}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-white/40">Student:</span>
                <span className="text-white font-medium">
                  {activeApproveModal.studentName || activeApproveModal.studentId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Field:</span>
                <span className="text-[#c3f340] font-medium">{activeApproveModal.field}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">From:</span>
                <span className="text-rose-300/80 font-mono">{activeApproveModal.currentValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">To:</span>
                <span className="text-emerald-300 font-mono font-semibold">{activeApproveModal.requestedValue}</span>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Confirming this request will mark the appeal as <strong>Approved</strong>, apply the rectification to the record, and append an immutable event entry to the audit log.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn-cancel-approve"
                type="button"
                onClick={() => setActiveApproveModal(null)}
                className="rounded-xl border border-white/[0.1] bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-approve"
                type="button"
                onClick={handleConfirmApprove}
                className="flex items-center gap-1.5 rounded-xl bg-[#c3f340] px-4 py-2 text-xs font-bold text-black hover:bg-[#d4f860] hover:shadow-[0_0_12px_rgba(195,243,64,0.3)] transition-all cursor-pointer"
              >
                <CheckCircle size={14} /> Confirm & Apply Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL (WITH MANDATORY REASON) */}
      {activeRejectModal && (
        <div
          id="reject-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
        >
          <div
            id="reject-modal-dialog"
            className="w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#161616] p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <XCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Reject Correction Request</h3>
                <p className="text-xs text-white/50">
                  Request <span className="font-mono text-white/80">{activeRejectModal.id}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-white/40">Student:</span>
                <span className="text-white font-medium">{activeRejectModal.studentName || activeRejectModal.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Target Field:</span>
                <span className="text-white/80 font-medium">{activeRejectModal.field}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="rejection-reason" className="block text-xs font-semibold text-white/90">
                Rejection Reason / Guidance Note <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (rejectError) setRejectError('');
                }}
                placeholder="Specify the institutional verification reason (e.g., Missing required faculty signature, unable to verify doctor clearance note...)"
                className={`w-full rounded-xl border bg-[#101010] p-3 text-xs text-white placeholder-white/30 focus:outline-none transition-all ${
                  rejectError
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-white/[0.1] focus:border-[#c3f340]'
                }`}
              />
              {rejectError ? (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {rejectError}
                </p>
              ) : (
                <p className="text-[11px] text-white/40">
                  Rejection requires an explicit note so the student receives transparent guidance on rectification.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn-cancel-reject"
                type="button"
                onClick={() => {
                  setActiveRejectModal(null);
                  setRejectReason('');
                  setRejectError('');
                }}
                className="rounded-xl border border-white/[0.1] bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-reject"
                type="button"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30 hover:border-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <XCircle size={14} /> Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
