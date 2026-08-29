'use client';

import React, { useState } from 'react';
import { SupportProgram } from '@/lib/types/admin';
import { Plus, Edit2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';

interface ProgramEditorProps {
  programs: SupportProgram[];
  onAddProgram?: (program: Omit<SupportProgram, 'id'>) => void;
  onUpdateStatus?: (id: string, status: SupportProgram['status']) => void;
}

export function ProgramEditor({ programs: initialPrograms, onAddProgram, onUpdateStatus }: ProgramEditorProps) {
  const [programs, setPrograms] = useState<SupportProgram[]>(initialPrograms);
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  const filtered = programs.filter(p => filter === 'all' || p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'draft', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === tab
                  ? 'bg-[#c3f340] text-black shadow-[0_0_12px_rgba(195,243,64,0.3)]'
                  : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const name = prompt('Program Title:');
            if (name) {
              const newP: SupportProgram = {
                id: `prog-${Date.now()}`,
                title: name,
                category: 'Stress & Rhythm',
                targetCohort: 'All Undergraduates',
                enrolledCount: 0,
                capacity: 50,
                status: 'draft',
                facilitator: 'Faculty Lead',
                startDate: '2026-09-01',
                budgetAllocated: '$2,500',
              };
              setPrograms([newP, ...programs]);
            }
          }}
          className="flex items-center gap-2 rounded-xl bg-[#c3f340] px-4 py-2 text-xs font-bold text-black transition-all hover:shadow-[0_0_16px_rgba(195,243,64,0.4)]"
        >
          <Plus size={14} /> New Support Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((program) => (
          <TiltCard
            key={program.id}
            maxTilt={2}
            className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#c3f340] uppercase tracking-wider">{program.category}</span>
                  <Pill tone={program.status === 'active' ? 'accent' : program.status === 'draft' ? 'warm' : 'default'}>
                    {program.status}
                  </Pill>
                </div>
                <h4 className="mt-1 text-base font-semibold text-white">{program.title}</h4>
                <p className="mt-0.5 text-xs text-white/50">Target: {program.targetCohort}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Enrolled</span>
                <span className="font-mono font-bold text-white">{program.enrolledCount} / {program.capacity}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Facilitator</span>
                <span className="truncate block text-white/80">{program.facilitator}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Budget</span>
                <span className="font-mono text-[#c3f340]">{program.budgetAllocated}</span>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
