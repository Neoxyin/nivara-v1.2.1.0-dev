'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface MarkProps { inverse?: boolean }

export function Mark({ inverse = false }: MarkProps) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3 font-bold tracking-tight" aria-label="Nivara home">
      <span className={`grid h-8 w-8 place-items-center rounded-[10px] bg-[#c3f340] text-[#0d1408] transition-transform duration-180 ease-out group-hover:rotate-6 ${inverse ? 'shadow-[0_0_24px_rgba(195,243,64,.18)]' : ''}`}>
        <Sparkles size={15} strokeWidth={2.6} />
      </span>
      <span className="text-[.95rem] uppercase tracking-[.28em] text-white">nivara</span>
    </Link>
  );
}
