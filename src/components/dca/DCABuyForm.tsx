'use client'

import React, { useState, useEffect } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, Check, X, AlertCircle, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatUSD, formatUSDC, formatNumber } from '@/lib/utils/format'
import * as Tabs from '@radix-ui/react-tabs'
import * as Select from '@radix-ui/react-select'


type Period = 'month' | 'week'
type OrderStatus = 'idle' | 'processing' | 'success' | 'error'
type TabType = 'stack-to-bit' | 'stack-to-sui'

interface WalletBalance {
  usdc: number
  btc: number
}

export function DCABuyForm() {
  const [activeTab, setActiveTab] = useState<TabType>('stack-to-bit')
  const [period, setPeriod] = useState<Period>('month')
  const [buyAmount, setBuyAmount] = useState<number>(100)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [totalAmount, setTotalAmount] = useState<number>(400)

  // 지갑 잔액 상태 - Mock API에서 가져오기
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    usdc: 0,
    btc: 0
  })
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const isConnected = true // Mock 연결 상태

  // Mock API에서 지갑 잔액 가져오기
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch('/api/wallet/balance')
        const result = await response.json()
        
        if (result.success) {
          const usdcBalance = result.data.balances.find((b: any) => b.symbol === 'USDC')
          const btcBalance = result.data.balances.find((b: any) => b.symbol === 'WBTC')
          
          setWalletBalance({
            usdc: usdcBalance?.amount || 0,
            btc: btcBalance?.amount || 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error)
      } finally {
        setIsLoadingBalance(false)
      }
    }

    fetchWalletBalance()
  }, [])

  // Calculate total amount based on period (daily purchases)
  useEffect(() => {
    // Calculate total for daily purchases over the selected period
    const daysInPeriod = period === 'month' ? 30 : 7
    setTotalAmount(buyAmount * daysInPeriod)
  }, [buyAmount, period])

  // 매일 구매할 최대 금액 계산 (일일 한도 고려)
  const calculateMaxDailyAmount = () => {
    const daysInPeriod = period === 'month' ? 30 : 7
    // 전체 잔액을 기간 동안 나누어 일일 최대 금액 계산
    const maxDaily = Math.floor(walletBalance.usdc / daysInPeriod)
    return Math.min(maxDaily, walletBalance.usdc) // 잔액을 초과하지 않도록
  }

  const handleConfirm = async () => {
    // Validation
    if (!buyAmount || buyAmount <= 0) {
      setErrorMessage('Please enter a valid amount')
      setOrderStatus('error')
      setTimeout(() => {
        setOrderStatus('idle')
        setErrorMessage('')
      }, 3000)
      return
    }

    if (totalAmount > walletBalance.usdc) {
      setErrorMessage('Insufficient balance')
      setOrderStatus('error')
      setTimeout(() => {
        setOrderStatus('idle')
        setErrorMessage('')
      }, 3000)
      return
    }

    setOrderStatus('processing')

    // Call mock API to create DCA order
    try {
      const response = await fetch('/api/dca/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          frequency: period === 'month' ? 'monthly' : 'weekly',
          amount: buyAmount,
          fromAsset: 'USDC',
          toAsset: activeTab === 'stack-to-bit' ? 'WBTC' : 'SUI'
        })
      })

      const result = await response.json()

      if (result.success) {
        setOrderStatus('success')
        // Refresh wallet balance
        const balanceResponse = await fetch('/api/wallet/balance')
        const balanceResult = await balanceResponse.json()
        if (balanceResult.success) {
          const usdcBalance = balanceResult.data.balances.find((b: any) => b.symbol === 'USDC')
          const btcBalance = balanceResult.data.balances.find((b: any) => b.symbol === 'WBTC')
          setWalletBalance({
            usdc: usdcBalance?.amount || 0,
            btc: btcBalance?.amount || 0
          })
        }

        setTimeout(() => {
          setBuyAmount(100)
          setOrderStatus('idle')
        }, 3000)
      } else {
        setOrderStatus('error')
        setErrorMessage(result.error || 'Transaction failed')
        setTimeout(() => {
          setOrderStatus('idle')
          setErrorMessage('')
        }, 3000)
      }
    } catch (error) {
      setOrderStatus('error')
      setErrorMessage('Failed to create DCA order')
      setTimeout(() => {
        setOrderStatus('idle')
        setErrorMessage('')
      }, 3000)
    }
  }

  const getStatusColor = () => {
    switch (orderStatus) {
      case 'success':
        return 'bg-green-100 border-green-300'
      case 'error':
        return 'bg-red-100 border-red-300'
      case 'processing':
        return 'bg-yellow-100 border-yellow-300'
      default:
        return ''
    }
  }

  const renderStatusMessage = () => {
    if (orderStatus === 'success') {
      return (
        <div className="flex items-center justify-center text-green-600 py-4">
          <Check className="w-5 h-5 mr-2" />
          <span>Transaction Successful!</span>
        </div>
      )
    }

    if (orderStatus === 'error') {
      return (
        <div className="flex items-center justify-center text-red-600 py-4">
          <X className="w-5 h-5 mr-2" />
          <span>{errorMessage || 'Transaction Failed'}</span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Top Tabs */}
        <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
          <Tabs.List className="flex border-b border-gray-100">
            <Tabs.Trigger 
              value="stack-to-bit"
              className={cn(
                "flex-1 py-4 px-6 text-sm font-medium transition-colors relative data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-gray-50"
              )}
            >
              Stack to BTC
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"></div>
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="stack-to-sui"
              className={cn(
                "flex-1 py-4 px-6 text-sm font-medium transition-colors relative data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-gray-50"
              )}
            >
              Stack to Sui
            </Tabs.Trigger>
          </Tabs.List>

          {/* Form Content */}
          <Tabs.Content value="stack-to-bit" className="p-6 space-y-6">
            {/* Period and Frequency Selection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">For a</span>
                <Select.Root value={period} onValueChange={(value) => setPeriod(value as Period)}>
                  <Select.Trigger className="inline-flex items-center justify-between bg-gray-100 text-gray-700 px-3 py-1 rounded-lg min-w-[80px] focus:outline-none">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                      <Select.Viewport className="p-1">
                        <Select.Item value="month" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded">
                          <Select.ItemText>month</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="week" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded">
                          <Select.ItemText>week</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
              
        
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">
                  {period === 'month' ? '(30일 동안 매일 구매)' : '(7일 동안 매일 구매)'}
                </span>
              </div>
            </div>

          {/* I want to buy Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-gray-700 font-medium">Available Balance</h3>
              <div className="text-xs text-gray-500">
                {isConnected ? (
                  isLoadingBalance ? (
                    <span className="animate-pulse">Loading balance...</span>
                  ) : (
                    <span className="text-lg font-semibold text-gray-800">{formatUSDC(walletBalance.usdc)}</span>
                  )
                ) : (
                  <span className="text-orange-500 flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    Connect wallet to see available balance
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light text-gray-800">
                  ${buyAmount}
                </span>
                <span className="text-sm text-gray-500">
                  per day
                </span>
              </div>
            </div>

            {/* Amount Slider */}
            <div className="space-y-3">
              <div className="flex gap-1">
                {[20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBuyAmount(amount)}
                    disabled={!isConnected}
                    className={cn(
                      "flex-1 py-2 text-sm rounded-lg transition-colors",
                      buyAmount === amount
                        ? "bg-green-400 text-white"
                        : !isConnected
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  onClick={() => setBuyAmount(calculateMaxDailyAmount())}
                  disabled={!isConnected || walletBalance.usdc === 0}
                  className={cn(
                    "flex-1 py-2 text-sm rounded-lg transition-colors font-medium",
                    buyAmount === calculateMaxDailyAmount()
                      ? "bg-green-400 text-white"
                      : !isConnected || walletBalance.usdc === 0
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Amount</span>
              <div className={cn(
                "text-2xl font-light",
                isConnected && totalAmount > walletBalance.usdc
                  ? "text-red-500"
                  : "text-green-500"
              )}>
                {formatUSD(totalAmount)}
              </div>
            </div>
            {isConnected && (
              <div className={cn(
                "text-xs text-right",
                totalAmount > walletBalance.usdc
                  ? "text-red-500 font-medium"
                  : "text-gray-500"
              )}>
                {totalAmount > walletBalance.usdc ? (
                  <>
                    <AlertCircle className="inline w-3 h-3 mr-1" />
                    Insufficient balance: {formatUSDC(walletBalance.usdc)} available
                  </>
                ) : (
                  `Available balance: ${formatUSDC(walletBalance.usdc)}`
                )}
              </div>
            )}
          </div>

            {/* Payment Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment method</span>
                <span className="font-medium text-gray-800 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  USDC
                </span>
              </div>
            </div>

            {/* Status Message */}
            {renderStatusMessage()}

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={orderStatus === 'processing' || !isConnected || walletBalance.usdc === 0 || totalAmount > walletBalance.usdc}
              className={cn(
                "w-full py-4 text-white font-medium rounded-lg transition-all",
                !isConnected
                  ? "bg-orange-500 hover:bg-orange-600"
                  : totalAmount > walletBalance.usdc
                  ? "bg-red-400 cursor-not-allowed"
                  : orderStatus === 'processing' || walletBalance.usdc === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800"
              )}
            >
              {!isConnected ? (
                <span className="flex items-center justify-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet First
                </span>
              ) : totalAmount > walletBalance.usdc ? (
                <span className="flex items-center justify-center">
                  <X className="w-4 h-4 mr-2" />
                  Insufficient USDC Balance
                </span>
              ) : orderStatus === 'processing' ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </span>
              ) : (
                'Confirm'
              )}
            </button>
          </Tabs.Content>

          <Tabs.Content value="stack-to-sui" className="p-6 space-y-6">
            <div className="text-center text-gray-500 py-8">
              Stack to Sui 기능은 곧 제공됩니다.
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}