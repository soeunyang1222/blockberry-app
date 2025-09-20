import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🫐 Blockberry DCA Platform
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sui 블록체인에서 달러 코스트 애버리징 투자를 시작하세요
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  자동 투자
                </h3>
                <p className="text-blue-700">
                  설정한 주기와 금액으로 자동으로 BTC를 매수합니다
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  최적 가격
                </h3>
                <p className="text-green-700">
                  Cetus DEX를 통해 최적의 스왑 경로를 찾아 실행합니다
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  투명한 추적
                </h3>
                <p className="text-purple-700">
                  모든 거래와 성과를 투명하게 추적하고 분석합니다
                </p>
              </div>
            </div>
            
            <div className="space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                대시보드 시작하기
              </Link>
              <Link 
                href="/api-docs" 
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                API 문서 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 기능 소개 섹션 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              📊 현재 기능
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ 지갑 연결 및 사용자 관리</li>
              <li>✅ DCA 저금고 생성 및 관리</li>
              <li>✅ USDC 입금 및 추적</li>
              <li>✅ 거래 내역 및 분석</li>
              <li>✅ PostgreSQL 데이터베이스</li>
              <li>🔄 Sui 블록체인 통합 (개발 중)</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              🚀 계획된 기능
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🔲 Cetus Protocol 통합</li>
              <li>🔲 실시간 가격 피드</li>
              <li>🔲 자동 스케줄링</li>
              <li>🔲 CEX 가격 비교</li>
              <li>🔲 모바일 반응형 UI</li>
              <li>🔲 알림 시스템</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
