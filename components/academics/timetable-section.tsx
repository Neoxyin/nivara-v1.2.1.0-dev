'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock3,
  MapPin,
  Plus,
  Upload,
  User,
  Sparkles,
  Coffee,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { TimetableUploadModal } from './timetable-upload-modal';
import {
  getTimetable,
  deleteClassFromTimetable,
  getCurrentDayOfWeek,
  getNextUpcomingClass,
  getTodayClasses,
  resetTimetable,
} from '@/lib/api/timetable';
import type { TimetableClass, DayOfWeek } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function TimetableSection() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelectedDay(getCurrentDayOfWeek());
  }, []);

  const { data: timetable = [], refetch } = useQuery({
    queryKey: ['timetable'],
    queryFn: getTimetable,
  });

  const nextUpcoming = getNextUpcomingClass(timetable);
  const dayClasses = getTodayClasses(timetable, selectedDay);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleDeleteClass = async (id: string) => {
    await deleteClassFromTimetable(id);
    refetch();
  };

  const handleReset = async () => {
    if (confirm('Reset schedule to standard university timetable?')) {
      await resetTimetable();
      refetch();
    }
  };

  // Find free blocks between consecutive classes on the selected day
  const freeBlocks: Array<{ start: string; end: string; durationMinutes: number }> = [];
  for (let i = 0; i < dayClasses.length - 1; i++) {
    const currentEnd = dayClasses[i].endTime;
    const nextStart = dayClasses[i + 1].startTime;

    const [endH, endM] = currentEnd.split(':').map(Number);
    const [startH, startM] = nextStart.split(':').map(Number);

    const endTotal = (endH || 0) * 60 + (endM || 0);
    const startTotal = (startH || 0) * 60 + (startM || 0);

    if (startTotal - endTotal >= 45) {
      freeBlocks.push({
        start: currentEnd,
        end: nextStart,
        durationMinutes: startTotal - endTotal,
      });
    }
  }

  const getTypeTone = (type: TimetableClass['type']) => {
    switch (type) {
      case 'studio':
        return 'accent';
      case 'lab':
        return 'warm';
      case 'seminar':
        return 'plum';
      case 'lecture':
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4" id="timetable">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#c3f340]" />
            <h3 className="font-display text-xl text-white">Class Timetable & Schedule Tracker</h3>
          </div>
          <p className="mt-1 text-xs text-white/50">
            Real-time timing reminders, upcoming lectures, and free study blocks across your week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Magnetic>
            <button
              onClick={() => setIsModalOpen(true)}
              className="pressable inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340]/40 bg-[#c3f340]/15 px-3.5 py-2 text-xs font-bold uppercase tracking-[.08em] text-[#dff77d] shadow-[0_0_15px_rgba(195,243,64,0.15)] hover:bg-[#c3f340]/25 transition-all"
            >
              <Upload size={13} /> Upload / Add Class
            </button>
          </Magnetic>

          <button
            onClick={handleReset}
            title="Reset to default semester timetable"
            className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 text-white/40 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Live Next Class Alert Banner */}
      {nextUpcoming.nextClass && mounted && (
        <TiltCard
          maxTilt={1.5}
          spotlightColor="rgba(195, 243, 64, 0.12)"
          className="relative overflow-hidden rounded-xl border border-[#c3f340]/30 bg-[#161c12] p-4 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#c3f340]/20 text-[#dff77d] border border-[#c3f340]/40">
                <Clock3 size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="serenity-label text-[#c3f340]">Next Scheduled Class</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c3f340] animate-ping" />
                </div>
                <p className="font-semibold text-white text-sm mt-0.5">
                  {nextUpcoming.nextClass.subject}{' '}
                  <span className="text-white/40 font-mono text-xs">
                    ({nextUpcoming.nextClass.moduleCode})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-white/70">
                <MapPin size={13} className="text-[#c3f340]" /> {nextUpcoming.nextClass.room}
              </span>
              <Pill tone="accent">
                {nextUpcoming.statusText}
              </Pill>
            </div>
          </div>
        </TiltCard>
      )}

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {days.map((d) => {
          const isToday = mounted && d === getCurrentDayOfWeek();
          const count = timetable.filter((c) => c.day === d).length;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[.08em] transition-all ${
                selectedDay === d
                  ? 'border border-[#c3f340] bg-[#c3f340] text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.35)]'
                  : 'border border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{d}</span>
              {isToday && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                    selectedDay === d ? 'bg-[#0d1408] text-[#c3f340]' : 'bg-[#c3f340]/20 text-[#dff77d]'
                  }`}
                >
                  Today
                </span>
              )}
              <span className="opacity-50 text-[10px] font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Day Schedule Grid */}
      {dayClasses.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#141414]/90 p-8 text-center backdrop-blur-xl">
          <div className="grid h-10 w-10 mx-auto place-items-center rounded-full bg-white/[0.04] text-white/40">
            <Coffee size={20} />
          </div>
          <h4 className="mt-3 font-semibold text-white text-sm">No classes scheduled on {selectedDay}</h4>
          <p className="mt-1 text-xs text-white/40 max-w-sm mx-auto">
            Full study / revision day. Use this block for project milestone sprints or well-being rest.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#c3f340] hover:text-[#c3f340] transition-colors"
          >
            <Plus size={13} /> Add class to {selectedDay}
          </button>
        </div>
      ) : (
        <StaggerContainer stagger={0.06} className="space-y-3">
          {dayClasses.map((item, index) => (
            <div key={item.id} className="stagger-item">
              <TiltCard
                maxTilt={2}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/[0.09] bg-[hsl(var(--card))]/90 p-4 sm:p-5 backdrop-blur-xl transition-all hover:border-white/20"
              >
                {/* Left: Time & Type */}
                <div className="flex items-start gap-4">
                  <div className="min-w-[85px] border-r border-white/[0.08] pr-4 text-left">
                    <p className="font-mono-ui text-sm font-bold text-[#c3f340]">
                      {item.startTime}
                    </p>
                    <p className="font-mono-ui text-xs text-white/40">{item.endTime}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-ui text-[10px] uppercase tracking-wider text-white/40">
                        {item.moduleCode}
                      </span>
                      <Pill tone={getTypeTone(item.type)}>
                        {item.type}
                      </Pill>
                    </div>
                    <h4 className="mt-1 font-semibold text-white text-base">
                      {item.subject}
                    </h4>

                    {item.notes && (
                      <p className="mt-1 text-xs text-white/50 italic">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Location, Instructor & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-white/[0.06] pt-3 sm:pt-0">
                  <div className="text-left sm:text-right space-y-1 text-xs">
                    <div className="flex items-center sm:justify-end gap-1.5 text-white/80 font-medium">
                      <MapPin size={13} className="text-[#c3f340]" />
                      <span>{item.room}</span>
                    </div>
                    {item.instructor && (
                      <div className="flex items-center sm:justify-end gap-1.5 text-white/40 text-[11px]">
                        <User size={11} />
                        <span>{item.instructor}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteClass(item.id)}
                    title="Remove class"
                    className="opacity-0 group-hover:opacity-100 grid h-7 w-7 place-items-center rounded bg-white/[0.04] text-white/30 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </TiltCard>

              {/* Free Block Insertion if between classes */}
              {freeBlocks.find((fb) => fb.start === item.endTime) && (
                <div className="my-2.5 flex items-center justify-between rounded-lg border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-2.5 text-xs text-white/50">
                  <span className="flex items-center gap-2">
                    <Coffee size={14} className="text-[#c3f340]" />
                    <span className="font-semibold text-white/70">
                      Free Study Block ({Math.floor((freeBlocks.find((fb) => fb.start === item.endTime)?.durationMinutes || 0) / 60)}h {(freeBlocks.find((fb) => fb.start === item.endTime)?.durationMinutes || 0) % 60}m)
                    </span>
                    <span>· {item.endTime} to {dayClasses[index + 1]?.startTime}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono text-[#c3f340]/80">
                    Recommended: 1-min check-in / reading
                  </span>
                </div>
              )}
            </div>
          ))}
        </StaggerContainer>
      )}

      {/* Timetable Upload / Add Modal */}
      <TimetableUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTimetableUpdated={() => {
          refetch();
        }}
      />
    </div>
  );
}
