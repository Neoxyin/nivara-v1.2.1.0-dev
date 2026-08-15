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
    <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0 flex-1">
        <p className="serenity-label text-[#c3f340]/80">{eyebrow}</p>
        <h1 className="mt-1.5 font-display text-4xl md:text-5xl lg:text-[3.2rem] leading-[.92] tracking-[-.03em] text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2.5 max-w-xl text-xs md:text-sm leading-5 text-white/50">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
