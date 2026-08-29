'use client';

import React, { useState } from 'react';
import { ConsentAuditLog } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import { Search, ShieldAlert, ShieldCheck, Download } from 'lucide-react';

interface ConsentLogTableProps {
  logs: ConsentAuditLog[];
}

export function ConsentLogTable({ logs }: ConsentLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = logs.filter((l) => {
    const matchesSearch = l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || l.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || l.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#141414] py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#141414] px-3 py-2 text-xs text-white/80 focus:border-[#c3f340] focus:outline-none"
          >
            <option value="all">All Actions</option>
            <option value="granted">Granted</option>
            <option value="revoked">Revoked</option>
            <option value="updated">Updated</option>
          </select>

          <button
            onClick={() => alert('Exporting immutable cryptographic audit ledger...')}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white hover:bg-white/[0.08] transition-all"
          >
            <Download size={13} /> Export Ledger
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Audit Hash / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white/80">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-white/50">{l.timestamp}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-white">{l.studentName}</span>
                    <span className="ml-2 font-mono text-[10px] text-white/40">({l.studentId})</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/70">{l.category}</td>
                  <td className="px-5 py-3.5">
                    <Pill tone={l.action === 'granted' ? 'accent' : l.action === 'revoked' ? 'warm' : 'default'}>
                      {l.action}
                    </Pill>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[10px] text-white/40">
                    <span className="text-white/60">{l.ipAddress}</span> · {l.verificationHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
