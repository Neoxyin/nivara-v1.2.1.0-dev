'use client';

import React, { useState } from 'react';
import { AdminResource } from '@/lib/types/admin';
import { Pill } from '@/components/shared/pill';
import { Plus, Check, Clock, Eye, Edit3, Trash2 } from 'lucide-react';
import { TiltCard } from '@/components/ui/tilt-card';

interface ResourceEditorProps {
  resources: AdminResource[];
  onAddResource?: (resource: Omit<AdminResource, 'id'>) => void;
  onDeleteResource?: (id: string) => void;
}

export function ResourceEditor({ resources: initialResources, onAddResource, onDeleteResource }: ResourceEditorProps) {
  const [resources, setResources] = useState<AdminResource[]>(initialResources);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'Emergency Crisis', 'Accessibility', 'Academic Rhythm', 'Financial & Food'];

  const filtered = resources.filter(
    (r) => activeCategory === 'all' || r.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#c3f340] text-black shadow-[0_0_12px_rgba(195,243,64,0.3)]'
                  : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const title = prompt('Enter resource title:');
            if (title) {
              const newRes: AdminResource = {
                id: `res-${Date.now()}`,
                title,
                category: 'Academic Rhythm',
                format: 'Guide',
                targetAudience: 'All Undergraduates',
                verifiedBy: 'Campus Admin',
                lastAudited: '2026-08-29',
                status: 'published',
                viewsThisMonth: 0,
              };
              setResources([newRes, ...resources]);
            }
          }}
          className="flex items-center gap-2 rounded-xl bg-[#c3f340] px-4 py-2 text-xs font-bold text-black transition-all hover:shadow-[0_0_16px_rgba(195,243,64,0.4)]"
        >
          <Plus size={14} /> Add Verified Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <TiltCard
            key={res.id}
            maxTilt={2}
            className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#c3f340] uppercase">{res.category}</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-xs text-white/60">{res.format}</span>
                </div>
                <Pill tone={res.status === 'published' ? 'accent' : 'warm'}>{res.status}</Pill>
              </div>

              <h4 className="mt-2 text-base font-semibold text-white">{res.title}</h4>
              <p className="mt-1 text-xs text-white/50">Audience: {res.targetAudience}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <Eye size={13} className="text-[#c3f340]" /> {res.viewsThisMonth} views
              </span>
              <span>Verified: {res.verifiedBy}</span>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
