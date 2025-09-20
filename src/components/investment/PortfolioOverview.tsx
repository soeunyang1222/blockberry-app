'use client';

import React from 'react';
import { PortfolioChart } from './PortfolioChart';
import { PortfolioAsset, PortfolioStats } from '@/types/investment';

export function PortfolioOverview() {
  // 임시 데이터 - 실제 앱에서는 API에서 가져올 것
  const portfolioStats: PortfolioStats = {
    totalValue: 800163,
    totalValueBTC: 12.431208,
    totalReturn: 5.7,
    unrealizedGainLoss: 168379,
    totalCostBasis: 7066879
  };

  const portfolioAssets: PortfolioAsset[] = [
    { symbol: 'BTC', name: 'Bitcoin', value: 320065, percentage: 40.0, color: '#F7931A' },
    { symbol: 'USDC', name: 'USD Coin', value: 240049, percentage: 30.0, color: '#2775CA' },
    { symbol: 'USDT', name: 'Tether', value: 160033, percentage: 20.0, color: '#26A17B' },
    { symbol: 'SUI', name: 'Sui', value: 80016, percentage: 10.0, color: '#4DA2FF' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 통계 정보 */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Value</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(portfolioStats.totalValue)}
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
                {formatCurrency(portfolioStats.unrealizedGainLoss)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">Total Cost Basis</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(portfolioStats.totalCostBasis)}
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
