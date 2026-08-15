'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface CounterProps {
  value: number | string;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({
  value,
  duration = 1.4,
  className = '',
  prefix = '',
  suffix = '',
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(value);
  const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.-]+/g, ''));
  const isNumeric = !isNaN(numericValue);

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: numericValue,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        setDisplayValue(Math.round(obj.val));
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, numericValue, isNumeric, duration]);

  if (!isNumeric) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
