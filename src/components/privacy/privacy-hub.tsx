'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Clock, 
  History, 
  Lock,
  ArrowUpRight,
  Info,
  Sliders,
  Check,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  INITIAL_STUDENT_DATA, 
  INITIAL_AUDIT_LOGS, 
  StudentDataField, 
  AuditLogEntry 
} from '@/lib/data/student-data';
import { mockPreferences } from '@/lib/data/preferences';
import { getPreferences } from '@/lib/api/preferences';
import { useQuery } from '@tanstack/react-query';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';

export function PrivacyHub() {
  const { data: preferences } = useQuery({ queryKey: ['preferences'], queryFn: getPreferences });
  const consentCategories = preferences || mockPreferences;
  const [dataFields] = useState<StudentDataField[]>(INITIAL_STUDENT_DATA);
  const [auditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'consent' | 'transparency' | 'audit'>('overview');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[rgba(195,243,64,.12)] text-[#c3f340] border border-[#c3f340]/20">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg tracking-tight">Privacy, Consent & Data Governance</h3>
            <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
              Nivara operates on strict data minimization and transparent student governance. Review what data we hold, why it is collected, manage your PRD consent categories, or inspect activity logs.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/settings"
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-2"
          >
            <Lock size={14} className="text-[#c3f340]" /> Consent Center
          </Link>
          <span className="text-xs font-semibold text-[#c3f340] bg-[#c3f340]/10 border border-[#c3f340]/20 px-3 py-1 rounded-lg">
            FERPA & GDPR Compliant
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-white/[0.08] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <ShieldCheck size={15} /> Privacy Overview
        </button>
        <button
          type="button"
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
          type="button"
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
          type="button"
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
                type="button"
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
                Data is strictly used to provide academic pacing assistance and coordinate peer or professional counselling. You control optional permissions at any time.
              </p>
              <button 
                type="button"
                onClick={() => setActiveTab('consent')}
                className="text-xs font-semibold text-[#c3f340] hover:underline inline-flex items-center gap-1 pt-2"
              >
                Review Consent Categories <ArrowUpRight size={13} />
              </button>
            </TiltCard>

            <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl shadow-xl space-y-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-[#c3f340] border border-white/10">
                <History size={20} />
              </div>
              <h3 className="font-semibold text-white text-base">Activity & Audit Trail</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Review verified timestamp records of every system data access, automated synchronization, and consent update across your account.
              </p>
              <button 
                type="button"
                onClick={() => setActiveTab('audit')}
                className="text-xs font-semibold text-[#c3f340] hover:underline inline-flex items-center gap-1 pt-2"
              >
                View Audit History <ArrowUpRight size={13} />
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
                  Withdrawing consent for optional categories immediately halts automated telemetry for those features. Core institutional records required by the registrar remain governed by university policy.
                </p>
              </div>
              <div className="space-y-2">
                <strong className="text-white block">Prototype Data Notice</strong>
                <p className="text-amber-300/90">
                  Permission toggles and preference changes update the current frontend session and local prototype state. No backend data service is connected in this build.
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
                <p className="text-xs text-white/60">Review your permission status across the core data consent categories.</p>
              </div>
              <Link
                href="/settings"
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-2"
              >
                Open Full Consent Center <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {consentCategories.map((pref) => (
                <div key={pref.key} className="border border-white/[0.08] bg-white/[0.02] p-5 rounded-xl space-y-3 backdrop-blur-xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white text-sm">{pref.label}</h4>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        pref.enabled 
                          ? 'bg-[#c3f340]/10 text-[#c3f340] border-[#c3f340]/20' 
                          : 'bg-white/[0.05] text-white/50 border-white/10'
                      }`}>
                        {pref.enabled ? 'Active (Consented)' : 'Opted Out'}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {pref.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-white/40">Default Policy</span>
                    <span className="text-white/70 font-medium">
                      {pref.key === 'academic_data' 
                        ? 'Consented by default' 
                        : 'Explicit Opt-In Required'
                      }
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
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.05] text-white/70 border border-white/10">
                      {field.consentStatus}
                    </span>
                    <span className="text-[11px] text-white/40 font-mono">
                      Verified
                    </span>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-semibold text-white">Data Access & Activity Audit Log</h3>
              <p className="text-xs text-white/60">Immutable record of data synchronization, system telemetry access, and consent changes.</p>
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
    </div>
  );
}
