'use client';

import React, { useState } from 'react';
import { AdminStudentRoster } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Plus,
  Power,
  RotateCcw,
  AlertTriangle,
  X,
  UserX,
} from 'lucide-react';

interface StudentRosterTableProps {
  students: AdminStudentRoster[];
}

export function StudentRosterTable({ students: initialStudents }: StudentRosterTableProps) {
  const [studentList, setStudentList] = useState<AdminStudentRoster[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Modal states for adding a student
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentNumber: '',
    department: '',
    year: '1',
  });
  const [formError, setFormError] = useState('');

  // Deactivate confirmation state
  const [deactivatingStudent, setDeactivatingStudent] = useState<AdminStudentRoster | null>(null);

  // Status mutation handlers (local state only)
  const handleConfirmDeactivate = () => {
    if (!deactivatingStudent) return;
    setStudentList((prev) =>
      prev.map((s) => (s.id === deactivatingStudent.id ? { ...s, status: 'inactive' } : s))
    );
    setDeactivatingStudent(null);
  };

  const handleReactivate = (id: string) => {
    setStudentList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'active' } : s))
    );
  };

  // Add student handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.studentNumber.trim() ||
      !formData.department.trim() ||
      !formData.year
    ) {
      setFormError('All fields (Name, Email, Student Number, Program/Department, Year) are required.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setFormError('Please provide a valid email address.');
      return;
    }

    const yearNum = parseInt(formData.year, 10) || 1;
    const newStudent: AdminStudentRoster = {
      id: `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      studentNumber: formData.studentNumber.trim(),
      department: formData.department.trim(),
      program: formData.department.trim(),
      year: yearNum,
      status: 'active',
      consentLevel: 'full',
      lastActivityDate: 'Just now',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setStudentList((prev) => [newStudent, ...prev]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', studentNumber: '', department: '', year: '1' });
    setFormError('');
  };

  const filtered = studentList.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(term) ||
      s.id.toLowerCase().includes(term) ||
      (s.studentNumber && s.studentNumber.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      s.department.toLowerCase().includes(term) ||
      (s.program && s.program.toLowerCase().includes(term));

    const matchesDept = filterDepartment === 'all' || s.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = ['all', ...Array.from(new Set(studentList.map((s) => s.department)))];

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
            Institutional administration is strictly restricted to demographic cohorts, active consent levels, and program assignments. 
            Raw daily check-in journals, somatic check-in scores, and confidential counselling session notes are strictly inaccessible.
          </p>
        </div>
      </div>

      {/* Filter, Search, and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by Name, Student ID, Email, or Program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#141414] py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none transition-colors"
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

        <button
          onClick={() => {
            setFormError('');
            setFormData({ name: '', email: '', studentNumber: '', department: '', year: '1' });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c3f340] px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Student Roster Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Student ID / Email</th>
                <th className="px-5 py-3.5">Cohort / Program</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Consent Level</th>
                <th className="px-5 py-3.5">Assigned Lead</th>
                <th className="px-5 py-3.5">Last Activity</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-white/40">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserX size={20} className="text-white/20" />
                      <span>No students found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Student Name */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-white">{s.name}</p>
                        <p className="font-mono text-[10px] text-white/40">{s.id}</p>
                      </div>
                    </td>

                    {/* Student Number & Email */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-mono text-white/90">{s.studentNumber || s.id}</p>
                        <p className="text-[10px] text-white/40">{s.email || '—'}</p>
                      </div>
                    </td>

                    {/* Cohort / Program */}
                    <td className="px-5 py-3.5">
                      <p className="text-white/80">{s.program || s.department}</p>
                      <p className="text-[10px] text-white/40">{s.department} • Year {s.year}</p>
                    </td>

                    {/* Account Status */}
                    <td className="px-5 py-3.5">
                      <Pill tone={s.status === 'inactive' ? 'default' : 'accent'}>
                        <span className="capitalize">{s.status || 'active'}</span>
                      </Pill>
                    </td>

                    {/* Consent Status */}
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

                    {/* Assigned Counsellor */}
                    <td className="px-5 py-3.5 text-white/70">{s.assignedCounsellor || '—'}</td>

                    {/* Last Activity */}
                    <td className="px-5 py-3.5 text-white/50 font-mono text-[11px]">{s.lastActivityDate}</td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      {s.status === 'inactive' ? (
                        <button
                          onClick={() => handleReactivate(s.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/80 hover:bg-white/[0.08] transition-colors"
                        >
                          <RotateCcw size={12} />
                          <span>Reactivate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeactivatingStudent(s)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Power size={12} />
                          <span>Deactivate</span>
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

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#141414] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Add Student Account</h3>
                <p className="text-xs text-white/40 mt-0.5">Enrolls student profile into institutional directory.</p>
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
                <label className="block text-xs font-medium text-white/70">Student Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Campus Email *</label>
                <input
                  type="email"
                  placeholder="e.g. maya.lin@campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Student Number / Roll ID *</label>
                <input
                  type="text"
                  placeholder="e.g. 2026-CS-402"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70">Program / Department *</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c3f340] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70">Academic Year *</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                  >
                    <option value="1">Year 1 (Freshman)</option>
                    <option value="2">Year 2 (Sophomore)</option>
                    <option value="3">Year 3 (Junior)</option>
                    <option value="4">Year 4 (Senior)</option>
                    <option value="5">Year 5+ (Postgrad / PhD)</option>
                  </select>
                </div>
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
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Student Confirmation Modal */}
      {deactivatingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeactivatingStudent(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#141414] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/10 text-red-400 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Deactivate Student Account</h3>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                  Are you sure you want to deactivate <span className="font-semibold text-white">{deactivatingStudent.name}</span> ({deactivatingStudent.studentNumber || deactivatingStudent.id})? The student account will be marked inactive.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
              <button
                type="button"
                onClick={() => setDeactivatingStudent(null)}
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
