import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/ui/FeatureCard';

export default function HomePage() {
  const features = [
    {
      title: '자동 투자',
      description: '설정한 주기와 금액으로 자동으로 BTC를 매수합니다',
      icon: '🤖',
      variant: 'primary' as const,
    },
    {
      title: '최적 가격',
      description: 'Cetus DEX를 통해 최적의 스왑 경로를 찾아 실행합니다',
      icon: '💰',
      variant: 'default' as const,
    },
    {
      title: '투명한 추적',
      description: '모든 거래와 성과를 투명하게 추적하고 분석합니다',
      icon: '📊',
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              🫐 Blockberry DCA Platform
            </CardTitle>
            <p className="text-lg text-gray-600 mb-8">
              Sui 블록체인에서 달러 코스트 애버리징 투자를 시작하세요
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  variant={feature.variant}
                />
              ))}
            </div>
            
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  대시보드 시작하기
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/api-docs">
                  API 문서 보기
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 기능 소개 섹션 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              📊 현재 기능
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ 지갑 연결 및 사용자 관리</li>
              <li>✅ DCA 저금고 생성 및 관리</li>
              <li>✅ USDC 입금 및 추적</li>
              <li>✅ 거래 내역 및 분석</li>
              <li>✅ PostgreSQL 데이터베이스</li>
              <li>🔄 Sui 블록체인 통합 (개발 중)</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              🚀 계획된 기능
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🔲 Cetus Protocol 통합</li>
              <li>🔲 실시간 가격 피드</li>
              <li>🔲 자동 스케줄링</li>
              <li>🔲 CEX 가격 비교</li>
              <li>🔲 모바일 반응형 UI</li>
              <li>🔲 알림 시스템</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
