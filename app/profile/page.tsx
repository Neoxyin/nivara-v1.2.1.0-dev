'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { getCurrentUser, updateStudent } from '@/lib/api/student';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: student, isLoading, isError } = useQuery({ queryKey: ['student'], queryFn: getCurrentUser });

  // Sync local state once student data resolves
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('2');
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setCourse(student.course || '');
      setYear(String(student.year || 2));
    }
  }, [student]);

  const updateMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['student'] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const handleSave = () => {
    if (!name.trim() || !course.trim()) {
      setErrorMsg('Name and course cannot be empty.');
      return;
    }
    setErrorMsg('');
    updateMutation.mutate({ name, course, year: Number(year) });
  };

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c3f340]" />
        </div>
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center text-rose-400">
          Failed to load profile data.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="rise-in space-y-8">
        <SectionHeading
          eyebrow="Your profile"
          title="Make this space yours."
          description="Keep the basics current so Nivara can keep its language and suggestions relevant."
        />

        <div className="grid grid-cols-1 md:grid-cols-[.75fr_1.25fr] gap-4">
          {/* Identity card */}
          <TiltCard maxTilt={4} spotlightColor="rgba(195, 243, 64, 0.15)" className="bg-[#141414]/90 p-9 text-white border border-white/[0.08] backdrop-blur-xl">
            <Magnetic>
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#c3f340] font-display text-2xl text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.4)]">
                {initials || student?.avatar || 'MC'}
              </div>
            </Magnetic>
            <h2 className="mt-8 font-display text-5xl leading-[.9] text-white">{name || 'Your name'}</h2>
            <p className="mt-2 text-sm text-white/45">{course || 'BSc Interaction Design'}</p>
            <div className="mt-10 border-t border-white/[0.08] pt-6">
              <p className="serenity-label text-white/35">Support profile</p>
              <p className="mt-3 text-xs leading-5 text-white/50">
                Student · Year {year}
                <br />
                Connected to your institution
              </p>
            </div>
          </TiltCard>

          {/* Edit form */}
          <TiltCard maxTilt={2} className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-9 backdrop-blur-xl">
            <p className="serenity-label text-white/40">Personal basics</p>
            <div className="mt-7 grid gap-5">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[.06em] text-white/50">
                  Preferred name
                </span>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSaved(false); }}
                  data-testid="input-profile-name"
                  className="mt-2 block w-full border border-white/[0.09] bg-white/[0.02] px-4 py-3 text-sm text-white/85 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors duration-150 rounded"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[.06em] text-white/50">
                  Course
                </span>
                <input
                  value={course}
                  onChange={(e) => { setCourse(e.target.value); setSaved(false); }}
                  data-testid="input-profile-course"
                  className="mt-2 block w-full border border-white/[0.09] bg-white/[0.02] px-4 py-3 text-sm text-white/85 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors duration-150 rounded"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[.06em] text-white/50">
                  Year of study
                </span>
                <select
                  value={year}
                  onChange={(e) => { setYear(e.target.value); setSaved(false); }}
                  data-testid="select-profile-year"
                  className="mt-2 block w-full border border-white/[0.09] bg-[#141414] px-4 py-3 text-sm text-white/85 outline-none focus:border-[#c3f340]/50 transition-colors duration-150 rounded"
                >
                  {['1', '2', '3', '4', '5'].map((y) => (
                    <option key={y} value={y}>Year {y}{y === '5' ? '+' : ''}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Magnetic>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="btn-sweep border border-[#c3f340]/30 bg-[#141414] px-6 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#dff77d] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors hover:text-[#0d1408] hover:border-[#c3f340] disabled:opacity-50 rounded"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                </button>
              </Magnetic>
              {saved && (
                <span className="text-[11px] font-bold text-[#c3f340] drop-shadow-[0_0_8px_#c3f340]">✓ Saved</span>
              )}
              {errorMsg && (
                <span className="text-xs text-rose-400">{errorMsg}</span>
              )}
              {updateMutation.isError && !errorMsg && (
                <span className="text-xs text-rose-400">Failed to save profile.</span>
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </AppShell>
  );
}


