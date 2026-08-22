'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Calendar,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';

export interface CounsellorNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity: 'high' | 'medium' | 'info';
  category: 'attention' | 'booking' | 'notes' | 'insights';
  link: string;
}

const INITIAL_COUNSELLOR_NOTIFICATIONS: CounsellorNotification[] = [
  {
    id: 'cnotif-1',
    title: 'High Priority: Attendance Dip',
    description: 'Marcus Vance attendance dropped to 54% in Advanced Algorithms. Early intervention recommended.',
    timestamp: '15m ago',
    read: false,
    severity: 'high',
    category: 'attention',
    link: '/counsellor/attention',
  },
  {
    id: 'cnotif-2',
    title: 'New Appointment Booked',
    description: 'Elena Rostova scheduled a 20-min session for Friday at 11:30 AM (Course Pressure).',
    timestamp: '1h ago',
    read: false,
    severity: 'medium',
    category: 'booking',
    link: '/counsellor/appointments',
  },
  {
    id: 'cnotif-3',
    title: 'Confidential Notes Pending',
    description: 'Review and sign off on session notes for Jordan Lee (Interaction Studio).',
    timestamp: '4h ago',
    read: false,
    severity: 'medium',
    category: 'notes',
    link: '/counsellor/appointments',
  },
  {
    id: 'cnotif-4',
    title: 'Cohort Wellbeing Metric',
    description: 'Weekly cohort rhythm index updated: 84% average stability across 2nd Year Design students.',
    timestamp: '1d ago',
    read: true,
    severity: 'info',
    category: 'insights',
    link: '/counsellor',
  },
];

export interface CounsellorNotificationsProps {
  onOpenBriefing?: () => void;
}

export function CounsellorNotifications({ onOpenBriefing }: CounsellorNotificationsProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CounsellorNotification[]>(INITIAL_COUNSELLOR_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter((n) => n.severity === 'high' && !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'priority') return n.severity === 'high';
    return true;
  });

  const getCategoryIcon = (category: CounsellorNotification['category'], severity: CounsellorNotification['severity']) => {
    if (severity === 'high') {
      return <ShieldAlert size={14} className="text-amber-400" />;
    }
    switch (category) {
      case 'attention':
        return <AlertTriangle size={14} className="text-amber-400" />;
      case 'booking':
        return <Calendar size={14} className="text-[#c3f340]" />;
      case 'notes':
        return <FileText size={14} className="text-[#c9b8df]" />;
      case 'insights':
        return <TrendingUp size={14} className="text-[#88d49e]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <Magnetic>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative grid h-8 w-8 place-items-center rounded-full border transition-all duration-200 ${
            isOpen
              ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d] shadow-[0_0_12px_rgba(195,243,64,0.3)]'
              : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/25 hover:bg-white/[0.06] hover:text-white'
          }`}
          aria-label="Counsellor Notifications"
          aria-expanded={isOpen}
        >
          <Bell size={15} />

          {/* Unread Counter Badge */}
          {unreadCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-extrabold shadow-[0_0_10px_rgba(195,243,64,0.8)] ${
                highPriorityCount > 0
                  ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                  : 'bg-[#c3f340] text-[#0d1408]'
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </Magnetic>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2.5 z-50 w-[370px] sm:w-[420px] rounded-xl border border-white/[0.14] bg-[#141414] sm:bg-[#141414]/98 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_24px_rgba(195,243,64,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-[.14em] text-white">
                  Counsellor Alerts
                </h3>
                {highPriorityCount > 0 ? (
                  <Pill tone="warm">
                    {highPriorityCount} priority
                  </Pill>
                ) : unreadCount > 0 ? (
                  <Pill tone="accent">
                    {unreadCount} new
                  </Pill>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-white/60 hover:bg-white/[0.08] hover:text-[#c3f340] transition-colors"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="rounded p-1 text-white/40 hover:bg-white/[0.08] hover:text-rose-400 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-2.5 pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                  filter === 'all'
                    ? 'bg-white/[0.14] text-white border border-white/20'
                    : 'bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                  filter === 'unread'
                    ? 'bg-[#c3f340]/20 text-[#dff77d] border border-[#c3f340]/40'
                    : 'bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('priority')}
                className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                  filter === 'priority'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                Priority
              </button>
            </div>

            {/* Notification Items */}
            <div className="mt-1 max-h-[340px] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-white/50">No alerts in this view.</p>
                  <p className="pt-1 text-[10px] text-white/30">Caseload is up to date.</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`group relative flex items-start gap-3 rounded-lg border p-3 transition-all duration-150 ${
                      notif.severity === 'high' && !notif.read
                        ? 'border-amber-400/40 bg-[#1e1b14] hover:bg-[#252016] shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                        : notif.read
                        ? 'border-white/[0.07] bg-[#191919] opacity-80 hover:opacity-100 hover:border-white/[0.14] hover:bg-[#202020]'
                        : 'border-[#c3f340]/30 bg-[#161c12] hover:bg-[#1b2314] shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {/* Icon container with unread badge */}
                    <div className="relative shrink-0">
                      <div className="grid h-7 w-7 place-items-center rounded bg-[#222222] border border-white/[0.1]">
                        {getCategoryIcon(notif.category, notif.severity)}
                      </div>
                      {!notif.read && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${
                              notif.severity === 'high' ? 'bg-amber-400' : 'bg-[#c3f340]'
                            }`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              notif.severity === 'high'
                                ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]'
                                : 'bg-[#c3f340] shadow-[0_0_6px_rgba(195,243,64,0.9)]'
                            }`}
                          />
                        </span>
                      )}
                    </div>

                    {/* Text content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className={`text-xs font-bold truncate ${notif.read ? 'text-white/85' : 'text-white'}`}>
                            {notif.title}
                          </p>
                          {notif.severity === 'high' && (
                            <span className="rounded bg-amber-400/20 px-1 py-0.2 text-[8px] font-extrabold uppercase text-amber-300">
                              Urgent
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 text-[9px] font-mono text-white/40">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/70">
                        {notif.description}
                      </p>

                      {/* Action Links */}
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <Link
                          href={notif.link}
                          onClick={() => {
                            markAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#c3f340] hover:underline"
                        >
                          Open in workspace <ArrowUpRight size={11} />
                        </Link>

                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="inline-flex items-center gap-0.5 text-[10px] text-white/50 hover:text-white transition-colors"
                          >
                            <Check size={10} /> Mark read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Delete action */}
                    <button
                      onClick={() => clearNotification(notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-white transition-all"
                      title="Dismiss"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5 text-[10px] text-white/50">
              {onOpenBriefing ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenBriefing();
                  }}
                  className="font-bold text-[#c3f340] hover:underline uppercase tracking-[.08em]"
                >
                  Generate AI Briefing
                </button>
              ) : (
                <span>End-to-End Encrypted</span>
              )}
              <span className="font-mono text-white/35">RBAC Verified</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
