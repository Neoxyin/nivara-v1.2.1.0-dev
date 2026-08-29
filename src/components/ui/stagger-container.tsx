'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  yOffset?: number;
  selector?: string;
}

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.08,
  delay = 0.05,
  yOffset = 20,
  selector = '.stagger-item',
}: StaggerContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(selector);

    if (elements.length === 0) return;

    gsap.set(elements, {
      opacity: 0,
      y: yOffset,
      scale: 0.98,
    });

    const tween = gsap.to(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      delay,
      stagger,
      ease: 'power3.out',
    });

    return () => {
      tween.kill();
    };
  }, [stagger, delay, yOffset, selector]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
