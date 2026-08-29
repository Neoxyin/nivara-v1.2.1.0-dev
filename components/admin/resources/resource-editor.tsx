'use client';

import React, { useState } from 'react';
import { SupportResource } from '@/lib/types/admin';
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
  BookOpen,
  DollarSign,
  HeartPulse,
  Compass,
  MapPin,
  Phone,
} from 'lucide-react';

interface ResourceEditorProps {
  resources: SupportResource[];
}

interface ResourceFormData {
  title: string;
  description: string;
  category: SupportResource['category'];
  provider: string;
  contact?: string;
  url?: string;
  location?: string;
  active: boolean;
}

const initialFormState: ResourceFormData = {
  title: '',
  description: '',
  category: 'academic',
  provider: '',
  contact: '',
  url: '',
  location: '',
  active: true,
};

export function ResourceEditor({ resources: initialResources }: ResourceEditorProps) {
  const [resourceList, setResourceList] = useState<SupportResource[]>(initialResources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<SupportResource | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>(initialFormState);
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

  // Open modal for new resource
  const handleOpenAddModal = () => {
    setEditingResource(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing existing resource
  const handleOpenEditModal = (resource: SupportResource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      provider: resource.provider,
      contact: resource.contact || '',
      url: resource.url || '',
      location: resource.location || '',
      active: resource.active,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
    setFormData(initialFormState);
    setFormErrors({});
  };

  // Validate form submission
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Resource name is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }
    if (!formData.category) {
      errors.category = 'Category is required.';
    }
    if (!formData.provider.trim()) {
      errors.provider = 'Provider is required.';
    }
    if (formData.url && formData.url.trim() && !isValidUrl(formData.url.trim())) {
      errors.url = 'URL must be a valid http:// or https:// address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save (Add or Edit)
  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (editingResource) {
      // Update existing resource in local state
      setResourceList((prev) =>
        prev.map((item) =>
          item.id === editingResource.id
            ? {
                ...item,
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                provider: formData.provider.trim(),
                contact: formData.contact?.trim() || undefined,
                url: formData.url?.trim() || undefined,
                location: formData.location?.trim() || undefined,
                active: formData.active,
                updatedAt: now,
              }
            : item
        )
      );
    } else {
      // Add new resource to local state
      const newResource: SupportResource = {
        id: `res-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        provider: formData.provider.trim(),
        contact: formData.contact?.trim() || undefined,
        url: formData.url?.trim() || undefined,
        location: formData.location?.trim() || undefined,
        active: formData.active,
        createdAt: now,
        updatedAt: now,
      };
      setResourceList((prev) => [newResource, ...prev]);
    }

    handleCloseModal();
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setResourceList((prev) =>
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

  // Confirm delete resource
  const handleDeleteResource = (id: string) => {
    setResourceList((prev) => prev.filter((item) => item.id !== id));
    setDeleteConfirmId(null);
  };

  const getCategoryIcon = (category: SupportResource['category']) => {
    switch (category) {
      case 'academic':
        return <BookOpen size={12} className="text-[#38bdf8]" />;
      case 'financial':
        return <DollarSign size={12} className="text-[#c3f340]" />;
      case 'wellbeing':
        return <HeartPulse size={12} className="text-[#f472b6]" />;
      case 'general':
      default:
        return <Compass size={12} className="text-white/60" />;
    }
  };

  const getCategoryBadge = (category: SupportResource['category']) => {
    switch (category) {
      case 'academic':
        return <Pill tone="default" className="text-[#38bdf8] border-[#38bdf8]/30">Academic</Pill>;
      case 'financial':
        return <Pill tone="accent">Financial</Pill>;
      case 'wellbeing':
        return <Pill tone="plum">Well-being</Pill>;
      case 'general':
      default:
        return <Pill tone="default">General</Pill>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Action Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/50">
            Manage institutional support services, academic toolkits, and wellness guidance catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#c3f340] px-4 py-2.5 text-xs font-bold text-black transition-all hover:bg-[#dff77d] hover:shadow-[0_0_16px_rgba(195,243,64,0.3)] shrink-0"
        >
          <Plus size={15} /> + Add Resource
        </button>
      </div>

      {/* Main Table / List View */}
      {resourceList.length === 0 ? (
        <TiltCard
          maxTilt={1.2}
          className="flex flex-col items-center justify-center p-12 rounded-2xl border border-white/[0.08] bg-[#141414]/90 text-center backdrop-blur-xl"
        >
          <Compass size={36} className="text-white/30 mb-3" />
          <h3 className="text-base font-semibold text-white">No resources added</h3>
          <p className="text-xs text-white/50 max-w-md mt-1">
            Add a support resource to make it available to students.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.12] transition-colors"
          >
            <Plus size={13} /> + Add Resource
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
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {resourceList.map((resource) => (
                  <tr key={resource.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Name & details */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{resource.title}</p>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/40 hover:text-[#c3f340] transition-colors"
                              title="Open resource URL"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                          {resource.description}
                        </p>
                        {(resource.location || resource.contact) && (
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/40 mt-1">
                            {resource.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={10} /> {resource.location}
                              </span>
                            )}
                            {resource.contact && (
                              <span className="flex items-center gap-1">
                                <Phone size={10} /> {resource.contact}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(resource.category)}
                        {getCategoryBadge(resource.category)}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-5 py-3.5 text-white/70 whitespace-nowrap font-medium">
                      {resource.provider}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {resource.active ? (
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
                          onClick={() => handleOpenEditModal(resource)}
                          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                          title="Edit resource"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Deactivate/Activate Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(resource.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            resource.active
                              ? 'text-white/60 hover:text-amber-300 hover:bg-amber-500/10'
                              : 'text-white/60 hover:text-[#c3f340] hover:bg-[#c3f340]/10'
                          }`}
                          title={resource.active ? 'Deactivate resource' : 'Activate resource'}
                        >
                          <Power size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(resource.id)}
                          className="p-1.5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete resource"
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

      {/* Resource Editor Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#141414] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingResource ? 'Edit Support Resource' : 'Add Support Resource'}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Configure directory details for student assistance.
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

            <form onSubmit={handleSaveResource} className="space-y-4">
              {/* Resource Name / Title */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Resource Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Peer Tutoring Center, Emergency Micro-Grant"
                  className={`w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                    formErrors.title
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-white/[0.1] focus:border-[#c3f340]'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide an overview of the services, support scope, and what students receive."
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

              {/* Category & Provider in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as SupportResource['category'],
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.1] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white focus:border-[#c3f340] focus:outline-none transition-colors"
                  >
                    <option value="academic">Academic</option>
                    <option value="financial">Financial</option>
                    <option value="wellbeing">Well-being</option>
                    <option value="general">General</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Provider <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g. Academic Success Center, Dean of Welfare"
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
              </div>

              {/* URL & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    URL <span className="text-white/40 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://campus.edu/resource"
                    className={`w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                      formErrors.url
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-white/[0.1] focus:border-[#c3f340]'
                    }`}
                  />
                  {formErrors.url && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Contact <span className="text-white/40 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g. email, phone, helpline"
                    className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#c3f340] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Location & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Location <span className="text-white/40 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Learning Commons, Room 310"
                    className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#c3f340] focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2 sm:pt-4 flex items-center gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-black/40 text-[#c3f340] focus:ring-[#c3f340] focus:ring-offset-0"
                    />
                    <span className="text-xs font-semibold text-white/90">Active Resource</span>
                  </label>
                  <span className="text-[10px] text-white/40">
                    {formData.active ? '(Visible to students)' : '(Hidden)'}
                  </span>
                </div>
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
                  {editingResource ? 'Save Changes' : 'Create Resource'}
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
                <h4 className="text-sm font-bold text-white">Delete Resource?</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Are you sure you want to remove this support resource from the directory? This action updates your local session state.
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
                onClick={() => handleDeleteResource(deleteConfirmId)}
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
