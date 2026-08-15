'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  CircleUserRound,
  Compass,
  LayoutDashboard,
  MessageCircle,
  Settings,
  UsersRound,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Mark } from '../shared/mark';

const nav = [
  { href: '/dashboard', label: 'Today', icon: LayoutDashboard },
  { href: '/check-in', label: 'Check-in', icon: CircleUserRound },
  { href: '/academics', label: 'Academics', icon: BookOpen },
  { href: '/insights', label: 'Insights', icon: BrainCircuit },
  { href: '/support', label: 'Support space', icon: MessageCircle },
  { href: '/counsellors', label: 'Counsellors', icon: UsersRound },
  { href: '/resources', label: 'Resources', icon: Compass },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const student = getCurrentUser();

  return (
    <div className="page-grain min-h-[100dvh] bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb left-[12%] top-[8%] h-64 w-64 bg-[#c3f340]/[0.035] blur-3xl" />
        <div className="ambient-orb right-[8%] top-[24%] h-80 w-80 bg-[#275a43]/[0.12] blur-3xl" />
        <div className="ambient-ribbon right-[-8%] top-[15%] h-[380px] w-[720px]" />
        <div className="ambient-ribbon right-[-14%] top-[23%] h-[310px] w-[610px] rotate-[-14deg] border-white/[0.05]" />
      </div>

      {/* Sidebar — always visible on desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#090909]/98 px-5 py-7 text-white backdrop-blur-xl">
        <div className="mb-10 flex items-center">
          <Mark inverse />
        </div>

        <p className="mb-3 px-3 serenity-label">Your space</p>
        <nav className="space-y-0.5" aria-label="Main navigation">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => router.prefetch(href)}
                onFocus={() => router.prefetch(href)}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-[10px] px-3 py-2.5 text-[13px] font-semibold transition-[background-color,color] duration-150 ease-out ${
                  active
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/85'
                }`}
              >
                {active && (
                  <span className="absolute inset-y-0 left-0 w-[2px] rounded-r-full bg-[#c3f340]" />
                )}
                <Icon size={16} strokeWidth={1.8} className="shrink-0" />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c3f340] shadow-[0_0_12px_rgba(195,243,64,.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-0.5">
          <div className="mb-5 border-t border-white/[0.07] pt-5">
            <p className="px-3 serenity-label">Private by design</p>
            <p className="px-3 pt-2 text-[11px] leading-relaxed text-white/35">
              You choose what Nivara uses and who can see it.
            </p>
          </div>

          <Link
            href="/profile"
            onMouseEnter={() => router.prefetch('/profile')}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white/55 transition-colors duration-150 hover:bg-white/[0.04] hover:text-white/85"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#c3f340] text-[10px] font-extrabold text-[#0d1408]">
              {student?.avatar || 'MC'}
            </span>
            <span className="truncate">{student?.name || 'Student'}</span>
            <ChevronRight size={13} className="ml-auto shrink-0 opacity-40" />
          </Link>
          <Link
            href="/settings"
            onMouseEnter={() => router.prefetch('/settings')}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white/55 transition-colors duration-150 hover:bg-white/[0.04] hover:text-white/85"
          >
            <Settings size={16} strokeWidth={1.8} className="shrink-0" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#0a0a0a]/80 px-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c3f340] shadow-[0_0_12px_rgba(195,243,64,.7)]" />
            <span className="serenity-label text-white/35">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>
            <Link
              href="/profile"
              onMouseEnter={() => router.prefetch('/profile')}
              className="grid h-8 w-8 place-items-center rounded-full bg-[#c3f340] text-[10px] font-extrabold text-[#0d1408] transition-opacity hover:opacity-85"
            >
              {student?.avatar || 'MC'}
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-[1380px] px-10 py-11">{children}</main>
      </div>
    </div>
  );
}
