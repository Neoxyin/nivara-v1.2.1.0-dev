'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { Button } from '@/components/shared/button';
import { Clock3, MessageCircle, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { getCounsellors, requestAppointment } from '@/lib/api/counsellors';
import { useQuery } from '@tanstack/react-query';

export default function CounsellorsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const { data: counsellors } = useQuery({ queryKey: ['counsellors'], queryFn: getCounsellors });

  const request = async (name: string) => {
    await requestAppointment(name, 'pending');
    setRequested(true);
  };

  const closeModal = () => {
    setSelected(null);
    setRequested(false);
  };

  return (
    <AppShell>
      <div className="rise-in">
        <SectionHeading
          eyebrow="Human support"
          title="People on your side."
          description="Connect with your institution's student support team. You choose what to share, and asking for a conversation is not a commitment to anything else."
          action={
            <Pill tone="plum">
              <ShieldCheck size={12} className="mr-1" /> Confidential by default
            </Pill>
          }
        />

        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-white/40">
            {counsellors?.length || 0} people available this week
          </p>
          <button
            data-testid="button-counsellor-filter"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.08em] text-white/45 transition-colors hover:text-white/80"
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {counsellors?.map((c, i) => (
            <article
              key={c.name}
              className="border border-white/[0.09] bg-[hsl(var(--card))] p-7"
              data-testid={`card-counsellor-${i}`}
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#1a1a1a] font-display text-xl text-white/80">
                  {c.initials}
                </div>
                <Pill tone={c.status === 'available' ? 'accent' : 'default'}>
                  {c.status === 'available' ? 'Available today' : 'Next opening'}
                </Pill>
              </div>
              <h2 className="mt-7 font-display text-3xl">{c.name}</h2>
              <p className="mt-1 text-xs text-white/40">{c.role}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {c.specializations.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-xs text-white/40">
                <Clock3 size={13} /> {c.availability}
              </div>
              <button
                onClick={() => { setSelected(c.name); setRequested(false); }}
                data-testid={`button-connect-counsellor-${i}`}
                className="mt-5 flex w-full items-center justify-center gap-2 border border-white/[0.14] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-white/60 transition-[border-color,color] duration-150 hover:border-white/30 hover:text-white/90"
              >
                <MessageCircle size={14} /> Request a conversation
              </button>
            </article>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md border border-white/[0.12] bg-[#111] p-8 shadow-[0_30px_80px_rgba(0,0,0,.6)]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-2xl">Request conversation</h3>
                <button
                  onClick={closeModal}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.07] hover:text-white/80"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {requested ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#c3f340]/10">
                    <span className="text-xl text-[#c3f340]">✓</span>
                  </div>
                  <p className="font-bold text-[#dff77d]">Request sent</p>
                  <p className="mt-2 text-sm text-white/45">
                    You'll receive a confirmation shortly.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 text-[11px] font-bold uppercase tracking-[.08em] text-white/35 transition-colors hover:text-white/70"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-white/50">
                    You're requesting a conversation with{' '}
                    <strong className="text-white/80">{selected}</strong>.
                  </p>
                  <p className="mt-2 text-xs text-white/35">
                    This is not a commitment — it simply opens the door.
                  </p>
                  <button
                    onClick={() => request(selected)}
                    className="btn-sweep mt-6 w-full border border-[#c3f340]/30 bg-[#141414] px-4 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] transition-colors hover:text-[#0d1408]"
                  >
                    Confirm request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
