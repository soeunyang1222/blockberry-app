import Link from 'next/link';

export function Header() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              🫐 Blockberry
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              대시보드
            </Link>
            <Link 
              href="/api-docs"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              API 문서
            </Link>
            <span className="text-sm text-gray-500">Sui DCA Platform</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
