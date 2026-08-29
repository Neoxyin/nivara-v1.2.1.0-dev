'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  AlertCircle,
  TrendingDown,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import { Pill } from '@/components/shared/pill';
import { Magnetic } from '@/components/ui/magnetic';

export interface StudentNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'academic' | 'wellbeing' | 'appointment' | 'guide';
  link?: string;
}

const INITIAL_NOTIFICATIONS: StudentNotification[] = [
  {
    id: 'notif-1',
    title: 'Check-in Reminder',
    description: 'Log your morning 1-minute well-being check-in to calibrate your daily study rhythm.',
    timestamp: '45m ago',
    read: false,
    type: 'wellbeing',
    link: '/check-in',
  },
  {
    id: 'notif-2',
    title: 'Pacing Alert: Deadline Overlap',
    description: 'Algorithms Assignment and Design Sprint Critique are due within 24h of each other.',
    timestamp: '2h ago',
    read: false,
    type: 'academic',
    link: '/academics',
  },
  {
    id: 'notif-3',
    title: 'Counsellor Office Hours',
    description: 'Dr. Sarah Jenkins has drop-in well-being slots open this Thursday afternoon.',
    timestamp: '5h ago',
    read: false,
    type: 'appointment',
    link: '/counsellors',
  },
  {
    id: 'notif-4',
    title: 'Welcome to Nivara',
    description: 'Take a quick 3-step walkthrough to discover all features in your student space.',
    timestamp: '1d ago',
    read: true,
    type: 'guide',
  },
];

export interface StudentNotificationsProps {
  onOpenWalkthrough?: () => void;
}

export function StudentNotifications({ onOpenWalkthrough }: StudentNotificationsProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<StudentNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    return true;
  });

  const getIcon = (type: StudentNotification['type']) => {
    switch (type) {
      case 'wellbeing':
        return <TrendingDown size={14} className="text-[#88d49e]" />;
      case 'academic':
        return <BookOpen size={14} className="text-amber-400" />;
      case 'appointment':
        return <Calendar size={14} className="text-[#c3f340]" />;
      case 'guide':
        return <Sparkles size={14} className="text-[#c9b8df]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <Magnetic>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative grid h-8 w-8 place-items-center rounded-full border transition-all duration-200 ${
            isOpen
              ? 'border-[#c3f340] bg-[#c3f340]/15 text-[#dff77d] shadow-[0_0_12px_rgba(195,243,64,0.3)]'
              : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/25 hover:bg-white/[0.06] hover:text-white'
          }`}
          aria-label="Student Notifications"
          aria-expanded={isOpen}
        >
          <Bell size={15} />

          {/* Unread Counter Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c3f340] px-1 text-[9px] font-extrabold text-[#0d1408] shadow-[0_0_10px_rgba(195,243,64,0.8)]">
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
            className="absolute right-0 top-full mt-2.5 z-50 w-[360px] sm:w-[410px] rounded-xl border border-white/[0.14] bg-[#141414] sm:bg-[#141414]/98 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_24px_rgba(195,243,64,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-[.14em] text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <Pill tone="accent">
                    {unreadCount} new
                  </Pill>
                )}
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
            </div>

            {/* Notification List */}
            <div className="mt-1 max-h-[330px] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-white/50">No notifications to display.</p>
                  <p className="pt-1 text-[10px] text-white/30">You’re completely up to date!</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`group relative flex items-start gap-3 rounded-lg border p-3 transition-all duration-150 ${
                      notif.read
                        ? 'border-white/[0.07] bg-[#191919] opacity-80 hover:opacity-100 hover:border-white/[0.14] hover:bg-[#202020]'
                        : 'border-[#c3f340]/30 bg-[#161c12] hover:bg-[#1b2314] shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {/* Icon container with unread badge */}
                    <div className="relative shrink-0">
                      <div className="grid h-7 w-7 place-items-center rounded bg-[#222222] border border-white/[0.1]">
                        {getIcon(notif.type)}
                      </div>
                      {!notif.read && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f340] opacity-80" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c3f340] shadow-[0_0_6px_rgba(195,243,64,0.9)]" />
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
                        {notif.type === 'guide' ? (
                          <button
                            onClick={() => {
                              markAsRead(notif.id);
                              setIsOpen(false);
                              onOpenWalkthrough?.();
                            }}
                            className="inline-flex items-center gap-1 rounded bg-[#c3f340]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] hover:bg-[#c3f340]/25 transition-colors"
                          >
                            <Sparkles size={10} /> Start Tour
                          </button>
                        ) : notif.link ? (
                          <Link
                            href={notif.link}
                            onClick={() => {
                              markAsRead(notif.id);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#c3f340] hover:underline"
                          >
                            View details <ArrowUpRight size={11} />
                          </Link>
                        ) : null}

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

            {/* Footer with Guided Tour button */}
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5 text-[10px] text-white/50">
              <span className="flex items-center gap-1">
                <HelpCircle size={12} /> Need assistance?
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenWalkthrough?.();
                }}
                className="font-bold text-[#c3f340] hover:underline uppercase tracking-[.08em]"
              >
                Replay Tour
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
