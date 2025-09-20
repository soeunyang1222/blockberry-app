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
import { useWalletBalance, useCreateDCAOrder } from '@/lib/hooks/useApi'

type Period = 'month' | 'week'
type TabType = 'stack-to-bit' | 'stack-to-sui'

export function DCABuyForm() {
  const [activeTab, setActiveTab] = useState<TabType>('stack-to-bit')
  const [period, setPeriod] = useState<Period>('month')
  const [buyAmount, setBuyAmount] = useState<number>(100)
  const [totalAmount, setTotalAmount] = useState<number>(400)

  const { data: walletData, isLoading: isLoadingBalance } = useWalletBalance()
  const { mutate: createOrder, isPending: isCreatingOrder, isSuccess, isError, error } = useCreateDCAOrder()

  const walletBalance = walletData?.balances?.find((b: any) => b.symbol === 'USDC')?.amount || 0
  const isConnected = true // Mock 연결 상태

  // Calculate total amount based on period (daily purchases)
  useEffect(() => {
    const daysInPeriod = period === 'month' ? 30 : 7
    setTotalAmount(buyAmount * daysInPeriod)
  }, [buyAmount, period])

  // Reset after successful order creation
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setBuyAmount(100)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  const calculateMaxDailyAmount = () => {
    const daysInPeriod = period === 'month' ? 30 : 7
    const maxDaily = Math.floor(walletBalance / daysInPeriod)
    return Math.min(maxDaily, walletBalance)
  }

  const handleConfirm = () => {
    // Validation
    if (!buyAmount || buyAmount <= 0) {
      return
    }

    if (totalAmount > walletBalance) {
      return
    }

    // Create DCA order
    createOrder({
      frequency: period === 'month' ? 'monthly' : 'weekly',
      amount: buyAmount,
      fromAsset: 'USDC',
      toAsset: activeTab === 'stack-to-bit' ? 'WBTC' : 'SUI'
    })
  }

  const getStatusColor = () => {
    if (isSuccess) return 'bg-green-100 border-green-300'
    if (isError) return 'bg-red-100 border-red-300'
    if (isCreatingOrder) return 'bg-yellow-100 border-yellow-300'
    return ''
  }

  const renderStatusMessage = () => {
    if (isSuccess) {
      return (
        <div className="flex items-center justify-center text-green-600 py-4">
          <Check className="w-5 h-5 mr-2" />
          <span>Transaction Successful!</span>
        </div>
      )
    }

    if (isError) {
      return (
        <div className="flex items-center justify-center text-red-600 py-4">
          <X className="w-5 h-5 mr-2" />
          <span>{error?.message || 'Transaction Failed'}</span>
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

            {/* Balance Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-gray-700 font-medium">Available Balance</h3>
                <div className="text-xs text-gray-500">
                  {isConnected ? (
                    isLoadingBalance ? (
                      <span className="animate-pulse">Loading balance...</span>
                    ) : (
                      <span className="text-lg font-semibold text-gray-800">{formatUSDC(walletBalance)}</span>
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
                    disabled={!isConnected || walletBalance === 0}
                    className={cn(
                      "flex-1 py-2 text-sm rounded-lg transition-colors font-medium",
                      buyAmount === calculateMaxDailyAmount()
                        ? "bg-green-400 text-white"
                        : !isConnected || walletBalance === 0
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
                  isConnected && totalAmount > walletBalance
                    ? "text-red-500"
                    : "text-green-500"
                )}>
                  {formatUSD(totalAmount)}
                </div>
              </div>
              {isConnected && (
                <div className={cn(
                  "text-xs text-right",
                  totalAmount > walletBalance
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                )}>
                  {totalAmount > walletBalance ? (
                    <>
                      <AlertCircle className="inline w-3 h-3 mr-1" />
                      Insufficient balance: {formatUSDC(walletBalance)} available
                    </>
                  ) : (
                    `Available balance: ${formatUSDC(walletBalance)}`
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
              disabled={isCreatingOrder || !isConnected || walletBalance === 0 || totalAmount > walletBalance}
              className={cn(
                "w-full py-4 text-white font-medium rounded-lg transition-all",
                !isConnected
                  ? "bg-orange-500 hover:bg-orange-600"
                  : totalAmount > walletBalance
                  ? "bg-red-400 cursor-not-allowed"
                  : isCreatingOrder || walletBalance === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800"
              )}
            >
              {!isConnected ? (
                <span className="flex items-center justify-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet First
                </span>
              ) : totalAmount > walletBalance ? (
                <span className="flex items-center justify-center">
                  <X className="w-4 h-4 mr-2" />
                  Insufficient USDC Balance
                </span>
              ) : isCreatingOrder ? (
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