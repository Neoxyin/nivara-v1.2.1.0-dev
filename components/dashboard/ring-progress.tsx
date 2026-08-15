'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Counter } from '@/components/ui/counter';

interface RingProgressProps {
  value: number;
  label: string;
}

export function RingProgress({ value, label }: RingProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - safeValue / 100);

  const circleRef = useRef<SVGCircleElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const circle = circleRef.current;
    const pulse = pulseRef.current;
    if (!circle) return;

    // Animate ring fill with GSAP
    gsap.fromTo(
      circle,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: targetOffset,
        duration: 1.5,
        ease: 'power3.out',
      }
    );

    // Subtle breathing pulse on the glowing indicator
    if (pulse) {
      gsap.to(pulse, {
        opacity: 0.8,
        scale: 1.05,
        transformOrigin: '50% 50%',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    return () => {
      if (circle) gsap.killTweensOf(circle);
      if (pulse) gsap.killTweensOf(pulse);
    };
  }, [circumference, targetOffset]);

  return (
    <div className="relative h-[112px] w-[112px] shrink-0" aria-label={`${value} ${label}`}>
      <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#202420"
          strokeWidth="9"
        />
        <circle
          ref={pulseRef}
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="rgba(195, 243, 64, 0.25)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={targetOffset}
          className="opacity-40 blur-[2px]"
        />
        <circle
          ref={circleRef}
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#c3f340"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="font-display text-3xl leading-none">
          <Counter value={value} duration={1.5} />
        </span>
        <span className="serenity-label text-[8px] mt-0.5 text-white/50">{label}</span>
      </div>
    </div>
  );
}
