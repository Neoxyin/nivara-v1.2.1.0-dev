'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Clock, 
  History, 
} from 'lucide-react';
import type { 
  StudentDataField, 
  AuditLogEntry 
} from '@/lib/data/student-data';
import { 
  getStudentDataFields, 
  getAuditLogs, 
} from '@/lib/api/student-data';
import { TiltCard } from '@/components/ui/tilt-card';

export function DataTransparencyDashboard() {
  const [dataFields, setDataFields] = useState<StudentDataField[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'data' | 'audit'>('data');

  useEffect(() => {
    async function loadData() {
      try {
        const [fields, logs] = await Promise.all([
          getStudentDataFields(),
          getAuditLogs(),
        ]);
        setDataFields(fields);
        setAuditLogs(logs);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border border-white/[0.08] bg-white/[0.02] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[rgba(195,243,64,.12)] text-[#c3f340] border border-[#c3f340]/20">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-base">Student Data Transparency & Access</h4>
            <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
              Nivara operates on strict data minimization and absolute student transparency. Review all data records held by the platform, understand their sources and purposes, and inspect access logs at any time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">Privacy Standard</span>
          <span className="text-xs font-semibold text-[#c3f340] bg-[#c3f340]/10 border border-[#c3f340]/20 px-3 py-1 rounded-lg">FERPA & GDPR Aligned</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'data'
              ? 'bg-[#c3f340] text-black shadow-md shadow-[#c3f340]/10'
              : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
          }`}
        >
          <Database size={15} /> Data Records ({dataFields.length})
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

      {/* TAB 2: AUDIT LOG */}
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
