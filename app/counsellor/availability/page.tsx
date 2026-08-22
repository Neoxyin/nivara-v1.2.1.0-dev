'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import {
  Clock3,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  UsersRound,
} from 'lucide-react';

export default function CounsellorAvailabilityPage() {
  const [dutyStatus, setDutyStatus] = useState<'available' | 'next' | 'away'>('available');
  const [maxCaseload, setMaxCaseload] = useState(15);
  const [officeLocation, setOfficeLocation] = useState('Student Wellbeing Center · Room 204');
  const [slotStates, setSlotStates] = useState({
    'Mon-AM': true,
    'Mon-PM': true,
    'Tue-AM': true,
    'Tue-PM': true,
    'Wed-AM': false,
    'Wed-PM': true,
    'Thu-AM': true,
    'Thu-PM': true,
    'Fri-AM': true,
    'Fri-PM': false,
  });
  const [savedAlert, setSavedAlert] = useState(false);

  const toggleSlot = (slotKey: keyof typeof slotStates) => {
    setSlotStates((prev) => ({ ...prev, [slotKey]: !prev[slotKey] }));
  };

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const days = [
    { key: 'Mon', label: 'Monday', date: '17 Mar' },
    { key: 'Tue', label: 'Tuesday', date: '18 Mar' },
    { key: 'Wed', label: 'Wednesday', date: '19 Mar' },
    { key: 'Thu', label: 'Thursday', date: '20 Mar' },
    { key: 'Fri', label: 'Friday', date: '21 Mar' },
  ];

  return (
    <div className="rise-in">
      <SectionHeading
        eyebrow="Working rhythm & capacity"
        title="Availability & office hours."
        description="Configure your consultation schedule, open booking windows for students, and set active caseload ceilings."
        action={
          <div className="flex items-center gap-2">
            {savedAlert && (
              <span className="text-xs font-bold text-[#c3f340] inline-flex items-center gap-1">
                <CheckCircle2 size={13} /> Preferences updated
              </span>
            )}
            <Pill tone="accent">
              <ShieldCheck size={12} className="mr-1 inline" /> Schedule Synced
            </Pill>
          </div>
        }
      />

      {/* Top Setting Cards */}
      <StaggerContainer stagger={0.06} className="mb-8 grid grid-cols-3 gap-3">
        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Current Duty Status</p>
            <div className="mt-3 flex gap-1.5">
              {(['available', 'next', 'away'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setDutyStatus(st)}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                    dutyStatus === st
                      ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_10px_rgba(195,243,64,0.3)]'
                      : 'border border-white/[0.08] text-white/40 hover:text-white/70'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-white/45">Visible on student booking directory</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Caseload Ceiling</p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-display text-4xl text-white">{maxCaseload}</p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMaxCaseload((prev) => Math.max(5, prev - 1))}
                  className="grid h-7 w-7 place-items-center rounded border border-white/[0.1] text-white/60 hover:text-white"
                >
                  -
                </button>
                <button
                  onClick={() => setMaxCaseload((prev) => Math.min(30, prev + 1))}
                  className="grid h-7 w-7 place-items-center rounded border border-white/[0.1] text-white/60 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/45">Active students limit</p>
          </TiltCard>
        </div>

        <div className="stagger-item">
          <TiltCard maxTilt={3} className="border border-white/[0.08] bg-[#141414]/90 p-5 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Consultation Location</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/80">
              <MapPin size={14} className="text-[#c3f340] shrink-0" />
              <input
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
                className="w-full bg-transparent text-xs text-white outline-none border-b border-white/[0.1] focus:border-[#c3f340]"
              />
            </div>
            <p className="mt-2 text-xs text-white/45">Physical or virtual room</p>
          </TiltCard>
        </div>
      </StaggerContainer>

      {/* Weekly Schedule Matrix */}
      <TiltCard maxTilt={1} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-6 backdrop-blur-xl rounded-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div>
            <h3 className="font-display text-xl text-white">Weekly Availability Matrix</h3>
            <p className="text-xs text-white/45 mt-0.5">Toggle morning and afternoon booking windows.</p>
          </div>
          <Magnetic>
            <button
              onClick={handleSave}
              className="btn-sweep rounded border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.3)]"
            >
              Save Schedule
            </button>
          </Magnetic>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {days.map((day) => {
            const amKey = `${day.key}-AM` as keyof typeof slotStates;
            const pmKey = `${day.key}-PM` as keyof typeof slotStates;
            const isAmOpen = slotStates[amKey];
            const isPmOpen = slotStates[pmKey];

            return (
              <div key={day.key} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="border-b border-white/[0.06] pb-2.5 mb-3">
                  <p className="font-semibold text-white text-sm">{day.label}</p>
                  <p className="text-[10px] text-white/40">{day.date}</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => toggleSlot(amKey)}
                    className={`w-full p-2.5 rounded border text-left transition-colors ${
                      isAmOpen
                        ? 'border-[#c3f340]/40 bg-[#c3f340]/10 text-[#dff77d]'
                        : 'border-white/[0.06] bg-white/[0.01] text-white/30'
                    }`}
                  >
                    <p className="text-[11px] font-bold">Morning</p>
                    <p className="text-[9px] mt-0.5">10:00 - 12:30</p>
                    <span className="text-[8px] uppercase tracking-wider font-mono-ui mt-1 block">
                      {isAmOpen ? 'Open for booking' : 'Closed'}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleSlot(pmKey)}
                    className={`w-full p-2.5 rounded border text-left transition-colors ${
                      isPmOpen
                        ? 'border-[#c3f340]/40 bg-[#c3f340]/10 text-[#dff77d]'
                        : 'border-white/[0.06] bg-white/[0.01] text-white/30'
                    }`}
                  >
                    <p className="text-[11px] font-bold">Afternoon</p>
                    <p className="text-[9px] mt-0.5">14:00 - 17:00</p>
                    <span className="text-[8px] uppercase tracking-wider font-mono-ui mt-1 block">
                      {isPmOpen ? 'Open for booking' : 'Closed'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </TiltCard>
    </div>
  );
}


