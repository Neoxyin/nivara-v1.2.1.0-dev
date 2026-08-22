'use client';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] text-white p-4">
      <div className="flex flex-col items-center text-center max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <div className="rounded-full bg-rose-500/10 p-4 mb-6">
          <ShieldAlert className="h-12 w-12 text-rose-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Access Denied</h1>
        <p className="mb-8 text-sm text-white/60">
          You don&apos;t have permission to view this page. If you believe this is an error, please contact support.
        </p>
        <Link 
          href="/"
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
