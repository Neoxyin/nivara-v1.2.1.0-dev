'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const TRANSITION_EVENT = 'nivara-auth-transition-start';

// Safety-only upper bound so the overlay can never get stuck on screen if a
// navigation is interrupted or redirected elsewhere. This is NOT a minimum
// display time — the overlay is dismissed the instant the destination route
// mounts, well before this fires in the normal case.
const SAFETY_TIMEOUT_MS = 6000;

interface AuthTransitionDetail {
  targetPath: string;
  message?: string;
}

/**
 * Call this the moment a sign-in flow decides to navigate to an
 * authenticated destination. It instantly reveals the full-screen
 * transition overlay (mounted once in Providers), which then dismisses
 * itself as soon as `targetPath` finishes mounting.
 */
export function triggerAuthTransition(targetPath: string, message?: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<AuthTransitionDetail>(TRANSITION_EVENT, {
      detail: { targetPath, message },
    })
  );
}

export function PostLoginTransitionOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Preparing your space...');
  const targetPathRef = useRef<string | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    setVisible(false);
    targetPathRef.current = null;
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const handleStart = (e: Event) => {
      const detail = (e as CustomEvent<AuthTransitionDetail>).detail;
      if (!detail?.targetPath) return;

      targetPathRef.current = detail.targetPath;
      setMessage(detail.message || 'Preparing your space...');
      setVisible(true);

      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(dismiss, SAFETY_TIMEOUT_MS);
    };

    window.addEventListener(TRANSITION_EVENT, handleStart);
    return () => window.removeEventListener(TRANSITION_EVENT, handleStart);
  }, []);

  // Dismiss the instant the destination route has taken over the pathname
  // and had a chance to paint — no artificial minimum, no lingering.
  useEffect(() => {
    if (!visible || !targetPathRef.current) return;
    if (pathname !== targetPathRef.current) return;

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        dismiss();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [pathname, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-[4px]"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="relative h-14 w-14">
              <span className="absolute inset-0 rounded-full border-2 border-[#c3f340]/15" />
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#c3f340]" />
              <span className="absolute inset-[10px] animate-pulse rounded-full bg-[#c3f340]/20 shadow-[0_0_22px_rgba(195,243,64,0.55)]" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#dff77d]">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
