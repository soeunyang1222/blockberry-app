'use client';

import React from 'react';
import { formatUSD, formatUSDC, formatNumber } from '@/lib/utils/format';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useDCAOrders, useTransactions } from '@/lib/hooks/useApi';

export function RecurringOrders() {
  const { data: ordersData, isLoading: ordersLoading } = useDCAOrders();
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(5);

  const loading = ordersLoading || transactionsLoading;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Transform DCA orders to match actual business logic
  const recurringOrders = ordersData?.orders?.map((order: any) => {
    // Determine investment period based on frequency field
    const isWeeklyPeriod = order.frequency === 'weekly';
    const isMonthlyPeriod = order.frequency === 'monthly';

    // Calculate period details
    const periodDays = isWeeklyPeriod ? 7 : 30;
    const dailyAmount = order.amount; // Amount is already daily amount
    const totalAmount = dailyAmount * periodDays;

    return {
      id: order.id,
      asset: order.toAsset === 'WBTC' ? 'Bitcoin' : order.toAsset,
      assetSymbol: order.toAsset === 'WBTC' ? 'BTC' : order.toAsset,
      periodType: isWeeklyPeriod ? 'week' : 'month',
      periodDays: periodDays,
      dailyAmount: dailyAmount,
      totalAmount: totalAmount,
      currency: order.fromAsset,
      nextExecution: order.nextExecution ? new Date(order.nextExecution) : null,
      status: 'active' // Assuming active if nextExecution exists
    };
  }).filter((o: any) => o.nextExecution) || [];

  // Transform transactions data
  const lastTransactions = transactionsData?.transactions?.map((tx: any) => ({
    id: tx.id,
    type: tx.type,
    asset: tx.asset === 'WBTC' ? 'Bitcoin' : tx.asset,
    amount: tx.amount,
    currency: 'USDC',
    price: tx.price,
    total: tx.value,
    date: new Date(tx.date),
    status: tx.status
  })) || [];

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD' || currency === 'USDC') {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
    return `${amount.toFixed(2)} ${currency}`;
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
      case 'active':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPeriodBadgeStyle = (periodType: string) => {
    return periodType === 'week'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getPeriodIcon = (periodType: string) => {
    return periodType === 'week' ? '📅' : '🗓️';
  };

  const RecurringOrdersContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
        <div>TARGET ASSET</div>
        <div>DAILY INVESTMENT</div>
        <div>INVESTMENT PERIOD</div>
        <div>TOTAL AMOUNT</div>
        <div>STATUS</div>
      </div>

      {recurringOrders.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No active DCA orders
        </div>
      ) : (
        recurringOrders.map((order: any) => (
          <div key={order.id} className="grid grid-cols-5 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0">
            {/* Target Asset */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                ₿
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{order.asset}</div>
                <div className="text-xs text-gray-500">{order.assetSymbol}</div>
              </div>
            </div>

            {/* Daily Investment */}
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(order.dailyAmount, order.currency)}
              </div>
              <div className="text-xs text-gray-500">per day</div>
            </div>

            {/* Investment Period */}
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPeriodBadgeStyle(order.periodType)}`}>
                <span className="mr-1">{getPeriodIcon(order.periodType)}</span>
                {order.periodDays} days
              </span>
              <div className="text-xs text-gray-500">
                ({order.periodType === 'week' ? '1 week' : '1 month'})
              </div>
            </div>

            {/* Total Amount */}
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(order.totalAmount, order.currency)}
              </div>
              <div className="text-xs text-gray-500">total</div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button className="text-xs text-primary hover:text-primary-hover font-medium">
                Manage
              </button>
            </div>
          </div>
        ))
      )}

      {/* Summary Information */}
      {recurringOrders.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">DCA Summary:</span>
              <span className="text-xs text-gray-500">Active Orders: {recurringOrders.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Total Daily Investment:</span>
                <div className="font-semibold text-gray-900">
                  {formatCurrency(
                    recurringOrders.reduce((sum, order) => sum + order.dailyAmount, 0),
                    'USDC'
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Max Total Investment:</span>
                <div className="font-semibold text-gray-900">
                  {formatCurrency(
                    recurringOrders.reduce((sum, order) => sum + order.totalAmount, 0),
                    'USDC'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

      {lastTransactions.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No transactions yet
        </div>
      ) : (
        lastTransactions.map((transaction: any) => (
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
        ))
      )}
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
              DCA Orders
            </TabsTrigger>
            <TabsTrigger
              value="last-transactions"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Recent Transactions
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