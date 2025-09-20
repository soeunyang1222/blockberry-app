'use client';

import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Wallet, Coins } from 'lucide-react';

// Helper function to format balance
function formatBalance(balance: string, decimals: number): string {
  const value = BigInt(balance);
  const divisor = BigInt(10 ** decimals);
  const quotient = value / divisor;
  const remainder = value % divisor;

  const wholeStr = quotient.toString();
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.slice(0, 6).replace(/0+$/, '');

  if (trimmedRemainder) {
    return `${wholeStr}.${trimmedRemainder}`;
  }
  return wholeStr;
}

export function WalletBalance() {
  const account = useCurrentAccount();

  // SUI 잔액 조회
  const { data: balance, isLoading } = useSuiClientQuery(
    'getBalance',
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    }
  );

  // USDC 잔액 조회 (Sui USDC 토큰 타입)
  const USDC_TYPE = '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN';

  const { data: usdcBalance } = useSuiClientQuery(
    'getBalance',
    {
      owner: account?.address as string,
      coinType: USDC_TYPE,
    },
    {
      enabled: !!account,
    }
  );

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            지갑 잔액
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground-muted">
            지갑을 연결하여 잔액을 확인하세요
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          지갑 잔액
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">SUI</span>
            </div>
            <span className="text-lg font-semibold">
              {isLoading ? (
                <span className="animate-pulse">로딩중...</span>
              ) : (
                formatBalance(balance?.totalBalance || '0', 9)
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">USDC</span>
            </div>
            <span className="text-lg font-semibold">
              {formatBalance(usdcBalance?.totalBalance || '0', 6)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}