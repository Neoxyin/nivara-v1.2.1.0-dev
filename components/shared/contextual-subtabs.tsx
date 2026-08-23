'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './language-context';

export interface SubtabItem {
  labelKey: string;
  defaultLabel: string;
  href: string;
  exact?: boolean;
}

export interface ContextualSubtabsProps {
  items: SubtabItem[];
  className?: string;
}

export function ContextualSubtabs({ items, className = '' }: ContextualSubtabsProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t('subtab.contextual_navigation')}
      className={`flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.08] pb-3 pt-1 no-scrollbar ${className}`}
    >
      {items.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && (pathname.length === item.href.length || pathname[item.href.length] === '/'));

        const labelText = t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.defaultLabel;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ease-out ${
              isActive
                ? 'bg-white/[0.08] text-[#c3f340] border border-[#c3f340]/30 shadow-[0_0_12px_rgba(195,243,64,0.15)] before:absolute before:inset-y-1.5 before:left-0 before:w-[2px] before:rounded-r-full before:bg-[#c3f340] before:shadow-[0_0_8px_#c3f340]'
                : 'text-white/60 hover:bg-white/[0.04] hover:text-white border border-transparent'
            }`}
          >
            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#c3f340] shadow-[0_0_6px_#c3f340]" />
            )}
            <span>{labelText}</span>
          </Link>
        );
      })}
    </nav>
  );
}
