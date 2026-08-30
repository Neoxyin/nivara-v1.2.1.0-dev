'use client';

import Link from 'next/link';
import { NivaraLogoIcon } from './nivara-logo';

interface MarkProps {
  inverse?: boolean;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Mark({ inverse = false, href = '/', size = 'md' }: MarkProps) {
  const iconDimensions = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;

  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-2.5 font-bold tracking-tight whitespace-nowrap"
      aria-label="Nivara home"
    >
      <span
        className={`relative grid h-8 w-8 place-items-center rounded-[10px] overflow-hidden transition-transform duration-180 ease-out group-hover:rotate-[2deg] group-hover:scale-105 ${
          inverse ? 'shadow-[0_0_24px_rgba(195,243,64,.25)]' : 'shadow-[0_0_15px_rgba(195,243,64,.15)]'
        }`}
      >
        <NivaraLogoIcon size={iconDimensions} />
      </span>
      <span className="text-[.95rem] uppercase tracking-[.28em] text-white font-extrabold">nivara</span>
    </Link>
  );
}

export default Mark;
