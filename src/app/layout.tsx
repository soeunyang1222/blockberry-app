import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { SuiWalletProvider } from '@/providers/WalletProvider'

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
        <SuiWalletProvider>
          <div className="min-h-screen bg-white">
            <Header />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </SuiWalletProvider>
      </body>
    </html>
  )
}
