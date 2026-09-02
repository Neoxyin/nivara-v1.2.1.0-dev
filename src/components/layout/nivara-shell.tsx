'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  BrainCircuit,
  ChevronRight,
  CircleUserRound,
  Compass,
  LayoutDashboard,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  UsersRound,
  Home,
  HelpCircle,
  Sparkles,
  LogOut,
  Landmark,
  HeartPulse,
  Settings,
} from 'lucide-react';
import gsap from 'gsap';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { Mark } from '../shared/mark';
import { NivaraLogoIcon } from '../shared/nivara-logo';
import { FluidBackground } from '@/components/ui/fluid-background';
import { Magnetic } from '@/components/ui/magnetic';
import { useSidebar } from './sidebar-context';
import { StudentNotifications } from './student-notifications';
import { StudentWalkthrough } from '@/components/dashboard/student-walkthrough';
import { HelpModal } from '@/components/shared/help-modal';
import { AboutNivaraModal } from '@/components/shared/about-nivara-modal';
import { LanguageSelector, useLanguage } from '@/components/shared/language-context';
import { AnimatedSidebarTree, type AnimatedSidebarItem } from './animated-sidebar-tree';
import { useAuthTransition } from '@/components/shared/auth-transition-context';

const nav: AnimatedSidebarItem[] = [
  { id: 'today', href: '/dashboard', label: 'nav.today', icon: LayoutDashboard, exact: true },
  {
    id: 'check-in',
    label: 'nav.checkin',
    icon: CircleUserRound,
    children: [
      { id: 'check-in-overview', href: '/check-in', label: 'subtab.daily_checkin', icon: CircleUserRound, exact: true },
      { id: 'check-in-history', href: '/check-in/history', label: 'subtab.history', icon: CircleUserRound },
    ],
  },
  { id: 'academics', href: '/academics', label: 'nav.academics', icon: BookOpen },
  {
    id: 'support',
    label: 'nav.support',
    icon: HeartPulse,
    children: [
      { id: 'support-overview', href: '/support', label: 'subtab.overview', icon: HeartPulse, exact: true },
      { id: 'support-ai', href: '/support/ai', label: 'subtab.ai_support', icon: Sparkles },
    ],
  },
  { id: 'support-circles', href: '/support/circles', label: 'nav.support_circles', icon: Sparkles },
  { id: 'counsellors', href: '/counsellors', label: 'nav.counsellors', icon: UsersRound },
  { id: 'financial', href: '/financial-support', label: 'nav.financial', icon: Landmark },
  { id: 'resources', href: '/resources', label: 'nav.resources', icon: Compass },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const student = getCurrentUser();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { collapsed, toggleSidebar } = useSidebar();
  const { t, language } = useLanguage();
  const { stop: stopAuthTransition } = useAuthTransition();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  
  // Sidebar custom scroller state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseInSidebar, setIsMouseInSidebar] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(36);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [motionBlur, setMotionBlur] = useState(0);

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());

  const updateScrollMetrics = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const overflow = maxScroll > 4;
    setHasOverflow(overflow);

    if (overflow) {
      const ratio = clientHeight / scrollHeight;
      const computedHeight = Math.max(32, Math.min(clientHeight * 0.45, clientHeight * ratio));
      setThumbHeight(computedHeight);
      const computedTop = (scrollTop / maxScroll) * (clientHeight - computedHeight);
      setThumbTop(computedTop);
    }
  }, []);

  const handleSidebarScroll = () => {
    if (!isMouseInSidebar) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const now = Date.now();
    const currentScrollTop = el.scrollTop;
    const deltaDistance = Math.abs(currentScrollTop - lastScrollTopRef.current);
    const deltaTime = Math.max(1, now - lastScrollTimeRef.current);
    const velocity = deltaDistance / deltaTime;

    lastScrollTopRef.current = currentScrollTop;
    lastScrollTimeRef.current = now;

    // Motion blur based on scrolling velocity
    const blurVal = Math.min(2.5, velocity * 1.5);
    setMotionBlur(blurVal);

    updateScrollMetrics();
    setIsScrolling(true);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setTimeout(() => {
      setMotionBlur(0);
    }, 120);

    hideTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 750);
  };

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener('resize', updateScrollMetrics);
    return () => {
      window.removeEventListener('resize', updateScrollMetrics);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [updateScrollMetrics, collapsed]);

  // Dismiss any in-flight post-login transition overlay the instant this
  // authenticated workspace has mounted — no artificial delay.
  useEffect(() => {
    stopAuthTransition();
  }, [stopAuthTransition]);

  // A walkthrough may be requested explicitly from Student Settings.
  // Consume that one-shot request here; never open it just because the
  // workspace was entered.
  useEffect(() => {
    try {
      if (sessionStorage.getItem('nivara_launch_student_tour') === 'true') {
        sessionStorage.removeItem('nivara_launch_student_tour');
        setShowWalkthrough(true);
      }
    } catch {
      // ignore storage access failures
    }
  }, []);

  // GSAP page entrance transition on pathname change
  useEffect(() => {
    if (!mainContentRef.current) return;
    gsap.fromTo(
      mainContentRef.current,
      { opacity: 0, y: 10, filter: 'blur(3px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.35,
        ease: 'power3.out',
      }
    );
  }, [pathname]);

  return (
    <div className="page-grain relative min-h-[100dvh] bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Interactive Unlumen Fluid Mesh Canvas */}
      <FluidBackground />

      {/* Ambient background accent shapes */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb left-[12%] top-[8%] h-64 w-64 bg-[#c3f340]/[0.035] blur-3xl" />
        <div className="ambient-orb right-[8%] top-[24%] h-80 w-80 bg-[#275a43]/[0.12] blur-3xl" />
        <div className="ambient-ribbon right-[-8%] top-[15%] h-[380px] w-[720px]" />
        <div className="ambient-ribbon right-[-14%] top-[23%] h-[310px] w-[610px] rotate-[-14deg] border-white/[0.05]" />
      </div>

      {/* Sidebar — collapsible desktop layout */}
      <aside
        onMouseEnter={() => {
          setIsMouseInSidebar(true);
          updateScrollMetrics();
        }}
        onMouseLeave={() => {
          setIsMouseInSidebar(false);
          setIsScrolling(false);
          setMotionBlur(0);
          if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
          }
        }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.07] bg-[#090909]/95 pt-6 text-white backdrop-blur-2xl transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-[68px]' : 'w-[250px] max-[1023px]:w-[68px]'
        }`}
      >
        {/* Smooth Lime Custom Scroller on Left Edge */}
        <div
          className="pointer-events-none absolute left-0 top-[72px] bottom-6 w-[4px] z-[60] overflow-visible"
          aria-hidden="true"
        >
          <div
            style={{
              transform: `translate3d(${
                isScrolling && isMouseInSidebar && hasOverflow ? '0px' : '-100%'
              }, ${thumbTop}px, 0px) scaleY(${isScrolling ? 1 : 0.6})`,
              height: `${thumbHeight}px`,
              filter: isScrolling ? `blur(${motionBlur}px)` : 'blur(2px)',
              opacity: isScrolling && isMouseInSidebar && hasOverflow ? 1 : 0,
            }}
            className="w-[3px] rounded-r-full bg-[#c3f340] shadow-[0_0_14px_rgba(195,243,64,0.9),0_0_4px_#c3f340] transition-[transform,opacity,filter] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </div>

        {/* Header with branding and collapse button (fixed top) */}
        <div className="mb-4 flex h-11 shrink-0 items-center justify-between px-3">
          <div
            className={`relative overflow-visible transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              collapsed
                ? 'max-w-0 opacity-0 pointer-events-none blur-sm'
                : 'max-w-[170px] opacity-100 blur-0 pl-1'
            }`}
          >
            <Magnetic radius={24} strength={0.018} maxDisplacement={1.5}>
              <div className="cursor-pointer">
                <Mark inverse />
              </div>
            </Magnetic>
          </div>

          <div className={`group relative shrink-0 ${collapsed ? 'mx-auto' : ''}`}>
            <button
              onClick={toggleSidebar}
              data-testid="button-toggle-sidebar"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 shadow-sm transition-all duration-150 hover:scale-[1.03] hover:border-[#c3f340]/40 hover:bg-white/[0.06] hover:text-[#c3f340] hover:shadow-[0_0_12px_rgba(195,243,64,0.12)] active:scale-[0.97]"
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>

            {collapsed && (
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 opacity-0 -translate-x-1 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-150 ease-out z-[60] flex items-center"
              >
                <div className="relative rounded-md border border-white/[0.12] bg-[#141414]/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_10px_rgba(195,243,64,0.15)] backdrop-blur-xl whitespace-nowrap">
                  Expand sidebar
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rotate-45 border-b border-l border-white/[0.12] bg-[#141414]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation and Footer Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleSidebarScroll}
          className="no-scrollbar flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden px-3 pb-6 pt-1"
        >
          <div>
            {/* Section title smoothly transitions */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed ? 'max-h-0 opacity-0 mb-0 blur-sm' : 'max-h-6 opacity-100 mb-2 px-2 blur-0'
              }`}
            >
              <p className="serenity-label text-white/40">Your space</p>
            </div>

            {/* Navigation list */}
            <AnimatedSidebarTree
              items={nav}
              collapsed={collapsed}
              t={t}
              ariaLabel="Main navigation"
            />
          </div>

          {/* Footer actions */}
          <div className="mt-6 space-y-1 pt-3">
            {/* Private by design box */}
            <div
              className={`overflow-hidden border-white/[0.07] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed
                  ? 'max-h-0 opacity-0 mb-0 border-t-0 py-0 blur-sm pointer-events-none'
                  : 'max-h-24 opacity-100 mb-3 border-t pt-3 px-2 blur-0'
              }`}
            >
              <p className="serenity-label text-white/35">Private by design</p>
              <p className="pt-1 text-[10px] leading-relaxed text-white/35">
                You choose what Nivara uses and who can see it.
              </p>
            </div>

            {/* Profile link */}
            <div className="group relative">
              <Link
                href="/profile"
                onMouseEnter={() => router.prefetch('/profile')}
                className="relative flex h-11 w-full items-center rounded-xl text-white/60 transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-white/[0.05] hover:text-white hover:shadow-[0_0_12px_rgba(195,243,64,0.06)] active:scale-[0.98]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#c3f340] text-[10px] font-extrabold text-[#0d1408] shadow-[0_0_10px_rgba(195,243,64,0.3)] transition-transform group-hover:scale-105">
                    {student?.avatar || 'MC'}
                  </span>
                </div>
                <span
                  className={`truncate text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    collapsed
                      ? 'max-w-0 opacity-0 pointer-events-none blur-sm -translate-x-2'
                      : 'max-w-[130px] opacity-100 blur-0 translate-x-0'
                  }`}
                >
                  {student?.name || 'Student'}
                </span>
                <ChevronRight
                  size={13}
                  className={`ml-auto mr-2.5 shrink-0 opacity-30 transition-all duration-300 ${
                    collapsed ? 'opacity-0 scale-0' : 'opacity-40 scale-100'
                  }`}
                />
              </Link>

              {collapsed && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 opacity-0 -translate-x-1 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-150 ease-out z-[60] flex items-center"
                >
                  <div className="relative rounded-md border border-white/[0.12] bg-[#141414]/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_10px_rgba(195,243,64,0.15)] backdrop-blur-xl whitespace-nowrap">
                    {student?.name || 'Profile'}
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rotate-45 border-b border-l border-white/[0.12] bg-[#141414]" />
                  </div>
                </div>
              )}
            </div>

            <div className="group relative">
              <Link
                href="/settings"
                onMouseEnter={() => router.prefetch('/settings')}
                className={`relative flex h-10 w-full items-center rounded-xl transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-white/[0.05] active:scale-[0.98] ${
                  pathname === '/settings' || pathname.startsWith('/settings/')
                    ? 'bg-white/[0.08] text-white shadow-[0_0_14px_rgba(195,243,64,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {pathname === '/settings' && (
                  <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-[#c3f340] shadow-[0_0_10px_#c3f340]" />
                )}
                <div className="flex h-10 w-11 shrink-0 items-center justify-center">
                  <Settings
                    size={16}
                    strokeWidth={1.8}
                    className={`transition-colors duration-150 ${
                      pathname === '/settings' ? 'text-[#c3f340]' : 'text-white/55 group-hover:text-white'
                    }`}
                  />
                </div>
                <span
                  className={`truncate text-[12px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    collapsed
                      ? 'max-w-0 opacity-0 pointer-events-none blur-sm -translate-x-2'
                      : 'max-w-[130px] opacity-100 blur-0 translate-x-0'
                  }`}
                >
                  Settings
                </span>
              </Link>

              {collapsed && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 opacity-0 -translate-x-1 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-150 ease-out z-[60] flex items-center"
                >
                  <div className="relative rounded-md border border-white/[0.12] bg-[#141414]/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_10px_rgba(195,243,64,0.15)] backdrop-blur-xl whitespace-nowrap">
                    Settings
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rotate-45 border-b border-l border-white/[0.12] bg-[#141414]" />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={`relative z-10 transition-[padding] duration-300 ease-in-out ${
          collapsed ? 'pl-[68px]' : 'pl-[250px] max-[1023px]:pl-[68px]'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-white/[0.07] bg-[#0a0a0a]/80 px-4 sm:px-6 lg:px-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 mr-1 hover:opacity-90 transition-opacity"
              title="Return to NIVARA Home"
              aria-label="NIVARA Home"
            >
              <span className="relative grid h-7 w-7 place-items-center rounded-lg overflow-hidden shadow-[0_0_10px_rgba(195,243,64,0.35)] transition-transform duration-150 group-hover:scale-105 group-hover:rotate-6">
                <NivaraLogoIcon size={28} />
              </span>
            </Link>
            <span className="h-1.5 w-1.5 rounded-full bg-[#c3f340] shadow-[0_0_12px_rgba(195,243,64,.7)] animate-pulse" />
            <span className="serenity-label text-white/35">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white/70 hover:border-[#c3f340]/40 hover:bg-[#c3f340]/10 hover:text-[#dff77d] transition-all"
              title="Overview of NIVARA's mission and architecture"
            >
              <Home size={11} />
              <span className="hidden sm:inline">{t('header.about')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white transition-all"
              title="Help & FAQ"
            >
              <HelpCircle size={11} />
              <span className="hidden sm:inline">{t('header.help')}</span>
            </button>

            <StudentNotifications onOpenWalkthrough={() => setShowWalkthrough(true)} />
            <Magnetic>
              <Link
                href="/profile"
                onMouseEnter={() => router.prefetch('/profile')}
                className="grid h-7 w-7 place-items-center rounded-full bg-[#c3f340] text-[10px] font-extrabold text-[#0d1408] transition-all hover:scale-105 hover:shadow-[0_0_14px_rgba(195,243,64,0.5)]"
                title="Student Profile"
              >
                {student?.avatar || 'MC'}
              </Link>
            </Magnetic>

            <button
              type="button"
              title="Sign Out of Student Space"
              onClick={async () => {
                await logoutUser();
                window.location.replace('/');
              }}
              className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-white/50 hover:border-[#e5a27d]/40 hover:bg-[#e5a27d]/10 hover:text-[#f0ba9d] transition-all"
            >
              <LogOut size={11} /> <span className="hidden sm:inline">{t('header.signout')}</span>
            </button>
          </div>
        </header>

        {/* 1-Minute Pop-in Walkthrough Modal */}
        <StudentWalkthrough
          forceOpen={showWalkthrough}
          onClose={() => setShowWalkthrough(false)}
        />

        {/* Help & FAQ Modal */}
        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        {/* Official Vision & Mission About Modal */}
        <AboutNivaraModal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />

        <main ref={mainContentRef} className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 sm:py-7 lg:px-10 lg:py-9 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}

