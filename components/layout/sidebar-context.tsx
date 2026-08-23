'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 1023px)').matches;
      if (isMobile) return true;
      return localStorage.getItem('nivara_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) return;
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nivara_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const syncViewport = () => {
      if (media.matches) {
        setCollapsed(true);
      } else {
        const stored = localStorage.getItem('nivara_sidebar_collapsed');
        setCollapsed(stored === 'true');
      }
    };
    syncViewport();
    media.addEventListener?.('change', syncViewport);
    return () => media.removeEventListener?.('change', syncViewport);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      collapsed: false,
      setCollapsed: () => {},
      toggleSidebar: () => {},
    };
  }
  return context;
}
