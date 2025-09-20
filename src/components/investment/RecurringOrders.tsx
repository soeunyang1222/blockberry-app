'use client';

import React from 'react';
import { RecurringOrder, Transaction } from '@/types/investment';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export function RecurringOrders() {
  // 임시 데이터 - 실제 앱에서는 API에서 가져올 것
  const recurringOrders: RecurringOrder[] = [
    {
      id: '1',
      asset: 'Bitcoin',
      frequency: 'weekly',
      amount: 10.00,
      currency: 'USD',
      nextExecution: new Date('2024-03-25')
    },
    {
      id: '2',
      asset: 'Bitcoin',
      frequency: 'monthly',
      amount: 50.00,
      currency: 'USDC',
      nextExecution: new Date('2024-04-01')
    }
  ];

  const lastTransactions: Transaction[] = [
    {
      id: '1',
      type: 'buy',
      asset: 'Bitcoin',
      amount: 0.0025,
      currency: 'USDC',
      price: 42000,
      total: 105.00,
      date: new Date('2024-03-20'),
      status: 'completed'
    },
    {
      id: '2',
      type: 'buy',
      asset: 'Ethereum',
      amount: 0.05,
      currency: 'USDC',
      price: 3000,
      total: 150.00,
      date: new Date('2024-03-18'),
      status: 'completed'
    },
    {
      id: '3',
      type: 'sell',
      asset: 'Bitcoin',
      amount: 0.001,
      currency: 'USDC',
      price: 41500,
      total: 41.50,
      date: new Date('2024-03-15'),
      status: 'completed'
    }
  ];

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatFrequency = (frequency: string) => {
    return frequency === 'weekly' ? 'for a week' : 'for a year';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const RecurringOrdersContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
        <div>ORDER</div>
        <div>INVESTMENT PERIOD</div>
        <div>METHOD</div>
        <div>AMOUNT</div>
      </div>

      {recurringOrders.map((order) => (
        <div key={order.id} className="grid grid-cols-4 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              B
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Buy {order.asset}</div>
              <div className="text-xs text-gray-500">{order.frequency}</div>
            </div>
          </div>

          <div className="text-sm text-gray-700">
            {formatFrequency(order.frequency)}
          </div>

          <div className="text-sm text-gray-700">
            {order.currency}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(order.amount, order.currency)}
            </span>
            <button className="text-xs text-blue-600 hover:text-blue-800">
              Manage
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const LastTransactionsContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
        <div>TYPE</div>
        <div>ASSET</div>
        <div>AMOUNT</div>
        <div>PRICE</div>
        <div>DATE</div>
      </div>

      {lastTransactions.map((transaction) => (
        <div key={transaction.id} className="grid grid-cols-5 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
              transaction.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {transaction.type === 'buy' ? 'B' : 'S'}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 capitalize">{transaction.type}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-700">
            {transaction.asset}
          </div>

          <div className="text-sm text-gray-700">
            {transaction.amount.toFixed(6)}
          </div>

          <div className="text-sm text-gray-700">
            {formatCurrency(transaction.price, transaction.currency)}
          </div>

          <div className="text-sm text-gray-700">
            {formatDate(transaction.date)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Tabs defaultValue="recurring-orders" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Investment Activity</h2>
          
          <TabsList className="bg-gray-100">
            <TabsTrigger 
              value="recurring-orders" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Recurring orders
            </TabsTrigger>
            <TabsTrigger 
              value="last-transactions"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Last transactions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="recurring-orders">
          <RecurringOrdersContent />
        </TabsContent>

        <TabsContent value="last-transactions">
          <LastTransactionsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
