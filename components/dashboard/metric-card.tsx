'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TiltCard } from '@/components/ui/tilt-card';
import { Counter } from '@/components/ui/counter';
import { Magnetic } from '@/components/ui/magnetic';

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: 'neutral' | 'accent' | 'warm';
  icon?: ReactNode;
  href?: string;
}

export function MetricCard({
  label,
  value,
  detail,
  tone = 'neutral',
  icon,
  href,
}: MetricCardProps) {
  const toneClass =
    tone === 'accent'
      ? 'bg-[#c3f340]/[.07] border-[#c3f340]/25 hover:border-[#c3f340]/50'
      : tone === 'warm'
      ? 'bg-[#e5a27d]/[.06] border-[#e5a27d]/25 hover:border-[#e5a27d]/50'
      : 'bg-[#121212]/90 border-white/[0.08] hover:border-white/25';

  const spotlightColor =
    tone === 'accent'
      ? 'rgba(195, 243, 64, 0.18)'
      : tone === 'warm'
      ? 'rgba(229, 162, 125, 0.16)'
      : 'rgba(255, 255, 255, 0.08)';

  // Extract number and suffix if any (e.g. "78%", "18h", "64")
  const match = value.match(/^([0-9]+)(.*)$/);
  const numPart = match ? parseInt(match[1], 10) : null;
  const suffixPart = match ? match[2] : '';

  const content = (
    <TiltCard
      maxTilt={2.5}
      spotlightColor={spotlightColor}
      className={`group relative min-h-[148px] border p-5 backdrop-blur-md transition-[border-color,background-color] duration-150 cursor-pointer ${toneClass}`}
      data-testid={`card-metric-${label.toLowerCase().replaceAll(' ', '-')}`}
    >
      <div className="flex items-start justify-between">
        <p className="serenity-label text-white/50 group-hover:text-white/75 transition-colors">{label}</p>
        <div className="flex items-center gap-1">
          {icon && (
            <Magnetic>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.04] text-white/55 transition-colors group-hover:bg-white/[0.1] group-hover:text-white">
                {icon}
              </span>
            </Magnetic>
          )}
          {href && (
            <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-white/50 group-hover:text-white">
              <ArrowUpRight size={13} />
            </span>
          )}
        </div>
      </div>
      <p className="mt-5 font-display text-[2.55rem] leading-none tracking-tight">
        {numPart !== null ? (
          <Counter value={numPart} suffix={suffixPart} duration={1.2} />
        ) : (
          value
        )}
      </p>
      <p className="mt-3 text-xs text-white/45 group-hover:text-white/60 transition-colors">{detail}</p>
    </TiltCard>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
