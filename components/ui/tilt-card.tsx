'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  spotlightColor?: string;
  glareOpacity?: number;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 2.5,
  perspective = 1400,
  spotlightColor = 'rgba(195, 243, 64, 0.12)',
  glareOpacity = 0.12,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card) return;

    // Set initial 3D transform style
    gsap.set(card, {
      transformPerspective: perspective,
      transformStyle: 'preserve-3d',
    });

    const rotateXTo = gsap.quickTo(card, 'rotationX', {
      duration: 0.3,
      ease: 'power2.out',
    });
    const rotateYTo = gsap.quickTo(card, 'rotationY', {
      duration: 0.3,
      ease: 'power2.out',
    });
    const scaleTo = gsap.quickTo(card, 'scale', {
      duration: 0.25,
      ease: 'power2.out',
    });

    const spotlightXTo = spotlight
      ? gsap.quickTo(spotlight, 'x', { duration: 0.08, ease: 'power2.out' })
      : null;
    const spotlightYTo = spotlight
      ? gsap.quickTo(spotlight, 'y', { duration: 0.08, ease: 'power2.out' })
      : null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      rotateXTo(rotateX);
      rotateYTo(rotateY);

      if (spotlightXTo && spotlightYTo) {
        spotlightXTo(x);
        spotlightYTo(y);
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (spotlight) {
        gsap.set(spotlight, { x, y });
        gsap.to(spotlight, { opacity: 1, duration: 0.08, ease: 'power1.out', overwrite: 'auto' });
      }
      scaleTo(1.006);
    };

    const handleMouseLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      scaleTo(1);
      if (spotlight) {
        gsap.to(spotlight, { opacity: 0, duration: 0.2, ease: 'power1.out', overwrite: 'auto' });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(card);
      if (spotlight) gsap.killTweensOf(spotlight);
    };
  }, [maxTilt, perspective]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden will-change-transform ${className}`}
      {...props}
    >
      {/* Dynamic Instant Cursor Spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 h-56 w-56 rounded-full opacity-0 will-change-transform"
        style={{
          background: `radial-gradient(circle, ${spotlightColor} 0%, rgba(195,243,64,0.03) 45%, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

