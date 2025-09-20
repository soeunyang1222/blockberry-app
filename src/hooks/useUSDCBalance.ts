'use client';

import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { CoinBalance } from '@mysten/sui/client';

// USDC coin types for different networks
// Mainnet USDC (Wormhole): 0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN
// Testnet USDC may vary - check your specific deployment
const MAINNET_USDC = '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN';
const TESTNET_USDC = '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN';

export function useUSDCBalance() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allBalances, setAllBalances] = useState<any[]>([]); // 디버깅용

  useEffect(() => {
    if (!account?.address) {
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get all coin balances for the address
        const coins = await suiClient.getAllBalances({
          owner: account.address,
        });

        // 디버깅: 모든 코인 타입 출력
        console.log('All coin balances:', coins);
        setAllBalances(coins);

        // Find USDC balance - check multiple possible types
        const usdcBalance = coins.find(coin =>
          coin.coinType === MAINNET_USDC ||
          coin.coinType === TESTNET_USDC ||
          coin.coinType.toLowerCase().includes('usdc') ||
          coin.coinType.includes('USDC')
        );

        if (usdcBalance) {
          // Convert from smallest unit (assuming 6 decimals for USDC)
          const balanceInUsdc = Number(usdcBalance.totalBalance) / 1_000_000;
          setBalance(balanceInUsdc);
        } else {
          // If no USDC found, check for SUI balance as fallback
          const suiBalance = coins.find(coin =>
            coin.coinType === '0x2::sui::SUI'
          );

          if (suiBalance) {
            // Convert SUI to approximate USD value (임시로 1 SUI = 0.5 USD로 가정)
            const balanceInSui = Number(suiBalance.totalBalance) / 1_000_000_000;
            setBalance(balanceInSui * 0.5); // 실제로는 실시간 가격 API 필요
          } else {
            setBalance(0);
          }
        }
      } catch (err) {
        console.error('Failed to fetch USDC balance:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
        setBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // 10초마다 잔액 업데이트
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [account?.address, suiClient]);

  return {
    balance,
    isLoading,
    error,
    isConnected: !!account,
    allBalances, // 디버깅용: 모든 코인 잔액 반환
    address: account?.address, // 현재 연결된 주소
  };
}