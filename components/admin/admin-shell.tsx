'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Scale,
  FolderKanban,
  HeartHandshake,
  Users2,
  GraduationCap,
  FileCheck2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Activity,
  HeartPulse,
} from 'lucide-react';
import gsap from 'gsap';
import { Mark } from '@/components/shared/mark';
import { FluidBackground } from '@/components/ui/fluid-background';
import { Magnetic } from '@/components/ui/magnetic';
import { Pill } from '@/components/shared/pill';

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const ADMIN_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { id: 'demand', label: 'Demand Trends', href: '/admin/demand-trends', icon: TrendingUp },
  { id: 'fairness', label: 'Fairness', href: '/admin/fairness', icon: Scale },
  { id: 'resources', label: 'Resources', href: '/admin/resources', icon: FolderKanban },
  { id: 'programs', label: 'Support Programs', href: '/admin/support-programs', icon: HeartHandshake },
  { id: 'counsellors', label: 'Counsellors', href: '/admin/counsellors', icon: Users2 },
  { id: 'students', label: 'Students', href: '/admin/students', icon: GraduationCap },
  { id: 'corrections', label: 'Corrections', href: '/admin/corrections', icon: FileCheck2, badge: '2' },
  { id: 'consent', label: 'Consent Audit', href: '/admin/consent-audit', icon: ShieldCheck },
];

