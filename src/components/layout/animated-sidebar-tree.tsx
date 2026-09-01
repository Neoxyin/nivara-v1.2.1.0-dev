 'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export type AnimatedSidebarItem = {
  id: string;
  href?: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
  excludePrefixes?: string[];
  children?: AnimatedSidebarItem[];
};

type Props = {
  items: AnimatedSidebarItem[];
  collapsed: boolean;
  t?: (key: string) => string;
  ariaLabel: string;
  className?: string;
};

const spring = {
  type: 'spring' as const,
  stiffness: 430,
  damping: 34,
  mass: 0.65,
};

function isItemActive(item: AnimatedSidebarItem, pathname: string): boolean {
  const excluded = item.excludePrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false;
  if (excluded) return false;
  if (!item.href) return Boolean(item.children?.some((child) => isItemActive(child, pathname)));
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AnimatedSidebarTree({
  items,
  collapsed,
  t = (value) => value,
  ariaLabel,
  className = '',
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (collapsed) setHoveredId(null);
  }, [collapsed]);

  const toggle = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <nav className={`space-y-1 ${className}`} aria-label={ariaLabel}>
      {items.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          level={0}
          collapsed={collapsed}
          pathname={pathname}
          router={router}
          t={t}
          openIds={openIds}
          toggle={toggle}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      ))}
    </nav>
  );
}

