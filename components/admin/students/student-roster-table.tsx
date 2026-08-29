'use client';

import React, { useState } from 'react';
import { AdminStudentRoster } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import { Search, Filter, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';

interface StudentRosterTableProps {
  students: AdminStudentRoster[];
}

export function StudentRosterTable({ students }: StudentRosterTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'all' || s.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = ['all', ...Array.from(new Set(students.map((s) => s.department)))];

  return (
    <div className="space-y-4">
      {/* Privacy Guarantee Notice */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-4 backdrop-blur-xl flex items-start gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#c3f340]/10 text-[#c3f340] shrink-0 mt-0.5">
          <Lock size={15} />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#c3f340]">
            Zero-Knowledge Privacy Boundary Enforced
          </h4>
          <p className="mt-0.5 text-xs text-white/60 leading-relaxed">
            Institutional administration is strictly restricted to department cohorts, active consent levels, and program assignments. 
            Raw daily check-in journals, somatic check-in scores, and confidential counselling session notes are strictly inaccessible.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#141414] py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-white/40" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#141414] px-3 py-2 text-xs text-white/80 focus:border-[#c3f340] focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#141414] text-white">
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Cohort / Dept</th>
                <th className="px-5 py-3.5">Consent Status</th>
                <th className="px-5 py-3.5">Assigned Lead</th>
                <th className="px-5 py-3.5">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white/80">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-semibold text-white">{s.name}</p>
                      <p className="font-mono text-[10px] text-white/40">{s.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-white/80">{s.department}</p>
                    <p className="text-[10px] text-white/40">Year {s.year}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                      {s.consentLevel === 'full' ? (
                        <ShieldCheck size={13} className="text-[#c3f340]" />
                      ) : (
                        <ShieldAlert size={13} className="text-amber-400" />
                      )}
                      <span className="capitalize">{s.consentLevel}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/70">{s.assignedCounsellor || '—'}</td>
                  <td className="px-5 py-3.5 text-white/50 font-mono text-[11px]">{s.lastActivityDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
