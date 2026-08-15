'use client';

import { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex items-end justify-between gap-8">
      <div className="min-w-0 flex-1">
        <p className="serenity-label text-white/40">{eyebrow}</p>
        <h1 className="mt-2 font-display text-[3.5rem] leading-[.92] tracking-[-.03em] text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
