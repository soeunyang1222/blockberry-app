'use client';

import React from 'react';
import { PortfolioOverview } from '@/components/investment/PortfolioOverviewQuery';
import { RecurringOrders } from '@/components/investment/RecurringOrdersQuery';

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Investment portfolio</h1>
        </div>
        
        <div className="space-y-8">
          <PortfolioOverview />
          <RecurringOrders />
        </div>
      </div>
    </div>
  );
}
