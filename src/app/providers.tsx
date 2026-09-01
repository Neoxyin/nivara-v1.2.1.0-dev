'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { SidebarProvider } from '@/components/layout/sidebar-context'
import { LanguageProvider } from '@/components/shared/language-context'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { syncSessionCookie } from '@/lib/auth'
import { PostLoginTransitionOverlay } from '@/components/auth/post-login-overlay'

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
          <TooltipProvider>
            {children}
            <Toaster />
            <PostLoginTransitionOverlay />
          </TooltipProvider>
        </SidebarProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
