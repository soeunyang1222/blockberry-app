import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">DCA 대시보드</h1>
        <p className="text-gray-600">Dollar Cost Averaging 투자를 관리하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    총 투자금
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₩0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">₿</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    보유 BTC
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    0.00000000
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    수익률
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    0%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🔄</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    거래 횟수
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              빠른 작업
            </h3>
            <div className="space-y-3">
              <Link 
                href="/dashboard/savings/new"
                className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700 transition-colors"
              >
                ➕ 새 저금고 만들기
              </Link>
              <Link 
                href="/dashboard/portfolio"
                className="block w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700 transition-colors"
              >
                📊 포트폴리오 보기
              </Link>
              <Link 
                href="/dashboard/transactions"
                className="block w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700 transition-colors"
              >
                📋 거래 내역 확인
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              최근 활동
            </h3>
            <div className="text-sm text-gray-500 space-y-2">
              <p>아직 활동 내역이 없습니다.</p>
              <p>첫 번째 저금고를 만들어 DCA 투자를 시작해보세요!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Savings Vaults */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              활성 저금고
            </h3>
            <Link 
              href="/dashboard/savings/new"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              새 저금고 만들기
            </Link>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <p>아직 생성된 저금고가 없습니다.</p>
            <p className="mt-2">
              <Link 
                href="/dashboard/savings/new"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                첫 번째 저금고를 만들어보세요 →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
