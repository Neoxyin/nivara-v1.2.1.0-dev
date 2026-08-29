'use client';

import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import type { 
  StudentDataField, 
  CorrectionRequest, 
  AuditLogEntry 
} from '@/lib/data/student-data';
import { 
  getStudentDataFields, 
  getCorrectionRequests, 
  getAuditLogs, 
  submitCorrectionRequest 
} from '@/lib/api/student-data';
import { TiltCard } from '@/components/ui/tilt-card';

export function DataTransparencyDashboard() {
  const [dataFields, setDataFields] = useState<StudentDataField[]>([]);
  const [corrections, setCorrections] = useState<CorrectionRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'data' | 'corrections' | 'audit'>('data');
  
  // Correction Modal State
  const [selectedField, setSelectedField] = useState<StudentDataField | null>(null);
  const [requestedValue, setRequestedValue] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [fields, corrs, logs] = await Promise.all([
          getStudentDataFields(),
          getCorrectionRequests(),
          getAuditLogs(),
        ]);
        setDataFields(fields);
        setCorrections(corrs);
        setAuditLogs(logs);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

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

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField || !requestedValue.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const newCorrection = await submitCorrectionRequest(
        selectedField.id,
        selectedField.fieldName,
        selectedField.currentValue,
        requestedValue.trim(),
        explanation.trim() || 'No explanation provided.'
      );

      setCorrections(prev => [newCorrection, ...prev]);

      const updatedLogs = await getAuditLogs();
      setAuditLogs(updatedLogs);

      setIsSubmitting(false);
      handleCloseCorrection();
      setSuccessBanner('Your data correction request has been successfully submitted for authorized review.');
      setActiveTab('corrections');
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border border-white/[0.08] bg-white/[0.02] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[rgba(195,243,64,.12)] text-[#c3f340] border border-[#c3f340]/20">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-base">Student Data Transparency & Correction</h4>
            <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
              Nivara operates on strict data minimization and absolute student transparency. Review all data records held by the platform, understand their sources and purposes, or submit correction requests at any time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">Privacy Standard</span>
          <span className="text-xs font-semibold text-[#c3f340] bg-[#c3f340]/10 border border-[#c3f340]/20 px-3 py-1 rounded-lg">FERPA & GDPR Aligned</span>
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
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'data'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <Database size={15} /> Data Transparency ({dataFields.length})
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
          <History size={15} /> Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: DATA TRANSPARENCY */}
      {activeTab === 'data' && (
        <div className="space-y-6">
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

      {/* TAB 2: CORRECTION REQUESTS */}
      {activeTab === 'corrections' && (
        <div className="space-y-6">
          <div className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Your Correction Requests</h3>
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

      {/* TAB 3: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-semibold text-white">Data Access & Activity Audit Log</h3>
              <p className="text-xs text-white/60">Immutable record of data synchronization, consent changes, and correction requests.</p>
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
                  <div className="text-right space-y-0.5">
                    <span className="text-white/70 font-medium">{log.actor}</span>
                    <span className="block text-[10px] text-white/40">{log.timestamp}</span>
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
