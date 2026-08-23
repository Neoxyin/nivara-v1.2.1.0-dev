'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';
import {
  Bell,
  ShieldCheck,
  UserCheck,
  LogOut,
  Calendar,
  Lock,
  Check,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Save,
} from 'lucide-react';
import { logoutUser } from '@/lib/auth';

interface CounsellorSettingToggle {
  id: string;
  label: string;
  description: string;
  category: 'alerts' | 'availability' | 'privacy';
  enabled: boolean;
}

const INITIAL_COUNSELLOR_SETTINGS: CounsellorSettingToggle[] = [
  {
    id: 'urgent_triage_push',
    label: 'Immediate High-Distress Triage Alerts',
    description: 'Trigger immediate push notifications when a student scores stress >= 4 or reports critical pacing overload.',
    category: 'alerts',
    enabled: true,
  },
  {
    id: 'attendance_flag_threshold',
    label: 'Low Attendance Auto-Flagging (<80%)',
    description: 'Automatically highlight students in the Attention Queue when seminar attendance dips below threshold.',
    category: 'alerts',
    enabled: true,
  },
  {
    id: 'morning_briefing_digest',
    label: 'Morning Caseload Summary (08:30)',
    description: 'Receive an automated morning overview of today’s scheduled appointments and newly flagged students.',
    category: 'alerts',
    enabled: true,
  },
  {
    id: 'duty_status_walkin',
    label: 'Duty Status: Accept Emergency Drop-ins',
    description: 'Show your profile as active on campus for same-day student crisis and walk-in consultations.',
    category: 'availability',
    enabled: true,
  },
  {
    id: 'calendar_buffer_sync',
    label: '15-Minute Clinical Buffer Between Sessions',
    description: 'Enforce automatic transition and clinical note-taking time after every student meeting.',
    category: 'availability',
    enabled: true,
  },
  {
    id: 'encrypted_clinical_notes',
    label: 'Client-Side Note Encryption & Audit Trails',
    description: 'Encrypt all confidential student notes in compliance with institutional FERPA and healthcare regulations.',
    category: 'privacy',
    enabled: true,
  },
  {
    id: 'zero_surveillance_guarantee',
    label: 'Zero Passive Surveillance Enforcement',
    description: 'Ensure institutional wellbeing insights are derived exclusively from voluntary student check-ins.',
    category: 'privacy',
    enabled: true,
  },
];

export default function CounsellorSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<CounsellorSettingToggle[]>(INITIAL_COUNSELLOR_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'availability' | 'privacy'>('all');

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = async () => {
    await logoutUser();
    router.push('/');
  };

  const filteredSettings =
    activeTab === 'all'
      ? settings
      : settings.filter((item) => item.category === activeTab);

  return (
    <div className="rise-in">
        <SectionHeading
          eyebrow="Counsellor Settings"
          title="Clinical triage & portal preferences."
          description="Configure your notification thresholds, campus availability status, FERPA security controls, and specialist credentials."
          action={
            <div className="flex items-center gap-3">
              <Pill tone="accent">
                <ShieldCheck size={11} className="mr-1 inline" /> Institutional Compliance Active
              </Pill>
              <button
                type="button"
                onClick={handleSave}
                className="btn-sweep inline-flex items-center gap-1.5 rounded-lg border border-[#c3f340] bg-[#c3f340] px-4 py-2 text-xs font-bold uppercase tracking-[.1em] text-[#0d1408] shadow-[0_0_16px_rgba(195,243,64,0.3)] transition hover:scale-105"
              >
                <Save size={13} /> {saved ? 'Saved' : 'Save Changes'}
              </button>
            </div>
          }
        />

        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#c3f340]/40 bg-[#c3f340]/10 px-4 py-2.5 text-xs text-[#dff77d]">
            <Check size={14} className="text-[#c3f340]" />
            Your counsellor workspace preferences have been updated and saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_.55fr] gap-6">
          {/* Main Controls Panel */}
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs">
              {(['all', 'alerts', 'availability', 'privacy'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3.5 py-1.5 font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.15]'
                      : 'text-white/45 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {tab === 'all' ? 'All Settings' : tab}
                </button>
              ))}
            </div>

            {/* Toggle Rows List */}
            <TiltCard
              maxTilt={1.5}
              className="border border-white/[0.09] bg-[#111111]/90 backdrop-blur-xl divide-y divide-white/[0.07] overflow-hidden rounded-xl"
            >
              {filteredSettings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-6 p-5 sm:p-6 transition-colors hover:bg-white/[0.015]"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <span className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/40">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/45">
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.enabled}
                    onClick={() => toggleSetting(item.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-out focus:outline-none ${
                      item.enabled
                        ? 'bg-[#c3f340] shadow-[0_0_14px_rgba(195,243,64,0.4)]'
                        : 'bg-white/[0.12]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                        item.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </TiltCard>
          </div>

          {/* Right Sidebar: Profile, Duty Status & Session Management */}
          <div className="space-y-6">
            {/* Counsellor Profile Card */}
            <TiltCard
              maxTilt={2}
              className="border border-white/[0.09] bg-[#111111]/90 p-6 backdrop-blur-xl rounded-xl text-left"
            >
              <div className="flex items-center gap-3.5 border-b border-white/[0.08] pb-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#1c1c1c] text-sm font-extrabold text-[#c3f340] border border-[#c3f340]/40 shadow-[0_0_14px_rgba(195,243,64,0.2)]">
                  AR
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Dr. Aisha Rahman</h3>
                  <p className="text-xs text-[#c3f340] font-medium">Lead Wellbeing Specialist</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Staff ID: ST-8832 · Campus Triage Team</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-white/60">
                  <span>Current Status</span>
                  <span className="font-semibold text-[#c3f340] flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#c3f340] animate-pulse" /> On Duty
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span>Assigned Department</span>
                  <span className="font-semibold text-white">Student Life & Wellbeing</span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span>Clinical Room</span>
                  <span className="font-semibold text-white">Room 304, North Quad</span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span>Active Caseload</span>
                  <span className="font-semibold text-white">14 Assigned Students</span>
                </div>
              </div>
            </TiltCard>

            {/* Quick Actions & Session Management */}
            <TiltCard
              maxTilt={2}
              className="border border-white/[0.09] bg-[#111111]/90 p-6 backdrop-blur-xl rounded-xl text-left"
            >
              <h3 className="text-xs font-bold uppercase tracking-[.14em] text-white/50 mb-3">
                Session Management
              </h3>
              <p className="text-xs text-white/45 leading-relaxed mb-5">
                Sign out to end your shift and secure clinical student confidentiality across shared terminal workstations.
              </p>

              <Magnetic>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#e5a27d]/40 bg-[#e5a27d]/[0.08] py-2.5 text-xs font-bold uppercase tracking-[.1em] text-[#f0ba9d] transition-all hover:bg-[#e5a27d]/20 hover:border-[#e5a27d] hover:text-white"
                >
                  <LogOut size={14} /> End Shift & Sign Out
                </button>
              </Magnetic>
            </TiltCard>
          </div>
        </div>
      </div>
  );
}
