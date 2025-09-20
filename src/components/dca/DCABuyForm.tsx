'use client'

import React, { useState, useEffect } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, Check, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import * as Select from '@radix-ui/react-select'

type Period = 'month' | 'week'
type Frequency = 'week' | 'day'
type OrderStatus = 'idle' | 'processing' | 'success' | 'error'
type TabType = 'stack-to-bit' | 'stack-to-sui'

interface WalletBalance {
  usdc: number
  btc: number
}

export function DCABuyForm() {
  const [activeTab, setActiveTab] = useState<TabType>('stack-to-bit')
  const [period, setPeriod] = useState<Period>('month')
  const [frequency, setFrequency] = useState<Frequency>('week')
  const [buyAmount, setBuyAmount] = useState<number>(100)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    usdc: 1000,
    btc: 0.00125
  })
  const [totalAmount, setTotalAmount] = useState<number>(400)
  const [paymentMethod, setPaymentMethod] = useState<string>('USD')

  // Mock wallet balance - API 연결 제거
  useEffect(() => {
    // fetchWalletBalance() - API 호출 비활성화
  }, [])

  // Calculate total amount based on frequency
  useEffect(() => {
    const weeksInMonth = 4
    if (period === 'month' && frequency === 'week') {
      setTotalAmount(buyAmount * weeksInMonth)
    } else {
      setTotalAmount(buyAmount)
    }
  }, [period, frequency, buyAmount])

  // Mock function - API 연결 제거
  const fetchWalletBalance = async () => {
    // API 호출 없이 mock 데이터 사용
    setWalletBalance({
      usdc: 1000,
      btc: 0.00125
    })
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

    // Mock API call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        setOrderStatus('success')
        setWalletBalance(prev => ({
          usdc: prev.usdc - totalAmount,
          btc: prev.btc + (totalAmount / 50000)
        }))

        setTimeout(() => {
          setBuyAmount(100)
          setOrderStatus('idle')
        }, 3000)
      } else {
        setOrderStatus('error')
        setErrorMessage('Transaction failed')
        setTimeout(() => {
          setOrderStatus('idle')
          setErrorMessage('')
        }, 3000)
      }
    }, 1500)
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
              Stack to Bit
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
              
              <span className="text-gray-400">,</span>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Every</span>
                <Select.Root value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
                  <Select.Trigger className="inline-flex items-center justify-between bg-gray-100 text-gray-700 px-3 py-1 rounded-lg min-w-[80px] focus:outline-none">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                      <Select.Viewport className="p-1">
                        <Select.Item value="week" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded">
                          <Select.ItemText>week</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="day" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded">
                          <Select.ItemText>day</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

          {/* I want to buy Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-gray-700 font-medium">I want to buy</h3>
              <div className="text-xs text-gray-500">
                You can buy up to $895.98
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-light text-gray-800">
                ${buyAmount}
              </div>
              <div className="text-sm text-gray-500">
                BTC
              </div>
            </div>

            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>$20</span>
                <span>$50</span>
                <span>$100</span>
                <span>MAX</span>
              </div>
              <div className="flex gap-1">
                {[20, 50, 100, 895].map((amount, index) => (
                  <button
                    key={amount}
                    onClick={() => setBuyAmount(amount)}
                    className={cn(
                      "flex-1 py-2 text-sm rounded-lg transition-colors",
                      buyAmount === amount 
                        ? "bg-green-400 text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {index === 3 ? 'MAX' : `$${amount}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Amount</span>
              <div className="text-2xl font-light text-green-500">
                ${totalAmount}
              </div>
            </div>
          </div>

            {/* Pay with */}
            <div className="space-y-2">
              <div className="text-gray-700 font-medium">Pay with</div>
              <Select.Root value={paymentMethod} onValueChange={setPaymentMethod}>
                <Select.Trigger className="w-full inline-flex items-center justify-between bg-gray-100 text-gray-700 px-3 py-2 rounded-lg focus:outline-none">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <Select.Viewport className="p-1">
                      <Select.Item value="USD" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded">
                        <Select.ItemText>USD</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="USDC" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded">
                        <Select.ItemText>USDC</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Status Message */}
            {renderStatusMessage()}

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={orderStatus === 'processing'}
              className={cn(
                "w-full py-4 text-white font-medium rounded-lg transition-all",
                orderStatus === 'processing'
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800"
              )}
            >
              {orderStatus === 'processing' ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </span>
              ) : (
                'confirm'
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