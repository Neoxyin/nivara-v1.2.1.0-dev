'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { Clock3, MessageCircle, ShieldCheck, X, Calendar, CheckCircle2 } from 'lucide-react';
import { getCounsellors, requestAppointment } from '@/lib/api/counsellors';
import { useQuery } from '@tanstack/react-query';
import type { Counsellor } from '@/lib/types';

export default function StudentCounsellorsPage() {
  const [selected, setSelected] = useState<Counsellor | null>(null);
  const [dayChoice, setDayChoice] = useState<'today' | 'tomorrow'>('today');
  const [selectedSlot, setSelectedSlot] = useState<string>('14:30');
  const [bookingReason, setBookingReason] = useState<string>('Workload pacing and course deadline support');
  const [filterTopic, setFilterTopic] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: counsellors } = useQuery({ queryKey: ['counsellors'], queryFn: getCounsellors });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll and close on Escape key when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selected]);

  const timeSlots = ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM'];

  const filteredCounsellors = filterTopic
    ? counsellors?.filter((c) => c.specializations.includes(filterTopic))
    : counsellors;

  const handleRequest = async (counsellor: Counsellor) => {
    await requestAppointment({
      counsellorName: counsellor.name,
      dayChoice,
      slot: selectedSlot,
      reason: bookingReason.trim() || 'Workload pacing and course deadline support',
      sessionType: '1-on-1 Confidential Guidance',
    });
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
              <ShieldCheck size={12} className="mr-1 inline" /> Confidential by default
            </Pill>
          }
        />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            {filteredCounsellors?.length || 0} specialists available this week
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTopic(null)}
              data-testid="filter-topic-all"
              className={`text-[10px] font-bold uppercase tracking-[.08em] px-2.5 py-1 rounded transition-colors ${
                filterTopic === null ? 'bg-[#c3f340] text-[#0d1408]' : 'text-white/40 hover:text-white/70'
              }`}
            >
              All
            </button>
            {['Study stress', 'Transition', 'Anxiety & focus', 'Accessibility', 'Course pressure'].map((topic) => (
              <button
                key={topic}
                onClick={() => setFilterTopic((prev) => (prev === topic ? null : topic))}
                data-testid={`filter-topic-${topic}`}
                className={`text-[10px] font-bold uppercase tracking-[.08em] px-2.5 py-1 rounded border transition-colors ${
                  filterTopic === topic
                    ? 'border-[#c3f340] bg-[#c3f340]/10 text-[#dff77d]'
                    : 'border-white/[0.08] text-white/40 hover:text-white/70'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <StaggerContainer stagger={0.06} className="grid grid-cols-3 gap-3">
          {filteredCounsellors?.map((c, i) => (
            <div key={c.id || c.name} className="stagger-item">
              <TiltCard
                maxTilt={4}
                spotlightColor="rgba(195, 243, 64, 0.12)"
                onClick={() => { setSelected(c); setRequested(false); }}
                className="group cursor-pointer border border-white/[0.09] bg-[hsl(var(--card))]/90 p-7 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#c3f340]/40 rounded-lg flex flex-col justify-between min-h-[320px]"
                data-testid={`card-counsellor-${i}`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#1a1a1a] font-display text-xl text-white/80 border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.05)] group-hover:border-[#c3f340]/30 transition-colors">
                      {c.initials}
                    </div>
                    <Pill tone={c.status === 'available' ? 'accent' : 'default'}>
                      {c.status === 'available' ? 'Available today' : 'Next opening'}
                    </Pill>
                  </div>
                  <h2 className="mt-7 font-display text-3xl text-white group-hover:text-[#dff77d] transition-colors">{c.name}</h2>
                  <p className="mt-1 text-xs text-white/40">{c.role}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {c.specializations.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.08] pt-4">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Clock3 size={13} className="text-[#c3f340]" /> {c.availability}
                  </div>
                  <div className="btn-sweep mt-4 flex w-full items-center justify-center gap-2 border border-white/[0.14] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-white/70 transition-all duration-150 group-hover:border-[#c3f340]/40 group-hover:text-[#c3f340] rounded">
                    <MessageCircle size={14} /> Request a conversation
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </StaggerContainer>

        {/* Modal rendered directly to body via portal */}
        {mounted && selected && createPortal(
          <div
            onClick={closeModal}
            data-testid="modal-backdrop-counsellor"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-opacity duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <TiltCard maxTilt={3} className="w-full border border-white/[0.14] bg-[#111]/95 p-7 shadow-[0_30px_90px_rgba(0,0,0,.9)] backdrop-blur-2xl rounded-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="serenity-label text-[#c3f340]">20-min confidential chat</p>
                    <h3 className="mt-1 font-display text-2xl text-white">Request conversation</h3>
                  </div>
                  <button
                    onClick={closeModal}
                    data-testid="button-close-counsellor-modal"
                    className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.07] hover:text-white/80"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {requested ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#c3f340]/15 shadow-[0_0_15px_rgba(195,243,64,0.3)]">
                      <CheckCircle2 size={24} className="text-[#c3f340]" />
                    </div>
                    <p className="font-bold text-[#dff77d]">Request submitted</p>
                    <p className="mt-2 text-sm text-white/55">
                      Reserved for <strong className="text-white">{dayChoice === 'today' ? 'Today' : 'Tomorrow'} at {selectedSlot}</strong> with {selected.name}.
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      You will receive calendar details privately.
                    </p>
                    <Magnetic>
                      <button
                        onClick={closeModal}
                        className="mt-6 text-[11px] font-bold uppercase tracking-[.08em] text-white/40 transition-colors hover:text-white"
                      >
                        Done
                      </button>
                    </Magnetic>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-white/55">
                      Scheduling with <strong className="text-white">{selected.name}</strong> ({selected.role}). Choose a preferred time:
                    </p>

                    {/* Day picker */}
                    <div>
                      <label className="serenity-label text-[9px] text-white/40 mb-1.5 block">Select day</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setDayChoice('today')}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                            dayChoice === 'today'
                              ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d]'
                              : 'border-white/[0.08] text-white/50 hover:border-white/20'
                          }`}
                        >
                          <Calendar size={13} /> Today
                        </button>
                        <button
                          onClick={() => setDayChoice('tomorrow')}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                            dayChoice === 'tomorrow'
                              ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d]'
                              : 'border-white/[0.08] text-white/50 hover:border-white/20'
                          }`}
                        >
                          <Calendar size={13} /> Tomorrow
                        </button>
                      </div>
                    </div>

                    {/* Time slots */}
                    <div>
                      <label className="serenity-label text-[9px] text-white/40 mb-1.5 block">Available slots</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                              selectedSlot === slot
                                ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d]'
                                : 'border-white/[0.08] text-white/50 hover:border-white/20'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Focus / Stated Reason */}
                    <div>
                      <label className="serenity-label text-[9px] text-white/40 mb-1.5 block">Focus or topic (optional)</label>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {[
                          'Workload pacing & deadlines',
                          'Exam preparation & stress',
                          'First-year transition',
                          'Focus & timetable balance',
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setBookingReason(preset)}
                            className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.06em] border transition-colors ${
                              bookingReason === preset
                                ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d]'
                                : 'border-white/[0.08] text-white/50 hover:text-white/80'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                      <input
                        value={bookingReason}
                        onChange={(e) => setBookingReason(e.target.value)}
                        placeholder="What would you like to discuss? (e.g. deadline clustering)"
                        className="w-full rounded border border-white/[0.09] bg-white/[0.02] px-3 py-2 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#c3f340]/50"
                      />
                    </div>

                    <p className="text-[11px] text-white/35 leading-tight pt-1">
                      No commitment required — you can cancel or reschedule at any moment.
                    </p>

                    <Magnetic>
                      <button
                        onClick={() => handleRequest(selected)}
                        className="btn-sweep mt-3 w-full border border-[#c3f340] bg-[#c3f340] px-4 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.3)] transition-all hover:scale-102 rounded"
                      >
                        Confirm {dayChoice === 'today' ? 'Today' : 'Tomorrow'} at {selectedSlot}
                      </button>
                    </Magnetic>
                  </div>
                )}
              </TiltCard>
            </div>
          </div>,
          document.body
        )}
      </div>
    </AppShell>
  );
}


