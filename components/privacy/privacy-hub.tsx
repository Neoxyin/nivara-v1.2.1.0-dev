'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  FileEdit, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Send, 
  Sparkles, 
  History, 
  Lock,
  ArrowUpRight,
  Info,
  RefreshCw,
  Sliders,
  Check,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  INITIAL_STUDENT_DATA, 
  INITIAL_CORRECTIONS, 
  INITIAL_AUDIT_LOGS, 
  StudentDataField, 
  CorrectionRequest, 
  AuditLogEntry 
} from '@/lib/data/student-data';
import { mockPreferences } from '@/lib/data/preferences';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';

export function PrivacyHub() {
  const [dataFields, setDataFields] = useState<StudentDataField[]>(INITIAL_STUDENT_DATA);
  const [corrections, setCorrections] = useState<CorrectionRequest[]>(INITIAL_CORRECTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'consent' | 'transparency' | 'corrections' | 'audit'>('overview');
  
  // Correction Modal State
  const [selectedField, setSelectedField] = useState<StudentDataField | null>(null);
  const [requestedValue, setRequestedValue] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleOpenCorrection = (field: StudentDataField) => {
    setSelectedField(field);
    setRequestedValue(field.currentValue);
    setExplanation('');
  };

  const handleCloseCorrection = () => {
    setSelectedField(null);
    setRequestedValue('');
    setExplanation('');
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField || !requestedValue.trim() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newCorrection: CorrectionRequest = {
        id: `corr-${Date.now()}`,
        fieldId: selectedField.id,
        fieldName: selectedField.fieldName,
        currentValue: selectedField.currentValue,
        requestedValue: requestedValue.trim(),
        explanation: explanation.trim() || 'No explanation provided.',
        status: 'Pending Review',
        submittedAt: 'Just now'
      };

      setCorrections(prev => [newCorrection, ...prev]);

      // Add audit log
      const newAudit: AuditLogEntry = {
        id: `audit-${Date.now()}`,
        timestamp: 'Just now',
        action: 'Correction Request Submitted',
        actor: 'You',
        details: `Requested correction for ${selectedField.fieldName}`
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      setIsSubmitting(false);
      handleCloseCorrection();
      setSuccessBanner('Your data correction request has been successfully submitted for authorized review.');
      setActiveTab('corrections');

      setTimeout(() => setSuccessBanner(null), 5000);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[rgba(195,243,64,.12)] text-[#c3f340] border border-[#c3f340]/20">
            <ShieldCheck size={26} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c3f340] bg-[#c3f340]/10 border border-[#c3f340]/20 px-2.5 py-0.5 rounded">
                Privacy Dashboard & Control Center
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Your Data, Your Choices, Absolute Transparency</h2>
            <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
              Nivara operates on strict data minimization and transparent student governance. Review what data we hold, why it is collected, manage your PRD consent categories, or request corrections at any time.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/settings"
            className="px-4 py-2.5 rounded-xl bg-[#c3f340] text-black text-xs font-semibold hover:bg-[#dff77d] transition-all flex items-center gap-2 shadow-lg shadow-[#c3f340]/10"
          >
            <Sliders size={14} /> Manage Consent Center
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-[rgba(195,243,64,.08)] border border-[#c3f340]/20 text-[#c3f340] text-xs flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-white/40 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.08] pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <ShieldCheck size={15} /> Overview & Guarantees
        </button>
        <button
          onClick={() => setActiveTab('consent')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'consent'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <Sliders size={15} /> Consent Categories
        </button>
        <button
          onClick={() => setActiveTab('transparency')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'transparency'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <Database size={15} /> Data Transparency Ledger ({dataFields.length})
        </button>
        <button
          onClick={() => setActiveTab('corrections')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'corrections'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <FileEdit size={15} /> Correction Requests ({corrections.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <History size={15} /> Audit History ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: PRIVACY OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl shadow-xl space-y-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-[#c3f340] border border-white/10">
                <Database size={20} />
              </div>
              <h3 className="font-semibold text-white text-base">What Data We Have</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Nivara securely stores your academic term details, course enrollments, well-being check-in history, support circle memberships, and emergency contact details synced from authorized university portals.
              </p>
              <button 
                onClick={() => setActiveTab('transparency')}
                className="text-xs font-semibold text-[#c3f340] hover:underline inline-flex items-center gap-1 pt-2"
              >
                Inspect Data Ledger <ArrowUpRight size={13} />
              </button>
            </TiltCard>

            <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl shadow-xl space-y-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-[#c3f340] border border-white/10">
                <Sliders size={20} />
              </div>
              <h3 className="font-semibold text-white text-base">Why & How It Is Used</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Data is strictly used to provide academic pacing assistance, match you with financial grants, and coordinate peer or professional counselling. You control optional permissions at any time.
              </p>
              <button 
                onClick={() => setActiveTab('consent')}
                className="text-xs font-semibold text-[#c3f340] hover:underline inline-flex items-center gap-1 pt-2"
              >
                Review Consent Categories <ArrowUpRight size={13} />
              </button>
            </TiltCard>

            <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl shadow-xl space-y-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-[#c3f340] border border-white/10">
                <FileEdit size={20} />
              </div>
              <h3 className="font-semibold text-white text-base">Correction & Rights</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                If any record is inaccurate, you can submit an official correction request instantly. Authorized reviewers will verify and update your records with full audit trail transparency.
              </p>
              <button 
                onClick={() => setActiveTab('corrections')}
                className="text-xs font-semibold text-[#c3f340] hover:underline inline-flex items-center gap-1 pt-2"
              >
                View Correction Requests <ArrowUpRight size={13} />
              </button>
            </TiltCard>

          </div>

          <div className="border border-white/[0.08] bg-white/[0.02] p-6 rounded-2xl space-y-4 backdrop-blur-xl">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Info size={16} className="text-[#c3f340]" />
              Understanding Withdrawal & Consent
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/70 leading-relaxed">
              <div className="space-y-2">
                <strong className="text-white block">What Withdrawal Means</strong>
                <p>
                  Withdrawing consent for optional categories (such as Financial Support Matching or AI Support) immediately halts automated telemetry for those features. Core institutional records required by the registrar remain governed by university policy.
                </p>
              </div>
              <div className="space-y-2">
                <strong className="text-white block">Frontend vs Backend Notice</strong>
                <p className="text-amber-300/90">
                  Frontend permission toggles and preference changes update your immediate session view and preferences store. Real backend data segregation is enforced according to institutional security pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONSENT CATEGORIES */}
      {activeTab === 'consent' && (
        <div className="space-y-6">
          <div className="border border-white/[0.09] bg-[#141414]/90 p-6 sm:p-8 backdrop-blur-xl rounded-2xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">PRD Consent Categories</h3>
                <p className="text-xs text-white/60">Review your permission status across the four core data consent categories.</p>
              </div>
              <Link
                href="/settings"
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-2"
              >
                Open Full Consent Center <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPreferences.map((pref) => (
                <div key={pref.key} className="border border-white/[0.08] bg-white/[0.02] p-5 rounded-xl space-y-3 backdrop-blur-xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white text-sm">{pref.label}</h4>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        pref.required 
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                          : 'bg-[#c3f340]/10 text-[#c3f340] border border-[#c3f340]/20'
                      }`}>
                        {pref.required ? 'Institutional Mandate (Required)' : 'Optional Permission'}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{pref.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-white/40">Status:</span>
                    <span className={`font-semibold flex items-center gap-1 ${pref.enabled ? 'text-[#c3f340]' : 'text-white/40'}`}>
                      <CheckCircle2 size={13} /> {pref.enabled ? 'Active Consent' : 'Opted Out / Withdrawn'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA TRANSPARENCY LEDGER */}
      {activeTab === 'transparency' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Data Transparency Ledger</h3>
              <p className="text-xs text-white/60">Inspect all records held by Nivara, their source, purpose, and last updated time.</p>
            </div>
            <span className="text-xs text-white/40 font-mono">{dataFields.length} Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataFields.map((field) => (
              <div key={field.id} className="stagger-item">
                <TiltCard maxTilt={2} className="h-full flex flex-col border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl transition-all hover:border-white/20 rounded-2xl shadow-xl justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c3f340] bg-[#c3f340]/10 border border-[#c3f340]/20 px-2 py-0.5 rounded">
                        {field.category}
                      </span>
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <Clock size={11} /> {field.lastUpdated}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-semibold text-white text-base">{field.fieldName}</h3>
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white/90 font-mono break-all">
                        {field.currentValue}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-white/60">
                      <p><strong className="text-white/80">Source:</strong> {field.source}</p>
                      <p><strong className="text-white/80">Purpose:</strong> {field.purpose}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/[0.05] text-white/70 border border-white/10">
                      {field.consentStatus}
                    </span>
                    <button
                      onClick={() => handleOpenCorrection(field)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/[0.1] transition-all flex items-center gap-1.5"
                    >
                      <FileEdit size={13} /> Request Correction
                    </button>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CORRECTION REQUESTS */}
      {activeTab === 'corrections' && (
        <div className="space-y-6">
          <div className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Your Data Correction Requests</h3>
                <p className="text-xs text-white/60">Track the status of data accuracy reviews submitted to institutional administrators.</p>
              </div>
              <span className="text-xs text-white/40 font-mono">{corrections.length} Total</span>
            </div>

            <div className="space-y-4">
              {corrections.map((corr) => (
                <div key={corr.id} className="border border-white/[0.08] bg-white/[0.02] p-5 rounded-xl space-y-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-white text-sm">{corr.fieldName}</h4>
                      <span className="text-[10px] text-white/40">Submitted {corr.submittedAt}</span>
                    </div>

                    <div>
                      {corr.status === 'Pending Review' && (
                        <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                          <Clock size={11} /> Pending Review
                        </span>
                      )}
                      {corr.status === 'Approved' && (
                        <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-[#c3f340]/10 text-[#c3f340] border border-[#c3f340]/20 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Approved
                        </span>
                      )}
                      {corr.status === 'Rejected' && (
                        <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20 flex items-center gap-1">
                          <AlertCircle size={11} /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-white/40">Current Recorded Value</span>
                      <p className="text-white/80 font-mono">{corr.currentValue}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#c3f340]/5 border border-[#c3f340]/20 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#c3f340]">Requested Correction</span>
                      <p className="text-white font-mono">{corr.requestedValue}</p>
                    </div>
                  </div>

                  <div className="text-xs text-white/60 space-y-1 pt-1">
                    <p><strong className="text-white/80">Student Explanation:</strong> {corr.explanation}</p>
                    {corr.reviewerNotes && (
                      <p className="text-[#c3f340]"><strong className="text-white/80">Reviewer Notes:</strong> {corr.reviewerNotes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-semibold text-white">Data Access & Activity Audit History</h3>
              <p className="text-xs text-white/60">Immutable record of data synchronization, consent preference updates, and correction submissions.</p>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05] text-[#c3f340] border border-white/[0.08]">
                      <History size={15} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white">{log.action}</span>
                      <p className="text-white/50 text-[11px]">{log.details}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-0.5 shrink-0 pl-2">
                    <span className="text-white/70 font-medium block whitespace-nowrap">{log.actor}</span>
                    <span className="block text-[10px] text-white/40 whitespace-nowrap">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CORRECTION REQUEST MODAL */}
      {selectedField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg border border-white/[0.12] bg-[#141414] p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#c3f340]">Data Correction Workflow</span>
                <h3 className="text-xl font-bold text-white tracking-tight">Request Data Correction</h3>
              </div>
              <button 
                onClick={handleCloseCorrection}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05] text-white/60 hover:text-white border border-white/[0.1]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Target Field</label>
                <input
                  type="text"
                  disabled
                  value={selectedField.fieldName}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white/50 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Current Value</label>
                <input
                  type="text"
                  disabled
                  value={selectedField.currentValue}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white/50 cursor-not-allowed font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Requested Corrected Value <span className="text-[#c3f340]">*</span></label>
                <input
                  type="text"
                  required
                  value={requestedValue}
                  onChange={(e) => setRequestedValue(e.target.value)}
                  placeholder="Enter the accurate value..."
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c3f340]/50 font-mono transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Explanation / Reason for Correction</label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Provide context or documentation reference..."
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c3f340]/50 resize-none transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCorrection}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white/80 border border-white/[0.1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!requestedValue.trim() || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#c3f340] text-black text-xs font-semibold hover:bg-[#dff77d] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#c3f340]/10"
                >
                  <Send size={14} /> {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
