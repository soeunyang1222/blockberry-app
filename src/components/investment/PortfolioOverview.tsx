'use client';

import React, { useEffect, useState } from 'react';
import { PortfolioChart } from './PortfolioChart';
import { PortfolioAsset, PortfolioStats } from '@/types/investment';
import { formatUSDC, formatPercentage } from '@/lib/utils/format';

export function PortfolioOverview() {
  const [portfolioData, setPortfolioData] = useState<{
    stats: PortfolioStats;
    assets: PortfolioAsset[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio');
      const result = await response.json();

      if (result.success) {
        // Transform API data to component format
        const data = result.data;
        setPortfolioData({
          stats: {
            totalValue: data.totalValue,
            totalValueBTC: data.totalValue / 95000, // Use current BTC price
            totalReturn: data.returnRate,
            unrealizedGainLoss: data.totalReturn,
            totalCostBasis: data.totalInvested
          },
          assets: data.holdings.map((h: any, index: number) => ({
            symbol: h.asset === 'WBTC' ? 'BTC' : h.asset,
            name: h.asset === 'WBTC' ? 'Bitcoin' : 'USD Coin',
            value: h.value,
            percentage: (h.value / data.totalValue) * 100,
            color: h.asset === 'WBTC' ? '#F7931A' : '#2775CA'
          }))
        });
      } else {
        setError(result.error || 'Failed to fetch portfolio');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();

    // Refetch data when page becomes visible (e.g., when user switches tabs or navigates back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPortfolio();
      }
    };

    const handleFocus = () => {
      fetchPortfolio();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="text-red-600">
          {error || 'Failed to load portfolio data'}
        </div>
      </div>
    );
  }

  const { stats: portfolioStats, assets: portfolioAssets } = portfolioData;



  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 통계 정보 */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Value</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatUSDC(portfolioStats.totalValue)}
            </div>
            <div className="text-sm text-gray-500">
              ≈ {portfolioStats.totalValueBTC.toFixed(6)} BTC
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Return</span>
              <span className={`text-sm font-medium ${
                portfolioStats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(portfolioStats.totalReturn)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Unrealized Gain/Loss</span>
              <span className={`text-sm font-medium ${
                portfolioStats.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatUSDC(portfolioStats.unrealizedGainLoss)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">Total Cost Basis</span>
              <span className="text-sm font-medium text-gray-900">
                {formatUSDC(portfolioStats.totalCostBasis)}
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 차트 */}
        <div className="flex justify-center items-center">
          <PortfolioChart assets={portfolioAssets} />
        </div>
      </div>
    </div>
  );
}
