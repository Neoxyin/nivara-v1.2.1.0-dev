import React from 'react';
import { CounsellorShell } from '@/components/layout/counsellor-shell';
export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CounsellorShell>
      {children}
    </CounsellorShell>
  );
}
