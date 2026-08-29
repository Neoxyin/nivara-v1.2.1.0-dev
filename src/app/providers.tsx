'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { SidebarProvider } from '@/components/layout/sidebar-context'
import { LanguageProvider } from '@/components/shared/language-context'
import { syncSessionCookie } from '@/lib/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncSessionCookie();
  }, []);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
