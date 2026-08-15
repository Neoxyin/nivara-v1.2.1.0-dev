'use client';

import React from 'react';
import { Magnetic, type MagneticProps } from './magnetic';

export interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<MagneticProps, 'children' | 'className'> {
  variant?: 'default' | 'accent' | 'outline' | 'ghost' | 'quiet' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  wrapperClassName?: string;
}

const variantStyles: Record<NonNullable<MagneticButtonProps['variant']>, string> = {
  default:
    'bg-[#141414] text-[#dff77d] border border-[#c3f340]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-[#c3f340] hover:text-[#0d1408] hover:border-[#c3f340]',
  accent:
    'bg-[#c3f340] text-[#0d1408] border border-[#c3f340] shadow-[0_0_20px_rgba(195,243,64,0.35)] hover:bg-[#b0df32] hover:shadow-[0_0_25px_rgba(195,243,64,0.5)]',
  destructive:
    'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]',
  outline:
    'bg-transparent text-white/80 border border-white/[0.14] hover:border-[#c3f340]/50 hover:text-white',
  ghost:
    'bg-transparent text-white/60 border border-transparent hover:bg-white/[0.05] hover:text-white',
  quiet:
    'bg-white/[0.03] text-white/70 border border-white/[0.08] hover:border-white/20 hover:text-white',
};

const sizeStyles: Record<NonNullable<MagneticButtonProps['size']>, string> = {
  default: 'px-5 py-2.5 text-xs font-semibold tracking-[.06em] rounded-md',
  sm: 'px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] rounded',
  lg: 'px-7 py-3.5 text-sm font-semibold tracking-[.06em] rounded-lg',
  icon: 'h-10 w-10 p-0 rounded-full flex items-center justify-center',
};

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      radius = 40,
      strength = 0.06,
      stiffness = 180,
      damping = 22,
      maxDisplacement = 5,
      variant = 'default',
      size = 'default',
      className = '',
      wrapperClassName = '',
      active = true,
      ...props
    },
    ref
  ) => {
    return (
      <Magnetic
        radius={radius}
        strength={strength}
        stiffness={stiffness}
        damping={damping}
        maxDisplacement={maxDisplacement}
        active={active}
        className={wrapperClassName}
      >
        <button
          ref={ref}
          className={`inline-flex items-center justify-center transition-colors duration-150 select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
          {...props}
        >
          {children}
        </button>
      </Magnetic>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
