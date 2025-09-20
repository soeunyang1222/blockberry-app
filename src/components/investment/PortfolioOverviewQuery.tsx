'use client';

import React from 'react';
import { PortfolioChart } from './PortfolioChart';
import { formatUSDC, formatPercentage } from '@/lib/utils/format';
import { usePortfolio } from '@/lib/hooks/useApi';

export function PortfolioOverview() {
  const { data, isLoading, error } = usePortfolio();

  if (isLoading) {
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

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="text-red-600">
          {error?.message || 'Failed to load portfolio data'}
        </div>
      </div>
    );
  }

  // Transform API data to component format
  const portfolioStats = {
    totalValue: data.totalValue,
    totalValueBTC: data.totalValue / 95000,
    totalReturn: data.returnRate,
    unrealizedGainLoss: data.totalReturn,
    totalCostBasis: data.totalInvested
  };

  // Only include assets with value > 0
  const portfolioAssets = data.holdings
    .filter((h: any) => h.value > 0)
    .map((h: any) => ({
      symbol: h.asset === 'WBTC' ? 'BTC' : h.asset,
      name: h.asset === 'WBTC' ? 'Bitcoin' : 'USD Coin',
      value: h.value,
      amount: h.amount,
      percentage: (h.value / data.totalValue) * 100,
      color: h.asset === 'WBTC' ? '#F7931A' : '#2775CA'
    }));

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
            {/* Asset Holdings */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Holdings</h3>
              {portfolioAssets.map((asset: any) => (
                <div key={asset.symbol} className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="text-sm text-gray-700">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatUSDC(asset.value)}
                    </div>
                    {asset.symbol === 'BTC' && (
                      <div className="text-xs text-gray-500">
                        {asset.amount.toFixed(8)} BTC
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Return</span>
                <span className={`text-sm font-medium ${
                  portfolioStats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(portfolioStats.totalReturn)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unrealized Gain/Loss</span>
                <span className={`text-sm font-medium ${
                  portfolioStats.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatUSDC(portfolioStats.unrealizedGainLoss)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cost Basis</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatUSDC(portfolioStats.totalCostBasis)}
                </span>
              </div>
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