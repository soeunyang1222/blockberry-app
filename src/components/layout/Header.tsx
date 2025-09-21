'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletConnect } from '@/components/wallet';

export function Header() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - SuiStack Logo SVG */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0, -5)">
                  {/* Stacked blocks - symbolizing stable and gentle growth */}
                  <rect x="25" y="70" width="50" height="20" rx="8" fill="#6ECF28"/>
                  <rect x="20" y="50" width="48" height="20" rx="8" fill="#6ECF28" transform="rotate(-5 44 61)"/>
                  <rect x="30" y="30" width="42" height="20" rx="8" fill="#6ECF28" transform="rotate(3 51 41)"/>
                  <rect x="37" y="12" width="30" height="20" rx="8" fill="#6ECF28" transform="rotate(-8 48 21)"/>
                </g>
              </svg>
              <span className="text-lg font-semibold text-gray-900">SuiStack</span>
            </Link>
          </div>
      
          {/* Central Navigation - Main Features */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                pathname === '/'
                  ? 'text-green-500 font-medium'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              DCA
            </Link>
            <Link
              href="/investment"
              className={`text-sm transition-colors ${
                pathname === '/investment'
                  ? 'text-green-500 font-medium'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Investment
            </Link>
          </div>

          {/* Right: Wallet Connection Button */}
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
