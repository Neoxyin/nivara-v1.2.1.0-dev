'use client';
import { AppShell } from '@/components/layout/nivara-shell';

export default function AdminDashboard() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Admin Portal</h1>
        <p className="text-white/60">
          Welcome to the Admin Portal. Administrative features will be available in Phase 2.
        </p>
      </div>
    </AppShell>
  );
}
