'use client';

import React, { useState } from 'react';
import { mockPortfolio, mockDCAOrders, mockTransactions } from '@/lib/mock/data';

/**
 * 투자 포트폴리오 페이지 컴포넌트
 * - 사용자의 전체 투자 현황을 시각적으로 표시
 * - 포트폴리오 분산 차트와 수익률 정보 제공
 * - 정기 주문 및 최근 거래 내역 탭으로 구성
 */
export default function InvestmentPage() {
  const [activeTab, setActiveTab] = useState<'recurring' | 'transactions'>('recurring');

  // 포트폴리오 데이터 계산
  const totalInvested = mockPortfolio.totalInvested;
  const totalReturn = mockPortfolio.totalReturn;
  const returnRate = ((totalReturn / totalInvested) * 100).toFixed(2);
  const unrealizedGain = totalReturn;
  const totalCostBasis = totalInvested - totalReturn;

  // BTC 보유량 계산 (목 데이터 기준)
  const btcHolding = mockPortfolio.holdings.find(h => h.asset === 'WBTC');
  const btcAmount = btcHolding?.amount || 0;

  // 포트폴리오 구성 비율 계산
  const btcPercentage = btcHolding ? (btcHolding.value / mockPortfolio.totalValue * 100).toFixed(2) : '0';
  const usdPercentage = (100 - parseFloat(btcPercentage)).toFixed(2);

  // 활성 DCA 주문 필터링
  const activeDCAOrders = mockDCAOrders.filter(order => order.status === 'active');

  // 최근 거래 내역 (최근 5개)
  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Investment Portfolio</h1>
        </div>

        {/* Portfolio Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Portfolio Statistics */}
            <div className="space-y-6">
              {/* Total Investment Amount */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Amount Invested</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${totalInvested.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  = {btcAmount.toFixed(8)} BTC
                </div>
              </div>

              {/* Return Information */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Return</div>
                  <div className="text-lg font-semibold text-red-500">+{returnRate}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Unrealized Gain/Loss</div>
                  <div className="text-lg font-semibold text-red-500">
                    ${unrealizedGain.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Cost Basis</div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${totalCostBasis.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Portfolio Composition */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">BTC</span>
                  <span className="text-sm font-medium text-gray-900">{btcPercentage}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">USD</span>
                  <span className="text-sm font-medium text-gray-900">{usdPercentage}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Other</span>
                  <span className="text-sm font-medium text-gray-900">0.00%</span>
                </div>
              </div>
            </div>

            {/* Right: Donut Chart (Simple Circular Display) */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                  />
                  {/* BTC Ratio Arc */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${(parseFloat(btcPercentage) / 100) * 502} 502`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{btcPercentage}%</div>
                    <div className="text-sm text-gray-500">BTC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation and Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Tab Header */}
          <div className="flex mb-8">
            <button
              onClick={() => setActiveTab('recurring')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'recurring'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recurring Orders
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`ml-8 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Last Transactions
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'recurring' && (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-6 text-xs font-medium text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-200">
                <div>ORDERS</div>
                <div>INVESTMENT PERIOD</div>
                <div>METHOD</div>
                <div>AMOUNT</div>
                <div></div>
              </div>

              {/* DCA Order List */}
              {activeDCAOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-5 gap-6 items-center py-4 border-b border-gray-100">
                  {/* Order Information */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">₿</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Buy Bitcoin</div>
                      <div className="text-xs text-gray-500">
                        {order.frequency === 'weekly' ? 'Weekly' : order.frequency === 'monthly' ? 'Monthly' : 'Daily'}
                      </div>
                    </div>
                  </div>

                  {/* Investment Period */}
                  <div className="text-sm text-gray-700">
                    for a {order.frequency === 'weekly' ? 'month' : 'year'}
                  </div>

                  {/* Payment Method */}
                  <div className="text-sm text-gray-700">
                    {order.fromAsset}
                  </div>

                  {/* Amount */}
                  <div className="text-sm font-medium text-gray-900">
                    ${order.amount.toFixed(2)}
                  </div>

                  {/* Manage Button */}
                  <div className="text-right">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-6 text-xs font-medium text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-200">
                <div>TIME</div>
                <div>TYPE</div>
                <div>TOKEN IN</div>
                <div>TOKEN OUT</div>
                <div>TOKEN ID</div>
              </div>

              {/* Transaction History List */}
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-5 gap-6 items-center py-4 border-b border-gray-100">
                  {/* Time */}
                  <div className="text-sm text-gray-700">
                    <div>{new Date(transaction.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Transaction Type */}
                  <div className="text-sm text-gray-700">
                    {transaction.type === 'buy' ? 'Claim Rewards' : 'Unlock'}
                  </div>

                  {/* Token In */}
                  <div className="text-sm text-gray-700">
                    <div>{(transaction.amount * 1000).toFixed(6)}</div>
                    <div className="text-xs text-gray-500">LP Shares</div>
                  </div>

                  {/* Token Out */}
                  <div className="text-sm text-gray-700">
                    <div>{(transaction.amount / 1000).toFixed(6)} XPRT</div>
                  </div>

                  {/* Token Out ID */}
                  <div className="text-sm text-gray-500 font-mono">
                    F9604...FG352
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