function TreeItem({
  item,
  level,
  collapsed,
  pathname,
  router,
  t,
  openIds,
  toggle,
  hoveredId,
  setHoveredId,
}: {
  item: AnimatedSidebarItem;
  level: number;
  collapsed: boolean;
  pathname: string;
  router: ReturnType<typeof useRouter>;
  t: (key: string) => string;
  openIds: Set<string>;
  toggle: (id: string) => void;
  hoveredId: string | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const hasChildren = Boolean(item.children?.length);
  const active = isItemActive(item, pathname);
  const open = openIds.has(item.id);
  const Icon = item.icon;
  const label = t(item.label);
  const rowHeight = level > 0 ? 'h-9' : 'h-11';
  const iconSize = level > 0 ? 15 : 17;
  const targetHref = item.href || item.children?.[0]?.href;

  return (
    <div
      className="group relative"
      onMouseEnter={() => !collapsed && setHoveredId(item.id)}
      onMouseLeave={() => !collapsed && setHoveredId((current) => current === item.id ? null : current)}
    >
      {hoveredId === item.id && !active && (
        <motion.div
          layoutId="nivara-sidebar-hover"
          transition={spring}
          className="pointer-events-none absolute inset-0 rounded-xl bg-white/[0.055] shadow-[0_0_12px_rgba(195,243,64,0.045)]"
        />
      )}

      <div className={`relative flex ${rowHeight} w-full items-center`}>
        {hasChildren ? (
          <div className="relative flex w-full items-center">
            {targetHref ? (
              <Link
                href={targetHref}
                onMouseEnter={() => {
                  if (!collapsed) setHoveredId(item.id);
                  router.prefetch(targetHref);
                }}
                onFocus={() => router.prefetch(targetHref)}
                className={`relative flex ${rowHeight} min-w-0 flex-1 items-center rounded-xl text-left transition-colors duration-150 ${
                  !collapsed ? 'pr-10' : ''
                } ${
                  active
                    ? 'bg-white/[0.08] text-white shadow-[0_0_14px_rgba(195,243,64,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {active && (
                  <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-[#c3f340] shadow-[0_0_10px_#c3f340]" />
                )}
                <div className={`flex ${rowHeight} w-11 shrink-0 items-center justify-center`}>
                  <Icon
                    size={iconSize}
                    strokeWidth={1.8}
                    className={active ? 'text-[#c3f340]' : ''}
                  />
                </div>
                <span
                  className={`truncate text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    collapsed
                      ? 'max-w-0 opacity-0 pointer-events-none blur-sm -translate-x-2'
                      : 'max-w-[140px] opacity-100 blur-0 translate-x-0'
                  }`}
                >
                  {label}
                </span>
                {item.badge && !collapsed && (
                  <span className="ml-auto mr-1.5 rounded-full bg-[rgba(229,162,125,.18)] px-1.5 py-0.5 text-[9px] font-bold text-[#e5a27d]">
                    {item.badge}
                  </span>
                )}
              </Link>
            ) : (
              <div
                className={`relative flex ${rowHeight} min-w-0 flex-1 items-center rounded-xl text-left ${
                  !collapsed ? 'pr-10' : ''
                } ${
                  active
                    ? 'bg-white/[0.08] text-white shadow-[0_0_14px_rgba(195,243,64,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-white/50'
                }`}
              >
                {active && (
                  <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-[#c3f340] shadow-[0_0_10px_#c3f340]" />
                )}
                <div className={`flex ${rowHeight} w-11 shrink-0 items-center justify-center`}>
                  <Icon
                    size={iconSize}
                    strokeWidth={1.8}
                    className={active ? 'text-[#c3f340]' : ''}
                  />
                </div>
                <span
                  className={`truncate text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    collapsed
                      ? 'max-w-0 opacity-0 pointer-events-none blur-sm -translate-x-2'
                      : 'max-w-[140px] opacity-100 blur-0 translate-x-0'
                  }`}
                >
                  {label}
                </span>
              </div>
            )}

            {!collapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggle(item.id);
                }}
                aria-expanded={open}
                aria-controls={`sidebar-children-${item.id}`}
                aria-label={open ? `Collapse ${label} sub-navigation` : `Expand ${label} sub-navigation`}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-white/40 hover:text-white transition-colors focus:outline-none"
              >
                <ChevronRight
                  size={15}
                  strokeWidth={1.8}
                  className={`transition-transform duration-200 ease-in-out ${
                    open ? 'rotate-90 text-white/80' : 'rotate-0 text-white/40'
                  }`}
                />
              </button>
            )}
          </div>
        ) : item.href ? (
          <Link
            href={item.href}
            onMouseEnter={() => {
              if (!collapsed) setHoveredId(item.id);
              router.prefetch(item.href!);
            }}
            onFocus={() => router.prefetch(item.href!)}
            className={`relative flex ${rowHeight} w-full items-center rounded-xl transition-colors duration-150 ${
              active
                ? 'bg-white/[0.08] text-white shadow-[0_0_14px_rgba(195,243,64,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {active && (
              <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-[#c3f340] shadow-[0_0_10px_#c3f340]" />
            )}
            <div className={`flex ${rowHeight} w-11 shrink-0 items-center justify-center`}>
              <Icon
                size={iconSize}
                strokeWidth={1.8}
                className={active ? 'text-[#c3f340]' : ''}
              />
            </div>
            <span
              className={`truncate text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed
                  ? 'max-w-0 opacity-0 pointer-events-none blur-sm -translate-x-2'
                  : 'max-w-[150px] opacity-100 blur-0 translate-x-0'
              }`}
            >
              {label}
            </span>
            {item.badge && !collapsed && (
              <span className="ml-auto mr-2.5 rounded-full bg-[rgba(229,162,125,.18)] px-1.5 py-0.5 text-[9px] font-bold text-[#e5a27d]">
                {item.badge}
              </span>
            )}
            {active && !item.badge && (
              <span
                className={`ml-auto mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c3f340] shadow-[0_0_10px_rgba(195,243,64,1)] animate-pulse transition-all duration-300 ${
                  collapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
            )}
          </Link>
        ) : null}
      </div>

      {collapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 z-[60] ml-3.5 flex -translate-y-1/2 items-center opacity-0 -translate-x-1 scale-95 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100">
          <div className="relative whitespace-nowrap rounded-md border border-white/[0.12] bg-[#141414]/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_10px_rgba(195,243,64,0.15)] backdrop-blur-xl">
            {label}{item.badge ? ` (${item.badge})` : ''}
            <span className="absolute -left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-b border-l border-white/[0.12] bg-[#141414]" />
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {hasChildren && open && !collapsed && (
          <motion.div
            id={`sidebar-children-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-5 border-l border-white/[0.08] pl-2 space-y-1 py-1">
              {item.children!.map((child) => (
                <TreeItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  collapsed={collapsed}
                  pathname={pathname}
                  router={router}
                  t={t}
                  openIds={openIds}
                  toggle={toggle}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
