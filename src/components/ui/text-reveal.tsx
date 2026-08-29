'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  type?: 'words' | 'chars';
}

function getText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getText).join('');
  return '';
}

export function TextReveal({
  children,
  className = '',
  delay = 0.1,
  duration = 0.7,
  stagger = 0.04,
  as: Component = 'span',
  type = 'words',
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const text = getText(children);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.reveal-item');

    gsap.set(items, {
      opacity: 0,
      y: 20,
      rotateX: -40,
      filter: 'blur(6px)',
      transformOrigin: '50% 100%',
    });

    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      duration,
      delay,
      stagger,
      ease: 'power3.out',
    });

    return () => {
      tween.kill();
    };
  }, [text, delay, duration, stagger, type]);

  const words = text ? text.split(' ') : [];

  if (type === 'chars') {
    return (
      <Component ref={containerRef as any} className={`inline-block perspective-1000 ${className}`}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split('').map((char, charIndex) => (
              <span
                key={charIndex}
                className="reveal-item inline-block will-change-transform"
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component ref={containerRef as any} className={`inline-block perspective-1000 ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="reveal-item inline-block mr-[0.28em] will-change-transform"
        >
          {word}
        </span>
      ))}
    </Component>
  );
}
