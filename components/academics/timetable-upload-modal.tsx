'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Calendar,
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { addClassToTimetable, saveTimetable, parseUploadedSchedule } from '@/lib/api/timetable';
import type { DayOfWeek } from '@/lib/types';

interface TimetableUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimetableUpdated: () => void;
}

export function TimetableUploadModal({
  isOpen,
  onClose,
  onTimetableUpdated,
}: TimetableUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'paste'>('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual form states
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [subject, setSubject] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');
  const [classType, setClassType] = useState<'lecture' | 'lab' | 'seminar' | 'studio'>('lecture');
  const [notes, setNotes] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseUploadedSchedule(content);
        if (parsed.length > 0) {
          await saveTimetable(parsed);
          setUploadSuccess(`Successfully imported ${parsed.length} scheduled classes from ${file.name}`);
          setTimeout(() => {
            onTimetableUpdated();
            setIsSubmitting(false);
            setUploadSuccess(null);
            onClose();
          }, 900);
        } else {
          setError('Could not extract structured classes from file. Try pasting text directly.');
          setIsSubmitting(false);
        }
      } catch {
        setError('Failed to parse file. Please verify format.');
        setIsSubmitting(false);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = async () => {
    if (!rawText.trim()) {
      setError('Please paste your schedule text.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const parsed = parseUploadedSchedule(rawText);
      await saveTimetable(parsed);
      setUploadSuccess(`Successfully parsed ${parsed.length} timetable entries.`);
      setTimeout(() => {
        onTimetableUpdated();
        setIsSubmitting(false);
        setUploadSuccess(null);
        onClose();
      }, 900);
    } catch {
      setError('Error parsing schedule text.');
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !room.trim()) {
      setError('Subject and Room are required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await addClassToTimetable({
        day,
        subject: subject.trim(),
        moduleCode: moduleCode.trim() || subject.substring(0, 3).toUpperCase() + '-101',
        startTime,
        endTime,
        room: room.trim(),
        instructor: instructor.trim() || undefined,
        type: classType,
        notes: notes.trim() || undefined,
      });

      setUploadSuccess('Class successfully added to your schedule.');
      setTimeout(() => {
        onTimetableUpdated();
        setIsSubmitting(false);
        setUploadSuccess(null);
        setSubject('');
        setModuleCode('');
        setRoom('');
        setInstructor('');
        setNotes('');
        onClose();
      }, 700);
    } catch {
      setError('Failed to add class.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.14] bg-[#141414] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(195,243,64,0.06)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#c3f340]" />
                  <h3 className="font-display text-lg sm:text-xl text-white">
                    Timetable & Schedule Manager
                  </h3>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Input or upload your weekly classes to track timings and alerts.
                </p>
              </div>

              <button
                onClick={onClose}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.04] text-white/40 hover:bg-white/[0.1] hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-4 flex border-b border-white/[0.08] pb-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  setError(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-[.08em] transition-colors rounded ${
                  activeTab === 'upload'
                    ? 'bg-[#c3f340]/15 text-[#dff77d] border border-[#c3f340]/30'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Upload size={13} /> Upload File (.ics / .csv)
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('manual');
                  setError(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-[.08em] transition-colors rounded ml-2 ${
                  activeTab === 'manual'
                    ? 'bg-[#c3f340]/15 text-[#dff77d] border border-[#c3f340]/30'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Plus size={13} /> Add Class
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('paste');
                  setError(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-[.08em] transition-colors rounded ml-2 ${
                  activeTab === 'paste'
                    ? 'bg-[#c3f340]/15 text-[#dff77d] border border-[#c3f340]/30'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <FileText size={13} /> Paste Schedule
              </button>
            </div>

            {/* Messages */}
            {uploadSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#c3f340]/40 bg-[#c3f340]/10 p-3 text-xs text-[#dff77d]">
                <CheckCircle2 size={16} />
                <span>{uploadSuccess}</span>
              </div>
            )}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-300">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: FILE UPLOAD */}
            {activeTab === 'upload' && (
              <div className="mt-4 space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/[0.15] bg-white/[0.02] p-8 text-center cursor-pointer transition hover:border-[#c3f340]/50 hover:bg-[#c3f340]/[0.03]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#c3f340]/15 text-[#c3f340]">
                    <Upload size={22} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">
                    Click to select your timetable file
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Supports .ics, .csv, Google Calendar exports, and raw syllabus schedules
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ics,.csv,.txt,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-xs text-white/55 flex items-start gap-2">
                  <Sparkles size={14} className="text-[#c3f340] shrink-0 mt-0.5" />
                  <span>
                    Nivara extracts class times, lecture halls, and module codes automatically to power class countdown alerts and free block recommendations.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL ENTRY */}
            {activeTab === 'manual' && (
              <form onSubmit={handleManualSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Day of the Week
                    </label>
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value as DayOfWeek)}
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Class Type
                    </label>
                    <select
                      value={classType}
                      onChange={(e) => setClassType(e.target.value as any)}
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    >
                      <option value="lecture">Lecture</option>
                      <option value="lab">Lab / Practical</option>
                      <option value="studio">Studio</option>
                      <option value="seminar">Seminar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Subject / Course Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Interaction Systems"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Module Code
                    </label>
                    <input
                      type="text"
                      placeholder="IXD-201"
                      value={moduleCode}
                      onChange={(e) => setModuleCode(e.target.value)}
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Room / Hall *
                    </label>
                    <input
                      type="text"
                      placeholder="Studio 3B"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      required
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Instructor (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Prof. Liam Ward"
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Notes / Reminder
                    </label>
                    <input
                      type="text"
                      placeholder="Bring design sketchbook"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 w-full rounded border border-white/[0.1] bg-[#1c1c1c] px-3 py-2 text-xs text-white focus:border-[#c3f340] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="pressable rounded bg-[#c3f340] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.3)] hover:brightness-110"
                  >
                    {isSubmitting ? 'Saving...' : 'Add to Schedule'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: PASTE TEXT */}
            {activeTab === 'paste' && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-white/60">
                  Paste schedule rows in format: <code className="text-[#c3f340]">Monday, 10:00 - 11:30, Interaction Systems, Studio 3B</code>
                </p>
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`Monday, 10:00 - 11:30, Interaction Systems, Studio 3B\nTuesday, 09:30 - 11:00, Creative Coding, Lab 4\nThursday, 14:00 - 15:30, Design History, Hall 3`}
                  className="w-full rounded-lg border border-white/[0.1] bg-[#1c1c1c] p-3 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#c3f340] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || !rawText.trim()}
                    onClick={handlePasteSubmit}
                    className="pressable rounded bg-[#c3f340] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0d1408] shadow-[0_0_15px_rgba(195,243,64,0.3)] hover:brightness-110 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Parsing...' : 'Import Schedule'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
