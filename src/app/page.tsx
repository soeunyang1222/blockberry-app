'use client';

import React, { useState } from 'react';


import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { mockWalletBalances } from '@/lib/mock/data';

/**
 * 메인 랜딩 페이지 컴포넌트
 * - DCA (Dollar Cost Averaging) 주문 생성 폼을 제공
 * - 사용자가 투자 주기, 금액, 기간을 설정할 수 있음
 * - 실시간으로 총 투자 금액을 계산하여 표시
 */
export default function HomePage() {
  // DCA 폼 상태 관리
  const [selectedStrategy, setSelectedStrategy] = useState<'btc' | 'sui'>('btc');
  const [days, setDays] = useState<number>(365);
  const [amount, setAmount] = useState<number>(0);
  const [selectedAmountButton, setSelectedAmountButton] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isRolling, setIsRolling] = useState(false);

  // 사용자의 현재 USDC 잔액 조회 (목 데이터 사용)
  const usdcBalance = mockWalletBalances.find(b => b.symbol === 'USDC')?.amount || 0;

  // 총 투자 금액 계산 로직
  const calculateTotalAmount = () => {
    if (amount === 0 || days === 0) return 0;
    
    // 설정한 일수 동안 매일 투자하는 총 금액 계산
    return Math.round(amount * days * 100) / 100;
  };

  // 금액 버튼 클릭 핸들러
  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setSelectedAmountButton(value);
  };

  // 커스텀 금액 입력 핸들러
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value) || 0;
    setAmount(numValue);
    setSelectedAmountButton(null);
  };

  // 전략 변경 핸들러 (코인 롤링 애니메이션 포함)
  const handleStrategyChange = (strategy: 'btc' | 'sui') => {
    if (strategy !== selectedStrategy) {
      setIsRolling(true);
      setTimeout(() => {
        setSelectedStrategy(strategy);
        setTimeout(() => {
          setIsRolling(false);
        }, 300);
      }, 150);
    }
  };

  const totalAmount = calculateTotalAmount();
  const isOverBudget = totalAmount > usdcBalance;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dollar Cost Averaging</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[70vh] items-center">
          {/* Left: DCA Configuration Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center">
            {/* Strategy Selection Tabs */}
            <div className="flex mb-8">
              <button
                onClick={() => handleStrategyChange('btc')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  selectedStrategy === 'btc'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 4091.27 4091.73" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"/>
                    <path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"/>
                  </g>
                </svg>
                <span>Stack to BTC</span>
              </button>
              <button
                onClick={() => handleStrategyChange('sui')}
                className={`ml-8 flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  selectedStrategy === 'sui'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 300 383.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" fill="#4DA2FF" d="M240.1,159.9c15.6,19.6,25,44.5,25,71.5s-9.6,52.6-25.7,72.4l-1.4,1.7l-0.4-2.2c-0.3-1.8-0.7-3.7-1.1-5.6c-8-35.3-34.2-65.6-77.4-90.2c-29.1-16.5-45.8-36.4-50.2-59c-2.8-14.6-0.7-29.3,3.3-41.9c4.1-12.6,10.1-23.1,15.2-29.4l16.8-20.5c2.9-3.6,8.5-3.6,11.4,0L240.1,159.9L240.1,159.9z M266.6,139.4L154.2,2c-2.1-2.6-6.2-2.6-8.3,0L33.4,139.4l-0.4,0.5C12.4,165.6,0,198.2,0,233.7c0,82.7,67.2,149.8,150,149.8c82.8,0,150-67.1,150-149.8c0-35.5-12.4-68.1-33.1-93.8L266.6,139.4L266.6,139.4z M60.3,159.5l10-12.3l0.3,2.3c0.2,1.8,0.5,3.6,0.9,5.4c6.5,34.1,29.8,62.6,68.6,84.6c33.8,19.2,53.4,41.3,59.1,65.6c2.4,10.1,2.8,20.1,1.8,28.8l-0.1,0.5l-0.5,0.2c-15.2,7.4-32.4,11.6-50.5,11.6c-63.5,0-115-51.4-115-114.8C34.9,204.2,44.4,179.1,60.3,159.5L60.3,159.5z"/>
                </svg>
                <span>Stack to SUI</span>
              </button>
            </div>

            {/* DCA Configuration Form */}
            <div className="space-y-6">
              {/* Investment Period Setting */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-lg text-gray-900">For</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max="365"
                      className="bg-gray-100 border-0 rounded-lg px-3 py-2 w-20 text-center text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <span className="text-lg text-gray-900">days,</span>
                </div>

                <div className="text-lg text-gray-900 mb-6">
                  Every day I want to buy
                </div>

                {/* Amount Selection Buttons */}
                <div className="space-y-4 mb-6">
                  {/* Preset Amount Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 100, 1000].map((value) => (
                      <button
                        key={value}
                        onClick={() => {
                          handleAmountSelect(value);
                          setCustomAmount('');
                        }}
                        className={`py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                          selectedAmountButton === value
                            ? 'bg-green-400 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        ${value}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Amount Input */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">$</span>
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Available Balance Display */}
                <p className="text-sm text-gray-500 text-center mb-6">
                  You can buy up to ${usdcBalance.toLocaleString()}
                </p>
              </div>

              {/* Total Investment Amount Display */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total Amount</span>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                      ${totalAmount.toLocaleString()}
                    </div>
                    {isOverBudget && (
                      <p className="text-sm text-red-500 mt-1">
                        You can spend up to ${usdcBalance.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <Button 
                className="w-full h-14 bg-slate-700 hover:bg-slate-800 text-white font-medium text-lg"
                disabled={amount === 0 || isOverBudget}
              >
                Confirm
              </Button>
            </div>
          </div>

          {/* Right: Visual Display Area */}
          <div className="flex flex-col justify-center items-center space-y-12">
            {/* Stacking Tree with Animated Coins */}
            <div className="relative">
              {/* SuiStack Tree Base (Static Background) */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 opacity-40">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(0, -5)">
                    {/* Tree-like stacked blocks */}
                    <rect x="25" y="70" width="50" height="20" rx="8" fill="#6ECF28"/>
                    <rect x="20" y="50" width="48" height="20" rx="8" fill="#6ECF28" transform="rotate(-5 44 61)"/>
                    <rect x="30" y="30" width="42" height="20" rx="8" fill="#6ECF28" transform="rotate(3 51 41)"/>
                    <rect x="37" y="12" width="30" height="20" rx="8" fill="#6ECF28" transform="rotate(-8 48 21)"/>
                  </g>
                </svg>
              </div>

              {/* Animated Coins Stacking on Tree */}
              <div className={`relative transition-all duration-500 ${isRolling ? 'animate-spin scale-110' : 'scale-100'}`}>
                {selectedStrategy === 'btc' ? (
                  <div className="relative">
                    {/* Bouncing stacked coin */}
                    <div className="absolute -translate-x-3 -translate-y-8 opacity-70 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2.5s' }}>
                      <svg width="100" height="100" viewBox="0 0 4091.27 4091.73" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                        <g>
                          <path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"/>
                          <path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"/>
                        </g>
                      </svg>
                    </div>
                    {/* Front main coin */}
                    <svg width="200" height="200" viewBox="0 0 4091.27 4091.73" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl relative z-10">
                      <g>
                        <path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"/>
                        <path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"/>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Bouncing stacked coin */}
                    <div className="absolute -translate-x-3 -translate-y-8 opacity-70 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2.5s' }}>
                      <svg width="100" height="100" viewBox="0 0 300 383.5" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                        <path fillRule="evenodd" clipRule="evenodd" fill="#4DA2FF" d="M240.1,159.9c15.6,19.6,25,44.5,25,71.5s-9.6,52.6-25.7,72.4l-1.4,1.7l-0.4-2.2c-0.3-1.8-0.7-3.7-1.1-5.6c-8-35.3-34.2-65.6-77.4-90.2c-29.1-16.5-45.8-36.4-50.2-59c-2.8-14.6-0.7-29.3,3.3-41.9c4.1-12.6,10.1-23.1,15.2-29.4l16.8-20.5c2.9-3.6,8.5-3.6,11.4,0L240.1,159.9L240.1,159.9z M266.6,139.4L154.2,2c-2.1-2.6-6.2-2.6-8.3,0L33.4,139.4l-0.4,0.5C12.4,165.6,0,198.2,0,233.7c0,82.7,67.2,149.8,150,149.8c82.8,0,150-67.1,150-149.8c0-35.5-12.4-68.1-33.1-93.8L266.6,139.4L266.6,139.4z M60.3,159.5l10-12.3l0.3,2.3c0.2,1.8,0.5,3.6,0.9,5.4c6.5,34.1,29.8,62.6,68.6,84.6c33.8,19.2,53.4,41.3,59.1,65.6c2.4,10.1,2.8,20.1,1.8,28.8l-0.1,0.5l-0.5,0.2c-15.2,7.4-32.4,11.6-50.5,11.6c-63.5,0-115-51.4-115-114.8C34.9,204.2,44.4,179.1,60.3,159.5L60.3,159.5z"/>
                      </svg>
                    </div>
                    {/* Front main coin */}
                    <svg width="200" height="200" viewBox="0 0 300 383.5" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl relative z-10">
                      <path fillRule="evenodd" clipRule="evenodd" fill="#4DA2FF" d="M240.1,159.9c15.6,19.6,25,44.5,25,71.5s-9.6,52.6-25.7,72.4l-1.4,1.7l-0.4-2.2c-0.3-1.8-0.7-3.7-1.1-5.6c-8-35.3-34.2-65.6-77.4-90.2c-29.1-16.5-45.8-36.4-50.2-59c-2.8-14.6-0.7-29.3,3.3-41.9c4.1-12.6,10.1-23.1,15.2-29.4l16.8-20.5c2.9-3.6,8.5-3.6,11.4,0L240.1,159.9L240.1,159.9z M266.6,139.4L154.2,2c-2.1-2.6-6.2-2.6-8.3,0L33.4,139.4l-0.4,0.5C12.4,165.6,0,198.2,0,233.7c0,82.7,67.2,149.8,150,149.8c82.8,0,150-67.1,150-149.8c0-35.5-12.4-68.1-33.1-93.8L266.6,139.4L266.6,139.4z M60.3,159.5l10-12.3l0.3,2.3c0.2,1.8,0.5,3.6,0.9,5.4c6.5,34.1,29.8,62.6,68.6,84.6c33.8,19.2,53.4,41.3,59.1,65.6c2.4,10.1,2.8,20.1,1.8,28.8l-0.1,0.5l-0.5,0.2c-15.2,7.4-32.4,11.6-50.5,11.6c-63.5,0-115-51.4-115-114.8C34.9,204.2,44.4,179.1,60.3,159.5L60.3,159.5z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Summary */}
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[350px]">
                <div className="text-sm text-gray-500 mb-2">Daily Investment</div>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  ${amount > 0 ? amount.toLocaleString() : '0'}
                </div>
                <div className="text-base text-gray-500 mb-6">USDC</div>
                
                <div className="border-t pt-6 space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{days} days</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Total Investment:</span>
                    <span className={`font-bold text-lg ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
