import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 섹션 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="text-lg font-semibold text-gray-900">SuiStack</span>
            </Link>
          </div>
          
          {/* 중앙 네비게이션 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dca"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Stack to Bit
            </Link>
            <Link
              href="/investment"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Investment
            </Link>
            <Link
              href="/portfolio"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              portfolio
            </Link>
          </div>
          
          {/* 오른쪽 지갑 연결 버튼 */}
          <div className="flex items-center">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Connet Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
