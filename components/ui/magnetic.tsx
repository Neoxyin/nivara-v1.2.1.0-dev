'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface MagneticProps {
  children: React.ReactNode;
  /** Proximity distance (in pixels) for the magnetic field to activate */
  radius?: number;
  /** Pull strength factor (almost minimal micro-pull) */
  strength?: number;
  /** Spring stiffness */
  stiffness?: number;
  /** Spring damping */
  damping?: number;
  /** Maximum displacement clamp in pixels (default 5px for almost minimal feel) */
  maxDisplacement?: number;
  className?: string;
  active?: boolean;
}

export function Magnetic({
  children,
  radius = 34,
  strength = 0.045,
  stiffness = 180,
  damping = 22,
  maxDisplacement = 4,
  className = '',
  active = true,
}: MagneticProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !elRef.current) return;
    const el = elRef.current;

    // Calculate spring physics parameters based on stiffness & damping
    const dampingRatio = damping / (2 * Math.sqrt(stiffness));
    const naturalDuration = Math.max(0.25, Math.min(0.6, 4 / (dampingRatio * Math.sqrt(stiffness))));
    const elasticParam = Math.max(0.4, Math.min(0.9, damping / Math.sqrt(stiffness)));

    const xTo = gsap.quickTo(el, 'x', {
      duration: naturalDuration,
      ease: `power2.out`,
    });
    const yTo = gsap.quickTo(el, 'y', {
      duration: naturalDuration,
      ease: `power2.out`,
    });

    let isInside = false;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      // Effective activation radius
      const activationRadius = Math.max(rect.width, rect.height) / 2 + radius;

      if (distance < activationRadius) {
        isInside = true;
        // Apply minimal magnetic pull clamped to maxDisplacement
        const rawPull = strength * (1 - (distance / activationRadius) * 0.4);
        const targetX = Math.max(-maxDisplacement, Math.min(maxDisplacement, dx * rawPull));
        const targetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, dy * rawPull));
        
        xTo(targetX);
        yTo(targetY);
      } else if (isInside) {
        // Just exited magnetic radius zone -> snap back
        isInside = false;
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeaveWindow = () => {
      isInside = false;
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('blur', handleMouseLeaveWindow);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('blur', handleMouseLeaveWindow);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      gsap.killTweensOf(el);
    };
  }, [radius, strength, stiffness, damping, maxDisplacement, active]);

  return (
    <div ref={elRef} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
