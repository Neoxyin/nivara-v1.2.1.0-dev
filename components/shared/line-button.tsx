'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface LineButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  testId: string;
}

export function LineButton({ children, onClick, href, testId }: LineButtonProps) {
  const cls = "pressable inline-flex items-center gap-2 border-b border-[hsl(var(--foreground))]/35 pb-1 text-xs font-bold text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--muted-foreground))]";
  return href ? (
    <Link href={href} className={cls} data-testid={testId}>
      {children}
      <ChevronRight size={14} />
    </Link>
  ) : (
    <button onClick={onClick} className={cls} data-testid={testId}>
      {children}
      <ChevronRight size={14} />
    </button>
  );
}