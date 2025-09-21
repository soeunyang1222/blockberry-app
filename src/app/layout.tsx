import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { SuiWalletProvider } from '@/providers/WalletProvider'
import { QueryProvider } from '@/lib/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SuiStack - Sui DCA Platform',
  description: 'Dollar Cost Averaging platform on Sui blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          <SuiWalletProvider>
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                {children}
              </main>
            </div>
          </SuiWalletProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
