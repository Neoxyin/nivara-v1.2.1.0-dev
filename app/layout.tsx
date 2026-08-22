import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nivara — Student Success & Well-being',
  description: 'A holistic student success platform designed to bridge the gap between academic performance and mental well-being.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}