export function AdminShell({ children, title, subtitle, action }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Page entrance animation
  useEffect(() => {
    if (!mainContentRef.current) return;
    gsap.fromTo(
      mainContentRef.current,
      { opacity: 0, y: 8, filter: 'blur(3px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.3,
        ease: 'power2.out',
      }
    );
  }, [pathname]);

  return (
    <div className="page-grain relative min-h-[100dvh] bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Interactive Fluid Background */}
      <FluidBackground />

      {/* Ambient background accents */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb left-[10%] top-[6%] h-72 w-72 bg-[#c3f340]/[0.035] blur-3xl" />
        <div className="ambient-orb right-[8%] top-[20%] h-80 w-80 bg-[#1e4d38]/[0.12] blur-3xl" />
        <div className="ambient-ribbon right-[-8%] top-[12%] h-[380px] w-[720px]" />
      </div>

      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#090909]/90 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <Mark inverse href="/admin" />
          <span className="rounded-md bg-[#c3f340]/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#c3f340] border border-[#c3f340]/20">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/70 hover:text-white"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/[0.08] bg-[#0d0d0d] p-4 transition-transform duration-300 ease-in-out lg:hidden flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Mark inverse href="/admin" />
              <div className="leading-tight">
                <p className="text-xs font-bold text-white uppercase tracking-wider">NIVARA</p>
                <p className="text-[10px] text-[#c3f340] font-mono">Governance</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/40 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>

          {/* Governance Notice */}
          <div className="rounded-xl border border-[#c3f340]/20 bg-[#c3f340]/[0.03] p-3 text-[11px] text-white/70">
            <div className="flex items-center gap-1.5 font-bold text-[#c3f340] uppercase tracking-wider text-[10px]">
              <ShieldAlert size={12} /> Governance Principle
            </div>
            <p className="mt-1 leading-relaxed text-white/60 text-[10px]">
              Observe → Understand → Govern → Improve. Strictly non-punitive.
            </p>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#c3f340]/10 text-[#c3f340] border border-[#c3f340]/30 shadow-[0_0_12px_rgba(195,243,64,0.12)]'
                      : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-[#c3f340]' : 'text-white/40'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-[#c3f340]/20 px-1.5 py-0.2 font-mono text-[10px] font-bold text-[#c3f340]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Footer */}
        <div className="pt-3 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-white/40 font-mono">
            <span>Role: Campus Admin</span>
            <span className="text-emerald-400">● Live</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 text-xs font-bold text-white/70 hover:bg-white/[0.08]"
          >
            <LogOut size={13} /> Exit to Student App
          </Link>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col justify-between border-r border-white/[0.07] bg-[#090909]/95 pt-5 pb-5 text-white backdrop-blur-2xl transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            collapsed ? 'w-[72px]' : 'w-[264px]'
          }`}
        >
          <div>
            {/* Header / Brand */}
            <div className="mb-4 flex h-11 shrink-0 items-center justify-between px-3">
              <div
                className={`overflow-visible transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  collapsed
                    ? 'max-w-0 opacity-0 pointer-events-none blur-sm'
                    : 'max-w-[180px] opacity-100 blur-0 pl-1'
                }`}
              >
                <Magnetic radius={24} strength={0.018} maxDisplacement={1.5}>
                  <div className="cursor-pointer flex items-center gap-2.5">
                    <Mark inverse href="/admin" />
                    <div className="leading-tight">
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-white">
                        NIVARA
                      </span>
                      <span className="block text-[9px] font-mono tracking-widest text-[#c3f340] uppercase">
                        Governance
                      </span>
                    </div>
                  </div>
                </Magnetic>
              </div>

              <div className={`group relative shrink-0 ${collapsed ? 'mx-auto' : ''}`}>
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 shadow-sm transition-all duration-150 hover:scale-[1.03] hover:border-[#c3f340]/40 hover:bg-white/[0.06] hover:text-[#c3f340] hover:shadow-[0_0_12px_rgba(195,243,64,0.12)] active:scale-[0.97]"
                >
                  {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>
            </div>

            {/* Governance Principle Badge */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed
                  ? 'max-h-0 opacity-0 mb-0 pointer-events-none'
                  : 'max-h-24 opacity-100 mb-3 px-3'
              }`}
            >
              <div className="rounded-xl border border-[#c3f340]/20 bg-[#c3f340]/[0.03] p-2.5 text-[10px] text-white/70">
                <div className="flex items-center gap-1.5 font-bold text-[#c3f340] uppercase tracking-wider">
                  <ShieldAlert size={12} /> Governance Principle
                </div>
                <p className="mt-1 leading-relaxed text-white/60">
                  Observe → Understand → Govern → Improve.
                </p>
              </div>
            </div>

            {/* Nav list */}
            <nav className="space-y-1 px-3">
              <div
                className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  collapsed ? 'max-h-0 opacity-0 mb-0' : 'max-h-6 opacity-100 mb-2 px-1'
                }`}
              >
                <p className="serenity-label text-[#c3f340]/70">Admin Control Center</p>
              </div>

              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <div key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={`relative flex h-10 w-full items-center rounded-xl transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                        isActive
                          ? 'bg-white/[0.08] text-white shadow-[0_0_14px_rgba(195,243,64,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]'
                          : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-[#c3f340] shadow-[0_0_10px_#c3f340]" />
                      )}

                      <div className="flex h-10 w-11 shrink-0 items-center justify-center">
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                          className={`transition-colors duration-150 ${
                            isActive ? 'text-[#c3f340]' : 'text-white/55 group-hover:text-white'
                          }`}
                        />
                      </div>

                      <span
                        className={`truncate text-[12px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          collapsed
                            ? 'max-w-0 opacity-0 pointer-events-none blur-sm -translate-x-2'
                            : 'max-w-[150px] opacity-100 blur-0 translate-x-0'
                        }`}
                      >
                        {item.label}
                      </span>

                      {!collapsed && item.badge && (
                        <span className="ml-auto mr-2 rounded-full bg-[#c3f340]/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#c3f340]">
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 opacity-0 -translate-x-1 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-150 ease-out z-[60] flex items-center"
                      >
                        <div className="relative rounded-md border border-white/[0.12] bg-[#141414]/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_10px_rgba(195,243,64,0.15)] backdrop-blur-xl whitespace-nowrap">
                          {item.label}
                          <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rotate-45 border-b border-l border-white/[0.12] bg-[#141414]" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Desktop Footer Navigation & Role Info */}
          <div className="space-y-2 px-3 pt-3 border-t border-white/[0.06]">
            {!collapsed && (
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate">Administrator</span>
                  <span className="text-[10px] text-emerald-400 font-mono">● Online</span>
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">Role: Campus Oversight</p>
              </div>
            )}

            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[11px] font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-all"
                title={collapsed ? 'Exit to Student App' : undefined}
              >
                <LogOut size={13} />
                {!collapsed && <span>Student Portal</span>}
              </Link>
              <Link
                href="/counsellor"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#c3f340]/20 bg-[#c3f340]/[0.04] text-[11px] font-semibold text-[#c3f340] hover:bg-[#c3f340]/10 transition-all"
                title={collapsed ? 'Switch to Counsellor Space' : undefined}
              >
                <HeartPulse size={13} />
                {!collapsed && <span>Counsellor Space</span>}
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-[margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            collapsed ? 'lg:ml-[72px]' : 'lg:ml-[264px]'
          }`}
        >
          {/* Top Sticky Header */}
          <header className="sticky top-0 z-30 flex min-h-[64px] items-center justify-between border-b border-white/[0.08] bg-[#0a0a0a]/80 px-6 sm:px-8 py-3 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                  {title}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#c3f340]/30 bg-[#c3f340]/10 px-2 py-0.5 text-[10px] font-mono text-[#c3f340]">
                  <Activity size={10} /> Live Telemetry
                </span>
              </div>
              {subtitle && <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-3">
              {action}
              <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/60">
                <ShieldCheck size={14} className="text-[#c3f340]" />
                <span className="font-mono text-[11px]">DPDP & FERPA Verified</span>
              </div>
            </div>
          </header>

          {/* Page Content View */}
          <main ref={mainContentRef} className="p-6 sm:p-8 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
