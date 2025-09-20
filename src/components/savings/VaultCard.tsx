import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface VaultCardProps {
  vault: {
    vault_id: number;
    vault_name: string;
    target_token: string;
    amount_fiat: number;
    fiat_symbol: string;
    interval_days: number;
    active: boolean;
    total_deposit: number;
    created_at: string;
  };
  onEdit?: (vaultId: number) => void;
  onToggleActive?: (vaultId: number, active: boolean) => void;
}

export function VaultCard({ vault, onEdit, onToggleActive }: VaultCardProps) {
  const formatCurrency = (amount: number, symbol: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: symbol === 'KRW' ? 'KRW' : 'USD',
    }).format(amount / 100); // 센트 단위에서 원화/달러로 변환
  };

  return (
    <Card className={`transition-all ${vault.active ? 'border-blue-200' : 'border-gray-200 opacity-70'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{vault.vault_name}</CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                vault.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {vault.active ? '활성' : '비활성'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">대상 토큰</p>
            <p className="font-medium">{vault.target_token}</p>
          </div>
          <div>
            <p className="text-gray-500">투자 간격</p>
            <p className="font-medium">{vault.interval_days}일</p>
          </div>
          <div>
            <p className="text-gray-500">회당 투자금액</p>
            <p className="font-medium">
              {formatCurrency(vault.amount_fiat, vault.fiat_symbol)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">총 입금액</p>
            <p className="font-medium">
              {formatCurrency(vault.total_deposit, vault.fiat_symbol)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(vault.vault_id)}
          >
            수정
          </Button>
          <Button
            variant={vault.active ? "secondary" : "default"}
            size="sm"
            onClick={() => onToggleActive?.(vault.vault_id, !vault.active)}
          >
            {vault.active ? '일시정지' : '활성화'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
