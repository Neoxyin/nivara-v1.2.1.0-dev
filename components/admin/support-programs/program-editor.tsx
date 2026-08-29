'use client';

import React, { useState } from 'react';
import { SupportProgram } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  X,
  AlertTriangle,
  ExternalLink,
  Award,
  DollarSign,
  Briefcase,
  Home,
  Utensils,
  Bus,
  Laptop,
  GraduationCap,
  Calendar,
} from 'lucide-react';

interface ProgramEditorProps {
  programs: SupportProgram[];
}

interface ProgramFormData {
  name: string;
  provider: string;
  description: string;
  category: SupportProgram['category'];
  eligibilitySummary: string;
  applicationUrl?: string;
  deadline?: string;
  active: boolean;
}

const initialFormState: ProgramFormData = {
  name: '',
  provider: '',
  description: '',
  category: 'scholarship',
  eligibilitySummary: '',
  applicationUrl: '',
  deadline: '',
  active: true,
};

export function ProgramEditor({ programs: initialPrograms }: ProgramEditorProps) {
  const [programList, setProgramList] = useState<SupportProgram[]>(initialPrograms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<SupportProgram | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Validate URL format
  const isValidUrl = (urlString: string) => {
    try {
      const parsed = new URL(urlString);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Open modal for new program
  const handleOpenAddModal = () => {
    setEditingProgram(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing existing program
  const handleOpenEditModal = (program: SupportProgram) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      provider: program.provider,
      description: program.description,
      category: program.category,
      eligibilitySummary: program.eligibilitySummary,
      applicationUrl: program.applicationUrl || '',
      deadline: program.deadline || '',
      active: program.active,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
    setFormData(initialFormState);
    setFormErrors({});
  };

  // Validate form submission
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Program name is required.';
    }
    if (!formData.provider.trim()) {
      errors.provider = 'Provider is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }
    if (!formData.category) {
      errors.category = 'Category is required.';
    }
    if (!formData.eligibilitySummary.trim()) {
      errors.eligibilitySummary = 'Eligibility criteria is required.';
    }
    if (formData.applicationUrl && formData.applicationUrl.trim() && !isValidUrl(formData.applicationUrl.trim())) {
      errors.applicationUrl = 'Application URL must be a valid http:// or https:// address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save (Add or Edit)
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (editingProgram) {
      // Update existing program in local state
      setProgramList((prev) =>
        prev.map((item) =>
          item.id === editingProgram.id
            ? {
                ...item,
                name: formData.name.trim(),
                provider: formData.provider.trim(),
                description: formData.description.trim(),
                category: formData.category,
                eligibilitySummary: formData.eligibilitySummary.trim(),
                applicationUrl: formData.applicationUrl?.trim() || undefined,
                deadline: formData.deadline?.trim() || undefined,
                active: formData.active,
                updatedAt: now,
              }
            : item
        )
      );
    } else {
      // Add new program to local state
      const newProgram: SupportProgram = {
        id: `prog-${Date.now()}`,
        name: formData.name.trim(),
        provider: formData.provider.trim(),
        description: formData.description.trim(),
        category: formData.category,
        eligibilitySummary: formData.eligibilitySummary.trim(),
        applicationUrl: formData.applicationUrl?.trim() || undefined,
        deadline: formData.deadline?.trim() || undefined,
        active: formData.active,
        createdAt: now,
        updatedAt: now,
      };
      setProgramList((prev) => [newProgram, ...prev]);
    }

    handleCloseModal();
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setProgramList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              active: !item.active,
              updatedAt: now,
            }
          : item
      )
    );
  };

  // Confirm delete program
  const handleDeleteProgram = (id: string) => {
    setProgramList((prev) => prev.filter((item) => item.id !== id));
    setDeleteConfirmId(null);
  };

  const getCategoryIcon = (category: SupportProgram['category']) => {
    switch (category) {
      case 'scholarship':
        return <Award size={12} className="text-[#38bdf8]" />;
      case 'fee-assistance':
      case 'emergency-fund':
        return <DollarSign size={12} className="text-[#c3f340]" />;
      case 'work-study':
        return <Briefcase size={12} className="text-[#a78bfa]" />;
      case 'hostel':
        return <Home size={12} className="text-[#fb923c]" />;
      case 'food':
        return <Utensils size={12} className="text-[#4ade80]" />;
      case 'transport':
        return <Bus size={12} className="text-[#38bdf8]" />;
      case 'equipment':
        return <Laptop size={12} className="text-[#94a3b8]" />;
      case 'government-scheme':
      default:
        return <GraduationCap size={12} className="text-[#facc15]" />;
    }
  };

  const formatCategoryLabel = (cat: SupportProgram['category']) => {
    switch (cat) {
      case 'scholarship':
        return 'Scholarship';
      case 'fee-assistance':
        return 'Fee Assistance';
      case 'emergency-fund':
        return 'Emergency Fund';
      case 'hostel':
        return 'Hostel';
      case 'food':
        return 'Food & Dining';
      case 'transport':
        return 'Transport';
      case 'equipment':
        return 'Equipment';
      case 'work-study':
        return 'Work-Study';
      case 'government-scheme':
        return 'Govt Scheme';
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Action Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/50">
            Maintain discovering directory of student scholarships, institutional fee concessions, and aid schemes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#c3f340] px-4 py-2.5 text-xs font-bold text-black transition-all hover:bg-[#dff77d] hover:shadow-[0_0_16px_rgba(195,243,64,0.3)] shrink-0"
        >
          <Plus size={15} /> + Add Program
        </button>
      </div>

      {/* Main Table / List View */}
      {programList.length === 0 ? (
        <TiltCard
          maxTilt={1.2}
          className="flex flex-col items-center justify-center p-12 rounded-2xl border border-white/[0.08] bg-[#141414]/90 text-center backdrop-blur-xl"
        >
          <GraduationCap size={36} className="text-white/30 mb-3" />
          <h3 className="text-base font-semibold text-white">No support programs</h3>
          <p className="text-xs text-white/50 max-w-md mt-1">
            Add scholarships, aid programs or schemes to make them discoverable.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.12] transition-colors"
          >
            <Plus size={13} /> + Add Program
          </button>
        </TiltCard>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/50">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Provider</th>
                  <th className="px-5 py-3.5">Deadline</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {programList.map((program) => (
                  <tr key={program.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Name & details */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{program.name}</p>
                          {program.applicationUrl && (
                            <a
                              href={program.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/40 hover:text-[#c3f340] transition-colors"
                              title="Open application URL"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                          {program.description}
                        </p>
                        <p className="text-[10px] text-white/40 line-clamp-1 mt-0.5">
                          <span className="text-white/60">Criteria:</span> {program.eligibilitySummary}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(program.category)}
                        <Pill tone="default">{formatCategoryLabel(program.category)}</Pill>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-5 py-3.5 text-white/70 whitespace-nowrap font-medium">
                      {program.provider}
                    </td>

                    {/* Deadline */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {program.deadline ? (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/75">
                          <Calendar size={12} className="text-white/40" />
                          <span>{program.deadline}</span>
                        </div>
                      ) : (
                        <span className="text-white/40 text-[11px]">Rolling / Open</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {program.active ? (
                        <Pill tone="accent">Active</Pill>
                      ) : (
                        <Pill tone="warm">Inactive</Pill>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(program)}
                          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                          title="Edit program"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Deactivate/Activate Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(program.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            program.active
                              ? 'text-white/60 hover:text-amber-300 hover:bg-amber-500/10'
                              : 'text-white/60 hover:text-[#c3f340] hover:bg-[#c3f340]/10'
                          }`}
                          title={program.active ? 'Deactivate program' : 'Activate program'}
                        >
                          <Power size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(program.id)}
                          className="p-1.5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete program"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Program Editor Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#141414] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProgram ? 'Edit Support Program' : 'Add Support Program'}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Publish aid schemes and scholarships for student discovery.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              {/* Program Name */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Program Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Merit-Cum-Means Tuition Fee Concession"
                  className={`w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                    formErrors.name
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-white/[0.1] focus:border-[#c3f340]'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Provider & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Provider <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g. University Aid Directorate, Govt Ministry"
                    className={`w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                      formErrors.provider
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-white/[0.1] focus:border-[#c3f340]'
                    }`}
                  />
                  {formErrors.provider && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.provider}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as SupportProgram['category'],
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.1] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white focus:border-[#c3f340] focus:outline-none transition-colors"
                  >
                    <option value="scholarship">Scholarship</option>
                    <option value="fee-assistance">Fee Assistance</option>
                    <option value="emergency-fund">Emergency Fund</option>
                    <option value="hostel">Hostel</option>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="equipment">Equipment</option>
                    <option value="work-study">Work-Study</option>
                    <option value="government-scheme">Government Scheme</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.category}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline benefits, coverage, and how this program assists students."
                  className={`w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none ${
                    formErrors.description
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-white/[0.1] focus:border-[#c3f340]'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Eligibility Summary (CRITICAL COPY RULE ENFORCED) */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Eligibility Criteria <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.eligibilitySummary}
                  onChange={(e) => setFormData({ ...formData, eligibilitySummary: e.target.value })}
                  placeholder="Document general qualification conditions, target academic standing, or cohort criteria."
                  className={`w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none ${
                    formErrors.eligibilitySummary
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-white/[0.1] focus:border-[#c3f340]'
                  }`}
                />
                <p className="text-[11px] text-white/45 mt-1">
                  Informational only — final eligibility is determined by the relevant institution or program.
                </p>
                {formErrors.eligibilitySummary && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.eligibilitySummary}</p>
                )}
              </div>

              {/* Application URL & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Application URL <span className="text-white/40 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.applicationUrl}
                    onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                    placeholder="https://campus.edu/apply"
                    className={`w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                      formErrors.applicationUrl
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-white/[0.1] focus:border-[#c3f340]'
                    }`}
                  />
                  {formErrors.applicationUrl && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.applicationUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Deadline <span className="text-white/40 font-normal">(optional date)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.1] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white focus:border-[#c3f340] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-black/40 text-[#c3f340] focus:ring-[#c3f340] focus:ring-offset-0"
                  />
                  <span className="text-xs font-semibold text-white/90">Active Program</span>
                </label>
                <span className="text-[10px] text-white/40">
                  {formData.active ? '(Discoverable by students)' : '(Hidden)'}
                </span>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#c3f340] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#dff77d] transition-all hover:shadow-[0_0_16px_rgba(195,243,64,0.3)]"
                >
                  {editingProgram ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#141414] p-5 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Delete Support Program?</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Are you sure you want to remove this support program from the discovery catalog? This action updates your local session state.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProgram(deleteConfirmId)}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
