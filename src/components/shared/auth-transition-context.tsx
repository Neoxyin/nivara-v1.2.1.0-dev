'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NivaraLogoIcon } from './nivara-logo';

interface AuthTransitionContextValue {
  start: (message?: string) => void;
  stop: () => void;
}

const AuthTransitionContext = createContext<AuthTransitionContextValue | null>(null);

export function useAuthTransition() {
  const ctx = useContext(AuthTransitionContext);
  if (!ctx) {
    // Safe no-op fallback so this can be called even if the provider
    // hasn't mounted yet (e.g. during SSR/edge cases).
    return { start: () => {}, stop: () => {} };
  }
  return ctx;
}

export function AuthTransitionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('Preparing your space...');
  const rafRef = useRef<number | null>(null);

  const start = useCallback((msg?: string) => {
    if (msg) setMessage(msg);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    // Wait one paint frame so we never hide before the destination
    // page has actually rendered content behind the overlay.
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setActive(false);
    });
  }, []);

  const value = useMemo(() => ({ start, stop }), [start, stop]);

  return (
    <AuthTransitionContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            key="auth-transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeInOut' } }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 backdrop-blur-sm"
            aria-live="polite"
            aria-label={message}
          >
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-5"
            >
              <div className="relative grid h-16 w-16 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#c3f340]/20" />
                <span className="absolute inset-0 rounded-full border border-[#c3f340]/25" />
                <span
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c3f340] border-r-[#c3f340]/40 shadow-[0_0_18px_rgba(195,243,64,0.35)]"
                  style={{ animation: 'auth-spin 0.9s linear infinite' }}
                />
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[#0d1408] shadow-[0_0_16px_rgba(195,243,64,0.3)]">
                  <NivaraLogoIcon size={20} />
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#dff77d] drop-shadow-[0_0_10px_rgba(195,243,64,0.35)]">
                {message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        @keyframes auth-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AuthTransitionContext.Provider>
  );
}
