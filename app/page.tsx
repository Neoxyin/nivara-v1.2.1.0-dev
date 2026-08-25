'use client';
import { Suspense } from 'react';
import { LandingPage } from '@/components/landing-page';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#070707]" />}>
      <LandingPage />
    </Suspense>
  );
}

