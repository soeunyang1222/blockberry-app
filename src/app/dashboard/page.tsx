import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const stats = [
    {
      title: '총 투자금',
      value: '₩0',
      icon: '💰',
      description: '누적 투자 금액',
    },
    {
      title: '보유 BTC',
      value: '0.00000000',
      icon: '₿',
      description: '현재 보유량',
    },
    {
      title: '수익률',
      value: '0%',
      icon: '📈',
      description: '총 수익률',
    },
    {
      title: '거래 횟수',
      value: '0',
      icon: '🔄',
      description: '총 거래 수',
    },
  ];

  const quickActions = [
    {
      href: '/dashboard/savings/new',
      label: '새 저금고 만들기',
      icon: '➕',
      colorScheme: 'blue' as const,
    },
    {
      href: '/dashboard/portfolio',
      label: '포트폴리오 보기',
      icon: '📊',
      colorScheme: 'green' as const,
    },
    {
      href: '/dashboard/transactions',
      label: '거래 내역 확인',
      icon: '📋',
      colorScheme: 'purple' as const,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">DCA 대시보드</h1>
        <p className="text-gray-600">Dollar Cost Averaging 투자를 관리하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <QuickActionCard actions={quickActions} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              최근 활동
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 space-y-2">
              <p>아직 활동 내역이 없습니다.</p>
              <p>첫 번째 저금고를 만들어 DCA 투자를 시작해보세요!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Savings Vaults */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-900">
              활성 저금고
            </CardTitle>
            <Button asChild size="sm">
              <Link href="/dashboard/savings/new">
                새 저금고 만들기
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
