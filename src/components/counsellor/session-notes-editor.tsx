'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Edit3,
  Check,
  RefreshCw,
  FileText,
  AlertCircle,
  Clock3,
  Calendar,
  User,
  Plus,
} from 'lucide-react';
import { saveConsultationRecord, getConsultationRecord, getGuardianNotification } from '@/lib/api/counsellors';
import type { AppointedSession, ConsultationRecord, GuardianNotification } from '@/lib/types';
import { FollowUpModal } from './follow-up-modal';
import { NotifyGuardianModal } from './notify-guardian-modal';

interface SessionNotesEditorProps {
  session: AppointedSession;
  activeCounsellorName: string;
  onSessionUpdated?: (updated: AppointedSession) => void;
}

export function SessionNotesEditor({
  session,
  activeCounsellorName,
  onSessionUpdated,
}: SessionNotesEditorProps) {
  const isAssigned =
    session.counsellorName.trim().toLowerCase() === activeCounsellorName.trim().toLowerCase();
  const isPending = session.status === 'requested' || session.status === 'pending';

  const [record, setRecord] = useState<ConsultationRecord | null>(session.consultationRecord || null);
  const [noteText, setNoteText] = useState(session.consultationRecord?.notes || session.notes || '');
  const [outcomeSummary, setOutcomeSummary] = useState(session.consultationRecord?.outcomeSummary || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [notifyGuardianModalOpen, setNotifyGuardianModalOpen] = useState(false);
  const [guardianNotification, setGuardianNotification] = useState<GuardianNotification | null>(null);

  // Sync state when session changes or remounts
  useEffect(() => {
    let isMounted = true;
    if (isAssigned && !isPending) {
      getConsultationRecord(session.id, activeCounsellorName).then((rec) => {
        if (isMounted) {
          if (rec) {
            setRecord(rec);
            setNoteText(rec.notes || '');
            setOutcomeSummary(rec.outcomeSummary || '');
            setIsEditing(!rec.notes); // If empty, open in edit mode
          } else {
            setNoteText(session.notes || '');
            setIsEditing(!session.notes);
          }
        }
      });
      getGuardianNotification(session.id).then((entry) => {
        if (isMounted) setGuardianNotification(entry || null);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [session.id, session.notes, session.consultationRecord, activeCounsellorName, isAssigned, isPending]);

  // Case 1: Unauthorized counsellor
  if (!isAssigned) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5 text-left">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <ShieldAlert size={18} />
          <h4 className="text-sm font-semibold text-white">Restricted: Private Consultation Record</h4>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          This session is appointed to <strong>{session.counsellorName}</strong>. In accordance with NIVARA
          confidentiality policies, private counselling records and session notes are strictly restricted to the assigned counsellor.
        </p>
        <div className="mt-3 pt-3 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-white/40">
          <span>Zero cross-counsellor visibility for private consultation records.</span>
        </div>
      </div>
    );
  }

  // Case 2: Pre-acceptance appointment (requested or pending)
  if (isPending) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs text-white/80">
        <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
          <Lock size={14} />
          <span>Pre-Acceptance Privacy Guard</span>
        </div>
        <p className="text-white/70 leading-relaxed">
          This appointment is currently <strong>{session.status}</strong>. Private session notes and consultation documentation become available once you officially accept the appointment request.
        </p>
      </div>
    );
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);
    setErrorMessage(null);

    const trimmed = noteText.trim();
    if (!trimmed) {
      setValidationError('Session note content cannot be empty. Please document key consultation discussion points.');
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveConsultationRecord(
        session.id,
        {
          notes: trimmed,
          outcomeSummary: outcomeSummary.trim() || undefined,
        },
        activeCounsellorName
      );

      setRecord(saved);
      setIsEditing(false);
      setSaveSuccess('Consultation record saved successfully ✓');
      setTimeout(() => setSaveSuccess(null), 3500);

      if (onSessionUpdated) {
        onSessionUpdated({
          ...session,
          notes: saved.notes,
          consultationRecord: saved,
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save consultation record.');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedSavedDate = record?.updatedAt
    ? new Date(record.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#141414] p-5">
      {/* Header & Confidentiality Notice */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#c3f340]">
              <ShieldCheck size={16} />
            </span>
            <h4 className="text-sm font-semibold text-white">Private Consultation Record</h4>
            <span className="rounded bg-[#c3f340]/10 px-2 py-0.5 text-[9px] font-bold text-[#c3f340] border border-[#c3f340]/20">
              Assigned: {session.counsellorName}
            </span>
          </div>
          <p className="text-[11px] text-white/50 mt-1">
            Student: <strong className="text-white/80">{session.studentName}</strong> ({session.course}) · Session: {session.sessionTime}
          </p>
        </div>

        {record?.updatedAt && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
            <Clock3 size={11} className="text-[#c3f340]" />
            <span>Saved {formattedSavedDate} (v{record.version || 1})</span>
          </div>
        )}
      </div>

      {/* Non-Diagnostic Clinical Policy Notice */}
      <div className="mt-3.5 rounded-lg border border-white/[0.06] bg-white/[0.015] p-3 text-[11px] text-white/50 leading-relaxed">
        <strong className="text-white/75 font-medium">Non-Diagnostic Counselling Record:</strong> Documentation is strictly for student guidance, course pacing, and agreed support actions. Do not record diagnostic classifications, clinical conclusions, or disciplinary remarks.
      </div>

      {/* Status Alerts */}
      {saveSuccess && (
        <div className="mt-3.5 rounded-lg border border-[#c3f340]/30 bg-[#c3f340]/10 p-3 text-xs text-[#dff77d] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={15} className="text-[#c3f340] shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {validationError && (
        <div className="mt-3.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-center gap-2">
          <AlertCircle size={15} className="text-amber-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3.5 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle size={15} className="text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Content View / Editor */}
      <div className="mt-4">
        {!isEditing && record?.notes ? (
          /* View Mode: Clean Saved Record Presentation */
          <div className="space-y-3">
            <div className="rounded-lg border border-white/[0.08] bg-[#181818] p-4 text-xs text-white/85 whitespace-pre-line leading-relaxed">
              {record.notes}
            </div>

            {record.outcomeSummary && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-white/80">
                <span className="serenity-label text-[9px] text-[#c3f340] block mb-1">
                  Agreed Outcome / Next Action Steps
                </span>
                <p className="text-white/70 leading-relaxed">{record.outcomeSummary}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-white/35">
                Note is locked to your account. No student or third-party access.
              </span>
              <div className="flex items-center gap-2">
                {guardianNotification ? (
                  <span className="inline-flex items-center gap-1.5 rounded border border-amber-400/30 bg-amber-400/[0.08] px-3.5 py-1.5 text-xs font-bold text-amber-300">
                    <ShieldAlert size={12} /> Guardian Notified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setNotifyGuardianModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-[#241a04] transition-colors"
                  >
                    <ShieldAlert size={12} /> Notify Parent / Guardian
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFollowUpModalOpen(true)}
                  className="btn-sweep inline-flex items-center gap-1.5 rounded border border-[#c3f340]/40 bg-[#c3f340]/10 px-3.5 py-1.5 text-xs font-bold text-[#dff77d] hover:bg-[#c3f340] hover:text-[#0d1408] transition-colors"
                >
                  <Clock3 size={12} /> Schedule Follow-Up
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold text-white hover:border-[#c3f340]/50 hover:text-[#c3f340] transition-colors"
                >
                  <Edit3 size={12} /> Edit Record
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode: Interactive Private Documentation Workspace */
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="serenity-label text-[9px] text-white/50 block mb-1.5 uppercase tracking-wider">
                Private Consultation Notes & Discussion Points *
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={isSaving}
                rows={4}
                placeholder="Document discussion outcomes, student-reported pacing issues, and agreed study strategies..."
                className="w-full rounded-lg border border-white/[0.12] bg-[#181818] p-3.5 text-xs text-white placeholder:text-white/30 focus:border-[#c3f340] focus:outline-none transition-colors disabled:opacity-50"
              />
              <div className="flex justify-between text-[10px] text-white/35 mt-1 px-1">
                <span>Supports bullet points and plain text.</span>
                <span>{noteText.trim().length} characters</span>
              </div>
            </div>

            <div>
              <label className="serenity-label text-[9px] text-white/50 block mb-1.5 uppercase tracking-wider">
                Agreed Outcome Summary / Follow-up Action (Optional)
              </label>
              <input
                value={outcomeSummary}
                onChange={(e) => setOutcomeSummary(e.target.value)}
                disabled={isSaving}
                placeholder="e.g. Recommended breaking lab reports into 45-min blocks; follow-up review next week"
                className="w-full rounded-lg border border-white/[0.12] bg-[#181818] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#c3f340] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              {record?.notes ? (
                <button
                  type="button"
                  onClick={() => {
                    setNoteText(record.notes || '');
                    setOutcomeSummary(record.outcomeSummary || '');
                    setIsEditing(false);
                    setValidationError(null);
                  }}
                  disabled={isSaving}
                  className="rounded px-3 py-1.5 text-xs text-white/50 hover:text-white transition-colors"
                >
                  Cancel Edit
                </button>
              ) : (
                <span className="text-[10px] text-white/35 italic">
                  Note will be saved with audit timestamp
                </span>
              )}

              <button
                type="submit"
                disabled={isSaving || !noteText.trim()}
                className="btn-sweep inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.3)] hover:scale-102 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" /> Saving Record...
                  </>
                ) : (
                  <>
                    <Check size={12} /> Save Consultation Record
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Follow-Up Modal Integration */}
      <FollowUpModal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        studentName={session.studentName}
        studentEmail={session.studentEmail}
        course={session.course}
        year={session.year}
        sessionId={session.id}
        activeCounsellorName={activeCounsellorName}
        defaultReason={outcomeSummary || 'Follow-up consultation'}
      />

      {/* Parent / Guardian Notification — counsellor-initiated, post-consultation only */}
      <NotifyGuardianModal
        isOpen={notifyGuardianModalOpen}
        onClose={() => setNotifyGuardianModalOpen(false)}
        studentName={session.studentName}
        sessionId={session.id}
        activeCounsellorName={activeCounsellorName}
        onNotified={(entry) => setGuardianNotification(entry)}
      />
    </div>
  );
}
