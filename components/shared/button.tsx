'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  kind?: 'primary' | 'quiet' | 'outline' | 'warm';
  testId: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  kind = 'primary',
  testId,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const styles = {
    primary:
      'bg-[#c3f340] text-[#0d1408] hover:bg-[#d2fb65] border border-transparent',
    quiet:
      'bg-transparent text-white/60 hover:bg-white/[.05] border border-transparent',
    outline:
      'border border-white/[.12] bg-transparent text-white/65 hover:border-white/[.28] hover:text-white/90',
    warm:
      'bg-[#2a201b] text-[#f0c8a7] border border-[#f0c8a7]/20 hover:bg-[#34261f]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.06em] transition-[color,background-color,border-color,opacity] duration-150 ease-out disabled:opacity-40 ${styles[kind]}`}
    >
      {children}
    </button>
  );
}
