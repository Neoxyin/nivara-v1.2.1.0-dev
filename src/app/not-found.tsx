'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NivaraLogoIcon } from '@/components/shared/nivara-logo';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-[#f0f0f0]">
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(195,243,64,0.4)]">
        <NivaraLogoIcon size={56} />
      </div>

      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-white/50">
        The requested page does not exist or requires active authentication.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-[#c3f340] bg-[#c3f340] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[.12em] text-[#0d1408] shadow-[0_0_20px_rgba(195,243,64,0.3)] transition hover:scale-105"
        >
          <ArrowLeft size={14} /> Return Home
        </Link>
      </div>
    </div>
  );
}
