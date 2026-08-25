'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, History } from 'lucide-react';
import { AppShell } from '@/components/layout/nivara-shell';
import { TiltCard } from '@/components/ui/tilt-card';
import type { AssessmentHistoryItem } from '@/lib/types';

const KEY = 'nivara_assessment_history';

export default function AssessmentHistoryPage() {
  const [items, setItems] = useState<(AssessmentHistoryItem & { signature?: string })[]>([]);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { setItems([]); }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem('nivara_current_support_assessment');
    setItems([]);
    setConfirming(false);
  };

  return (
    <AppShell>
      <div className="rise-in mx-auto max-w-4xl space-y-7">
        <div>
          <Link href="/support" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white"><ArrowLeft size={14}/> Back to Support</Link>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#c3f340]">Support Need Profile</p>
              <h1 className="mt-2 font-display text-5xl text-white">Assessment History</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Historical Support Need assessments and their explanations. Clearing this history does not change your current permissions or other data.</p>
            </div>
            <button onClick={() => setConfirming(true)} disabled={!items.length} className="inline-flex items-center gap-2 rounded border border-rose-300/20 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-rose-200 disabled:opacity-30"><Trash2 size={13}/> Clear history</button>
          </div>
        </div>
        {items.length === 0 ? (
          <TiltCard maxTilt={1} className="border border-white/10 bg-[#141414]/90 p-8"><History size={22} className="text-white/30"/><h2 className="mt-4 text-lg font-semibold text-white">No saved assessments</h2><p className="mt-2 text-sm text-white/45">New student-facing assessments will appear here when available.</p></TiltCard>
        ) : (
          <div className="space-y-3">{items.map(item => (
            <TiltCard key={item.id} maxTilt={1} className="border border-white/10 bg-[#141414]/90 p-6">
              <p className="text-xs font-semibold text-white">{new Date(item.createdAt).toLocaleString()}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[.1em] text-white/35">{item.availability}{item.stale ? ' · STALE' : ''}</p>
              <div className="mt-5 grid gap-2 md:grid-cols-3">
                {[item.dimensions.academic,item.dimensions.financial,item.dimensions.wellbeing].map(d => (
                  <div key={d.dimension} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/35">{d.dimension}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{d.available ? (d.stale ? 'Previous assessment' : 'Personalized result') : 'Unavailable'}</p>
                  </div>
                ))}
              </div>
            </TiltCard>
          ))}</div>
        )}
        {confirming && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151515] p-7"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-rose-200">Clear assessment history</p><h2 className="mt-2 font-display text-3xl text-white">Delete saved Support Need history?</h2><p className="mt-4 text-sm leading-6 text-white/55">This removes saved Support Need assessment history and associated historical explanations. It does not change permissions, academic/financial/well-being data, support access, or unrelated data.</p><div className="mt-7 flex justify-end gap-3"><button onClick={() => setConfirming(false)} className="rounded border border-white/10 px-4 py-2.5 text-xs text-white/60">Cancel</button><button onClick={clearHistory} className="rounded border border-rose-300/30 bg-rose-300/10 px-4 py-2.5 text-xs font-bold text-rose-100">Clear history</button></div></div></div>}
      </div>
    </AppShell>
  );
}
