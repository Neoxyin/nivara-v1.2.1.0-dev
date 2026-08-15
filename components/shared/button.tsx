'use client';

import { ReactNode, useRef } from 'react';
import gsap from 'gsap';
import { Magnetic } from '@/components/ui/magnetic';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  kind?: 'primary' | 'quiet' | 'outline' | 'warm';
  testId: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  magnetic?: boolean;
}

export function Button({
  children,
  onClick,
  kind = 'primary',
  testId,
  type = 'button',
  disabled = false,
  magnetic = true,
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const styles = {
    primary:
      'bg-[#c3f340] text-[#0d1408] hover:bg-[#d2fb65] border border-transparent shadow-[0_0_20px_rgba(195,243,64,0.2)]',
    quiet:
      'bg-transparent text-white/60 hover:bg-white/[.05] border border-transparent',
    outline:
      'border border-white/[.12] bg-transparent text-white/65 hover:border-white/[.28] hover:text-white/90',
    warm:
      'bg-[#2a201b] text-[#f0c8a7] border border-[#f0c8a7]/20 hover:bg-[#34261f]',
  };

  const handleMouseDown = () => {
    if (!btnRef.current || disabled) return;
    gsap.to(btnRef.current, { scale: 0.95, duration: 0.1, ease: 'power2.out' });
  };

  const handleMouseUp = () => {
    if (!btnRef.current || disabled) return;
    gsap.to(btnRef.current, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.4)' });
  };

  const buttonElement = (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      data-testid={testId}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.06em] transition-all duration-200 ease-out disabled:opacity-40 will-change-transform ${styles[kind]}`}
    >
      {children}
    </button>
  );

  if (magnetic && !disabled) {
    return (
      <Magnetic radius={40} strength={0.06} stiffness={180} damping={22} maxDisplacement={5}>
        {buttonElement}
      </Magnetic>
    );
  }

  return buttonElement;
}
