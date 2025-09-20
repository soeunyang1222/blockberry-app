'use client';

import React from 'react';
import { RecurringOrder } from '@/types/investment';

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recurring orders</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700">
          last transaction
        </button>
      </div>

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
    </div>
  );
}
