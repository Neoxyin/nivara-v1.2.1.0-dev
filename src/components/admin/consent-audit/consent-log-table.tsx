'use client';

import React, { useState, useMemo } from 'react';
import { ConsentAuditLog } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Filter,
  Lock,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface ConsentLogTableProps {
  logs: ConsentAuditLog[];
}

export function ConsentLogTable({ logs }: ConsentLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Summary Metrics Computation
  const summary = useMemo(() => {
    const totalEvents = logs.length;
    const allowedCount = logs.filter((l) => l.status === 'allowed').length;
    const withdrawnCount = logs.filter((l) => l.status === 'withdrawn').length;

    // Recent changes (e.g., within last 7 days from dataset reference 2026-08-30)
    const sevenDaysAgo = new Date('2026-08-23T00:00:00').getTime();
    const recentCount = logs.filter((l) => {
      const logTime = new Date(l.timestamp).getTime();
      return !isNaN(logTime) && logTime >= sevenDaysAgo;
    }).length;

    return {
      totalEvents,
      allowedCount,
      withdrawnCount,
      recentCount,
    };
  }, [logs]);

  // Filtering Logic (Read-Only)
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search matches name or ID
      const matchesSearch =
        !searchTerm.trim() ||
        log.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.studentName && log.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.fields.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory =
        categoryFilter === 'all' || log.category === categoryFilter;

      // Action filter
      const matchesAction =
        actionFilter === 'all' || log.action === actionFilter;

      return matchesSearch && matchesCategory && matchesAction;
    });
  }, [logs, searchTerm, categoryFilter, actionFilter]);

  // Helper for Category formatting & badges
  const getCategoryBadge = (cat: ConsentAuditLog['category']) => {
    switch (cat) {
      case 'academic':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 text-[11px] font-medium text-blue-300">
            Academic Data
          </span>
        );
      case 'financial':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[11px] font-medium text-amber-300">
            Financial Aid
          </span>
        );
      case 'wellbeing':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            Wellbeing Rhythm
          </span>
        );
      case 'ai':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 text-[11px] font-medium text-purple-300">
            AI & Analytics
          </span>
        );
      default:
        return <span className="text-white/60 capitalize">{cat}</span>;
    }
  };

  // Helper for Action badges
  const getActionBadge = (action: ConsentAuditLog['action']) => {
    switch (action) {
      case 'granted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#c3f340]/15 border border-[#c3f340]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#c3f340]">
            <CheckCircle2 size={11} /> Granted
          </span>
        );
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[11px] font-bold text-rose-300">
            <XCircle size={11} /> Withdrawn
          </span>
        );
      case 'updated':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
            <RefreshCw size={11} /> Updated
          </span>
        );
    }
  };

  return (
    <div id="consent-audit-container" className="space-y-6">
      {/* 1. TOP SUMMARY METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Consent Events */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Total Consent Events</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-white/80">
              <FileText size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{summary.totalEvents}</span>
            <span className="text-[11px] text-white/40">Logged entries</span>
          </div>
        </div>

        {/* Allowed Count */}
        <div className="rounded-2xl border border-emerald-500/20 bg-[#141414]/90 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400/70 uppercase tracking-wider">Allowed Count</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-300">{summary.allowedCount}</span>
            <span className="text-[11px] text-emerald-400/60">Active permissions</span>
          </div>
        </div>

        {/* Withdrawn Count */}
        <div className="rounded-2xl border border-rose-500/20 bg-[#141414]/90 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400/70 uppercase tracking-wider">Withdrawn Count</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-300">{summary.withdrawnCount}</span>
            <span className="text-[11px] text-rose-400/60">Revocations enforced</span>
          </div>
        </div>

        {/* Recent Changes (Last 7 Days) */}
        <div className="rounded-2xl border border-[#c3f340]/20 bg-[#141414]/90 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#c3f340]/70 uppercase tracking-wider">Recent Changes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#c3f340]/10 text-[#c3f340] border border-[#c3f340]/20">
              <Calendar size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#c3f340]">{summary.recentCount}</span>
            <span className="text-[11px] text-white/40">Last 7 days activity</span>
          </div>
        </div>
      </div>

      {/* 2. READ-ONLY PRIVACY ENFORCEMENT CALLOUT */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs">
        <div className="flex items-center gap-2.5 text-white/70">
          <Lock size={14} className="text-[#c3f340] shrink-0" />
          <span>
            <strong className="text-white">Immutable Institutional Ledger:</strong> This ledger is strictly read-only. Administrators cannot override or force student consent.
          </span>
        </div>
        <span className="hidden md:inline-flex text-[10px] font-mono text-white/30 uppercase tracking-wider">
          DPDP & GDPR Article 7 Compliant
        </span>
      </div>

      {/* 3. FILTER CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 sm:flex-initial">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="search-consent-logs"
            type="text"
            placeholder="Search student name, ID, or data field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#141414] py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#141414] px-3 py-1.5 text-xs text-white/70">
            <span className="text-white/40 text-[11px]">Category:</span>
            <select
              id="filter-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#181818] text-white">All Categories</option>
              <option value="academic" className="bg-[#181818] text-white">Academic</option>
              <option value="financial" className="bg-[#181818] text-white">Financial</option>
              <option value="wellbeing" className="bg-[#181818] text-white">Wellbeing</option>
              <option value="ai" className="bg-[#181818] text-white">AI & Analytics</option>
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#141414] px-3 py-1.5 text-xs text-white/70">
            <span className="text-white/40 text-[11px]">Action:</span>
            <select
              id="filter-action"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              aria-label="Filter by Action"
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#181818] text-white">All Actions</option>
              <option value="granted" className="bg-[#181818] text-white">Granted</option>
              <option value="withdrawn" className="bg-[#181818] text-white">Withdrawn</option>
              <option value="updated" className="bg-[#181818] text-white">Updated</option>
            </select>
          </div>

          {(categoryFilter !== 'all' || actionFilter !== 'all' || searchTerm) && (
            <button
              id="btn-reset-filters"
              onClick={() => {
                setCategoryFilter('all');
                setActionFilter('all');
                setSearchTerm('');
              }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. AUDIT LOGS DATA TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table id="consent-logs-table" className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Fields</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-white/40">
                    <ShieldCheck size={32} className="mx-auto text-white/20 mb-2" />
                    <p className="text-sm font-semibold text-white/70">No consent events found</p>
                    <p className="text-xs text-white/40 mt-1">
                      No student consent logs match the selected category or action filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr
                    key={l.id}
                    id={`log-row-${l.id}`}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="px-5 py-3.5 font-mono text-[11px] text-white/50 whitespace-nowrap">
                      {l.timestamp}
                    </td>

                    {/* Student */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-white">{l.studentName || l.studentId}</span>
                      {l.studentName && (
                        <span className="ml-1.5 font-mono text-[10px] text-white/40">
                          ({l.studentId})
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getCategoryBadge(l.category)}
                    </td>

                    {/* Fields */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {l.fields && l.fields.length > 0 ? (
                          l.fields.map((f, i) => (
                            <span
                              key={i}
                              className="rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/70 font-mono"
                            >
                              {f}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/40 italic text-[11px]">All category attributes</span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getActionBadge(l.action)}
                    </td>

                    {/* Version */}
                    <td className="px-5 py-3.5 font-mono text-[11px] text-white/60 whitespace-nowrap">
                      <span className="rounded bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 text-[10px] text-white/70">
                        {l.consentVersion}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
