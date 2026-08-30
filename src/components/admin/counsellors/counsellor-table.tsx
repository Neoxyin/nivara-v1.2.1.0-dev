'use client';

import React, { useState } from 'react';
import { AdminCounsellor } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import { Plus, Check, Power, RotateCcw, AlertTriangle, X, Search, ShieldCheck, UserCheck } from 'lucide-react';

interface CounsellorTableProps {
  counsellors: AdminCounsellor[];
}

export function CounsellorTable({ counsellors: initialCounsellors }: CounsellorTableProps) {
  const [counsellorList, setCounsellorList] = useState<AdminCounsellor[]>(initialCounsellors);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });
  const [formError, setFormError] = useState('');

  // Deactivate confirmation state
  const [deactivatingCounsellor, setDeactivatingCounsellor] = useState<AdminCounsellor | null>(null);

  // Status mutation handlers (local state only)
  const handleApprove = (id: string) => {
    setCounsellorList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'active' } : c))
    );
  };

  const handleConfirmDeactivate = () => {
    if (!deactivatingCounsellor) return;
    setCounsellorList((prev) =>
      prev.map((c) => (c.id === deactivatingCounsellor.id ? { ...c, status: 'inactive' } : c))
    );
    setDeactivatingCounsellor(null);
  };

  const handleReactivate = (id: string) => {
    setCounsellorList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'active' } : c))
    );
  };

  // Add counsellor handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.department.trim()) {
      setFormError('All fields (Name, Email, Department) are required.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setFormError('Please provide a valid email address.');
      return;
    }

    const newCounsellor: AdminCounsellor = {
      id: `coun-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      specialization: formData.department.trim(),
      status: 'pending',
      workload: {
        upcomingSessions: 0,
        pendingRequests: 0,
        openFollowUps: 0,
      },
      activeStudents: 0,
      capacity: 20,
      completedSessions: 0,
      avgSatisfactionRating: 5.0,
      burnoutRiskScore: 'low',
    };

    setCounsellorList((prev) => [newCounsellor, ...prev]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', department: '' });
    setFormError('');
  };

  const filtered = counsellorList.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.department && c.department.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search counsellors by name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#141414] py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none transition-colors"
          />
        </div>

        <button
          onClick={() => {
            setFormError('');
            setFormData({ name: '', email: '', department: '' });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c3f340] px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Add Counsellor</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Counsellor</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Upcoming</th>
                <th className="px-5 py-3.5">Pending</th>
                <th className="px-5 py-3.5">Follow-ups</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    No counsellors found — Add or approve counsellors to begin managing campus support capacity.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Counsellor */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#1c1c1c] text-[10px] font-bold text-[#c3f340] border border-[#c3f340]/30 shrink-0">
                          {c.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-[10px] text-white/40">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5">
                      <span className="text-white/80">{c.department || c.specialization || 'General Student Support'}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <Pill
                        tone={
                          c.status === 'active'
                            ? 'accent'
                            : c.status === 'pending'
                            ? 'warm'
                            : 'default'
                        }
                      >
                        <span className="capitalize">{c.status}</span>
                      </Pill>
                    </td>

                    {/* Upcoming */}
                    <td className="px-5 py-3.5 font-mono text-white/90">
                      {c.workload?.upcomingSessions ?? 0}
                    </td>

                    {/* Pending */}
                    <td className="px-5 py-3.5 font-mono">
                      {(c.workload?.pendingRequests ?? 0) > 0 ? (
                        <span className="text-amber-400 font-semibold">{c.workload.pendingRequests}</span>
                      ) : (
                        <span className="text-white/40">0</span>
                      )}
                    </td>

                    {/* Follow-ups */}
                    <td className="px-5 py-3.5 font-mono text-white/70">
                      {c.workload?.openFollowUps ?? 0}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      {c.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(c.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340]/30 bg-[#c3f340]/10 px-2.5 py-1 text-[11px] font-medium text-[#c3f340] hover:bg-[#c3f340]/20 transition-colors"
                        >
                          <UserCheck size={12} />
                          <span>Approve</span>
                        </button>
                      )}

                      {c.status === 'active' && (
                        <button
                          onClick={() => setDeactivatingCounsellor(c)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Power size={12} />
                          <span>Deactivate</span>
                        </button>
                      )}

                      {c.status === 'inactive' && (
                        <button
                          onClick={() => handleReactivate(c.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/80 hover:bg-white/[0.08] transition-colors"
                        >
                          <RotateCcw size={12} />
                          <span>Reactivate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Counsellor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#141414] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Add Campus Counsellor</h3>
                <p className="text-xs text-white/40 mt-0.5">New practitioner will be added with pending status.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-white/40 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jordan Vance, PsyD"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Institutional Email *</label>
                <input
                  type="email"
                  placeholder="e.g. j.vance@campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Department / Unit *</label>
                <input
                  type="text"
                  placeholder="e.g. Psychological Services / Academic Counseling"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-white/[0.08] bg-transparent px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#c3f340] px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Add Counsellor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {deactivatingCounsellor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeactivatingCounsellor(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#141414] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/10 text-red-400 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Deactivate Counsellor</h3>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                  Are you sure you want to deactivate <span className="font-semibold text-white">{deactivatingCounsellor.name}</span>? They will no longer receive new session allocations until reactivated.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
              <button
                type="button"
                onClick={() => setDeactivatingCounsellor(null)}
                className="rounded-xl border border-white/[0.08] bg-transparent px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeactivate}
                className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
